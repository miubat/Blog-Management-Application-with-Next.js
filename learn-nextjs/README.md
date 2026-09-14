# learn-nextjs-b19

A minimal Next.js (App Router) demo project — one page per React/Next.js concept: components, props, JSX rules, events, list rendering, and the `useEffect` / `useRef` / `useRouter` / `useParams` hooks.

## Prerequisites

- **Node.js 20.9 or newer** (Next.js 16 requires it). Verified working on Node v22.
  Check with `node -v`.
- **npm** (ships with Node). Check with `npm -v`.

## Install

Clone the repo (or open the project folder), then install dependencies:

```bash
npm install
```

## Run

### Development

```bash
npm run dev
```

Open <http://localhost:3000>. Pages hot-reload as you edit files in [app/](app/).

To use a different port:

```bash
npm run dev -- -p 4000
```

### Production build

```bash
npm run build   # compiles to .next/
npm start       # serves the production build on http://localhost:3000
```

## Available scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the dev server with hot reload |
| `npm run build` | Create an optimized production build |
| `npm start` | Serve the production build (run `npm run build` first) |

## Project structure

```
app/                      # App Router — each folder is a route
  layout.jsx              # Root layout (<html>/<body>, shared container)
  globals.css             # Global styles
  page.jsx                # /            — home
  index/page.jsx          # /index       — link index of all demos
  create-component/       # /create-component
  jsx-syntax/             # /jsx-syntax
  events/                 # /events
  rendering-lists/        # /rendering-lists
  use-effect/             # /use-effect  — fetches users via axios
  use-ref/                # /use-ref
  use-router/             # /use-router
  use-params/             # /use-params
    [id]/page.jsx         # /use-params/:id — dynamic route
components/
  PageHeader.jsx          # Shared title/description header
  WelcomeCard.jsx         # Props demo component
next.config.js            # Next.js config (currently empty defaults)
```

## Routes

| Route | Demonstrates |
| --- | --- |
| `/` | Home page |
| `/index` | Index of demo links |
| `/create-component` | Creating and reusing components with props |
| `/jsx-syntax` | JSX syntax rules and expression embedding |
| `/events` | `onChange`, `onClick`, keyboard events |
| `/rendering-lists` | Rendering arrays with `key`, `useState` |
| `/use-effect` | `useEffect` + data fetching with axios |
| `/use-ref` | `useRef` for direct DOM access |
| `/use-router` | Programmatic navigation with `useRouter` |
| `/use-params` and `/use-params/[id]` | Reading dynamic URL segments with `useParams` |

## Notes

- `/use-effect` calls the public `https://jsonplaceholder.typicode.com/users` API, so that page needs an internet connection.
- Pages using hooks or event handlers are marked `'use client'`; the rest are React Server Components.
- The path-alias config file is currently named `jsonconfig.json`. Next.js reads `jsconfig.json`, so the `@/*` alias is not active. Nothing imports via `@/` today, but rename the file to `jsconfig.json` if you want to start using it.
- `/index` links to several routes (`/creating-component`, `/using-components`, `/fragments`, etc.) that do not exist yet and will 404.

## Troubleshooting

- **Port 3000 already in use** — run `npm run dev -- -p 3001`.
- **Stale build or odd errors** — delete the build cache and reinstall:
  ```bash
  rm -rf .next node_modules
  npm install
  ```
  On Windows PowerShell: `Remove-Item -Recurse -Force .next, node_modules`
- **`npm start` fails** — run `npm run build` first; `start` only serves an existing build.
