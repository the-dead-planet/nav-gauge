# Development

First `yarn install` from this folder.

## Components

- [web app](/apps/app-web/README.md) - How to run and develop the web application
- [mobile app](/apps/app-mobile/README.md) - How to run and develop the mobile application
- [apparatus](/apps/apparatus/) - Shared logic (common/web/mobile)
- [tinker-chest](/apps/tinker-chest/) - Foundational utilities (single package)
- [gears](/apps/gears/README.md) - Pluggable features
- [ui](/apps/ui/README.md) - UI library (common/web/mobile)

See [ARCHITECTURES](/docs/ARCHITECTURES.md).

### Common dependencies

- [TypeScript v6](https://www.typescriptlang.org/)
- [Node v24](https://nodejs.org/en/download)
- [React v19](https://react.dev)
- [RxJS v7](https://rxjs.dev)
- [Mocha v11](https://mochajs.org)

### Install dependencies

#### Install all

Run

```
yarn install
```

#### Install new packages

To install a global dependency which can be used in all apps and packages run:

```
yarn add <package_name> -W
```

To install a package in only a single workspace run below commands mentioning the workspace name.

Dev dependencies:

```
yarn workspace <workspace_name> add -D <package_name> 
```

Depencencies:

```
yarn workspace <workspace_name> add <package_name>
```

For example `yarn workspace @the-dead-planet/nav-gauge-app-mobile add react-native`

Same applies to removal of packages.

## Run

### Run web app

```
yarn dev:web
```

More info in web app's [README](/apps/app-web/README.md).

### Run mobile app

Set up android environment following https://reactnative.dev/docs/set-up-your-environment

To start metro service or start with clear cache:

```
yarn start:mobile
yarn start:mobile:r 
```

To run on the development device (emulator or connected real device):

```
yarn dev:mobile
```

To run type check in watch mode:

```
yarn typecheck:mobile
```

More info in mobile app's [README](/apps/app-mobile/app/README.md).

## Generating

### Generate a gear

```bash
yarn generate:gear
```

Or provide the name and optional flags right away:

```bash
yarn generate:gear <name>
```

Scaffolds a new pluggable feature from `apps/.templates/`. Supports `--web-only` and `--mobile-only` flags. See [gears README](/apps/gears/README.md).

## Tests

### Unit tests

```bash
yarn test:all
```

```bash
yarn test:web
```

```bash
yarn test:mobile
```

```bash
yarn test:gear <gear-name>
yarn test:gear route-story
```

### E2E

#### Web with Cypress

```bash
test:e2e:web
```

#### Mobile with Jest

```bash
test:e2e:mobile
```