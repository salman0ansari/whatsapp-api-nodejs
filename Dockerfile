FROM node:19-alpine

ARG _WORKDIR=/home/node/app
ARG PORT=3333
ENV MONGODB_URL=mongodb://mongo:27017/whatsapp_api

WORKDIR ${_WORKDIR}

ADD . ${_WORKDIR}
RUN npm install

USER node
EXPOSE ${PORT}

CMD ["npm", "start"]