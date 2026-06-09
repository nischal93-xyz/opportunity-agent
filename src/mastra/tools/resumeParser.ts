import { createTool } from "@mastra/core/tools";
import { z } from "zod";

export const resumeParserTool = createTool({
  id: "resume-parser",
  description: "Parses a student resume and extracts their skills, experience, and education to give personalized advice",
  inputSchema: z.object({
    resumeText: z.string().describe("The raw text content extracted from the student resume"),
  }),
  outputSchema: z.object({
    skills: z.array(z.string()),
    experience: z.array(z.string()),
    education: z.array(z.string()),
    gaps: z.array(z.string()),
    strongPoints: z.array(z.string()),
  }),
  execute: async ({ context }) => {
    const text = context.resumeText.toLowerCase();

    const skillKeywords = [
      "python", "javascript", "typescript", "react", "node", "java", "c#", "c++",
      "sql", "mongodb", "git", "html", "css", "express", "tailwind", "mastra",
      "machine learning", "ai", "data structures", "algorithms"
    ];

    const skills = skillKeywords.filter(skill => text.includes(skill));

    const hasInternship = text.includes("intern");
    const hasResearch = text.includes("research");
    const hasLeadership = text.includes("leader") || text.includes("president") || text.includes("captain");
    const hasProjects = text.includes("project");
    const hasLinkedIn = text.includes("linkedin");
    const hasCertification = text.includes("certif");

    const experience = [];
    if (hasInternship) experience.push("Has internship experience");
    if (hasResearch) experience.push("Has research experience");
    if (hasLeadership) experience.push("Has leadership experience");
    if (hasProjects) experience.push("Has personal projects");

    const education = [];
    if (text.includes("university") || text.includes("college")) education.push("Currently enrolled in university");
    if (text.includes("gpa")) education.push("GPA listed on resume");
    if (text.includes("dean")) education.push("Dean's list recognition");

    const gaps = [];
    if (!hasInternship) gaps.push("No internship experience yet — this is the most important gap to close");
    if (!hasLinkedIn) gaps.push("LinkedIn not mentioned — US recruiters search LinkedIn heavily");
    if (!hasCertification) gaps.push("No certifications listed — even free ones like Google or AWS strengthen your profile");
    if (skills.length < 4) gaps.push("Limited technical skills visible — add more languages and frameworks you know");
    if (!hasResearch) gaps.push("No research experience — undergraduate research funding like AYRP can fill this gap");

    const strongPoints = [];
    if (skills.length >= 4) strongPoints.push(`Strong technical foundation with ${skills.length} skills listed`);
    if (hasProjects) strongPoints.push("Personal projects show initiative beyond coursework");
    if (hasLeadership) strongPoints.push("Leadership experience stands out to recruiters");
    if (hasResearch) strongPoints.push("Research experience is rare at undergrad level and very impressive");

    return {
      skills,
      experience,
      education,
      gaps,
      strongPoints,
    };
  },
});