# 🚀 Configuración del Community Hub

## ✅ Estado Actual

He configurado el proxy en AnythingLLM para integrar el Community Hub. Ahora puedes acceder al hub desde:
- `http://localhost:3001/community-hub/` - Página de exploración
- `http://localhost:3001/community-hub/admin` - Panel de administración

## 📋 Pasos para Completar la Configuración

### **Paso 1: Instalar Dependencias del Hub**

```bash
cd hub-server
npm install
```

### **Paso 2: Instalar Dependencias del Servidor Principal**

```bash
cd ../server
npm install http-proxy-middleware
```

### **Paso 3: Configurar Variables de Entorno**

Crea o edita el archivo `server/.env.development`:

```env
# Habilitar el hub local
USE_LOCAL_HUB=true

# URL del servidor del hub (opcional, default: http://127.0.0.1:5001)
HUB_SERVER_URL=http://127.0.0.1:5001

# Prefijo para import IDs (debe coincidir con el hub)
COMMUNITY_HUB_IMPORT_PREFIX=allm-community-id
```

### **Paso 4: Iniciar el Servidor del Hub**

```bash
cd hub-server
npm run dev
```

Verás:
```
🚀 Community Hub server running at http://localhost:5001
📦 Database: /path/to/hub.db
🔗 API Base: http://localhost:5001/v1
```

### **Paso 5: Iniciar AnythingLLM**

En otra terminal:

```bash
# Desde la raíz del proyecto
npm run dev:server
```

O si usas el frontend:
```bash
npm run dev
```

### **Paso 6: Verificar la Integración**

1. Abre `http://localhost:3001/community-hub/`
2. Deberías ver la página de exploración
3. Prueba crear un item en `/community-hub/admin`

## 🔧 Solución de Problemas

### Error: "Cannot find module 'http-proxy-middleware'"

```bash
cd server
npm install http-proxy-middleware
```

### Error: "Community Hub no disponible"

Asegúrate de que:
1. El servidor del hub está ejecutándose en el puerto 5001
2. La variable `USE_LOCAL_HUB=true` está configurada
3. No hay otro servicio usando el puerto 5001

### Error: "EADDRINUSE: Port 5001 is already in use"

```bash
# Buscar y matar el proceso
lsof -ti:5001 | xargs kill -9

# O cambiar el puerto en hub-server/.env
PORT=5002
```

## 🎯 URLs Disponibles

### **Servidor del Hub** (localhost:5001)
- `GET /` - Página de exploración
- `GET /admin` - Panel de administración
- `GET /v1/explore` - API: Listar items
- `POST /v1/:type/create` - API: Crear item
- `POST /v1/:type/:id/update` - API: Actualizar item
- `DELETE /v1/:type/:id` - API: Eliminar item

### **AnythingLLM** (localhost:3001)
- `GET /community-hub/` - Proxy a la página de exploración
- `GET /community-hub/admin` - Proxy al panel de admin
- `GET /api/community-hub/explore` - API integrada de AnythingLLM
- `POST /api/community-hub/apply` - Aplicar item importado

## 📊 Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                    AnythingLLM Server                       │
│                    (localhost:3001)                         │
├─────────────────────────────────────────────────────────────┤
│  /community-hub/*  ──► Proxy ──► Hub Server (5001)         │
│  /api/community-hub/* ──► CommunityHub Model                │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Hub Server                               │
│                    (localhost:5001)                         │
├─────────────────────────────────────────────────────────────┤
│  /              ──► index.html (Exploración)                │
│  /admin         ──► admin.html (Panel Admin)                │
│  /v1/explore    ──► API REST                                │
│  /v1/:type/*    ──► CRUD Items                              │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    SQLite Database                          │
│                    (hub.db)                                 │
└─────────────────────────────────────────────────────────────┘
```

## 🎨 Características Implementadas

### **Servidor del Hub**
- ✅ API RESTful completa
- ✅ Base de datos SQLite persistente
- ✅ CRUD de items (prompts, comandos, skills, flows)
- ✅ Sistema de votaciones
- ✅ Categorías
- ✅ Filtros y búsqueda
- ✅ URLs limpias (sin .html)

### **UI del Hub**
- ✅ Diseño profesional tipo AnythingLLM
- ✅ Tema oscuro/claro con persistencia
- ✅ Animaciones y transiciones
- ✅ Skeleton loading
- ✅ Responsive design
- ✅ Modal con animaciones
- ✅ Toast notifications

### **Integración con AnythingLLM**
- ✅ Proxy para URLs limpias
- ✅ API compartida
- ✅ Importación de items
- ✅ Aplicación automática

## 🚀 Comandos Útiles

```bash
# Iniciar solo el hub
cd hub-server && npm run dev

# Iniciar solo el servidor de AnythingLLM
cd server && npm run dev

# Iniciar todo (con concurrently)
npm run dev

# Ver logs del hub
cd hub-server && npm start 2>&1 | tee hub.log

# Backup de la base de datos
cp hub-server/hub.db hub-server/hub.db.backup.$(date +%Y%m%d)
```

## 📝 Notas Importantes

1. **Los cambios en el hub** se guardan automáticamente en `hub-server/hub.db`
2. **El tema** se sincroniza vía localStorage
3. **Las URLs .html** redirigen automáticamente a las URLs limpias
4. **El proxy** solo funciona en desarrollo o si `USE_LOCAL_HUB=true`

## 🎯 Siguientes Pasos Opcionales

1. **Agregar autenticación** al panel de admin
2. **Implementar analytics** (contador de downloads)
3. **Agregar paginación** para muchos items
4. **Crear tests** automatizados
5. **Dockerizar** el hub

¿Necesitas ayuda con algún paso específico?
