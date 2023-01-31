FROM node:19-alpine

ARG _WORKDIR=/home/node/app
ARG PORT=3333

USER root
RUN apk add git

USER node
WORKDIR ${_WORKDIR}

ADD . ${_WORKDIR}
RUN yarn install

EXPOSE ${PORT}

CMD yarn start
