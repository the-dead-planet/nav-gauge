FROM node:22-alpine AS builder

WORKDIR /app/

COPY apps/package.json apps/yarn.lock apps/tsconfig.base.json apps/tsconfig.web.json ./

COPY apps/app-web ./app-web
COPY apps/packages ./packages
COPY apps/ui/common ./ui/common
COPY apps/ui/web ./ui/web
COPY apps/types ./types

COPY apps/gears ./gears
RUN rm -rf apps/gears/*/mobile apps/gears/*/mobile

RUN yarn install --network-timeout 300000
RUN yarn build:web

FROM nginx:1.28.0-alpine

COPY --from=builder /app/app-web/dist /usr/share/nginx/html

COPY apps/app-web/conf/conf.d/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]