# OpportunityAgent

An autonomous AI agent that helps first generation and international students at the University of Toledo discover scholarships, research funding, and internship opportunities they never knew existed.

## Live Demo

https://opportunity-agent-ui.vercel.app

## The Problem

I grew up in a small town in Nepal where nobody told you opportunities existed. When I came to UToledo, I had no idea research funding was available, that you could email professors, or that scholarship deadlines were passing me by. I built this to solve exactly that for students like me.

## What It Does

- Takes a student's background and goals as input
- Analyzes their profile using a context extractor tool
- Surfaces real UToledo deadlines with exact dates and contextual reasoning
- Parses uploaded resumes to give personalized gap analysis
- Remembers students across sessions using working memory

## Tech Stack

- **Framework:** Mastra (agentic AI framework)
- **LLM:** Groq with Llama 4 Scout
- **Memory:** LibSQL via @mastra/libsql
- **Backend:** Node.js, TypeScript, deployed on Railway
- **Frontend:** React, Tailwind CSS, deployed on Vercel

## Architecture

The agent uses three custom tools:

1. **Context Extractor** — analyzes student background and identifies hidden opportunity gaps
2. **Deadline Monitor** — surfaces real UToledo scholarships and internship deadlines
3. **Resume Parser** — reads uploaded resumes and gives specific skill gap analysis

## Local Development

```bash
npm install
npm run dev
```

Add a `.env` file with:

## Built By

Nischal Dahal — CS sophomore at University of Toledo
nischal.dahal@rockets.utoledo.edu