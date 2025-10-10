# Chat 1
## Prompt(s)
"What would be a good project that meets the following criteria? Optional Assignment Instructions: We plan to fast track review of candidates who complete an assignment to build a type of AI-powered application on Cloudflare. An AI-powered application should include the following components: LLM (recommend using Llama 3.3 on Workers AI), or an external LLM of your choice Workflow / coordination (recommend using Workflows, Workers or Durable Objects) User input via chat or voice (recommend using Pages or Realtime) Memory or state"

## Chat Link(s)

ChatGPT: https://chatgpt.com/share/68e420c6-2fe4-8002-bcbb-9b40695a5ba7

## Use In Project

Used to decide the overall idea of what to do for this project, follow up chat was used to clarify if Cloudflare had a search API or if something else would need to be used

# Chat 2
## Prompt(s)

"which search engine api would be the best to use for a research assistant AI tool?"

Followed by

"write a typescript method for nodeJS which takes an object with a field of query as an argument and returns search results from Brave's search API"

## Chat Link(s)

Claude: https://claude.ai/share/0dd04143-6211-40f6-ade4-e6ddc0e82e56

## Use in Project

Reading over the initial response I went with Brave's API, it said Brave's API was cheaper and there was no particular reason to deal with Perplexity's additions for this project

Claude's code had more type definitions than I needed and overall overengineered the code for what I'm doing with it.

# Chat 3
## Prompt(s)

"I have some code which uses vercel's AI sdk ... However when the LLM tries to make multiple tool calls it seems to be interpreted as a chat message instead of multiple tool calls, any ideas on why?"

"for 1, looking at the documentation I don't see a maxToolRoundTrips parameter https://ai-sdk.dev/docs/reference/ai-sdk-core/stream-text

for 2, convertToModelMessages is also from the vercel AI sdk

for the logging of an example though I got

...

I am using cloudflare's workers AI with llama 3.1-8b-instruct created via

...
"

## Chat Link(s)

Claude: https://claude.ai/share/626274bd-17d1-4c93-adef-3dc9559d0f8e

## Use in Project

Used to determine that Llama 3.1 provided by cloudflare was insuffiecient for my needs and so swapped to @hf/nousresearch/hermes-2-pro-mistral-7b
