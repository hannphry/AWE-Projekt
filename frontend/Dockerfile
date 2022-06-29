### STAGE 1: Build ###
FROM --platform=linux/amd64 node:12.20-alpine AS build
#FROM --platform=linux/amd64 node:latest as builder
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install --unsafe-perm
COPY . .
RUN npm run build

### STAGE 2: Run ###
FROM nginx:1.17.1-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/dist/frontend /usr/share/nginx/html

#docker buildx build --platform linux/amd64 -t ihk-awe-frontend .
#docker tag ihk-awe-frontend registry.heroku.com/ihk-awe-frontend/web
#docker push registry.heroku.com/ihk-awe-frontend/web
#heroku container:release web -a ihk-awe-frontend