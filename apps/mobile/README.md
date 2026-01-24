# Mobile application

Mobile version of the application.

## Components

- [Mobile app](/apps/mobile/app/README.md)
- [Mobile UI](/apps/mobile/ui/README.md)

## Import sequence

See [architecture](/docs/architecture.md).

## Dependencies

- [TypeScript v5](https://www.typescriptlang.org/)
- [Node v22](https://nodejs.org/en/download)
- [React v19](https://react.dev)
- [React Native v0.83](https://reactnative.dev)
- [RxJS v7](https://rxjs.dev)
- [Mocha v11](https://mochajs.org) for unit tests
- [MapLibre React Native v10](https://maplibre.org/maplibre-react-native)

## Development

### Start development build

From /apps folder in the repository run:

```
yarn dev:mobile
```

To restart metro server and clear cache

```
yarn start:mobile:r
```

## Tests

### Unit tests

Write unit tests for logic using mocha and chai in folders `test/**/*.ts`.

Run below commands from the `app` / `ui` folder:

```
yarn test
```

### E2E tests

Write E2E (component rendering) tests using jest in folders `__tests__/**/*.tsx`.

```
yarn test:e2e
```
