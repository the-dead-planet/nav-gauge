# Development

First `yarn install` from this folder.

## Components

- [web](/apps/web/README.md) - How to run and develop the web application
- [mobile](/apps/mobile/README.md) - How to run and develop the mobile application
- [packages](/apps/packages/README.md) - Packages
- [ui](/apps/ui/README.md) - Common UI

See [ARCHITECTURES](/docs/ARCHITECTURES.md).

### Common dependencies

- [TypeScript v5](https://www.typescriptlang.org/)
- [Node v22](https://nodejs.org/en/download)
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

For example `yarn workspace @the-dead-planet/nav-gauge-mobile-app add react-native`

Same applies to removal of packages.

## Run

### Run web app

```
yarn dev:web
```

More info in web app's [README](/apps/web/README.md).

### Run mobile app

Set up android environment following https://reactnative.dev/docs/set-up-your-environment

To start metro service:

```
yarn start:mobile
```

To run on the development device (emulator or connected real device):

```
yarn dev:mobile
```

More info in mobile app's [README](/apps/mobile/app/README.md).

## Tests

### Unit tests

```
yarn test:all
```

```
yarn test:web
```

```
yarn test:mobile
```

### E2E

#### Web with Cypress

```
test:e2e:web
```

#### Mobile with Jest

```
test:e2e:mobile
```