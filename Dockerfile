# Use the official Bun image as the base
FROM oven/bun:latest

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Copy the rest of the application code
COPY . .

# Install dependencies
RUN bun install

# Build the application
RUN bun run build:frontend

# Expose the port the app runs on
EXPOSE 5180

# Start the application
CMD ["bun", "run", "start:backend"]
