# 🚀 CodingSoft Community Hub (Local)

Un servidor local de Community Hub para AnythingLLM que permite gestionar, compartir e importar prompts de sistema, comandos slash, agent skills y agent flows.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Uso](#uso)
- [Gestión de Items](#gestión-de-items)
- [API Reference](#api-reference)
- [Integración con AnythingLLM](#integración-con-anythingllm)
- [Migración de Datos](#migración-de-datos)
- [Solución de Problemas](#solución-de-problemas)

## ✨ Características

- 🎯 **4 Tipos de Items**: System Prompts, Slash Commands, Agent Skills, Agent Flows
- 🔍 **Exploración Pública**: Catálogo de items sin necesidad de autenticación
- 🔐 **Items Privados**: Soporte para items que requieren API Key
- 📱 **Panel de Administración**: UI intuitiva para crear, editar y eliminar items
- 🎨 **Tema Oscuro/Claro**: Interfaz adaptable
- ⚡ **Importación Directa**: Integración nativa con AnythingLLM
- 🗄️ **Base de Datos SQLite**: Almacenamiento local ligero
- 🔄 **Hot Reload**: Desarrollo con recarga automática

## 🚀 Instalación

### Opción A: Docker Compose (Recomendado) 🐳

La forma más fácil y completa de ejecutar AnythingLLM + Community Hub juntos.

**Requisitos:**
- Docker y Docker Compose

**Pasos:**

1. **Desde la raíz del proyecto**:
```bash
cd anything-llm
```

2. **Iniciar servicios**:
```bash
# Usando el helper script
./docker-helper.sh start

# O con docker-compose directamente
docker-compose up -d
```

3. **Acceder a las aplicaciones**:
- **AnythingLLM**: http://localhost:3001
- **Community Hub**: http://localhost:5001
- **Hub Admin**: http://localhost:5001/admin

4. **Gestión con helper script**:
```bash
./docker-helper.sh status    # Ver estado
./docker-helper.sh logs      # Ver logs
./docker-helper.sh stop      # Detener
./docker-helper.sh update    # Actualizar
```

### Opción B: Instalación Manual (Node.js)

Para desarrollo o si prefieres no usar Docker.

**Requisitos:**
- Node.js 18+ 
- AnythingLLM instalado y configurado

**Pasos:**

1. **Clonar o navegar al directorio**:
```bash
cd anything-llm/hub-server
```

2. **Instalar dependencias**:
```bash
npm install
```

3. **Configurar variables de entorno** (opcional):
```bash
cp .env.example .env
```

4. **Iniciar el servidor**:
```bash
# Modo desarrollo (con hot reload)
npm run dev

# Modo producción
npm start
```

El servidor estará disponible en: `http://localhost:5001`

## ⚙️ Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz del hub-server:

```env
# Puerto del servidor (default: 5001)
PORT=5001

# Prefijo para IDs de importación
COMMUNITY_HUB_IMPORT_PREFIX=allm-community-id

# URL base para AnythingLLM (desarrollo)
ANYTHINGLLM_URL=http://localhost:3000

# Modo de operación
NODE_ENV=development
```

### Configuración de AnythingLLM

Para que AnythingLLM use este hub local, configura en `server/.env.development`:

```env
USE_LOCAL_HUB=true
```

Esto redirigirá todas las llamadas al Community Hub desde AnythingLLM a tu servidor local.

## 📖 Uso

### Acceso al Hub

- **Hub Público**: `http://localhost:5001`
- **Panel Admin**: `http://localhost:5001/admin`
- **API Base**: `http://localhost:5001/v1`

### Explorar Items

1. Abre `http://localhost:5001` en tu navegador
2. Navega por las categorías: Todos, Prompts, Comandos, Skills, Flows
3. Haz clic en "Importar" en cualquier item para ver el ID de importación
4. Copia el ID y úsalo en AnythingLLM

## 📝 Gestión de Items

### Crear un Nuevo Item

1. Ve al Panel Admin (`http://localhost:5001/admin`)
2. Haz clic en "+ Nuevo Item"
3. Completa el formulario:
   - **Tipo**: System Prompt, Slash Command, Agent Skill, Agent Flow
   - **Nombre**: Título descriptivo
   - **Descripción**: Explicación breve
   - **Contenido**: El prompt/comando/skill
   - **Tags**: Palabras clave separadas por comas
   - **Visibilidad**: Público o Privado
4. Guarda el item

### Editar/eliminar Items

En el Panel Admin, cada item tiene botones de:
- ✏️ **Editar**: Modificar contenido
- 🗑️ **Eliminar**: Borrar permanentemente
- 👁️ **Vista Previa**: Ver cómo se verá

### Estructura de Items

#### System Prompt
```json
{
  "itemType": "system-prompt",
  "name": "Data Analyst",
  "description": "Prompt para análisis de datos",
  "prompt": "You are a data analyst...",
  "tags": ["data", "analysis"],
  "visibility": "public"
}
```

#### Slash Command
```json
{
  "itemType": "slash-command", 
  "name": "Resumir",
  "description": "Resume textos largos",
  "prompt": "Summarize the following...",
  "command": "/resumir",
  "tags": ["summary", "text"],
  "visibility": "public"
}
```

## 🔌 API Reference

### Endpoints Públicos

#### GET `/v1/explore`
Obtiene todos los items públicos organizados por tipo.

**Response**:
```json
{
  "systemprompts": { "items": [...], "totalCount": 2 },
  "slashcommands": { "items": [...], "totalCount": 5 },
  "agentskills": { "items": [...], "totalCount": 0 },
  "agentflows": { "items": [...], "totalCount": 0 }
}
```

#### GET `/v1/item/:type/:id`
Obtiene un item específico por tipo e ID.

**Parameters**:
- `type`: `system-prompt`, `slash-command`, `agent-skill`, `agent-flow`
- `id`: Identificador único del item

### Endpoints de Administración

#### POST `/v1/admin/items`
Crear un nuevo item.

**Body**:
```json
{
  "itemType": "slash-command",
  "name": "Mi Comando",
  "description": "Descripción",
  "prompt": "Contenido del prompt",
  "command": "/comando",
  "tags": "tag1, tag2",
  "visibility": "public"
}
```

#### PUT `/v1/admin/items/:id`
Actualizar un item existente.

#### DELETE `/v1/admin/items/:id`
Eliminar un item.

## 🔗 Integración con AnythingLLM

### Desde el Hub Local

1. **Explorar**: Ve a `http://localhost:5001` y explora items
2. **Importar**: Haz clic en "Importar →" en cualquier item
3. **Copiar ID**: Copia el ID de importación mostrado
4. **Importar en AnythingLLM**:
   - Ve a `Ajustes → Community Hub → Importar Item`
   - Pega el ID: `allm-community-id:slash-command:continuar`
   - Continúa con la importación

### Desde AnythingLLM

1. Ve a `Ajustes → Community Hub → Explore Hub`
2. Verás los items de tu hub local integrados
3. Haz clic en "Import →" en cualquier item
4. El ID se rellena automáticamente

### Navegación

- **Hub Local → AnythingLLM**: Botón "Volver" en la navegación
- **AnythingLLM → Admin**: En "Mis Items" hay enlaces al panel admin

## 🔄 Migración de Datos

### Backup de Items

Para respaldar todos tus items:

```bash
# Copiar la base de datos
cp hub.db hub.db.backup.$(date +%Y%m%d)

# O exportar a JSON
sqlite3 hub.db ".dump items" > backup.sql
```

### Importar desde JSON

Si tienes items en formato JSON:

```javascript
// Ejemplo de script de importación
const items = require('./mis-items.json');
items.forEach(item => {
  fetch('http://localhost:5001/v1/admin/items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item)
  });
});
```

### Migrar desde Hub Oficial

Si tienes items en el hub oficial de CodingSoft:

1. Exporta tus items desde tu perfil en el hub oficial
2. Convierte el formato si es necesario
3. Usa el script de importación anterior

## 🐛 Solución de Problemas

### El hub no muestra items en AnythingLLM

**Verifica**:
1. El hub está corriendo: `curl http://localhost:5001/v1/explore`
2. AnythingLLM tiene `USE_LOCAL_HUB=true` en `.env.development`
3. El servidor backend de AnythingLLM está reiniciado

### Error "Cannot connect to hub"

- Verifica que el puerto 5001 no esté ocupado
- Revisa el firewall no bloquee conexiones locales
- Asegúrate de que el hub y AnythingLLM estén en el mismo host

### Items privados no aparecen

- Los items privados requieren API Key
- Configura la API Key en "Mis Items" dentro de AnythingLLM
- Verifica que el item tenga `visibility: "private"` en el admin

### Cambios no se reflejan

- Refresca la página del navegador
- Si es el frontend de AnythingLLM, reconstruye: `npm run build`
- Reinicia el servidor backend de AnythingLLM

## 📝 Notas Importantes

- **Desarrollo**: El hub está diseñado para desarrollo local
- **Producción**: Para producción, considera usar el hub oficial o implementar autenticación robusta
- **Datos**: La base de datos SQLite se almacena en `hub-server/hub.db`
- **Persistencia**: Los datos persisten entre reinicios del servidor

## 🤝 Contribuir

Para agregar nuevas características o reportar bugs:

1. Verifica que el código siga el estilo existente
2. Prueba los cambios localmente
3. Actualiza este README si es necesario

## 📄 Licencia

Este proyecto es parte de AnythingLLM y sigue sus términos de licencia.

---

**Desarrollado por CodingSoft** ⚡

## 🐳 Docker y Container Registry

### Imagen Docker Oficial

La imagen Docker está disponible en **GitHub Container Registry**:

```bash
# Pull la imagen
docker pull ghcr.io/codingsoft/community-hub:1.1.0

# Ejecutar standalone
docker run -p 5001:5001 -v hub-data:/data ghcr.io/codingsoft/community-hub:1.1.0
```

**Tags disponibles:**
- `ghcr.io/codingsoft/community-hub:1.1.0` - Versión específica
- `ghcr.io/codingsoft/community-hub:latest` - Última versión

### Construir Imagen Local

```bash
cd hub-server
docker build -t community-hub:local .
docker run -p 5001:5001 community-hub:local
```

### Variables de Entorno Docker

| Variable | Descripción | Default |
|----------|-------------|---------|
| `PORT` | Puerto del servidor | `5001` |
| `DB_PATH` | Ruta de la base de datos | `/data/hub.db` |
| `COMMUNITY_HUB_IMPORT_PREFIX` | Prefijo de IDs | `allm-community-id` |
| `NODE_ENV` | Modo de operación | `production` |

### Volúmenes

- `/data` - Base de datos SQLite y archivos persistentes

### Arquitectura Docker Compose

```
┌─────────────────────────────────────────────┐
│          Docker Compose Network            │
│                                             │
│  ┌──────────────┐    ┌──────────────┐     │
│  │ AnythingLLM  │◄──►│ Community Hub│     │
│  │  Port 3001   │    │  Port 5001   │     │
│  └──────────────┘    └──────────────┘     │
│                                             │
└─────────────────────────────────────────────┘
```

**Ventajas de Docker Compose:**
- ✅ Ambos servicios orquestados juntos
- ✅ Networking automática entre servicios
- ✅ Volúmenes persistentes
- ✅ Health checks integrados
- ✅ Fácil actualización y rollback
- ✅ Escalable horizontalmente

### Publicar tu Propia Imagen

1. **Generar GitHub PAT**:
   - Ve a: https://github.com/settings/tokens
   - Scopes: `read:packages`, `write:packages`

2. **Login y Push**:
```bash
echo TU_TOKEN | docker login ghcr.io -u TU_USUARIO --password-stdin
docker build -t ghcr.io/TU_USUARIO/community-hub:1.0.0 .
docker push ghcr.io/TU_USUARIO/community-hub:1.0.0
```

