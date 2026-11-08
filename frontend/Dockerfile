FROM node:22-alpine AS build
WORKDIR /app

# Copy only package.json (not the lock file made on Windows).
# Then Linux installs its own correct files for Vite and Tailwind.
COPY package.json ./
RUN npm install

COPY . .

# Website settings are baked in when the site is built
ARG VITE_API_URL
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
RUN npm run build

FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
