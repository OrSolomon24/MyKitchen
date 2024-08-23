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

# Expose the frontend port (usually React apps run on port 3000)
EXPOSE 3000

# Start the frontend server
CMD ["npm", "start"]
