FROM node:14.15

RUN npm i -g @nestjs/cli

RUN cd /home/ && mkdir article

WORKDIR /home/article
