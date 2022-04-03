FROM node:16.13.2
WORKDIR /usr/src/clean-node-api
COPY ./package.json .
RUN npm install --only=prod
