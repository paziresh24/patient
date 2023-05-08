#FROM docker.paziresh24.info/node:14.18.2-alpine
FROM docker.paziresh24.info/node:18.15.0-alpine3.17
RUN apk add --no-cache libc6-compat
WORKDIR /app
ENV DOCKER_BUILDKIT 1
ENV NEXT_TELEMETRY_DISABLED 1

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
