# syntax=docker/dockerfile:1.20

FROM node:24-alpine AS builder

WORKDIR /app/

COPY /package.json /yarn.lock /.yarnrc.yml ./
COPY /.yarn/patches ./.yarn/patches

COPY --parents /tinker-chest/package.json /ui/common/package.json /ui/web/package.json ./
RUN corepack enable && CYPRESS_INSTALL_BINARY=0 yarn install

COPY /tsconfig.base.json /tsconfig.packages.json /tsconfig.web.json ./
COPY /tinker-chest ./tinker-chest
COPY /ui/common ./ui/common
COPY /ui/web ./ui/web

COPY /docs/assets ./docs/assets

RUN yarn build:ui:web

FROM nginx:1.28.0-alpine

COPY --from=builder /app/ui/web/storybook-static /usr/share/nginx/html

COPY /ui/web/conf/conf.d/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
