# Dockerfile for SvelteKit (Vite) app
FROM node:20-alpine AS build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production image
FROM node:20-alpine
WORKDIR /usr/src/app
COPY --from=build /usr/src/app .
ENV NODE_ENV=production
EXPOSE 5173
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]
