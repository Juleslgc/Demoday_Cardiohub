# Base image
FROM node:20

# Working folder in container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project
COPY . .

# Expose the port the app is running on
EXPOSE 3000

# Start the server
CMD ["npm", "run", "dev"]
