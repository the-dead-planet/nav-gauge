# Contributing guidelines

## Create issues

At this moment feel free to add any kind of issues in this repository. The rules might be scoped out later.

## Create pull requests

Contributions will be welcome at later stages.

Work in progress.

## Development

### Languages and frameworks of choice

#### Web frontend

[React](https://react.dev) with strict [TypeScript](https://www.typescriptlang.org), state management by [RxJS](https://rxjs.dev), bundled with [Rspack](https://rspack.dev/guide/tech/react), containerized by [docker](https://docs.docker.com) and served using [nginx](https://nginx.org).

[Svelte](https://svelte.dev) can also be used for static server rendered public pages, for example for an SEO optimized home page or blog articles.

#### Mobile frontend

[React Native](https://reactnative.dev) with strict [TypeScript](https://www.typescriptlang.org) and [without a framework](https://reactnative.dev/docs/getting-started-without-a-framework).

#### Backend

[GoLang](https://go.dev) for the main application REST API and proxy gateway. 

Other languages can be considered case by case, if it is decided that GoLang is not the right choice for a new service.

### Infrastructure

All deployed on a self managed machine and automated using [GitHub Actions](https://github.com/features/actions).

### Development rules

Keep it fun.

#### Design principles

Mix of object oriented and functional programming. Try to separate modules and abstract the logic wherever it makes sense.

#### Web & mobile alignment

Web and mobile applications should follow the same structure which is defined by [Machine Ward](/apps/packages/apparatus/src/machine-ward/machine-ward.tsx). Both apps should implement specifics using the DOM (for web) and native components (for mobile).

#### State management

The main application state is provided via the [State Warden](/apps/packages/apparatus/src/state-warden/state-warden.ts) object accessible using the [useStateWarden](/apps/packages/apparatus/src/state-warden/useStateWarden.tsx) hook.

#### Separation of features

All features should be opt-in, easily plugged in and out of the app. You can find them stored in the [Engine](/apps/packages/apparatus/src/state-warden/engine/engine.ts) and they should implement a [Gear interface](/apps/packages/apparatus/src/state-warden/engine/model.ts).

More info: TBD

#### Import paths

Follow the [architectures](/docs/ARCHITECTURES.md) flow when importing from other workspaces. Do not import in the wrong direction.

Import paths are setup as `@package-name` in the `tsconfig.json` files in each workspace, in [Rspack config](/apps/web/app/rspack.config.cjs) and in [mobile babel config](/apps/mobile/app/babel.config.js). 

If suddenly something is imported, for example, from `../../apparatus/src` instead of `@apparatus` when importing to a file in `tinker-chest` workspace, and importing from `@apparatus` is not possible... it's a sign of a forbidden import. Consider moving stuff around or creating another package to assure correct import flow. 

Remember about updating the [architectures chart](/docs/assets/architecture.drawio) and [svg](/docs/assets/architecture.svg) using [Draw.io](https://app.diagrams.net), if needed.

#### Code splitting

Code splitting is set up for web in [Rspack config](/apps/web/app/rspack.config.production.cjs) per larger dependencies and per application workspace to enable better caching for faster startup.

#### Preferred environment

[VS Code](https://code.visualstudio.com) but use whatever.

#### Linting

Default TypeScript formatter.

#### Time formatting

Use [luxon](https://github.com/moment/luxon#readme).

#### Documentation

Add [JSDocs](https://jsdoc.app) with minimal information which is handy to read when writing the code (for example describe the meaning of parameters and the returned value). 

The code should be as much as possible self explanatory. If it's not clear what the code is supposed to do just from reading it - refactor it so that it is. 

Writing successful and failing unit tests for complex functions is also a good way to document how a function should work.

Avoid bloated comments which just take space and which nobody will read anyway.

#### `TODO:`s

At the moment, the architecture of this application is being structured and there are many `TODO:`s. Once a basic version of the API and the web and mobile app is structured, those will be handled and removed. Going forward from that moment, instead of adding a `TODO:` add an issue in the [GitHub repository](https://github.com/the-dead-planet/nav-gauge).

#### Dependencies

The less the better. If you can write something yourself - do it. 

This project aims to only include essential packages, which are trusted and well maintained. A package should be installed only if it's really necessary or helpful and only when it's needed. Examples of such packages: React, RxJS, MapLibre, Turf, D3, Three.

The aim is to be:
- As much as possible aware of how things work
- Decrease the floor size for hidden security vulnerabilities
- Prevent from the need to refactor in the future when dependencies do not catch up with updates of their peer dependencies.

#### Persisted data

Use device storage to store non-sensitive settings. Implement options to export and import settings from one device to another.

The application should not require an account creation but it can offer it as a complimentary feature.

#### Testing

Add unit, component and end-to-end tests for more complex logic but do not overcomplicate them. 

##### Testing environments:

- Unit tests in `/apps/**/test/*.test.ts` using [Mocha](https://mochajs.org) and [Chai](https://www.chaijs.com).
- Web component and end-to-end tests in [`/apps/web/app/cypress/e2e/*.cy.ts`](/apps/web/app/cypress/e2e) using [Cypress](https://docs.cypress.io/app/component-testing/react/overview).
- Mobile component and end-to-end tests in [`/apps/mobile/app/__tests__/*.test.tsx`](/apps/mobile/app/__tests__) using [Jest](https://jestjs.io/docs/tutorial-react-native).
- Backend tests in [TBD](/api/)

#### UI library

Own UI library is created with focus on semantics, accessibility and minimalism. Reusable components should be developed without including any business logic. 

Styling should be steampunk inspired.

Variables used repeatedly and those which which depend on the theme should be added to [theme specifications](/apps/ui/src/theme/specifications.ts) in the common [UI package](/apps/).

The library is currently not deployed as a separate app with component docs. Maybe it will be in the future.

#### Theme

Own light & dark themes are created and applied to the wrappers for native components which should be used across the app.

#### Use of AI

Use with caution. Use it as a tool or as an advanced search or autocomplete and don't depend on it too much. 

There is no plan to jump the hype train. If there is ever a need to include an AI component and if it would be beneficial as an option to a certain feature, it can be added. In general it's an AI-last application.
