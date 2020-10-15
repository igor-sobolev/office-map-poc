FROM node:12-alpine as server
COPY . /client
WORKDIR /client
RUN npm ci
CMD ["npm", "start"]