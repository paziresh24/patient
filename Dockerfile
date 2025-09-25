FROM node:18.19.1 as deps

WORKDIR /app

# Copy all files
COPY . .

# Install dependencies with clean slate
RUN npm install --force

FROM node:18.19.1 as builder

WORKDIR /app

# Copy from deps stage
COPY --from=deps /app .

# Build the application
RUN npm run build

FROM node:18.19.1 as runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy necessary files from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["npm", "start"]
