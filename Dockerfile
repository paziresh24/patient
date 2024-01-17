FROM node:18.17.0

WORKDIR /app

ENV DOCKER_BUILDKIT 1
ENV NEXT_TELEMETRY_DISABLED 1
ENV NEW_RELIC_NO_CONFIG_FILE=true
ENV NEW_RELIC_DISTRIBUTED_TRACING_ENABLED=true
ENV NEW_RELIC_LOG=stdout
ENV NODE_ENV=production

COPY package.json package-lock.json .npmrc ./ 
RUN npm config set fetch-retry-mintimeout 100000 && npm config set fetch-retry-maxtimeout 600000 
RUN  npm cache verify
RUN npm install --force

COPY . .

RUN npm run build

EXPOSE 3000

ENV PORT 3000

CMD ["npm", "start"]
