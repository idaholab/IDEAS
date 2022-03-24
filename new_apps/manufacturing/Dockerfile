FROM node:16.6 as base

WORKDIR /home/node/app

COPY package*.json ./

RUN npm i

COPY . .
