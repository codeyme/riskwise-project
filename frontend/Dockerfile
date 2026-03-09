# ---- Build stage ----
FROM node:20-alpine AS build
WORKDIR /app

# install dependencies first for caching
COPY package*.json ./
RUN npm ci

# copy the rest of the app
COPY . .

# build static assets
RUN npm run build

# ---- Run stage (Nginx) ----
FROM nginx:alpine

# Copy build output to Nginx default public folder
COPY --from=build /app/dist /usr/share/nginx/html

# Vite SPA routing: serve index.html for unknown routes
RUN printf 'server {\n\
  listen 80;\n\
  server_name _;\n\
  root /usr/share/nginx/html;\n\
  index index.html;\n\
  location / {\n\
    try_files $uri $uri/ /index.html;\n\
  }\n\
}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]