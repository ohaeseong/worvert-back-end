FROM node:14.15.1

RUN mkdir -p /tech-diary-back-end-version2.

WORKDIR /tech-diary-back-end-version2.

COPY package*.json ./
COPY tsconfig.json ./
COPY ormconfig.json ./
COPY /etc/letsencrypt/live/work-it.co.kr/privkey.pem ./
COPY /etc/letsencrypt/live/work-it.co.kr/fullchain.pem ./
COPY /etc/letsencrypt/live/work-it.co.kr/cert.pem ./

RUN yarn

ADD . /tech-diary-back-end-version2.

EXPOSE 8888

CMD ["yarn", "start"];