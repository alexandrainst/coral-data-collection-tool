FROM node:20-bullseye

WORKDIR /app

RUN apt-get update -q -y && \
    apt-get install -q -y sqlite3

COPY . .

RUN npm install --omit=dev
RUN npm run build:server

ENTRYPOINT ["npm", "run", "start:server"]
