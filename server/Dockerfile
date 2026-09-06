FROM node:20-alpine

WORKDIR /app

RUN npm install -g npm@11.6.2

COPY package*.json ./

RUN npm ci --omit=dev --omit=optional

COPY src ./src

EXPOSE 5000

CMD ["npm", "start"]