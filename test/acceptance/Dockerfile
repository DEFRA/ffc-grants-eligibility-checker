FROM defradigital/node-development:2.3.0-node22.4.0

USER node
RUN mkdir ./json-reports
COPY ./features /home/node/features
COPY ./services /home/node/services
COPY ./steps /home/node/steps
COPY package.json ./
COPY wdio.conf.js ./
RUN npm install --ignore-scripts

CMD [ "npm", "run", "test" ]
