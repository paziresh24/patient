FROM node:18.19.1 as deps

WORKDIR /app

ENV DOCKER_BUILDKIT=1
ENV NEXT_TELEMETRY_DISABLED=1

# Copy package manifests first to leverage Docker layer caching
COPY package.json package-lock.json .npmrc ./

# Install dependencies defined in the lockfile
RUN npm ci

# Copy the rest of the source code
COPY . .

# Build the production bundle
RUN npm run build

# Remove development-only packages to slim down the runtime image
RUN npm prune --omit=dev && npm cache clean --force

EXPOSE 3000
ENV NODE_ENV=production
ENV PORT=3000

CMD ["npm", "start"]
