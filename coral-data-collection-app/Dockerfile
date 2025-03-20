FROM node:20-bullseye AS build

WORKDIR /app

COPY . .

RUN npm install --omit=dev
RUN npm run build:client

FROM nginx

COPY --from=build /app/coral-data-collection-app/dist /usr/share/nginx/html
