FROM node:10.17.0-alpine

COPY . /opt/phema/phekb
RUN rm -rf /opt/phema/phekb/data

WORKDIR /opt/phema/phekb

RUN npm install -g yarn
RUN yarn install

VOLUME /opt/phema/phekb/data

ENTRYPOINT [ "/opt/phema/phekb/entrypoint.sh" ]

CMD ["yarn", "run", "prod"]