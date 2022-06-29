
FROM --platform=linux/amd64 node:latest as builder


ENV NODE_ENV build

RUN mkdir -p /home/node/app && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY --chown=node:node . /home/node/app/

#hier liegt der Fehler

#USER root

#RUN npm i -g npm@8.5.2

RUN npm ci \
    && npm run build \
    && npm prune --production

# ---


FROM --platform=linux/amd64 node:latest

ENV NODE_ENV production

WORKDIR /home/node/app

COPY --from=builder --chown=node:node /home/node/app/package*.json /home/node/app
COPY --from=builder --chown=node:node /home/node/app/node_modules/ /home/node/app/node_modules/
COPY --from=builder --chown=node:node /home/node/app/dist/ /home/node/app/dist/

USER node

CMD ["node", "dist/main.js"]