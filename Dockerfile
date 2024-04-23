FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

# Copia solo el archivo de bloqueo de dependencias
COPY package.json pnpm-lock.yaml ./

# Instala dependencias de producción
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

# Copia el resto de los archivos
COPY . .

FROM base AS build

# Instala dependencias de desarrollo y construye la aplicación
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

FROM base AS final
COPY --from=build /app/dist ./dist

ARG PORT=3000
ENV PORT=${PORT}
ENV NODE_ENV=production

EXPOSE ${PORT}

CMD ["pnpm", "start:prod"]