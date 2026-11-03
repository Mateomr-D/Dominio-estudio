FROM node:20-alpine

WORKDIR /app

# Instalar dependencias requeridas para compilación ligera si es necesario
RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

EXPOSE 4000

ENV PORT=4000
ENV NODE_ENV=production

CMD ["node", "src/server.js"]
