FROM node:14.18.1-alpine3.13

WORKDIR /usr/src/api
COPY package.json /usr/src/api
RUN npm install
COPY . /usr/src/api
RUN npm install -g --force nodemon
RUN npm install express && npm install rimraf && npm run build
EXPOSE 3007
CMD npm run start-server