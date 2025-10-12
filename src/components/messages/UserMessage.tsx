import { isToolUIPart } from "ai";
import { type UIMessage } from "ai";
import { Avatar } from "../avatar/Avatar";
import { Card } from "../card/Card";
import { ToolInvocationCard } from "../tool-invocation-card/ToolInvocationCard";
import { MemoizedMarkdown } from "../memoized-markdown";
import { formatTime } from "@/utils";
import { useAgentChat } from "agents/ai-react";
import { useAgent } from "agents/react";

export function UserMessage({ msg, showAvatar }: { msg: UIMessage, showAvatar: boolean }) {
    const isUser = true;
    const agent = useAgent({ agent: "chat" })
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

    return (
        <chat-msg>
            <div
                className={`flex ${isUser ? "justify-end" : "justify-start"}`}
            >
                <div
                    className={`flex gap-2 max-w-[85%] ${isUser ? "flex-row-reverse" : "flex-row"
                        }`}
                >
                    {showAvatar && !isUser ? (
                        <Avatar username={"AI"} />
                    ) : (
                        !isUser && <div className="w-8" />
                    )}

                    <div>
                        <div>
                            {msg.parts?.map((part, i) => {
                                if (part.type === "text") {
                                    return (
                                        // biome-ignore lint/suspicious/noArrayIndexKey: immutable index
                                        <div key={i}>
                                            <Card
                                                className={`p-3 rounded-md bg-neutral-100 dark:bg-neutral-900 ${isUser
                                                    ? "rounded-br-none"
                                                    : "rounded-bl-none border-assistant-border"
                                                    } ${part.text.startsWith("scheduled message")
                                                        ? "border-accent/50"
                                                        : ""
                                                    } relative`}
                                            >
                                                {part.text.startsWith(
                                                    "scheduled message"
                                                ) && (
                                                        <span className="absolute -top-3 -left-2 text-base">
                                                            🕒
                                                        </span>
                                                    )}
                                                <MemoizedMarkdown
                                                    id={`${msg.id}-${i}`}
                                                    content={part.text.replace(
                                                        /^scheduled message: /,
                                                        ""
                                                    )}
                                                />
                                            </Card>
                                            <p
                                                className={`text-xs text-muted-foreground mt-1 ${isUser ? "text-right" : "text-left"
                                                    }`}
                                            >
                                                {formatTime(
                                                    msg.metadata?.createdAt
                                                        ? new Date(m.metadata.createdAt)
                                                        : new Date()
                                                )}
                                            </p>
                                        </div>
                                    );
                                }

                                if (isToolUIPart(part)) {
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
                                        />
                                    );
                                }
                                return null;
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </chat-msg>
    );
}
