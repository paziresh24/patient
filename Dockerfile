FROM docker.paziresh24.info/node:14.18.2-alpine
RUN apk add --no-cache libc6-compat
WORKDIR /app
ENV DOCKER_BUILDKIT 1
ENV NEXT_TELEMETRY_DISABLED 1

COPY package.json package-lock.json ./ 
RUN yarn cache clean
RUN yarn --network-timeout 10000000
RUN yarn

COPY . .

RUN yarn build && \
    yarn cache clean

EXPOSE 3000

ENV PORT 3000

CMD ["yarn", "start"]