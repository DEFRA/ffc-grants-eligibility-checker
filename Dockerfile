ARG PARENT_VERSION=2.4.0-node22.9.0
ARG PORT=3000
ARG PORT_DEBUG=9229

# Development
FROM defradigital/node-development:${PARENT_VERSION} AS development
USER node
ARG PARENT_VERSION
LABEL uk.gov.defra.ffc.parent-image=defradigital/node-development:${PARENT_VERSION}

ARG PORT
ARG PORT_DEBUG
ENV PORT ${PORT}
EXPOSE ${PORT} ${PORT_DEBUG}

COPY package*.json /home/node
RUN NODE_ENV=development npm --ignore-scripts ci
COPY ./src /home/node/src
COPY .eslintrc /home/node/.eslintrc
COPY .babelrc /home/node/.babelrc
COPY jest.config.js /home/node/jest.config.js
COPY jest.setup.js /home/node/jest.setup.js

RUN npm run build
COPY ./public /home/node/public
CMD [ "node", "src/index.js" ]


# Production
FROM defradigital/node:${PARENT_VERSION} AS production
USER node
ARG PARENT_VERSION
LABEL uk.gov.defra.ffc.parent-image=defradigital/node:${PARENT_VERSION}

ARG PORT
ENV PORT ${PORT}
EXPOSE ${PORT}

COPY --from=development /home/node/src/ ./src/
COPY --from=development /home/node/public ./public/
COPY --from=development /home/node/package*.json ./

RUN npm ci --ignore-scripts --production


CMD [ "node", "src/index.js" ]