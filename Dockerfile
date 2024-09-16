FROM defradigital/node-development:22.4.0-alpine3.19 as dev

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --only=development
COPY . .

RUN npm run build:dev
EXPOSE 3000

CMD ["npm", "start"]
