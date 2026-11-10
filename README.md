# Anish's AI/ML Portfolio

An interactive portfolio for Anish, an AI/ML Engineer focused on production GenAI, agentic systems, RAG, real-time voice agents, and deep learning.

## Run locally

Requirements: Node.js 18+, pnpm, a Groq API key, and a Gemini API key for fallback. The chat uses Groq's Qwen 3.8 27B first and Gemini 3.8 Flash if Groq fails before replying. The GitHub token is optional for the star counter.

```bash
pnpm install
copy .env.example .env
pnpm dev
```

Set the following values in `.env`:

```env
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key
GROQ_API_KEY=your_groq_api_key
GITHUB_TOKEN=your_github_token
```

Open `http://localhost:3000` and ask about Anish’s experience, projects, skills, or résumé.

Use the moon or sun button beside the information button at the top left to switch themes. The choice is saved in the browser. The Projects shortcut opens four project cards. Clicking a card opens its overview, problem, architecture, results, technology stack, and links. The chat can also explain the projects or compare them.

Common questions about introduction, experience, skills, contact details, résumé, and the project gallery open local portfolio cards immediately. Written explanations use Groq with Gemini fallback. If both providers are unavailable, project questions show saved project details; other questions show a clear availability message. Failed requests can be retried, and a running response can be stopped.
