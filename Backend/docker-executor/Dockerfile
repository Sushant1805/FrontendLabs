# Docker container for safe code execution
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Install dependencies for code execution
RUN npm init -y
RUN npm install --save-dev jest

# Install Jest globally for easier access
RUN npm install -g jest

# Create Jest configuration
RUN echo '{"testEnvironment": "node", "testMatch": ["**/*.test.js"]}' > jest.config.json

# Create execution directory with proper permissions
RUN mkdir -p /tmp/execution
RUN chmod 777 /tmp/execution

# Copy execution script
COPY executor.js .

# Set security limits
RUN addgroup -g 1001 -S nodejs
RUN adduser -S executor -u 1001

# Give executor user access to temp directory and make it writable
RUN chown -R executor:nodejs /tmp/execution
RUN chmod -R 755 /tmp/execution

USER executor

# Set resource limits
ENV NODE_OPTIONS="--max-old-space-size=128"

# Default command
CMD ["node", "executor.js"]
