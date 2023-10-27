FROM node:18-alpine
ARG NEXT_BUILD_ID
ARG DOCKER_BUILD_VERSION
ARG NPM_TOKEN

ENV NODE_ENV=development
ENV NEXT_BUILD_ID=${NEXT_BUILD_ID}
ENV DOCKER_BUILD_VERSION=$DOCKER_BUILD_VERSION

RUN apk update && apk add --no-cache coreutils

WORKDIR /usr/src/app

RUN chown -R node:node /usr/src/app

USER node

COPY --chown=node:node "components" "/usr/src/app/components"
COPY --chown=node:node "pages" "/usr/src/app/pages"
COPY --chown=node:node "public" "/usr/src/app/public"
COPY --chown=node:node "scripts" "/usr/src/app/scripts"
COPY --chown=node:node "styles" "/usr/src/app/styles"
COPY --chown=node:node "utils" "/usr/src/app/utils"
COPY --chown=node:node "metadata" "/usr/src/app/metadata"
COPY --chown=node:node ".npmrc" "jest.config.js" "locales.json" "next-env.d.ts" "next-i18next.config.js" "next.config.js" "package-lock.json" "package.json" "postcss.config.js" "tailwind.config.js" "tsconfig.json" "/usr/src/app/"
COPY --chown=node:node "entrypoint" "next-build.sh" "/usr/local/bin/"

RUN npm install --include=dev
EXPOSE 3000

ENTRYPOINT ["/usr/local/bin/entrypoint"]
