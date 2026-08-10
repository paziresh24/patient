# Rebuild without npm/apk egress: reuse node_modules from last known-good image.
# package.json / package-lock.json are unchanged vs 0d479232; only app source is rebuilt.
ARG BASE_IMAGE=gitlab-app-registry.gitlab.svc:5000/paziresh24/patient:0d479232
FROM ${BASE_IMAGE}

WORKDIR /app

ENV DOCKER_BUILDKIT=1
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEW_RELIC_NO_CONFIG_FILE=true
ENV NEW_RELIC_DISTRIBUTED_TRACING_ENABLED=true
ENV NEW_RELIC_LOG=stdout
ENV NODE_ENV=production
# Keep next build under dind service memory; default Next scales with nproc (~96) and OOMs.
ENV NODE_OPTIONS=--max-old-space-size=6144
ENV UV_THREADPOOL_SIZE=2

# node_modules stays from BASE_IMAGE (.dockerignore excludes it from context).
COPY . .

RUN NODE_OPTIONS=--max-old-space-size=6144 npm run build

EXPOSE 3000
ENV PORT=3000

CMD ["node", "-r", "./log-bootstrap.cjs", "node_modules/next/dist/bin/next", "start"]
