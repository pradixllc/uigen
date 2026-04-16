# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Initial setup (install deps, generate Prisma client, run migrations)
npm run setup

# Development server (Turbopack)
npm run dev

# Production build
npm run build

# Run all tests
npm test

# Run a single test file
npx vitest run src/components/chat/__tests__/ChatPanel.test.tsx

# Reset the database
npm run db:reset
```

## Architecture

UIGen is a Next.js 15 (App Router) AI-powered React component generator. Users describe components in a chat interface; Claude generates and edits code in a virtual file system with a live preview.

### Core flow

1. User sends a message from the chat panel
2. `POST /api/chat` (`src/app/api/chat/route.ts`) streams a Claude response using the Vercel AI SDK
3. Claude calls tools (`str_replace_editor`, `file_manager`) to create/edit files
4. Tool results update the in-memory virtual file system on the client
5. The preview iframe rerenders with the new component code
6. For authenticated users, the project (messages + file system state) is auto-saved to SQLite via Prisma

### Virtual file system

`src/lib/file-system.ts` implements an in-memory FS — no files are written to disk. The entire file tree is serialized as JSON and persisted in the `Project.data` column for authenticated users. The client sends current file state with every chat request so the server has full context.

### AI integration

- Provider: `src/lib/anthropic-provider.ts` — wraps `@anthropic-ai/sdk` with prompt caching on the system prompt
- Tools: `src/lib/tools/` — `str_replace_editor` (targeted edits) and `file_manager` (create/delete/rename files)
- System prompts: `src/lib/prompts/` — instructs Claude how to generate valid preview-ready React components
- Anonymous users get a fallback static code path when no API key is configured

### Auth & sessions

- `src/actions/auth.ts` — server actions for signup/login using bcrypt + JWT stored in an HTTP-only cookie
- `src/lib/session.ts` — JWT encode/decode helpers
- `src/lib/auth.ts` — session validation used in API routes and server actions
- Unauthenticated users can use the app fully; projects are not persisted

### UI layout

The main workspace (`src/app/project/[id]/page.tsx`) uses resizable panels:
- **Chat panel** (`src/components/chat/`) — message history, streaming responses, tool call display
- **Editor panel** (`src/components/editor/`) — Monaco editor showing virtual file contents
- **Preview panel** (`src/components/preview/`) — sandboxed iframe rendering the generated component

### Database

Prisma + SQLite (`prisma/schema.prisma`). Two models: `User` (email, hashed password) and `Project` (name, messages as JSON, data as serialized virtual FS, userId). Migrations live in `prisma/migrations/`.
