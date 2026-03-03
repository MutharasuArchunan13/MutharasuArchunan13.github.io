# Goal Tracker

## Project Overview
Visual web-based goal tracking application that uses GitHub Issues/Milestones as the backend. Users create projects (GitHub Milestones), track goals (GitHub Issues), perform daily check-ins (comments on a dedicated issue), and visualize progress with charts and a streak heatmap. Includes Gemini AI integration for auto-generating project plans from descriptions.

## Tech Stack
- **Framework:** React 18 + TypeScript (Vite)
- **Styling:** TailwindCSS v3 with dark mode (`class` strategy)
- **State:** Zustand (persisted via localStorage)
- **Routing:** react-router-dom v6 (HashRouter for GitHub Pages)
- **GitHub API:** @octokit/rest
- **AI:** Google Gemini API (gemini-2.0-flash, free tier)
- **Charts:** Recharts
- **Drag & Drop:** @dnd-kit (core + sortable)
- **Icons:** lucide-react
- **Dates:** date-fns
- **Deploy:** GitHub Actions → GitHub Pages

## Architecture
Single-page app with GitHub API as backend. No server required.

**Data Model Mapping:**
- Projects → GitHub Milestones
- Goals/Tasks → GitHub Issues (with structured labels)
- Daily Logs → Comments on a dedicated "Daily Log" issue per project
- App Config → `tracker-config.json` in repo (via Contents API)

**Label Taxonomy:** `project:{slug}`, `status:{todo|inprogress|done}`, `category:{name}`, `priority:{low|medium|high|critical}`, `type:{goal|dailylog}`

## Project Flow
User → Login (PAT + optional Gemini key) → Select Repo → Dashboard → Create/View Projects → Add Goals → Daily Check-ins → Kanban Board → Analytics

## Directory Structure
```
src/
├── config/          # Constants, routes, GitHub config
├── types/           # TypeScript interfaces (project, goal, checkin, analytics, auth)
├── services/
│   ├── github/      # Octokit-based services (milestone, issue, label, comment, config)
│   └── ai/          # Gemini client, prompts, AI service
├── store/           # Zustand stores (auth, project, goal, checkin, ui)
├── hooks/           # Custom React hooks (useGitHubQuery, useProjects, useGoals, etc.)
├── components/
│   ├── ui/          # Reusable: Button, Card, Badge, Modal, Input, ProgressBar, Spinner, Toast
│   ├── layout/      # AppLayout, Sidebar, Header, ProtectedRoute
│   ├── auth/        # LoginForm, RepoSelector
│   ├── dashboard/   # DashboardPage, ProjectCard, StreakHeatmap, OverallStats
│   ├── project/     # ProjectPage, GoalItem, GoalForm, CategoryFilter, PhaseTimeline
│   ├── checkin/     # CheckInPage, TaskChecklist, CheckInHistory
│   ├── kanban/      # KanbanPage, KanbanColumn, KanbanCard
│   ├── analytics/   # AnalyticsPage (Recharts charts)
│   └── ai/          # AIProjectGenerator, AIContentParser
└── utils/           # label parsing, date helpers, markdown parser, streak calc, cn()
```

## Key Commands
- `npm run dev` — Start dev server
- `npm run build` — TypeScript check + Vite production build
- `npm run lint` — ESLint
- `npm run preview` — Preview production build

## Conventions
- Path alias: `@/` → `src/`
- Service pattern: Singleton class instances exported from service files
- Labels are the single source of truth for goal metadata (status, category, priority)
- Check-in comments embed `<!-- tracker-meta:{...} -->` for machine parsing
- All stores use Zustand; auth and UI stores use persist middleware
- Components follow: Page → Feature Components → UI Components hierarchy

## Current Focus
- Initial implementation complete
- All pages functional: Login, Dashboard, Project, Check-in, Kanban, Analytics
- AI integration: Project generation, content parsing, daily suggestions
