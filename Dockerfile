FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# We use the command from package.json for hot-reloading
CMD ["npm", "run", "dev"]