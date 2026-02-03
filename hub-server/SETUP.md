# 🚀 Guía de Instalación y Configuración

## 📦 Instalación Rápida

### 1. **Instalar Dependencias**

```bash
cd hub-server
npm install
```

### 2. **Iniciar el Servidor**

```bash
# Desarrollo (con auto-reload)
npm run dev

# Producción
npm start
```

El servidor estará disponible en: `http://localhost:5001`

---

## 🔗 Integración con AnythingLLM

### Opción 1: Proxy en el Servidor Principal (Recomendado)

Editar `server/index.js` en AnythingLLM:

```javascript
// Agregar al inicio
const { createProxyMiddleware } = require('http-proxy-middleware');

// Agregar antes de app.listen()
app.use('/community-hub', createProxyMiddleware({
    target: 'http://localhost:5001',
    changeOrigin: true,
    pathRewrite: {
        '^/community-hub': ''
    },
    onError: (err, req, res) => {
        res.status(503).json({ 
            error: 'Community Hub no disponible',
            message: 'Asegúrate de que el servidor del hub esté ejecutándose en el puerto 5001'
        });
    }
}));
```

Instalar dependencia:
```bash
cd server
npm install http-proxy-middleware
```

Ahora puedes acceder a:
- `http://localhost:3001/community-hub/` → Página principal
- `http://localhost:3001/community-hub/admin` → Panel de admin

### Opción 2: Nginx (Producción)

```nginx
server {
    listen 80;
    server_name tu-dominio.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /community-hub/ {
        proxy_pass http://localhost:5001/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Opción 3: Acceso Directo (Desarrollo)

Si prefieres no usar proxy, accede directamente:
- `http://localhost:5001` - Página principal
- `http://localhost:5001/admin` - Panel de administración

---

## ⚙️ Configuración

### Variables de Entorno

Crear archivo `.env` en `hub-server/`:

```env
# Puerto del servidor
PORT=5001

# Base de datos
DB_PATH=./hub.db

# CORS - Orígenes permitidos (separados por coma)
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# Entorno
NODE_ENV=development

# Clave para importación (cambiar en producción)
IMPORT_KEY=codingsoft-hub-2025
```

### Configuración del Tema

El tema se sincroniza automáticamente con localStorage. Para forzar un tema:

```javascript
// En consola del navegador
localStorage.setItem('theme', 'light'); // o 'dark'
location.reload();
```

---

## 🗄️ Base de Datos

### Estructura

La base de datos SQLite (`hub.db`) se crea automáticamente con las siguientes tablas:

- **items**: Prompts, comandos, skills y flows
- **ratings**: Votos de usuarios
- **categories**: Categorías disponibles

### Backup

```bash
# Backup manual
cp hub.db hub.db.backup.$(date +%Y%m%d)

# Restaurar
cp hub.db.backup.20250115 hub.db
```

### Migraciones

Para agregar nuevas columnas:

```bash
sqlite3 hub.db "ALTER TABLE items ADD COLUMN new_column TEXT;"
```

---

## 🔌 API Endpoints

### Items

```http
GET    /v1/explore                    # Listar todos los items
GET    /v1/explore?category=General   # Filtrar por categoría
GET    /v1/categories                 # Listar categorías

GET    /v1/:itemType/:id/pull         # Obtener un item específico
POST   /v1/:itemType/create           # Crear item
POST   /v1/:itemType/:id/update       # Actualizar item
DELETE /v1/:itemType/:id              # Eliminar item
```

### Ratings

```http
POST   /v1/:itemType/:id/vote         # Votar (+1, -1, 0)
GET    /v1/:itemType/:id/vote         # Obtener voto del usuario
```

### Tipos de Item

- `system-prompt`
- `slash-command`
- `agent-skill`
- `agent-flow`

### Ejemplo de Uso

```bash
# Crear un system prompt
curl -X POST http://localhost:5001/v1/system-prompt/create \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Asistente Creativo",
    "description": "Ayuda con escritura creativa",
    "prompt": "Eres un asistente de escritura creativa...",
    "tags": ["writing", "creative"],
    "visibility": "public"
  }'
```

