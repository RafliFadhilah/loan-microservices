FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm install kafkajs @nestjs/platform-express
RUN npm install -D typescript ts-node @types/node

CMD ["npx", "ts-node", "--transpile-only", "src/main.ts"]