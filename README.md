# Part Scope

**Language:** [EN](README.md) · [RU](README.ru.md)

SPA for auto parts and analogues via the Protsenka API: React, TypeScript, Vite, Feature-Sliced Design.

## Features

1. Search by article number → list of unique manufacturers.
2. Pick a manufacturer → original part and analogues with prices and warehouse stock.
3. Loading, empty, API, and network error states with retry.
4. Light / dark theme (system default; choice is persisted).
5. Responsive UI: table on wide screens, cards on narrow ones.

Price and stock are taken only from warehouse offers (`warehouses[].price` / `stock`). The `goods.price` field is not used.

## Stack

- React 19 + TypeScript (`strict`) + Vite
- TanStack Query — server state and cache
- React Router — routes `/`, `/search`, 404
- Feature-Sliced Design: `app` → `pages` → `features` → `entities` → `shared`
- CSS Modules + semantic CSS variables
- Vitest + React Testing Library

## Requirements

- Node.js 20+ (LTS recommended)
- npm
- A valid Protsenka buyer API key

## Quick start

```bash
cp .env.example .env
# set a real VITE_API_KEY in .env
npm install
npm run dev
```

The app opens on the Vite URL (usually `http://localhost:5173`).

## Scripts

| Command              | Purpose                          |
| -------------------- | -------------------------------- |
| `npm run dev`        | Dev server                       |
| `npm run build`      | Production build (`tsc` + Vite)  |
| `npm run preview`    | Preview production build         |
| `npm run typecheck`  | Type check                       |
| `npm run lint`       | ESLint                           |
| `npm run lint:fsd`   | Steiger (Feature-Sliced Design)  |
| `npm run test`       | Tests (Vitest)                   |
| `npm run test:watch` | Tests in watch mode              |
| `npm run format`     | Prettier                         |

## Environment

Copy `.env.example` to `.env`. Do not commit a file with a real key.

| Variable            | Purpose                    |
| ------------------- | -------------------------- |
| `VITE_API_BASE_URL` | Protsenka API base URL     |
| `VITE_API_KEY`      | Buyer API key              |

The key is embedded in the client bundle. If the key is secret or the browser blocks requests (CORS / mixed content HTTP→HTTPS), you need a server-side proxy — that is out of scope here.

## Routes

| Path                       | Screen                                      |
| -------------------------- | ------------------------------------------- |
| `/`                        | Home with search                            |
| `/search?number=…&brand=…` | Results: manufacturers and offers           |
| any other                  | 404                                         |

Dynamic search is marked `noindex`; `public/robots.txt` disallows `/search`.

## Project structure

```text
src/
  app/        # entry, router, providers, shell
  pages/      # home, parts-search, not-found
  features/   # article search (form + URL)
  entities/   # part: API, types, normalization
  shared/     # HTTP, UI kit, config, tokens, utils
```

Cross-slice imports go only through public `index.ts`. Alias: `@/*` → `src/*`.

## License

MIT
