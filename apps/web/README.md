# Web application

Web version of the application.

## Components

- [Web app](/apps/web/app/README.md)
- [Web gears](/apps/web/gears/README.md)
- [Web UI](/apps/web/ui/README.md)

## Import sequence

See [architecture](/docs/architecture.md).

## Dependencies

- [TypeScript v5](https://www.typescriptlang.org/)
- [Node v22](https://nodejs.org/en/download)
- [React v19](https://react.dev)
- [RxJS v7](https://rxjs.dev)
- [MaplibreGL v5](https://maplibre.org/maplibre-gl-js/docs)

## Development

### Web app

#### Start development build

From root of the repository run:

```
yarn dev:web
```

#### Preview production build

From root of the repository run:

```
yarn build:web
yarn start:web
```

#### Production build and deployment

- [Dockerfile](/apps/web/app/Dockerfile)
- [nginx.conf](/apps/web/app/conf/conf.d/nginx.conf)
- [build-and-push workflow](/.github/workflows/build-and-push.yaml)

To run docker image locally from root of the repository:

```
docker build . --file apps/web/app/Dockerfile -t nav-gauge
docker run -p 8080:8080 nav-gauge
```

Visit [http://localhost:8080](http://localhost:8080).

### Web UI

At the moment a separate deployment of UI library does not exist. It might be added later.
