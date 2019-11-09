FROM node:10.17.0-alpine

COPY viewer /opt/phema/phekb/viewer
COPY package.json /opt/phema/phekb/
COPY tsconfig.json /opt/phema/phekb/

WORKDIR /opt/phema/phekb

RUN yarn install
RUN yarn run build

VOLUME /opt/phema/phekb/data

CMD ["yarn", "run", "prod"]