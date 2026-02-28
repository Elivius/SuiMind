# Use Node 20 slim image
FROM node:20-slim

# Set working directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the code as reference
COPY . .

# Expose Next.js default port
EXPOSE 3000

# Next.js dev server listening on all interfaces
ENV HOSTNAME="0.0.0.0"

# Main command for development
CMD ["pnpm", "dev"]
