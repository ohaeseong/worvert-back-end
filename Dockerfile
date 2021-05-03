FROM node:14.15.1

RUN mkdir -p /tech-diary-back-end-version2.

WORKDIR /tech-diary-back-end-version2.

COPY package*.json ./
COPY tsconfig.json ./
COPY ormconfig.json ./

RUN yarn

ADD . /tech-diary-back-end-version2.
ADD /etc/letsencrypt/live/work-it.co.kr/privkey.pem .
ADD /etc/letsencrypt/live/work-it.co.kr/fullchain.pem .
ADD /etc/letsencrypt/live/work-it.co.kr/cert.pem .

EXPOSE 8888

CMD ["yarn", "start"];