# ================================================
# Stage 1: Build the React Application
# ================================================
FROM node:20-alpine AS build

WORKDIR /app

# Copy package configurations
COPY package*.json ./

# Install packages with legacy-peer-deps to prevent peer mismatches with React 19
RUN npm ci --legacy-peer-deps

# Copy codebase
COPY . .

# Compile React SPA
RUN npm run build

# ================================================
# Stage 2: Serve using Nginx
# ================================================
FROM nginx:alpine

# Copy compiled assets from build stage to nginx html folder
COPY --from=build /app/dist /usr/share/nginx/html

# Overwrite default Nginx server setup with custom routing config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
