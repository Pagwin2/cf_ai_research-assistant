import type { UIMessage } from "ai";
import { Avatar } from "../avatar/Avatar";
import { Card } from "../card/Card";
import { MemoizedMarkdown } from "../memoized-markdown";
import { formatTime } from "@/utils";

export function UserMessage({
  msg,
  showAvatar
}: {
  msg: UIMessage;
  showAvatar: boolean;
}) {
  const isUser = true;
  return (
    <chat-msg>
      <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
        <div
          className={`flex gap-2 max-w-[85%] ${
            isUser ? "flex-row-reverse" : "flex-row"
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
                        className={`p-3 rounded-md bg-neutral-100 dark:bg-neutral-900 ${
                          isUser
                            ? "rounded-br-none"
                            : "rounded-bl-none border-assistant-border"
                        } ${
                          part.text.startsWith("scheduled message")
                            ? "border-accent/50"
                            : ""
                        } relative`}
                      >
                        {part.text.startsWith("scheduled message") && (
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
                        className={`text-xs text-muted-foreground mt-1 ${
                          isUser ? "text-right" : "text-left"
                        }`}
                      >
                        {formatTime(
                          msg.metadata?.createdAt
                            ? new Date(msg.metadata.createdAt)
                            : new Date()
                        )}
                      </p>
                    </div>
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
