FROM node:14.16.1-alpine3.11

RUN apk add --no-cache bash

RUN npm i -g @nestjs/cli@7.4.1

USER node

WORKDIR /home/node/app

ADD package.json /src

RUN npm i --silent

ADD . /home/node/app