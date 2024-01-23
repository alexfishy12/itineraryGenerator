# Specify a base image
FROM node:14

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available) to the container
COPY package*.json ./

# Install dependencies in the container
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Define the command to run the app
CMD ["npm", "start"]
