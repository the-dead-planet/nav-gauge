# Agent Instructions

## Project

nav-gauge — open-source map & route data tools for content creators. Offline-first, no account required. Steampunk/cyber-inspired design.

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
| `yarn lint` (in workspace) | ESLint check (zero warnings policy) |
| `yarn ui:web` | Start Storybook for web UI |
| `yarn generate:gear <name>` | Scaffold a new gear from `.templates/` |
| `yarn add:gear <name> <platform> <pkg>` | Add a dependency to a gear package |

## Architecture

Monorepo with Yarn workspaces. Strict **import direction**:

```
tinker-chest → apparatus → ui/common, gears/common
                                     ↓
                          ui/web, gears/web → app-web
                          ui/mobile, gears/mobile → app-mobile
```

No reverse imports. Always use `@package-name` aliases, never relative paths across workspaces.

### Gears (features)
Each feature is a pluggable **Gear** with 1-3 packages depending on template: `common/` (abstract class), `web/`, `mobile/`. Gears implement the `Gear` interface from `@apparatus`. Generate with `yarn generate:gear <name>` from `apps/`.

## Code Style

- Strict **TypeScript** — no `any`, explicit member accessibility
- **React** + **RxJS** for state management (use `useStateWarden` hook)
- **Luxon** for all date/time formatting
- **4-space indentation**, semicolons required
- Minimal JSDocs — code should be self-documenting; refactor if unclear
- No bloated comments, no `TODO:`s (use GitHub issues instead)
- Prefer fewer dependencies; write your own when feasible

## Testing

- **Web unit**: Mocha + Chai in `test/**/*.test.ts`
- **Mobile unit**: Jest in `__tests__/*.test.tsx`
- **Web E2E**: Cypress in `app-web/cypress/e2e/*.cy.ts`
- Test complex logic; don't overcomplicate

## UI

- Own UI library in `apps/ui/` — semantic, accessible, minimal
- Steampunk/cyber-inspired styling
- Theme variables in `@ui/common/src/theme/specifications.ts`
- Reusable components must not contain business logic

## Other

- Do not commit secrets or `.env` files
- No account required by default; persistence via device storage
- Use `@react-native` preset for mobile tests
- Refer to `docs/CONTRIBUTING.md` and `docs/ARCHITECTURES.md` for details
