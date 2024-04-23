FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app

FROM base AS prod-deps
RUN --mount=type=cache,id=s/b1ff8c12-724c-4aee-84f8-9f9dc8662531-/pnpm/store,target=/pnpm/store

FROM base AS build
RUN --mount=type=cache,id=s/b1ff8c12-724c-4aee-84f8-9f9dc8662531-/pnpm/store,target=/pnpm/store
RUN pnpm run build

FROM base
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist

ARG PORT=3000
ENV PORT=${PORT}
ENV NODE_ENV=production

EXPOSE ${PORT}
CMD [ "pnpm", "start" ]