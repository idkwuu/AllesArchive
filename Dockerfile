FROM node:latest
WORKDIR /app
COPY package.json ./
COPY yarn.lock ./
RUN npm i -g yarn
RUN yarn
COPY . .
RUN yarn build
CMD yarn start
