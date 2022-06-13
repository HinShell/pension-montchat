FROM node AS builder

# create dir
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app

# build dependencies
RUN apt-get update && apt-get install -y libglu1
COPY src /home/node/app/src
COPY ./package*.json ./
COPY gulpfile.js ./
RUN chown -R node:node /home/node/app
USER node
RUN npm install
RUN ./node_modules/gulp/bin/gulp.js build

# copy in source code
#COPY --chown=node:node ./ ./

FROM docker.io/library/nginx:stable-alpine
COPY --from=builder /home/node/app/dist /usr/share/nginx/html