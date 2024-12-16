FROM defradigital/node-development:2.3.0-node22.4.0

USER node
COPY ./specs ./specs
COPY package.json ./
COPY wdio.conf.js ./
RUN npm install --ignore-scripts

CMD [ "npm", "run", "test" ]
