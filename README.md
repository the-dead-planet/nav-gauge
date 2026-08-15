# About nav-gauge

## Mission

The mission of this open source application is to provide a variety of fun map & route data tools to play around and create content with. 

## Vision

### Examples of tools

- [Record a route](#record-a-route)
- [Navigate along a route](#navigate-along-a-route)
- [Submit street art data points](#submit-street-art-points) and create street art routes
- [Generate content](#create-route-story) such as a trip summary story or assets for video editing (think of mini navigation maps in racing games or an intermediate clip in a documentary film)

### Offline and no account needed

The tools are to be available as much as possible offline and without the need to create accounts. The option to create an account to persist certain data or submit new data points will be provided, but not mandatory to use.

### Devices

The tools are initially planned to be published on:
- Web 
- Android

If there is interest, in the future maybe also on iOS. The mobile app is in theory already being developed also for iOS but publishing there is simply too expensive ($99 per year vs. $25 one time fee on Google Play Stor) for a start for an app which doesn't make any money.

I would also like to experiment with offering some of the features on smart watches.

### Gamify

Opt-in gamification mode is being considered. But a clear idea for it has not been defined yet.

### Visual design

Visual designs will be steampunk inspired.

## Target audience

The target audience are content creators, video editors and simply anybody who is interested in analyzing their trip or creating an encapsulated single file souvenir for themselves or to share or post on (social) media.

## Use cases 

Development is in progress so none of below use cases are covered yet but this is the plan:

### Create route story

1. Select a recorded route or upload a `.gpx`, `.kml` or `.geojson` file with route data.
2. Overlay image, video and audio assets on top of the route to create a story.
3. Customize styles of the map, route and additional content and add analytics components. 
4. Animate the route and record a story video.

### Record a route

Go and explore the world and the app will save your route data on your device in the background. Take pictures, videos or audio notes on the way. The recorded data can later be used to create content or export as a `.gpx`, `.kml` or `.geojson` file.

### Navigate along a route

Draw or upload a route and start navigating along.

### Submit street art points

See cool street art on the way? Submit and rate it to allow creation of unique interesting routes.

## License

This project is licensed under the **GNU Affero General Public License v3.0**.
See the [LICENSE](LICENSE) file for details.

## Attributions

- [OpenStreetMap](https://www.openstreetmap.org/copyright)
- [Overture Maps Foundation](https://docs.overturemaps.org/attribution)

## Contribution guidelines

See [CONTRIBUTING](/docs/CONTRIBUTING.md).

## Support my work

This is a hobby project. If you find it useful, please consider supporting me:

- ☕ [Ko-fi](https://ko-fi.com/spookydoodle)

## Components

- [web app](/app-web/README.md) - How to run and develop the web application
- [mobile app](/app-mobile/README.md) - How to run and develop the mobile application
- [apparatus](/apparatus/) - Shared logic (common/web/mobile)
- [tinker-chest](/tinker-chest/) - Foundational utilities (single package)
- [gears](/gears/README.md) - Pluggable features
- [ui](/ui/README.md) - UI library (common/web/mobile)

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

More info in web app's [README](/app-web/README.md).

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

More info in mobile app's [README](/app-mobile/app/README.md).

## Generating

### Generate a gear

```bash
yarn generate:gear
```

Or provide the name and optional flags right away:

```bash
yarn generate:gear <name>
```

Scaffolds a new pluggable feature from `/.templates/`. Supports `--web-only` and `--mobile-only` flags. See [gears README](/gears/README.md).

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