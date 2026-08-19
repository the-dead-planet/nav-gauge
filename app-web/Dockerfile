FROM node:24-alpine AS builder

WORKDIR /app/

COPY /package.json /yarn.lock /.yarnrc.yml /tsconfig.base.json /tsconfig.packages.json /tsconfig.web.json ./
COPY /.yarn/patches ./.yarn/patches

COPY /app-web ./app-web
COPY /apparatus ./apparatus
COPY /tinker-chest ./tinker-chest
COPY /ui/common ./ui/common
COPY /ui/web ./ui/web
COPY /types ./types

COPY /gears ./gears
RUN rm -rf /gears/*/mobile

RUN corepack enable && yarn install --network-timeout 300000
RUN yarn build:web

FROM nginx:1.28.0-alpine

COPY --from=builder /app/app-web/dist /usr/share/nginx/html

COPY /app-web/conf/conf.d/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]