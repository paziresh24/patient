FROM node:18.15.0-alpine
RUN apk add --no-cache libc6-compat
WORKDIR /app
ENV DOCKER_BUILDKIT 1
ENV NEXT_TELEMETRY_DISABLED 1
ENV NEW_RELIC_NO_CONFIG_FILE=true
ENV NEW_RELIC_DISTRIBUTED_TRACING_ENABLED=true
ENV NEW_RELIC_LOG=stdout

COPY package.json package-lock.json ./ 
RUN rm -rf package-lock.json 
#RUN yarn cache clean
#RUN yarn --network-timeout 10000000
#RUN yarn
RUN npm config set fetch-retry-mintimeout 100000 && npm config set fetch-retry-maxtimeout 600000 
RUN npm install --force && npm cache clean --force

COPY . .


#RUN yarn build && \
#    yarn cache clean
RUN npm run build && npm cache clean --force

EXPOSE 3000

ENV PORT 3000

#CMD ["yarn", "start"]
CMD ["npm", "start"]
