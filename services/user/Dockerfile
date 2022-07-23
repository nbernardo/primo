FROM node:alpine

WORKDIR /app
ENV PORT 4001
ENV ENVIRONMENT "dev"
COPY . .
RUN npm install
CMD npm start
EXPOSE 4001