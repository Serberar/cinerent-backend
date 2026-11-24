FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
RUN apk add --no-cache openssl

COPY package*.json ./
RUN npm ci --omit=dev
COPY prisma ./prisma
RUN npx prisma generate
COPY src ./src

USER node
EXPOSE 4000
HEALTHCHECK --interval=15s --timeout=3s --start-period=20s \
  CMD wget -qO- "http://127.0.0.1:${PORT:-4000}/health" || exit 1
CMD ["sh", "-c", "npx prisma migrate deploy && exec node src/main.js"]
