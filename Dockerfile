FROM node:22.13.0

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Clean npm cache (optional but similar intent)
RUN npm cache clean --force

# Install dependencies
RUN npm install

# Copy source files
COPY . .

# Build the application
RUN npm run build

# Run the app
CMD [ "npm", "run", "start" ]