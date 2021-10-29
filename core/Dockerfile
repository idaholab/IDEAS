# Copyright 2021, Battelle Energy Alliance, LLC  ALL RIGHTS RESERVED

FROM node:14.4.0-alpine3.10

WORKDIR /usr/src

COPY package.json .

RUN npm install

COPY . .
