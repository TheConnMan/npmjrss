FROM alpine:3.4

RUN apk add --no-cache nodejs

WORKDIR /usr/src/app

COPY package.json /usr/src/app
RUN npm install --production

COPY . /usr/src/app

RUN npm install && npm run compile && npm prune --production

EXPOSE 3000

CMD npm start
