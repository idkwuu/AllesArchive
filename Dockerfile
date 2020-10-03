FROM node:latest
WORKDIR /app
COPY . .
RUN yarn
CMD node index.js