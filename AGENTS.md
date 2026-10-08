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

## After changes

Always run `yarn typecheck:web` (or `yarn typecheck:mobile:once` for mobile changes), `yarn lint`, and relevant tests after every code edit.
Redirect verbose verification output to temporary log files. Report only pass/fail, and inspect relevant log sections only when a command fails.

## Single-Pass Workflow

For every task:

1. Read each relevant file once and maintain a compact working-state summary.
2. Resolve requirements before editing; ask only when behavior is genuinely ambiguous.
3. Batch related changes into one focused patch.
4. Review the final diff once. Use subagents only for high-risk or explicitly requested reviews.
5. Run one verification pass: relevant typecheck, tests, lint, and `git diff --check`.
6. Send progress updates only for discoveries, blockers, or major phase changes.
7. Stop once requirements and checks pass. Do not investigate speculative improvements.

Avoid repeating file reads, context summaries, verification commands, or already-settled reasoning.

## Other

- Do not commit secrets or `.env` files
- No account required by default; persistence via device storage
- Use `@react-native` preset for mobile tests
- Native mobile dependencies used by another workspace must be runtime dependencies of `app-mobile` for autolinking, and peer plus dev dependencies of each workspace that imports them.
- Do not run long Android builds in the agent session. Ask the user to run `yarn build:mobile` and provide the first error block if it fails.
- Refer to `docs/CONTRIBUTING.md` and `docs/ARCHITECTURES.md` for details
