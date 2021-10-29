FROM alpine:latest

WORKDIR /usr/src/paged

# This is Puppeteer documentation on running Puppeteer (a PagedJS dependency) in Docker

# Installs latest Chromium (89) package.
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    nodejs \
    yarn

# Tell Puppeteer to skip installing Chrome. We'll be using the installed package.
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Puppeteer v6.0.0 works with Chromium 89.
RUN yarn add puppeteer@6.0.0

# This is app specific Dockerfile commands

RUN apk update
RUN apk add --update nodejs npm
RUN npm install -g pagedjs-cli pagedjs

RUN apk add py-pip
RUN apk add python3

COPY . .

RUN pip install -r requirements.txt 

# Add user so we don't need --no-sandbox.
RUN addgroup -S pptruser && adduser -S -g pptruser pptruser \
    && mkdir -p /home/pptruser/Downloads /app \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser /app

# Run everything after as non-privileged user.
USER pptruser





