FROM node:lts

COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm install --omit=dev

RUN apt update; apt install sqlite3

COPY dist/ dist/

CMD [ "NODE_ENV=production node", "dist/src/index.js" ]