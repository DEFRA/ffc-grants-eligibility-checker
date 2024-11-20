FROM defradigital/node-development:2.3.0-node22.4.0

RUN npm install -g @axe-core/cli
RUN npm install -g browser-driver-manager
RUN npx browser-driver-manager install chrome

CMD [ "axe", "http://www.deque.com" ]
