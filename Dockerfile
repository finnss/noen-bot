FROM node:6

MAINTAINER Abakus Webkom <webkom@abakus.no>

RUN mkdir -p /app
COPY . /app/
WORKDIR /app

RUN set -e \
   && npm install

ENTRYPOINT ["node", "index.js"]
