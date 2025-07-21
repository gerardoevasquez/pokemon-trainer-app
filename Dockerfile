# Etapa 1: Build de Angular
FROM node:20-alpine AS builder

WORKDIR /app

# Copiamos solo los archivos de dependencias
COPY package*.json ./

# 🔧 Instalamos TODAS las dependencias, incluyendo devDependencies
RUN npm install

# 🔧 Instalamos Angular CLI globalmente (necesario para `ng build`)
RUN npm install -g @angular/cli

# Copiamos el resto del código fuente
COPY . .

# 🔧 Compilamos la app Angular en modo producción
RUN npx ng build --configuration production

# Etapa 2: Imagen liviana con Nginx para servir la app
FROM nginx:alpine

# Copiamos el resultado del build al directorio de Nginx
COPY --from=builder /app/dist/Gerardo_Vasquez_Prueba_tecnica/browser /usr/share/nginx/html

# Copiamos nuestra configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Eliminamos la configuración por defecto de Nginx
RUN rm -f /etc/nginx/conf.d/default.conf

# Exponemos el puerto 80
EXPOSE 80

# Comando por defecto
CMD ["nginx", "-g", "daemon off;"]
