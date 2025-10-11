import { routeAgentRequest, type Schedule } from "agents";

import { getSchedulePrompt } from "agents/schedule";
import { createOpenAI } from "@ai-sdk/openai";
import { AIChatAgent } from "agents/ai-chat-agent";
import {
    generateId,
    streamText,
    type StreamTextOnFinishCallback,
    stepCountIs,
    createUIMessageStream,
    convertToModelMessages,
    createUIMessageStreamResponse,
    type ToolSet
} from "ai";
//import { createWorkersAI } from 'workers-ai-provider';

import { processToolCalls, cleanupMessages } from "./utils";
import { tools, executions } from "./tools";
import { env } from "cloudflare:workers";

//const workersai = createWorkersAI({ binding: env.AI });
//const model = workersai('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
//    // additional settings
//    safePrompt: true,
//});


// Cloudflare AI Gateway
// const openai = createOpenAI({
//   apiKey: env.OPENAI_API_KEY,
//   baseURL: env.GATEWAY_BASE_URL,
// });

/**
 * Chat Agent implementation that handles real-time AI chat interactions
 */
export class Chat extends AIChatAgent<Env> {
    /**
     * Handles incoming chat messages and manages the response stream
     */
    async onChatMessage(
        onFinish: StreamTextOnFinishCallback<ToolSet>,
        _options?: { abortSignal?: AbortSignal }
    ) {
        const openai = createOpenAI({ apiKey: await env.OPENAI_API_KEY.get() });
        const model = openai("gpt-4.1-mini");//openai("gpt-4o-2024-11-20");
        // const mcpConnection = await this.mcp.connect(
        //   "https://path-to-mcp-server/sse"
        // );

        // Collect all tools, including MCP tools
        const allTools = {
            ...tools,
            ...this.mcp.getAITools()
        };
        if (!model) {
            console.error("fuck");
        }
        const stream = createUIMessageStream({
            execute: async ({ writer }) => {
                // Clean up incomplete tool calls to prevent API errors
                const cleanedMessages = cleanupMessages(this.messages);

                // Process any pending tool calls from previous messages
                // This handles human-in-the-loop confirmations for tools
                const processedMessages = await processToolCalls({
                    messages: cleanedMessages,
                    dataStream: writer,
                    tools: allTools,
                    executions
                });

                const result = streamText({
                    // Marker 1:
                    system: `You are a helpful research assistant:

When asked to research something:
1. Use searchInternet to find relevant sources
2. Use fetchUrl to read detailed content from promising URLs
3. Write an in depth report within <report> xml tag(s)
4. write a summary within <summary> xml tag(s)

Note: Everthing you write should be contained within report and summary xml tag(s)
Important: HTML links from content retrived via fetchUrl will show their destination in [square brackets].`,

                    // Marker 2:
                    messages: convertToModelMessages(processedMessages),
                    model,
                    tools: allTools,
                    onStepFinish: ({ text, finishReason }) => {
                        console.log('=== STEP DEBUG ===');
                        console.log('Text output:', text);
                        console.log('Finish reason:', finishReason);

                        console.log('==================');
                    },
                    // Type boundary: streamText expects specific tool types, but base class uses ToolSet
                    // This is safe because our tools satisfy ToolSet interface (verified by 'satisfies' in tools.ts)
                    onFinish: onFinish as unknown as StreamTextOnFinishCallback<
                        typeof allTools
                    >,
                    stopWhen: stepCountIs(10)
                });

                writer.merge(result.toUIMessageStream());
            }
        });

        return createUIMessageStreamResponse({ stream });
    }
    async executeTask(description: string, _task: Schedule<string>) {
        await this.saveMessages([
            ...this.messages,
            {
                id: generateId(),
                role: "user",
                parts: [
                    {
                        type: "text",
                        text: `Running scheduled task: ${description}`
                    }
                ],
                metadata: {
                    createdAt: new Date()
                }
            }
        ]);
    }
}

/**
 * Worker entry point that routes incoming requests to the appropriate handler
 */
export default {
    async fetch(request: Request, env: Env, _ctx: ExecutionContext) {
        const url = new URL(request.url);

        if (url.pathname === "/check-open-ai-key") {
            //const hasOpenAIKey = !!process.env.OPENAI_API_KEY;
            return Response.json({
                success: true//hasOpenAIKey
            });
        }
        if (false/*!process.env.OPENAI_API_KEY*/) {
            console.error(
                "OPENAI_API_KEY is not set, don't forget to set it locally in .dev.vars, and use `wrangler secret bulk .dev.vars` to upload it to production"
            );
        }
        return (
            // Route the request to our agent or return 404 if not found
            (await routeAgentRequest(request, env)) ||
            new Response("Not found", { status: 404 })
        );
    }
} satisfies ExportedHandler<Env>;
