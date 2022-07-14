FROM dockerhub.paziresh24.com/node:14.18.2-alpine 
RUN apk add --no-cache libc6-compat
WORKDIR /app
ENV DOCKER_BUILDKIT 1

COPY package.json package-lock.json ./ 
RUN yarn

COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN yarn build

ENV NODE_ENV production

EXPOSE 3000

ENV PORT 3000

CMD ["yarn", "start"]