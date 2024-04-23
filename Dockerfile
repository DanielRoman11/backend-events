# Define el stage base
FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Habilita Corepack
RUN corepack enable

# Copia el código fuente de la aplicación
COPY . /app
WORKDIR /app

# Define el stage para las dependencias de producción
FROM base AS prod-deps
# Usa la caché de pnpm
RUN --mount=type=cache,id=s/pnpm-cache,target=/pnpm/store pnpm install --prod --frozen-lockfile

# Define el stage para la construcción
FROM base AS build
# Usa la caché de pnpm
RUN --mount=type=cache,id=s/pnpm-cache,target=/pnpm/store pnpm install --frozen-lockfile
# Ejecuta el comando de construcción
RUN pnpm run build

# Define el stage final
FROM base AS final
# Copia las dependencias de producción
COPY --from=prod-deps /app/node_modules /app/node_modules
# Copia el código construido
COPY --from=build /app/dist /app/dist

# Configura el puerto
ARG PORT=3000
ENV PORT=${PORT}
ENV NODE_ENV=production
EXPOSE ${PORT}

# Define el comando de inicio
CMD ["pnpm", "start:prod"]