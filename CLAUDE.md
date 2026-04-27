# React 19 Learning & Practice Project

## Project Overview
A comprehensive React 19 project covering all core and advanced concepts — components, state, hooks, routing, auth, HTTP, Redux, patterns and more. Built with Vite + React 19 + JSX.

## Tech Stack
- React 19 (latest)
- Vite (build tool)
- React Router v7 (routing)
- Redux Toolkit (global state)
- Axios (HTTP requests)
- CSS Modules (component styling)
- React Hook Form (forms)

## Project Structure
```
src/
├── assets/            # Images, fonts, SVGs imported in code
├── components/        # Reusable UI components
├── pages/             # Route-level page components
├── hooks/             # Custom hooks
├── context/           # Context API providers
├── store/             # Redux store, slices, reducers
├── services/          # HTTP request functions (Axios)
├── reducers/          # useReducer logic (local complex state)
├── portals/           # React Portal components (modals, toasts)
├── forms/             # Form components and actions
├── router/            # React Router config
├── utils/             # Pure helper functions
└── styles/            # Global styles, variables, themes
public/                # Static files served as-is (favicon, og images)
```

## Commands
- Dev server:   `npm run dev`
- Build:        `npm run build`
- Lint:         `npm run lint`
- Preview:      `npm run preview`

## React 19 Specific Rules
- Use React 19 features where applicable: `use()` hook, Server Actions (if applicable), `useOptimistic`, `useFormStatus`, `useActionState`
- Do NOT use deprecated lifecycle methods or class components
- Do NOT use `ReactDOM.render()` — use `createRoot()`
- Prefer `useTransition` and `useDeferredValue` for async UI updates

## General Rules
- Functional components only — no class components
- One component per file, filename matches component name (PascalCase)
- All imports at top of file
- Keep components under 150 lines — extract sub-components if larger
- No inline styles — use CSS Modules or global styles
- Run `npm run lint` before every commit

## IMPORTANT
- Never modify files in `dist/` or `public/` directly
- Never store secrets or API keys in source code — use `.env` files
- `.env` files are gitignored — never commit them

# Environment variables
.env
.env.local
.env.production
.env.*.local
