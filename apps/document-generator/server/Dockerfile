FROM node:14.4.0-alpine3.10

WORKDIR /usr/src/server

COPY package.json .

RUN npm install

COPY . .
