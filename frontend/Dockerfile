# Base image
FROM node:20

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project
COPY . .

# Expose Expo ports
# 19000: Metro JS server
# 19001: Web interface
# 19002: Tunnel
EXPOSE 19000 19001 19002

# Start the Expo server
CMD ["npm", "start", "--tunnel"]
