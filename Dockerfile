FROM node:10
WORKDIR /app
COPY . .
RUN yarn
CMD node index.js