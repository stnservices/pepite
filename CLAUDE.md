# Claude Code Project Instructions

## Project Overview
Pepite is an internal, frontend-focused web app for business lead generation, CRM, and website building for local businesses. Gold/amber "pepite" branding. Dark mode default. Desktop-first.

## Tech Stack
- React 19 + TypeScript + Vite 8
- Radix UI + shadcn/ui (new-york style)
- Tailwind CSS 3.4 + CSS variables (HSL)
- Zustand 4.x with persist middleware (localStorage)
- React Hook Form + Zod
- React Router DOM v7 + lazy loading
- Lucide React icons
- @dnd-kit for kanban board
- date-fns for dates

## Project Conventions
- All state in Zustand stores with localStorage persist
- All UI components from shadcn/ui (`src/components/ui/`)
- Feature components in domain folders (`leads/`, `discovery/`, `pipeline/`, etc.)
- Types centralized in `src/types/index.ts`
- Constants (labels, colors, icons) in `src/lib/constants.ts`
- No backend - all data in localStorage
- Path alias: `@/` -> `src/`
- Use CVA (class-variance-authority) for component variants
- Use `cn()` from `@/lib/utils` for class merging

## Git Rules
- Keep commit messages concise and descriptive

## Post-Implementation Review Workflow
After implementing any plan, ALWAYS run:
1. Code Review - Launch `code-reviewer` agent on changed files
2. TypeScript check - `npx tsc --noEmit`
3. Build check - `npm run build`
