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

# Expose the backend port (assuming your backend runs on port 5000)
EXPOSE 5000

# Start the backend server
CMD ["npm", "start"]
