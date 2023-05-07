#FROM docker.paziresh24.info/node:14.18.2-alpine
FROM docker.paziresh24.info/node:18.15.0-alpine3.17 as builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
ENV DOCKER_BUILDKIT 1
ENV NEXT_TELEMETRY_DISABLED 1

COPY package.json package-lock.json ./ 
RUN rm -rf package-lock.json && npm config set fetch-retry-mintimeout 100000 && npm config set fetch-retry-maxtimeout 600000 && npm install --force && npm cache clean --force

COPY . .
RUN npm run build && npm cache clean --force

#
ENV NODE_ENV=production
RUN npm install
RUN wget https://gobinaries.com/tj/node-prune --output-document - | /bin/sh && node-prune

FROM docker.paziresh24.info/node:18.15.0-alpine3.17 as runner

COPY --from=builder /app/.next /app/.next
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/package-lock.json /app/package-lock.json
COPY --from=builder /app/.env /app/.env
COPY --from=builder /app/node_modules /app/node_modules


WORKDIR /app
EXPOSE 3000

ENV PORT 3000

#CMD ["yarn", "start"]
CMD ["npm", "start"]
