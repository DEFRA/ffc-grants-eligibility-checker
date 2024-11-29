FROM defradigital/node-development:2.3.0-node22.4.0

USER node
COPY ./features ./features
COPY ./services ./services
COPY ./steps ./steps
COPY package.json ./
COPY wdio.conf.js ./
RUN npm install --ignore-scripts

CMD [ "npm", "run", "test" ]
