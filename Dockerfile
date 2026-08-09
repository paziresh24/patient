FROM node:18.17.0

WORKDIR /app

ENV DOCKER_BUILDKIT=1
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEW_RELIC_NO_CONFIG_FILE=true
ENV NEW_RELIC_DISTRIBUTED_TRACING_ENABLED=true
ENV NEW_RELIC_LOG=stdout
ENV NODE_ENV=production

COPY package.json package-lock.json .npmrc ./
RUN npm config set fetch-retries 5 \
 && npm config set fetch-retry-mintimeout 20000 \
 && npm config set fetch-retry-maxtimeout 120000 \
 && npm config set fetch-retry-factor 2 \
 && npm cache verify \
 && ( npm config set registry https://registry.npmjs.org/ \
      && npm install --force ) \
 || ( echo "npmjs.org install failed — falling back to npm.devneeds.ir" \
      && npm config set registry https://npm.devneeds.ir/ \
      && npm install --force )

COPY . .

RUN npm run build

EXPOSE 3000

ENV PORT=3000

CMD ["node", "-r", "./log-bootstrap.cjs", "node_modules/next/dist/bin/next", "start"]
