# Use Node.js base image
FROM node:22-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package*.json ./

# Copy the rest of the project files
COPY . .

RUN yarn install

# Expose port 3001
EXPOSE 3001

# Start the NestJS application
CMD ["yarn", "start:dev"]
