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
| `yarn dev:ui:web` | Start Storybook for web UI |
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

## Documentation

The authoritative UI design and implementation guidance lives in Storybook MDX under `ui/web/src/design-system/`; start with `Overview.mdx` and its linked foundation pages.

Keep documentation concise and scannable: one authoritative home per rule, links instead of repetition, and tables for specifications.

## Workflow and verification

- Read relevant code and guidance; reuse context instead of rereading unchanged files or revisiting settled decisions. Ask only about genuine behavioral ambiguity.
- Batch cohesive changes and review the final diff once. Adjacent cleanup is worthwhile only when it materially improves consistency.
- Verify proportionally to the change:

| Change | Checks |
|--------|--------|
| Runtime behavior or rendering | Affected typechecks, focused tests, `yarn lint`, and `git diff --check`; browser/device checks when relevant |
| Types or mechanical renames | Affected typechecks, `yarn lint`, and `git diff --check`; tests when runtime behavior may be affected |
| Documentation or agent instructions | Relevant parsing/compilation and `git diff --check` |

- Run checks after the focused edits; repeat only failed checks or checks affected by subsequent changes. Log verbose output outside the repo and inspect it on failure.
- Use subagents only for high-risk or explicitly requested reviews. Report discoveries, blockers, and major phase changes; stop when the task and checks are complete.
- Direct Prettier invocations require `--tab-width 4`; avoid reformatting untouched lines.

## Other

- Never commit secrets or `.env` files.
- Preserve offline, account-free device persistence by default.
- Use the `@react-native` preset for mobile tests.
- Native mobile dependencies used by another workspace must be runtime dependencies of `app-mobile` for autolinking, and peer plus dev dependencies of each workspace that imports them.
- Do not run long Android builds in the agent session. Ask the user to run `yarn build:mobile` and provide the first error block if it fails.
- See `docs/CONTRIBUTING.md` and `docs/ARCHITECTURES.md` for details.
