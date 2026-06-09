import { Agent } from "@mastra/core/agent";
import { createGroq } from "@ai-sdk/groq";
import { contextExtractorTool } from "../tools/index";
import { resumeParserTool } from "../tools/resumeParser";
import { Memory } from "@mastra/memory";
import { LibSQLStore } from "@mastra/libsql";
import { getDeadlines } from "../tools/deadlineMonitor";

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

const memory = new Memory({
  storage: new LibSQLStore({
    id: "opportunity-agent-memory",
    url: "file:../memory.db",
  }),
  options: {
    workingMemory: {
      enabled: true,
    },
    lastMessages: 10,
  },
});

const allDeadlines = getDeadlines("nepal cs international internship engineering research");
const deadlineLines = allDeadlines.map(d =>
  `- ${d.name} | Deadline: ${d.deadline} | ${d.daysUntilDeadline} days from today | ${d.description} | ${d.url}`
).join("\n");

export function buildMessageWithContext(userMessage: string): string {
  return userMessage;
}

const instructions = `You are a mentor for international students like those from small town Nepal.

IMPORTANT: The following are REAL upcoming deadlines. Mention them by exact name and date. Do not invent other deadlines.

REAL DEADLINES:
${deadlineLines}

When a student messages you:
1. Call the context-extractor tool with their message.
2. If the message starts with RESUME: call the resume-parser tool first then use results for specific advice.
3. Write a warm direct response with real deadlines by exact name and date.
4. Explain why each deadline matters for this student.
5. Name their hidden gaps based on resume if available.
6. End with one clear action for this week.

Only mention deadlines ONCE per conversation. Do not repeat them in follow up messages.
Short paragraphs. No hyphens. No made-up dates. Write like a person not a report.
Do not output any internal reasoning, tags, or metadata. Do not write things like assistant or header_end or any system text. Just write your response and stop immediately after.
Never start your response with raw data or list format. Always start with a warm direct sentence to the student.`;

export const opportunityAgent = new Agent({
  name: "OpportunityAgent",
  instructions,
  model: groq("meta-llama/llama-4-scout-17b-16e-instruct"),
  tools: {
    contextExtractorTool,
    resumeParserTool,
  },
  memory,
});