FROM node:lts-alpine

COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm install --omit=dev

COPY dist/ dist/

CMD [ "node", "dist/src/index.js" ]