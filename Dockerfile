FROM node:20-alpine AS dev
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /usr/src/app
COPY . .

RUN --mount=type=cache,id=s/c3c868f7-49e7-49da-9efb-f2c04a4a58d5-/pnpm/store,target=/pnpm/store pnpm install --frozen-lockfile

EXPOSE ${PORT}

CMD ["pnpm", "start"]