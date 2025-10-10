/**
 * Tool definitions for the AI chat agent
 * Tools can either require human confirmation or execute automatically
 */
import { tool, type ToolSet } from "ai";
import { z } from "zod/v3";

import type { Chat } from "./server";
import { getCurrentAgent } from "agents";
import { scheduleSchema } from "agents/schedule";
import { assert } from "node:console";

type BraveAPIResponse = { web: { results: { url: string }[] } };

/**
 *  Use a search engine via
 *  @param query
 */
const searchInternet = tool({
    description: "Search the internet with a query and get back a list of relevant urls from a search engine",
    inputSchema: z.object({ query: z.string() }),
    // TODO: need to rate limit to 1/second due to the free tier restrictions
    // TODO: figure out how to store Brave search API key so cloudflare deployment and dev deoployment can see it
    execute: async ({ query }) => {
        const { web: { results } }: BraveAPIResponse = await fetch(`https://api.search.brave.com/res/v1/web/search?${encodeURI(query)}`, {
            headers: {
                Accept: "application/json",
                "X-Subscription-Token": todo("Store/retrieve Brave search api token")
            }
        })
            .then(r => r.json());
        return results.map(result => result.url);

    }
});

const fetchPage = tool({
    description: "Retrieve a web page from a given URL as plain text",
    inputSchema: z.object({ url: z.string() }),
    execute: async ({ url }) => {
        const resp = await fetch(url).then(r => r.text());
        return htmlToText(resp, { preserveLinks: true });
    }
})

/**
 * Export all available tools
 * These will be provided to the AI model to describe available capabilities
 */
export const tools = {
    searchInternet,
    fetchPage
} satisfies ToolSet;

function todo(msg: string = ""): any {
    throw `TODO: ${msg}`;
}

function htmlToText(html: string, options: { preserveLinks?: boolean, preserveLineBreaks?: boolean } = {}): string {
    const { preserveLineBreaks = true, preserveLinks = false } = options;

    let text = html;

    // Remove script and style tags with their content
    text = text.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
    text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

    // Handle links if preserveLinks is true
    if (preserveLinks) {
        text = text.replace(/<a[^>]*href=["']([^"']*)["'][^>]*>(.*?)<\/a>/gi, '$2 [$1]');
    }

    // Convert block-level elements to line breaks
    if (preserveLineBreaks) {
        const blockElements = ['div', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'li', 'tr', 'br', 'blockquote', 'article',
            'section', 'header', 'footer', 'aside'];

        blockElements.forEach(tag => {
            const regex = new RegExp(`</?${tag}[^>]*>`, 'gi');
            text = text.replace(regex, '\n');
        });
    }

    // Remove all remaining HTML tags
    text = text.replace(/<[^>]+>/g, '');

    // Decode HTML entities
    const entities = {
        '&nbsp;': ' ',
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&#39;': "'",
        '&apos;': "'",
        '&mdash;': '—',
        '&ndash;': '–',
        '&hellip;': '...',
    };

    Object.entries(entities).forEach(([entity, char]) => {
        text = text.replace(new RegExp(entity, 'g'), char);
    });

    // Decode numeric entities
    text = text.replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec));
    text = text.replace(/&#x([0-9a-f]+);/gi, (match, hex) => String.fromCharCode(parseInt(hex, 16)));

    // Clean up whitespace
    text = text.replace(/\n\s*\n\s*\n/g, '\n\n'); // Multiple newlines to double newline
    text = text.replace(/[ \t]+/g, ' '); // Multiple spaces to single space
    text = text.trim();

    return text;
}
