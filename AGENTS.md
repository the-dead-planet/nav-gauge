# Agent Instructions

## Project

nav-gauge is an offline-first and no-account-first map and route toolkit for content creators.

The workspace root is `/`; `package.json` and Yarn commands live there.

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
| `yarn typecheck:mobile` | Mobile TypeScript check in watch mode; stop after it reports zero errors |
| `yarn typecheck:mobile:once` | One-shot mobile TypeScript check |
| `yarn lint` | ESLint check (zero warnings) |
| `yarn ui:web` | Start Storybook for web UI |
| `yarn generate:gear <name>` | Scaffold a new gear from `.templates/` |
| `yarn add:gear <name> <platform> <pkg>` | Add a dependency to a gear package |

## Architecture

Yarn workspace monorepo. See `.opencode/rules/architecture.mdc` for package responsibilities and import direction.

### Gears (features)
Each feature is a pluggable Gear with `common/`, `web/`, and/or `mobile/` packages. Gears implement `Gear` from `@the-dead-planet/nav-gauge-apparatus-common`.

Generate with `yarn generate:gear <name>` from `/`.

### Machine Ward hooks
- **Web** (`app-web`, `gears/*/web`): use `useWebMachineWard()` from `@web-apparatus`
- **Mobile** (`app-mobile`, `gears/*/mobile`): use `useMobileMachineWard()` from `@mobile-apparatus`
- **Common** (`apparatus/common`): use `useMachineWard()`; platform hooks are forbidden

## After changes

Review surrounding code for control flow, naming, duplication, concept extraction, and module boundaries. Make a small behavior-preserving adjacent refactor only when it materially improves consistency.

Run one verification pass after edits: relevant typecheck, tests, `yarn lint`, and `git diff --check`. Redirect verbose output to temporary logs, report only pass or fail, and inspect it only on failure.

## Single-Pass Workflow

1. Read each relevant file once and maintain a compact working-state summary.
2. Resolve requirements before editing; ask only when behavior is genuinely ambiguous.
3. Batch related changes into one focused patch.
4. Review the final diff once. Use subagents only for high-risk or explicitly requested reviews.
5. Run one verification pass.
6. Send progress updates only for discoveries, blockers, or major phase changes.
7. Stop when requirements and checks pass; do not investigate speculative improvements.

Do not repeat file reads, context summaries, verification commands, or settled reasoning.

## Other

- Never commit secrets or `.env` files.
- Preserve offline, account-free device persistence by default.
- Use the `@react-native` preset for mobile tests.
- Native mobile dependencies used by another workspace must be runtime dependencies of `app-mobile` for autolinking, and peer plus dev dependencies of each workspace that imports them.
- Do not run long Android builds in the agent session. Ask the user to run `yarn build:mobile` and provide the first error block if it fails.
- See `docs/CONTRIBUTING.md` and `docs/ARCHITECTURES.md` for details.
