FROM node:18

WORKDIR /app

# Copy seluruh monorepo
COPY . .

# Install deps di root dulu (agar libs/kafka bisa resolve 'kafkajs')
RUN npm install

# Pindah ke folder service audit
WORKDIR /app/services/audit

# Install deps service audit
RUN npm install
RUN npm install -D @types/express @types/node typescript

RUN npm run build
RUN find /app/services/audit -name main.js

CMD ["node", "dist/services/audit/src/main.js"]