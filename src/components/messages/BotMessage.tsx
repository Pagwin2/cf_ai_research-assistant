import { isToolUIPart } from "ai";
import { type UIMessage } from "ai";
import { Avatar } from "../avatar/Avatar";
import { Card } from "../card/Card";
import { ToolInvocationCard } from "../tool-invocation-card/ToolInvocationCard";
import { MemoizedMarkdown } from "../memoized-markdown";
import { formatTime } from "@/utils";
import { useAgentChat } from "agents/ai-react";
import { useAgent } from "agents/react";
import { todo } from "node:test";

// not really parsing properly but for this use case that doesn't matter due to lack of nesting
function pseudoXMLParse(tag: string, content: string): string {
  let return_val = "";

  // the loop will be redundant for most LLM output
  for (
    let next_start = content.indexOf(`<${tag}>`), next_end = -2;
    next_start != -1;
    next_start = content.indexOf(`<${tag}>`, next_end)
  ) {
    next_end = content.indexOf(`</${tag}>`, next_start);
    if (next_end == -1) {
      return_val += content.substring(next_start + tag.length + 2);
      break;
    } else {
      return_val += content.substring(next_start + tag.length + 2, next_end);
    }
  }

  return return_val;
}

export function BotMessage({
  msg,
  showAvatar
}: {
  msg: UIMessage;
  showAvatar: boolean;
}) {
  const isUser = false;
  const agent = useAgent({ agent: "chat" });
  const {
    messages: agentMessages,
    addToolResult,
    clearHistory,
    status,
    sendMessage,
    stop
  } = useAgentChat<unknown, UIMessage<{ createdAt: string }>>({
    agent
  });

  const textResponse = msg.parts
    ?.filter((p) => p.type === "text")
    .map((p) => p.text)
    .join("");
  const toolUseInfo = msg.parts?.filter(isToolUIPart).map((part, i) => {
    const toolCallId = part.toolCallId;
    const toolName = part.type.replace("tool-", "");
    return (
      <ToolInvocationCard
        // biome-ignore lint/suspicious/noArrayIndexKey: using index is safe here as the array is static
        key={`${toolCallId}-${i}`}
        toolUIPart={part}
        toolCallId={toolCallId}
        needsConfirmation={false}
        onSubmit={({ toolCallId, result }) => {
          addToolResult({
            tool: part.type.replace("tool-", ""),
            toolCallId,
            output: result
          });
        }}
        addToolResult={(toolCallId, result) => {
          addToolResult({
            tool: part.type.replace("tool-", ""),
            toolCallId,
            output: result
          });
        }}
        addedClass="tool-invocation"
      />
    );
  });

  // Marker 5
  const report = pseudoXMLParse("report", textResponse);
  const summary = pseudoXMLParse("summary", textResponse);
  return (
    <chat-msg>
      <div className={`flex justify-start`}>
        <div className={`flex gap-2 max-w-[85%] flex-column`}>
          <Avatar username={"AI"} />
          {toolUseInfo.length != 0 ? (
            <details className="tool-use p-3 bot-msg w-full dark:text-neutral-100 text-neutral-900 dark:bg-neutral-900 text-base">
              <summary>Tool Usage</summary> {toolUseInfo}{" "}
            </details>
          ) : null}
          {report !== "" ? (
            <details className="report p-3 bot-msg w-full dark:text-neutral-100 text-neutral-900 dark:bg-neutral-900 text-base">
              <summary>Full Report</summary>
              <MemoizedMarkdown content={report} id={msg.id} />
            </details>
          ) : null}
          {summary !== "" ? (
            <section className="summary p-3 bot-msg w-full dark:text-neutral-100 text-neutral-900 text-base">
              <h3 className="summary-header">Summary</h3>
              {summary}
            </section>
          ) : null}
        </div>
      </div>
    </chat-msg>
  );
}
