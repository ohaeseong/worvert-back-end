FROM node:12

WORKDIR /Users/steve/Documents/GitHub/tech-diary-back-end-version2.

COPY package*.json ./

RUN yarn

COPY . .

EXPOSE 8888

CMD ["node", "app.ts"];