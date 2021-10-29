FROM node:14.4.0-alpine3.10
RUN mkdir -p /usr/src/backend/node_modules && chown -R node:node /usr/src/backend
WORKDIR /usr/src/backend
COPY package.json .
USER node
RUN npm install
COPY --chown=node:node . .
