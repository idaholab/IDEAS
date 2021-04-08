# Copyright 2020, Battelle Energy Alliance, LLC  ALL RIGHTS RESERVED

FROM node:14.4.0-alpine3.10

WORKDIR /usr/src/app/client

COPY package.json .

RUN npm install

COPY . .