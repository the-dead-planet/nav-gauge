FROM node:22-alpine AS builder

WORKDIR /app/

COPY apps/package.json apps/yarn.lock apps/tsconfig.base.json apps/tsconfig.web.json ./

COPY apps/ui/common ./ui/common
COPY apps/ui/web ./ui/web

RUN yarn install --network-timeout 300000
RUN yarn build:ui:web

FROM nginx:1.28.0-alpine

COPY --from=builder /app/ui/web/storybook-static /usr/share/nginx/html

COPY apps/ui/web/conf/conf.d/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
