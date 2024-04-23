FROM node:20-slim AS base
COPY . /app
WORKDIR /app

# Instalar PNPM solo si no está instalado previamente
RUN if ! command -v pnpm &> /dev/null; then npm i -g pnpm; fi

# Configurar el directorio de almacenamiento de PNPM
RUN pnpm config set store-dir ~/.pnpm-store


FROM base AS prod-deps
RUN --mount=type=cache,id=s/c3c868f7-49e7-49da-9efb-f2c04a4a58d5-/.pnpm-store,target=/.pnpm-store pnpm install --prod --frozen-lockfile

FROM base AS build
RUN --mount=type=cache,id=s/c3c868f7-49e7-49da-9efb-f2c04a4a58d5-/.pnpm-store,target=/.pnpm-store pnpm install --frozen-lockfile
RUN pnpm run build

FROM base
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist

ARG PORT=3000
ENV PORT=${PORT}
ENV NODE_ENV=production

EXPOSE ${PORT}
CMD [ "pnpm", "start" ]
