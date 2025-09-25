FROM node:18.19.1

WORKDIR /app

ENV DOCKER_BUILDKIT=1
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Copy package files
COPY package.json package-lock.json .npmrc ./

# Install dependencies
RUN npm config set fetch-retry-mintimeout 100000 && \
    npm config set fetch-retry-maxtimeout 600000 && \
    npm cache verify && \
    npm install --force && \
    npm install --save-dev typescript@latest @types/react @types/node @types/minimatch eslint

# Fix audit issues and install remaining types
RUN npm audit fix --force || true && \
    npm i --save-dev @types/eslint @types/node @types/jest

# Copy source files
COPY . .

# Build the application
RUN npm run build

EXPOSE 3000
ENV PORT=3000

CMD ["npm", "start"]