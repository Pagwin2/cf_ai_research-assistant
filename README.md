# cf_ai_research-assistant
This was a project done for a job posting, specifically: https://job-boards.greenhouse.io/cloudflare/jobs/7259003

Demo Link: https://polished-rice-6b04.spam-dbb.workers.dev/

## What is it?

This is web app which is setup to allow the user to use gpt-4.1-mini as a research assistant (very original I know).

It has the prompt and UI setup such that tool usage, a summary and a full report are visually distinct elements of a response.

A known oversight is that if the LLM doesn't have any output in certain "XML tags" (scare quotes due to how they get parsed in `src/components/messages/BotMessage.tsx`'s `pseudoXMLParse`) then it will visually seem to not respond to the user
