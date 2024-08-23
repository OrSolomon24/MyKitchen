# Dockerfile for client

# Use a Node.js base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the remaining application files
COPY . .

# Build the React app for production
RUN npm run build

# Install a lightweight web server like serve
RUN npm install -g serve

# Expose the port
EXPOSE 3000

# Serve the built app
CMD ["serve", "-s", "build", "-l", "3000"]
