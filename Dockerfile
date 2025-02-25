# Use Node.js base image
FROM node:20-alpine

# Set working directory
WORKDIR /usr/local/app

# Copy package.json and install dependencies
COPY package*.json ./
RUN yarn install

# Copy the rest of the project files
COPY . .

# Expose port 3001
EXPOSE 3001

# Start the NestJS application
CMD ["yarn", "start"]