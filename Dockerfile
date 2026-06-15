FROM node:20-bookworm AS client-build

WORKDIR /app/client
COPY client/package*.json ./
RUN npm install --legacy-peer-deps
COPY client/ ./
RUN npm run build

FROM node:20-bookworm

WORKDIR /app
ENV NODE_ENV=production

COPY server/package*.json ./server/
RUN npm install --omit=dev --legacy-peer-deps --prefix server

COPY server/ ./server/
COPY --from=client-build /app/frontend ./frontend

EXPOSE 5000
CMD ["node", "server/server.js"]
