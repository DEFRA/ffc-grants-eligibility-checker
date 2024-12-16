ARG PARENT_VERSION=2.3.0-node22.4.0
ARG PORT_DEBUG=9229

FROM defradigital/node-development:${PARENT_VERSION}
USER node
ARG PARENT_VERSION
LABEL uk.gov.defra.ffc.parent-image=defradigital/node-development:${PARENT_VERSION}
ARG PORT_DEBUG
EXPOSE ${PORT_DEBUG}
COPY package.json ./
RUN npm install --ignore-scripts
COPY wdio.conf.js ./
COPY ./features /home/node/features
COPY ./services /home/node/services
COPY ./steps /home/node/steps
CMD [ "npm", "run", "test" ]
