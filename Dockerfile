FROM node:20-alpine
WORKDIR /app

# Copy pre-built server with pre-installed node_modules
COPY .medusa/server/ .

EXPOSE 9000
CMD ["npm", "run", "start"]
