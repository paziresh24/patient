FROM node:18.17.0

WORKDIR /app

ENV DOCKER_BUILDKIT=1
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEW_RELIC_NO_CONFIG_FILE=true
ENV NEW_RELIC_DISTRIBUTED_TRACING_ENABLED=true
ENV NEW_RELIC_LOG=stdout
ENV NODE_ENV=production

COPY package.json package-lock.json .npmrc ./

# package-lock pins resolved URLs to npm.devneeds.ir (Nexus). That host is
# rate-limiting / intermittently unreachable from CI, which broke main builds
# even after `npm config set registry`. Rewrite hosts, then install prod-only.
RUN set -eux; \
  sed -i \
    -e 's#https://npm.devneeds.ir/repository/npm/#https://registry.npmjs.org/#g' \
    -e 's#https://npm.devneeds.ir/#https://registry.npmjs.org/#g' \
    package-lock.json; \
  npm config set fetch-retries 5; \
  npm config set fetch-retry-mintimeout 20000; \
  npm config set fetch-retry-maxtimeout 120000; \
  npm config set fetch-retry-factor 2; \
  npm config set registry https://registry.npmjs.org/; \
  npm ci --omit=dev --no-audit --no-fund

COPY . .

RUN npm run build

EXPOSE 3000

ENV PORT=3000

CMD ["node", "-r", "./log-bootstrap.cjs", "node_modules/next/dist/bin/next", "start"]
