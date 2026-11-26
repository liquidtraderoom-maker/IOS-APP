# CLAUDE.md - ApexHQ Virtual Office

## Project Overview
ApexHQ is a virtual office web app with 6 AI agents designed for autonomous revenue generation.

## Commands
- `npm run dev` - Start development server on port 3000
- `npm run build` - Build for production
- `npm run lint` - Run ESLint

## Architecture
- Next.js 14 with App Router
- All API routes in /app/api/ (server-side only)
- Agent personas defined in /lib/agents.ts
- Tailwind CSS with custom apex-* colors

## Key Files
- `/lib/agents.ts` - 6 agent definitions with system prompts
- `/app/api/meeting/one-on-one/route.ts` - Agent chat API
- `/app/api/meeting/boardroom/route.ts` - Multi-agent meeting API
- `/app/office/page.tsx` - Main office floorplan

## Agent IDs
- marcus, alen, keith, mya, jin, elena

## Style Guidelines
- Dark theme: bg-apex-dark (#0a0a0f), bg-apex-card (#12121a)
- Accent: indigo-500, success: green-500, warning: yellow-500
- Status indicators: autonomous=green, supervised=yellow, paused=gray

## Environment Variables
Required in .env.local:
- ANTHROPIC_API_KEY (for Claude API)
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- STRIPE_SECRET_KEY
