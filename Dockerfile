FROM node:20-alpine
WORKDIR /app

COPY .medusa/server/package*.json ./
RUN npm ci --omit=dev

COPY .medusa/server/ .

EXPOSE 9000
CMD ["npm", "run", "start"]
