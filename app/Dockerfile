FROM node:16.19-alpine

RUN apk --no-cache add curl
RUN apk add make g++ python3 git
RUN npm i -g node-pre-gyp

RUN mkdir /api
WORKDIR /api

COPY package.json .
COPY npm* .
RUN npm i

COPY src ./src
COPY .env .

CMD npm start