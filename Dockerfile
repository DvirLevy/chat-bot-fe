# ─── Build stage ────────────────────────────────────────────────────────────
FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

# Vite inlines VITE_* vars at build time, so they must be passed as build args.
ARG VITE_BACKEND_WS_URL=ws://localhost:8000/ws
ARG VITE_BACKEND_HTTP_URL=http://localhost:8000
ENV VITE_BACKEND_WS_URL=$VITE_BACKEND_WS_URL
ENV VITE_BACKEND_HTTP_URL=$VITE_BACKEND_HTTP_URL

RUN npm run build

# ─── Serve stage ────────────────────────────────────────────────────────────
FROM nginx:1.27-alpine AS serve

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
