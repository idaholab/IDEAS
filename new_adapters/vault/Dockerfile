FROM node:16.6 as base

WORKDIR /home/node/app

RUN apt-get update && \
    apt-get dist-upgrade -f -y && \
    apt-get install -y build-essential  && \
    apt-get install -y python3  && \
    apt-get install -y g++  && \
    apt-get install -y make  && \
    apt-get install -y autoconf  && \
    apt-get install -y automake  && \
    apt-get install -y libtool  && \
    apt-get install -y git  && \
    apt-get install -y swig  && \
    apt-get install -y python-dev  && \
    apt-get install -y texinfo && \
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

COPY package*.json ./

RUN npm i

COPY . .


#FROM base as production

#ENV NODE_PATH=./build

#RUN npm run build