---

## 🎨 Personalización

### Cambiar Colores del Tema

Editar variables CSS en `public/index.html` y `public/admin.html`:

```css
:root {
  --accent-primary: #tu-color;
  --accent-secondary: #tu-color-claro;
}
```

### Agregar Nuevas Categorías

Editar `index.js`, array `CATEGORIES`:

```javascript
const CATEGORIES = [
    "Productivity",
    "Development",
    "Creative Writing",
    "Data Analysis",
    "Business",
    "Education",
    "Language",
    "General",
    "TU_NUEVA_CATEGORIA"  // Agregar aquí
];
```

### Modificar Items Iniciales

Editar `INITIAL_ITEMS` en `index.js`:

```javascript
const INITIAL_ITEMS = {
    "system-prompt": [
        {
            id: "mi-prompt",
            name: "Mi Prompt",
            description: "Descripción",
            prompt: "Contenido del prompt...",
            tags: JSON.stringify(["tag1", "tag2"]),
            category: "General"
        }
    ]
};
```

---

## 🐛 Solución de Problemas

### Error: "Error loading items"

**Causa**: El servidor no está ejecutándose

**Solución**:
```bash
cd hub-server
npm start
```

### Error: CORS

**Causa**: Origen no permitido

**Solución**:
- Verificar `ALLOWED_ORIGINS` en `.env`
- Agregar el origen de tu frontend

### Error: "Cannot find module"

**Causa**: Dependencias no instaladas

**Solución**:
```bash
npm install
```

### Puerto 5001 en uso

**Solución**:
```bash
# Cambiar el puerto
PORT=5002 npm start
```

O en `.env`:
```env
PORT=5002
```

---

## 📊 Monitoreo

### Logs

```bash
# Ver logs en tiempo real
npm start 2>&1 | tee hub.log

# Filtrar errores
grep "ERROR" hub.log
```

### Health Check

```bash
curl http://localhost:5001/v1/explore
```

Debería retornar JSON con items.

---

## 🔒 Seguridad en Producción

### 1. Cambiar Clave de Importación

```env
IMPORT_KEY=tu-clave-segura-aqui
```

### 2. HTTPS

Usar certificados SSL en Nginx o configurar el servidor Express:

```javascript
const https = require('https');
const fs = require('fs');

const options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
};

https.createServer(options, app).listen(PORT);
```

### 3. Rate Limiting

Instalar y configurar:

```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100 // máximo 100 requests por IP
});

app.use('/v1/', limiter);
```

---

## 🚀 Deployment

### Docker

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5001

CMD ["npm", "start"]
```

```bash
# Build
docker build -t community-hub .

# Run
docker run -p 5001:5001 -v $(pwd)/data:/app/data community-hub
```

### PM2 (Producción)

```bash
npm install -g pm2

# Crear configuración
cat > ecosystem.config.js << 'EOF'
module.exports = {
    apps: [{
        name: 'community-hub',
        script: './index.js',
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: '1G',
        env: {
            NODE_ENV: 'production',
            PORT: 5001
        }
    }]
};
EOF

# Iniciar
pm2 start ecosystem.config.js

# Guardar configuración
pm2 save
pm2 startup
```

---

## 📝 Changelog

### v1.0.0 (Actual)
- ✅ Servidor Express con SQLite
- ✅ CRUD completo de items
- ✅ UI responsive con tema oscuro/claro
- ✅ Sistema de votaciones
- ✅ URLs limpias (sin .html)
- ✅ Skeleton loading
- ✅ Animaciones y transiciones

---

## 🤝 Contribuir

1. Fork el repositorio
2. Crear rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit: `git commit -m 'Agregar nueva funcionalidad'`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Crear Pull Request

---

## 📞 Soporte

- Issues: GitHub Issues
- Documentación: Este archivo
- API Docs: `http://localhost:5001/api-docs` (si implementas Swagger)

---

## 📄 Licencia

Misma licencia que AnythingLLM
