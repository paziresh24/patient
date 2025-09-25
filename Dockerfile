FROM node:18.19.1

WORKDIR /app

ENV DOCKER_BUILDKIT=1
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Copy package files
COPY package.json .npmrc ./

# Install dependencies with clean slate
RUN npm config set fetch-retry-mintimeout 100000 && \
    npm config set fetch-retry-maxtimeout 600000 && \
    npm cache clean --force && \
    rm -rf node_modules && \
    npm install --force && \
    npm install --save-dev typescript@latest @types/react @types/node @types/minimatch eslint

# Generate fresh package-lock.json
RUN npm install --package-lock-only && \
    npm audit fix --force || true

# Copy source files
COPY . .

# Build the application
RUN npm run build

EXPOSE 3000
ENV PORT=3000

CMD ["npm", "start"]