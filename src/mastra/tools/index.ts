import { createTool } from "@mastra/core/tools";
import { z } from "zod";

export const contextExtractorTool = createTool({
  id: "context-extractor",
  description: "Extracts student background and identifies hidden gaps in their US university experience",
  inputSchema: z.object({
    studentBio: z.string().describe("The student's background, major, origin, and goals"),
  }),
  outputSchema: z.object({
    origin: z.string(),
    major: z.string(),
    knownSkills: z.array(z.string()),
    hiddenGaps: z.array(z.string()),
    priorityAction: z.string(),
    culturalInsight: z.string(),
  }),
  execute: async ({ context }) => {
    const bio = context.studentBio.toLowerCase();

    const isNepal = bio.includes("nepal");
    const isCS = bio.includes("computer science") || bio.includes("cs") || bio.includes("coding") || bio.includes("software");
    const isFreshman = bio.includes("freshman") || bio.includes("first year");
    const isSophomore = bio.includes("sophomore") || bio.includes("second year");
    const mentionsInternship = bio.includes("internship");
    const mentionsResearch = bio.includes("research");
    const mentionsNetwork = bio.includes("network") || bio.includes("linkedin");

    const gaps = [];
    if (!mentionsInternship) gaps.push("Has not applied for internships yet. Summer deadlines are often in October and November of the previous year.");
    if (!mentionsResearch) gaps.push("Unaware that undergraduate research funding exists at UToledo. The AYRP program gives students up to $1,500 to do research with a faculty mentor.");
    if (!mentionsNetwork) gaps.push("LinkedIn profile likely not optimized for the US job market. Recruiters search LinkedIn actively.");
    if (isNepal) gaps.push("Coming from Nepal means you may not know that office hours with professors are expected and welcomed here. It is not bothering them. It is how the system works.");
    if (isFreshman || isSophomore) gaps.push("Early in your degree is the best time to start. Most students wait until junior year and lose two years of opportunities.");

    return {
      origin: isNepal ? "Nepal" : "International",
      major: isCS ? "Computer Science" : "Engineering",
      knownSkills: ["theoretical foundations", "academic coursework"],
      hiddenGaps: gaps.length > 0 ? gaps : ["General navigation of US university opportunities"],
      priorityAction: mentionsResearch
        ? "Apply for the AYRP undergraduate research funding at UToledo before May 19."
        : "Visit a professor during office hours this week and ask about research or project opportunities.",
      culturalInsight: isNepal
        ? "In Nepal asking for help can feel like a burden. Here in the US asking questions directly is seen as initiative and ambition. Professors and professionals respect students who reach out."
        : "US universities reward students who ask for things directly and show up proactively.",
    };
  },
});