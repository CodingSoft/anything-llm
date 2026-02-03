FROM node:18-alpine

WORKDIR /app

# Instalar dependencias del sistema para better-sqlite3
RUN apk add --no-cache python3 make g++

# Copiar archivos
COPY package*.json ./
COPY index.js ./
COPY add-advanced-items.mjs ./
COPY public/ ./public/

# Instalar dependencias
RUN npm install --production

# Crear directorio para la base de datos
RUN mkdir -p /data

# Puerto
EXPOSE 5001

# Variable de entorno para la DB
ENV DB_PATH=/data/hub.db

# Comando de inicio
CMD ["npm", "start"]
