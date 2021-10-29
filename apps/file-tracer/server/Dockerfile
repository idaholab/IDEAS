# Copyright 2020, Battelle Energy Alliance, LLC  ALL RIGHTS RESERVED

FROM node:14.4.0

WORKDIR /usr/src/app/server

RUN apt-get update && \
    apt-get install -y build-essential python3 g++ make autoconf automake libtool git swig python-dev texinfo && \
    rm -rf /var/lib/apt/lists/*ls && \
    apt-get update && \
    git clone "https://github.com/LibreDWG/libredwg" && \
    cd ./libredwg && \
    sh ./autogen.sh && \
    ./configure && \
    make && \
    make check && \
    make install && \
    echo "/usr/local/lib" > /etc/ld.so.conf.d/local.conf && \
    ldconfig

COPY package.json .

RUN npm install

COPY . .
