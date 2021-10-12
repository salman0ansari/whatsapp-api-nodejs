FROM node:14.17-alpine
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
EXPOSE 3000
ENV PORT 3000
CMD ["npm", "start"]

