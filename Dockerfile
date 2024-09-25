FROM defradigital/node-development:2.3.0-node22.4.0 as dev

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --only=development
COPY . .
RUN npm run build
EXPOSE 3000

CMD ["npm", "start"]
