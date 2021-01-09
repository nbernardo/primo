FROM node:alpine

WORKDIR /app
COPY . .
RUN npm install
CMD npm start
ENV PORT 4000
ENV ENVIRONMENT "dev"
EXPOSE 4000