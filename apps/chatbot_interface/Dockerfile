# ---------- Stage 1: Build Vite app ----------
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of project
COPY . .

ARG VITE_BACKEND_URL
ENV VITE_BACKEND_URL=${VITE_BACKEND_URL}

ARG VITE_MY_CAREER_URL
ENV VITE_MY_CAREER_URL=${VITE_MY_CAREER_URL}

ARG VITE_WAIKATO_UNIVERSITY_URL
ENV VITE_WAIKATO_UNIVERSITY_URL=${VITE_WAIKATO_UNIVERSITY_URL}

# Build production files
RUN npm run build

# ---------- Stage 2: Serve with Nginx ----------
FROM nginx:alpine

# Remove nginx default configuration
RUN rm /etc/nginx/nginx.conf

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built files from previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]