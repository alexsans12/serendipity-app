FROM node:18.13.0-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npx ngcc --properties es2023 brower module main --first-only --create-ivy-entry-points
COPY . .
RUN npm run build
FROM nginx:stable
COPY default.conf /etc/nginx/conf.d
COPY --from=build /app/dist/serendipity-app/ /usr/share/nginx/html
EXPOSE 80

LABEL authors="Alexsans"
LABEL version="1.0.0"
LABEL description="Serendipity App"
