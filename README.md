# CodeFusion AI

CodeFusion AI is a learning project by Yash Suthar: a web app with a browser code editor, a course catalog and user accounts. It is built with React, TypeScript, Vite and Supabase.

It is a work in progress. Some parts are real and some parts are still placeholders. This README lists both.

## What works

- **Code editor** (`/editor`, `src/pages/CodeEditor.tsx`): a Monaco editor with a picker for 13 languages and Hello World starter code for Python, JavaScript, TypeScript, Java, C++ and C. Snippets can be saved to and loaded from Supabase (`code_snippets` table).
- **Code tip panels** (`src/components/AI/`): side panels that explain code, suggest refactors, point out performance issues and walk through debugging steps. They are rule-based. The logic in `src/services/` (for example `realTimeErrorDetection.ts`, `performanceAnalyzer.ts`, `smartRefactoring.ts`) uses regular expressions and keyword checks. No AI model is called.
- **Accounts**: Supabase Auth with email and password, magic links, Google and GitHub sign-in, email verification and password reset.
- **Session timeout**: a timer with a warning modal that lets the user extend the session or log out (`src/contexts/SessionContext.tsx`, `src/components/session/`).
- **Courses**: a static catalog in `src/data/coursesData.ts`. Lessons in some courses link to free YouTube videos and GeeksforGeeks articles. Lesson progress and certificates are stored in Supabase (`course_progress` and `certificates` tables), and certificates can be checked on `/verify-certificate`.
- **Dashboard**: counts of saved snippets and projects and a list of recent items from Supabase.
- **Design assets page**: search for icons and illustrations through the IconScout API (needs an API key).
- Light and dark theme.

## What does not work yet

- **Code execution is simulated.** Nothing is compiled or run on a server. `CodeEditor.tsx` runs a few regex syntax checks and then builds an output by pulling the text out of `print`, `console.log` and similar calls. The project editor (`/editor/:language`) returns a fixed placeholder output. `src/services/codeExecution.ts` has a Web Worker runner for JavaScript, but no page uses it.
- **No live AI.** `src/services/OpenRouterService.ts` and `src/services/aiService.ts` contain an OpenRouter client for free models, but no page or component imports them.
- **No real-time collaboration.** `src/services/collaboration.ts` exists, but nothing uses it, and its peer broadcast function only writes a log line.
- **Payments are not set up.** Paid courses use a placeholder Razorpay key, and `server/index.ts` returns a fake PhonePe success link. Free course enrollments are saved in the browser's localStorage.
- The files in `src/pages/editors/` are older per-language editors that are no longer routed.
- The Jest config (`jest.config.js`) has an error, so `npm test` does not run right now.

## Tech stack

React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui (Radix UI), Framer Motion, React Router, TanStack Query, Zustand, Monaco Editor (`@monaco-editor/react`), Supabase (Auth and Postgres), and a small Express server (`server/index.ts`) for mock OTP and payment endpoints.

## Run it locally

You need Node.js 18 or newer and a Supabase project. Run the SQL files in `supabase/migrations/` on that project.

```bash
git clone https://github.com/trynayash/CodeFusionAI.git
cd CodeFusionAI
npm install
```

Create a `.env.local` file:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
VITE_ICONSCOUT_API_KEY=optional_iconscout_key
```

Start the front end:

```bash
npx vite
```

The app runs on http://localhost:8080. `npm run dev` also starts the mock Express server on port 3001, but it calls `pnpm`, so you need pnpm installed for that script.

Production build:

```bash
npm run build
npm run preview
```

## License

MIT. See [LICENSE](LICENSE).
