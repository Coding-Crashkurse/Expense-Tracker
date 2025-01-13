# 1) Build-Stage
FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 2) Nginx-Stage
FROM nginx:alpine
# Kopiere unsere custom config in /etc/nginx/conf.d/default.conf
COPY default.conf /etc/nginx/conf.d/default.conf

# Copy build output
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
