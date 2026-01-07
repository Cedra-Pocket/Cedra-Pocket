FROM node:18-slim

# Install OpenSSL
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install all dependencies (including dev for build)
RUN npm ci

# Generate Prisma client
RUN npx prisma generate

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Remove dev dependencies
RUN npm prune --production

# Expose port
EXPOSE 10000

# Set environment
ENV NODE_ENV=production
ENV PORT=10000

# Start the application
CMD ["node", "dist/src/main.js"]
