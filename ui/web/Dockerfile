FROM node:24-alpine AS builder

WORKDIR /app/

COPY /package.json /yarn.lock /.yarnrc.yml /tsconfig.base.json /tsconfig.packages.json /tsconfig.web.json ./

COPY /tinker-chest ./tinker-chest
COPY /ui/common ./ui/common
COPY /ui/web ./ui/web

RUN corepack enable && yarn install --network-timeout 300000
RUN yarn build:ui:web

FROM nginx:1.28.0-alpine

COPY --from=builder /app/ui/web/storybook-static /usr/share/nginx/html

COPY /ui/web/conf/conf.d/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
