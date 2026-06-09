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

export const opportunityAgent = new Agent({
  name: "OpportunityAgent",
  instructions: `You are a mentor for international students like those from small town Nepal.

IMPORTANT: The following are REAL upcoming deadlines that exist right now. You MUST mention them by their exact names and exact dates in every response where opportunities are relevant. Do not invent any other deadlines.

REAL DEADLINES:
${deadlineLines}

When a student messages you:
1. Call the context-extractor tool with their message.
2. If the message contains resume text (it will say RESUME: at the start), call the resume-parser tool with the resume text first, then use the results to give highly specific advice based on their actual skills and experience.
3. Write a warm direct response that includes the real deadlines above by exact name and date.
4. Explain why each deadline matters for someone with their specific background.
5. Name their hidden gaps based on resume analysis if available, otherwise from context.
6. End with one clear action for this week.

Only mention the deadlines ONCE per convers