FROM node:slim
ENV NODE_ENV development
WORKDIR /meetbackend
COPY . .
RUN npm install
CMD [ "node", "server.js" ]
EXPOSE 5001