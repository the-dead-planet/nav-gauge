# Mobile application

Mobile version of the application.

## Components

- [Mobile app](/apps/mobile/app/README.md)
- [Mobile UI](/apps/mobile/ui/README.md)

## Import sequence

See [architecture](/docs/architecture.md).

## Tests

### Unit tests

Write unit tests for logic using mocha and chai in folders `test/**/*.ts`.
Write E2E (component rendering) tests using jest in folders `__tests__/**/*.tsx`.

### Commands

Run below commands from the `app` / `ui` folder:

Unit tests:

```
yarn test
```

E2E tests:

```
yarn test:e2e
```
