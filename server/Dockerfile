FROM node:12-alpine as server
COPY . /server
WORKDIR /server
RUN npm ci
CMD ["npm", "start"]