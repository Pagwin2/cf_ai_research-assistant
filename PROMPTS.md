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

Incidentally also lead to changing system prompt

# Chat 4

## Prompt(s)

"I'm trying to use cloudflare secrets store for something, here's my wrangler.jsonc ... here's where I use it in the code ... assuming secret_name is correct, why does this fail when deployed to cloudflare?"

"it still seems to not work, here is the whole function for the code after the change"

"the string being passed into encodeURI is "unicorns" to be clear, is it possible to view console log statments made in cloudflare workers?"

## Chat Link(s)

https://claude.ai/share/9d5aa8f6-4bca-461e-992d-1ded3b1d7dd9

## Use in Project

Immediately added await to relevant code and felt like an idiot after going back to the docs to see await in the example on the secrets documentation page

Then when it continued not working I used it as a rubber ducky/way of realizing `wrangler tail` allows for viewing logs

# Chat 5

## Prompt(s)

"I am using @hf/nousresearch/hermes-2-pro-mistral-7bfor something which calls tools, is this model somewhat unreliable with it's tool usage?"

"I am getting the model from cloudflare's workers AI is there a better model from that?"

"I'm using it through vercel's api sdk"

"@cf/meta/llama-3.1-8b-instruct is also a bit flaky with tool usage, please search cloudflare's documentation to see what models are available and the general internet for what models among the ones you find are some of the better ones for tool usage"

"considering how the problem has persisted between models with varying size and capability could something be wrong with this usage of vercel's AI sdk"

"I've changed the system prompt but I don't see the maxSteps parameter that you're talking about https://ai-sdk.dev/docs/reference/ai-sdk-core/stream-text"

"tool definitions:

...

onStepFinish output:

...

with the visible response being a call to the search internet tool and then sending 

...

in the chat
"

## Chat Link(s)

https://claude.ai/share/0e2d19f1-302d-4db3-b389-b3d9df7ea0c2

## Use in Project

Used Claude to attempt to find a better LLM within cloudflare's Worker AI API that would not mess up attempted tool usage as well as seeing if I was missing some obvious issue with the code, concluded on going back to using ChatGPT for the LLM powering the research bot

# Chat 6

## Prompt(s)

"I am using OpenAI's api to make a research assistant via Vercel's AI sdk however I am hitting OpenAI's api rate limiting due to low spending/lack of account age, does Vercel's AI sdk have functionality to rate limit things for me and if not are there any other effective ways to deal with this?"

"I am running this on Cloudflare, do they provide something timilar to vercel?"

"I don't need to rate limit clients to my app though, I need to rate limit the app to OpenAI due to 1 query immediately bumping up on the Tier 1 rate limit"

"Do any of these solutions allow for not needing to rip out the AI sdk and redo that work myself?"

"could the wrapper approach be used to display a message to the user when the rate limit is hit instead?"

"looking at past logs it seems the openai adapter for ai sdk raises an error in some way, could we use that instead of using p-queue with a timeout?"

"can we change the returned output instead of throwing an error?"

## Chat Link(s)

Claude: https://claude.ai/share/bc80c458-7333-453d-bed6-bb877a7daf81

## Use in Project

None I just swapped in a model with a higher rate limit, I returned to this conversation later to explore passing on information about the rate limit being hit or other errors to the user but ultimately decided the effort wasn't worth it

# Chat 7

## Prompt(s)

"I have a system prompt for a research assistant which uses GPT-4.1-mini under the hood

...


but I'm not always getting back content within summary tag(s), any ideas on what I could do to fix that?"

## Chat Link(s)

https://claude.ai/share/dee73977-bd8d-442a-9d03-25f3aa420edc

## Use in Project

removed "either" and replaced "or" with "and" in system prompt
