# GitHero

> Master Git by Changing the World.

GitHero is an immersive 2D terminal puzzle adventure that transforms Git concepts (branches, merges, rebases, stashes, remotes, and plumbing) into tactile puzzles across 250 handcrafted levels.

---

## Overview

- **Core Gameplay**: Control your operative using keyboard arrow keys, WASD, on-screen touch controls, or direct terminal movement commands (`git up`, `git down`, `git left`, `git right`).
- **Authentic Git Plumbing**: Execute 22+ authentic Git commands (`git status`, `git push`, `git pull`, `git commit`, `git switch`, `git branch`, `git merge`, `git rebase`, `git stash`, `git cherry-pick`, `git reset`, `git tag`, `git diff`, etc.) to manipulate repository objects and stage commit payloads.
- **Progression**: 250 numerical sectors distributed across 20 themed worlds, featuring strict sequential progression, star rating milestones, and real backend authentication.
- **Developer Workbenches**: Interactive submodules, worktrees, hooks studio, sparse checkout, bisect assistant, history cleaner, and cryptographic signing tools.

---

## Prerequisites

- **Node.js**: `v18.0.0` or higher (ESM module support)
- **npm**: `v9.0.0` or higher
- Modern web browser with ES2022+ support (Chrome, Firefox, Edge, Safari)

---

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/Avinash1905/Git_hero.git
cd Git_hero
npm install
```

---

## Environment Variables

Copy the provided template to configure your local environment:

```bash
cp .env.example .env
```

### Configuration Keys:

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `PORT` | `3000` | HTTP server listening port |
| `HOST` | `localhost` | Server host address |
| `NODE_ENV` | `development` | Runtime environment (`development` / `production`) |
| `DATABASE_PATH` | `./server/database/gitquest.db` | SQLite database file location |
| `JWT_SECRET` | *(placeholder)* | Secret key used for signing JWT tokens |
| `JWT_EXPIRATION` | `7d` | Session token validity duration |
| `RATE_LIMIT_WINDOW_MS` | `60000` | Rate limiting sliding window in milliseconds |
| `RATE_LIMIT_MAX_REQUESTS` | `120` | Maximum requests allowed per IP per window |
| `API_BASE_URL` | `http://localhost:3000/api` | API endpoint for frontend client services |

> **Security Note**: Never commit `.env` or production credentials. Use `.env.example` as a template for team synchronization.

---

## Build

GitHero runs on native browser ES Modules and lightweight backend architecture without requiring heavy bundling. All production source files in `src/`, `js/`, and `server/` are verified through our automated build and linting pipelines.

To verify build integrity and static validation:

```bash
npm run test:master
```

---

## Run

### Production Mode

```bash
npm start
```

### Development Mode

```bash
npm run dev
```

The application will be available at: **`http://localhost:3000`**

---

## Testing

GitHero includes a comprehensive test suite spanning unit, integration, frontend, and level solvability tests.

### Run Backend Integration Tests
Tests database seeding, password hashing, JWT issuance, sequential unlocking, and anti-cheat validation:

```bash
npm test
```

### Run Frontend Component & Workbench Tests
Tests authentication views, level filters, terminal themes, git workbenches, and UI stores:

```bash
npm run test:frontend
```

### Run Master Engine & 250 Levels Solvability Suite
Tests Math/Vector2D, 22 Git commands, repository services, and algorithmic solvability across all 250 sectors:

```bash
npm run test:master
```

### Run All Test Suites
Executes the full end-to-end testing pipeline:

```bash
npm run test:all
```

---

## Architecture & Directory Structure

```
Git_hero/
├── css/                  # Custom theme variables, terminal styling & animations
├── js/
│   ├── app.js            # Main SPA orchestrator, hash router & lifecycle
│   ├── components/       # TopAppBar, BottomNavBar & navigation widgets
│   └── engine/           # 20K LOC deterministic Git puzzle & physics engine
├── server/               # Express REST API, SQLite repositories & auth controller
├── src/
│   ├── adapters/         # GameEngineAdapter, EventBus & Error Boundaries
│   ├── api/              # Resilient API client, cache & offline sync middleware
│   ├── auth/             # Session auditor, MFA manager, password security & views
│   ├── components/       # Reusable UI widgets, modals, toasts & breadcrumbs
│   ├── features/         # Gameplay HUD, minimap, terminal, profile, levels & duels
│   ├── hooks/            # Reactive hooks (debounce, storage, audio synth, keypress)
│   ├── layouts/          # Responsive application layouts and shell grids
│   ├── levels/           # Level metadata, star milestones & recommendation engine
│   ├── pages/            # View controllers (Dashboard, Levels, Profile, Leaderboard, etc.)
│   ├── services/         # Client services (auth, player, level, progress, sound, export)
│   ├── state/            # Reactive state stores (Auth, Player, Level, Game, UI, Telemetry)
│   ├── terminal/         # Theme manager, command suggester, diff inspector & logs
│   └── utils/            # Myers diff algorithm, focus trap & AST validators
└── tests/                # Integration, frontend, and master test runners
```

---

## License

MIT License. Designed for developers mastering version control workflows through puzzle gaming.
