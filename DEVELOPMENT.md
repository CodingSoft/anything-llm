# Desarrollo Local - AnythingLLM CodingSoft

## Configuración del entorno

### Requisitos previos
- Node.js >= 18.12.1 (actual: v18.20.8 ✓)
- Yarn >= 1.22 (actual: 1.22.22 ✓)

### Instalación
```bash
# Clonar repositorio
git clone https://github.com/CodingSoft/anything-llm.git
cd anything-llm

# Instalar dependencias
cd server && yarn
cd ../frontend && yarn
cd ../collector && yarn
```

### Configurar variables de entorno
```bash
# Copiar archivo de ejemplo
cp server/.env.example server/.env

# Editar con valores seguros
nano server/.env
```

#### Configuración básica (server/.env):
```env
SERVER_PORT=3001
JWT_SECRET="tu-cadena-secreta-aleatoria"
SIG_KEY='tu-frase-de-contraseña'
SIG_SALT='tu-sal-aleatoria'
NODE_ENV=development

# Configurar un LLM (opcional para desarrollo básico)
# LLM_PROVIDER='openai'
# OPEN_AI_KEY=tu-api-key-aqui
# OPEN_MODEL_PREF='gpt-3.5-turbo'

# O usar Ollama local (recomendado para desarrollo)
# LLM_PROVIDER='ollama'
# OLLAMA_BASE_PATH='http://localhost:11434'
# OLLAMA_MODEL_PREF='llama2'
```

## Ejecutar la aplicación

### Opción 1: Usar scripts de desarrollo
```bash
# En terminal 1: Servidor
cd server && yarn dev

# En terminal 2: Frontend
cd frontend && yarn dev

# En terminal 3: Collector
cd collector && yarn dev
```

### Opción 2: Usar script unificado
```bash
# Ejecutar todos los servicios
yarn dev:all
```

### Puertos por defecto:
- **Frontend:** http://localhost:3000
- **Servidor API:** http://localhost:3001
- **Collector:** http://localhost:5005

## Configuración para producción

### Variables de entorno de producción (server/.env):
```env
SERVER_PORT=3001
JWT_SECRET="cadena-secreta-fuerte-y-aleatoria"
SIG_KEY='frase-de-contraseña-fuerte-y-aleatoria'
SIG_SALT='sal-fuerte-y-aleatoria'
NODE_ENV=production

# Configurar CORS para dominio específico
# CORS_ORIGIN=https://anythingllm.codingsoft.org

# Configurar LLM para producción
LLM_PROVIDER='openai'
OPEN_AI_KEY=tu-api-key-produccion
OPEN_MODEL_PREF='gpt-4o'

# Configurar base de datos vectorial
VECTOR_DB="lancedb"  # Usa LanceDB por defecto (sin configuración adicional)
```

### Ejecutar en producción:
```bash
# Construir frontend
cd frontend && yarn build

# Iniciar servidor en producción
cd server && yarn start

# Iniciar collector en producción
cd collector && yarn start
```

## Configurar dominio personalizado

Para usar `anythingllm.codingsoft.org`:

### 1. Configurar DNS
```
anythingllm.codingsoft.org -> IP_DEL_SERVIDOR
```

### 2. Configurar proxy inverso (Nginx)
```nginx
server {
    server_name anythingllm.codingsoft.org;
    
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 3. Configurar SSL (opcional pero recomendado)
```bash
# Usar Let's Encrypt
sudo certbot --nginx -d anythingllm.codingsoft.org
```

## Solución de problemas

### Error: "Port already in use"
```bash
# Verificar procesos usando el puerto
lsof -i :3000
lsof -i :3001
lsof -i :5005

# Matar proceso
kill -9 PID
```

### Error: "Missing dependencies"
```bash
# Reinstalar dependencias
rm -rf node_modules yarn.lock
yarn
```

### Error: "Invalid API key"
- Verificar que la API key esté configurada en `server/.env`
- Verificar que el proveedor LLM esté correctamente configurado

## Comandos útiles

```bash
# Limpiar caché
yarn clean

# Ejecutar tests
yarn test

# Ejecutar lint
yarn lint

# Verificar configuración
yarn check:envs

# Actualizar base de datos
yarn prisma:setup
```

## Estructura del proyecto
```
anything-llm/
├── server/          # API backend (Node.js)
├── frontend/        # Interfaz web (React/Vite)
├── collector/       # Procesador de documentos
├── docker/          # Configuración Docker
├── locales/         # Traducciones
└── images/          # Assets e imágenes
```

## Soporte
- **Documentación:** https://docs.anythingllm.codingsoft.org
- **Issues:** https://github.com/CodingSoft/anything-llm/issues
- **Email:** contact@codingsoft.org
- **Autor:** Oscar Alardin (CodingSoft)
```

Ahora voy a mostrar cómo iniciar la aplicación

<｜DSML｜function_calls>
<｜DSML｜invoke name="bash">
<｜DSML｜parameter name="command" string="true">cd /Users/codingsoft/GitHub/anything-llm && ls package.json scripts/