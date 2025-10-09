# TODO

- implement the searchInternet tool in tools.ts
- Change the ai prompt/response to have it do searching and summarize that searching based on user prompt instead of being chat
    - at Marker 1 in server.ts change the system prompt so the LLM responds with an xml esque language containing "research" with calls to the tool(s) and a "summary section" afterwards for the UI to highlight
    - at Marker 2 change "messages" so the llm behaves accordingly
        - https://ai-sdk.dev/docs/reference/ai-sdk-core/model-message#modelmessage
        - https://ai-sdk.dev/docs/reference/ai-sdk-ui/convert-to-model-messages#converttomodelmessages
        - https://ai-sdk.dev/docs/reference/ai-sdk-core/stream-text#streamtext
        - https://ai-sdk.dev/docs/reference/ai-sdk-core/model-message#modelmessage
        - https://ai-sdk.dev/docs/reference/ai-sdk-ui/use-chat#usechat
    - Change UI to match the change from chat to research
        - Change descriptive text around text input at Marker 3 in app.tsx
        - replace the function used in the map at marker 4 with one which does a switch statement on `m.role` or whatever it gets renamed to to change how things are displayed rather than doing a billion checks
            - https://ai-sdk.dev/docs/reference/ai-sdk-core/ui-message
