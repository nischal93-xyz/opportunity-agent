import { createTool } from "@mastra/core/tools";
import { z } from "zod";

export const opportunities = [
  {
    name: "AYRP Fall 2026 Research Funding",
    deadline: "2026-05-19",
    description: "Up to $1,500 to do undergraduate research with a faculty mentor at UToledo.",
    relevantFor: ["research", "cs", "engineering", "international", "nepal"],
    url: "https://www.utoledo.edu/honors/undergradresearch/",
  },
  {
    name: "Ebeid STEM Scholarship",
    deadline: "2026-06-01",
    description: "Scholarship for STEM students at UToledo. Strong preference for students with financial need.",
    relevantFor: ["cs", "engineering", "international", "nepal"],
    url: "https://www.utoledo.edu/financial-aid/",
  },
  {
    name: "Bold.org Scholarships for International Students",
    deadline: "2026-07-15",
    description: "Multiple scholarships available specifically for F1 international students.",
    relevantFor: ["international", "nepal", "f1"],
    url: "https://bold.org",
  },
  {
    name: "UToledo Career Fair Fall 2026",
    deadline: "2026-09-15",
    description: "Meet recruiters from companies hiring CS interns and full time roles. Bring your resume.",
    relevantFor: ["cs", "internship", "engineering"],
    url: "https://www.utoledo.edu/career/",
  },
  {
    name: "Google Summer Internship Applications",
    deadline: "2026-10-01",
    description: "Google opens internship applications in fall for the following summer. Apply early.",
    relevantFor: ["cs", "internship", "software"],
    url: "https://careers.google.com",
  },
];

export function getDeadlines(profile: string) {
  const p = profile.toLowerCase();
  const today = new Date();

  return opportunities
    .filter(op =>
      op.relevantFor.some(tag =>
        p.includes(tag) ||
        (tag === "international" && p.includes("nepal")) ||
        (tag === "cs" && (p.includes("computer science") || p.includes("cs")))
      )
    )
    .map(op => {
      const deadline = new Date(op.deadline);
      const daysUntil = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return { ...op, daysUntilDeadline: daysUntil };
    })
    .filter(op => op.daysUntilDeadline > 0)
    .sort((a, b) => a.daysUntilDeadline - b.daysUntilDeadline);
}

export const deadlineMonitorTool = createTool({
  id: "deadline-monitor",
  description: "Finds upcoming deadlines relevant to the student",
  inputSchema: z.object({
    studentProfile: z.string().describe("The student background, major, and goals"),
  }),
  outputSchema: z.object({
    upcomingDeadlines: z.array(z.object({
      name: z.string(),
      deadline: z.string(),
      description: z.string(),
      url: z.string(),
      daysUntilDeadline: z.number(),
    })),
    mostUrgent: z.string(),
  }),
  execute: async ({ context }) => {
    const deadlines = getDeadlines(context.studentProfile);
    return {
      upcomingDeadlines: deadlines,
      mostUrgent: deadlines.length > 0 ? deadlines[0].name : "No urgent deadlines found",
    };
  },
});