FROM node:23-slim AS deps
WORKDIR /app

COPY package.json package-lock*.json ./
COPY fandomize/package*.json ./fandomize/
RUN npm ci --workspaces --include-workspace-root

FROM node:23-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/fandomize/node_modules ./fandomize/node_modules

COPY fandomize ./fandomize
RUN cd fandomize && npm run build

FROM node:23-slim AS runner
WORKDIR /app/fandomize

ENV NODE_ENV=production
ENV PORT=3000
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /app/fandomize/next.config.ts ./
COPY --from=builder /app/fandomize/.next  ./.next
COPY --from=builder /app/fandomize/public ./public
COPY --from=builder /app/fandomize/package*.json ./

RUN chown -R node:node .next \
 && npm ci --omit=dev --ignore-scripts --prefer-offline

USER node
EXPOSE 3000
CMD ["npm", "start"]