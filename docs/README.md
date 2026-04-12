# MagNews — Developer Documentation

## Prerequisites

| Requirement | Version |
|-------------|---------|
| Node.js     | ≥ 18.x  |
| npm         | ≥ 9.x (bundled with Node.js) |

> **Tip:** Use [nvm](https://github.com/nvm-sh/nvm) or [fnm](https://github.com/Schniz/fnm) to manage Node.js versions.

---

## Install

```bash
npm install
```

---

## Development

Start the local Vite dev server with Hot Module Replacement:

```bash
npm run dev
```

The app is available at <http://localhost:5173> by default.

---

## Build

Compile and bundle for production:

```bash
npm run build
```

The output is placed in the `dist/` directory.

---

## Preview production build

```bash
npm run preview
```

---

## Lint

```bash
npm run lint
```

---

## Type-check

```bash
npm run typecheck
```

---

## Environment Variables

Create a `.env` file in the project root (it is git-ignored) to override defaults:

| Variable       | Default                    | Description                        |
|----------------|----------------------------|------------------------------------|
| `VITE_API_URL` | `http://localhost:8000`    | Base URL of the MagNews backend API |

Example `.env`:

```env
VITE_API_URL=https://api.magnews.example.com
```

All variables exposed to the browser **must** be prefixed with `VITE_`.

---

## Project Structure

```
MagNews/
├── src/
│   ├── app/          # App entry point, global providers, routing
│   ├── pages/        # Page-level components (one per route)
│   ├── widgets/      # Large self-contained UI blocks (Header, etc.)
│   ├── features/     # User-facing feature slices (auth, subscriptions…)
│   ├── entities/     # Business-domain models & their UI (User, Publication…)
│   └── shared/       # Reusable utilities, API client, types, config
├── public/           # Static assets served as-is
├── docs/             # Developer documentation (README.md + generated API docs)
├── index.html        # HTML entry point
├── vite.config.ts    # Vite configuration
├── tsconfig.app.json # TypeScript config for the application source
├── tailwind.config.js
└── package.json
```

The project follows the [Feature-Sliced Design](https://feature-sliced.design/) architecture.

---

## Generating API Documentation (TypeDoc)

Source-code API docs are generated from TSDoc comments using [TypeDoc](https://typedoc.org/).

### Generate docs

```bash
npm run docs:api
```

Output is written to `docs/api/`. Open `docs/api/index.md` (or any Markdown viewer) to browse the generated docs.

### Build all docs

```bash
npm run docs
```

> `docs/api/` is generated output and is excluded from version control via `.gitignore`.

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| [Vite](https://vitejs.dev/) | Build tool & dev server |
| [React 18](https://react.dev/) | UI library |
| [TypeScript](https://www.typescriptlang.org/) | Static typing |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first CSS |
| [React Router v7](https://reactrouter.com/) | Client-side routing |
| [TypeDoc](https://typedoc.org/) | API documentation generator |
