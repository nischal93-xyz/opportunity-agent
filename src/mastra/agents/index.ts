import { Agent } from "@mastra/core/agent";
import { createGroq } from "@ai-sdk/groq";
import { contextExtractorTool } from "../tools/index";
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

export const opportunityAgent = new Agent({
  name: "OpportunityAgent",
  instructions: `You are a mentor for international students like those from small town Nepal.

IMPORTANT: The following are REAL upcoming deadlines that exist right now. You MUST mention them by their exact names and exact dates in every response where opportunities are relevant. Do not invent any other deadlines.

REAL DEADLINES:
${deadlineLines}

When a student messages you:
1. Call the context-extractor tool with their message.
2. Write a warm direct response that includes the real deadlines above by exact name and date.
3. Explain why each deadline matters for someone with their specific background.
4. Name their hidden gaps.
5. End with one clear action for this week.

Short paragraphs. No hyphens. No made-up dates. Write like a person not a report. Do not narrate your memory updates or say things like "I will update your working memory" or "this conversation will help me." Just write the response and stop.`,
  model: groq("meta-llama/llama-4-scout-17b-16e-instruct"),
  tools: {
    contextExtractorTool,
  },
  memory,
});