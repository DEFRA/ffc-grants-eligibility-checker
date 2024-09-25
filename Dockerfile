ARG PARENT_VERSION=2.3.0-node22.4.0
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

COPY package*.json ./
RUN npm --ingore-scripts ci
COPY ./src /home/node/src

RUN npm run build
CMD [ "npm", "run", "start:watch" ]


# Production
FROM defradigital/node:${PARENT_VERSION} AS production
USER node
ARG PARENT_VERSION
LABEL uk.gov.defra.ffc.parent-image=defradigital/node:${PARENT_VERSION}

ARG PORT
ENV PORT ${PORT}
EXPOSE ${PORT}

COPY --from=development /home/node/src/ ./src/
COPY --from=development /home/node/package*.json ./

RUN npm ci --ignore-scripts --production


CMD [ "node", "src/index.js" ]











