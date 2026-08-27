# Agent Instructions

## Project

nav-gauge — open-source map & route data tools for content creators. Offline-first, no account required. Steampunk/cyber-inspired design.

The workspace root is `/` (package.json and yarn commands live there, not at repo root).

## Commands

| Command | Description |
|---------|-------------|
| `yarn dev:web` | Start web dev server (port 3000, HMR) |
| `yarn build:web` | TypeScript check + production Rspack build |
| `yarn test:all` | Run all unit tests (Mocha + Jest) |
| `yarn test:web` | Run web unit tests |
| `yarn test:mobile` | Run mobile unit tests |
| `yarn test:gear` | Test a specific gear (pass name) |
| `yarn test:e2e:web:dev` | Cypress E2E against localhost |
| `yarn dev:mobile` | Start mobile dev (Android) |
| `yarn start:mobile` | Start Metro server |
| `yarn typecheck:web` | TypeScript check for web packages (exits) |
| `yarn typecheck:mobile` | TypeScript check for mobile packages (watch mode — never exits; 0 errors means it passed, just Ctrl-C) |
| `yarn typecheck:mobile:once` | One-shot mobile TypeScript check (exits; silent = passed) — prefer this for non-interactive runs |
| `yarn lint` (in workspace) | ESLint check (zero warnings policy) |
| `yarn ui:web` | Start Storybook for web UI |
| `yarn generate:gear <name>` | Scaffold a new gear from `.templates/` |
| `yarn add:gear <name> <platform> <pkg>` | Add a dependency to a gear package |

## Architecture

Monorepo with Yarn workspaces. Strict **import direction** (`/` layout):

Strict import direction — see `.opencode/rules/import-constraints.mdc` for allowed importers and package paths.

### Gears (features)
Each feature is a pluggable **Gear** with 1-3 packages: `common/` (abstract class), `web/`, `mobile/`. Gears implement the `Gear` interface from `@the-dead-planet/nav-gauge-apparatus-common`. Generate with `yarn generate:gear <name>` from `/`.

### Machine Ward hooks
- **Web** (`app-web`, `gears/*/web`): use `useWebMachineWard()` from `@web-apparatus`
- **Mobile** (`app-mobile`, `gears/*/mobile`): use `useMobileMachineWard()` from `@mobile-apparatus`
- **Common** (`apparatus/common`): use generic `useMachineWard()` — cannot import platform hooks

## Code Style

See `.opencode/rules/code-style.mdc`.

## Testing

See `.opencode/rules/testing.mdc`.

## UI

- Own UI library in `/ui/` — see `.opencode/rules/ui-conventions.mdc`

## After changes

Always run `yarn typecheck:web` (or `yarn typecheck:mobile:once` for mobile changes), `yarn lint`, and relevant tests after every code edit.

## Other

- Do not commit secrets or `.env` files
- No account required by default; persistence via device storage
- Use `@react-native` preset for mobile tests
- Refer to `docs/CONTRIBUTING.md` and `docs/ARCHITECTURES.md` for details
