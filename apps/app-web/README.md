# Web application

Web version of the application.

## Components

Web application consists of the main app and the web UI library.

## Import sequence

Web app can import the (common) UI, web UI and all packages.
It cannot be imported back to other components.

## Development

### Web app

#### Start development build

From root of the repository run:

```
yarn --cwd apps dev
```

or 

```
cd apps
yarn dev
```

#### Preview production build

From root of the repository run:

```
yarn --cwd apps build
yarn --cwd apps start
```

or

```
cd apps
yarn build
yarn start
```

#### Production build and deployment

- [Dockerfile](/apps/app-web/web-app/Dockerfile)
- [nginx.conf](/apps/app-web/web-app/conf/conf.d/nginx.conf)
- [build-and-push workflow](/.github/workflows/build-and-push.yaml)

To run docker image locally from root of the repository:

```
docker build . --file apps/app-web/web-app/Dockerfile -t nav-gauge
docker run -p 8080:8080 nav-gauge
```

Visit [http://localhost:8080](http://localhost:8080).

### Web UI

At the moment a separate deployment of UI library documentation does not exist. It might be added later.
