# Guía Rápida: Constructor de Agentes (Agent Builder)

## 🎯 Acceso Rápido

1. **Ingresa a** http://localhost:3002/
2. **Navega a** `Admin` en el menú lateral
3. **Selecciona** `Agent Builder`
4. **Crea nuevo agente** haciendo clic en "New Agent"

## 🖥️ Interfaz del Constructor

```
┌─────────────────────────────────────────────────────────┐
│  Agent Builder                                      │
├─────────────────────────────────────────────────────────┤
│                                                     │
│  [Nombre del agente]                 [Save] [Load]   │
│                                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │  Start   │→ │  Block 1 │→ │  Block 2 │→ ... │
│  └──────────┘  └──────────┘  └──────────┘      │
│       ↓                                                      │
│  ┌──────────┐                                               │
│  │  Finish  │                                               │
│  └──────────┘                                               │
│                                                     │
│  [+] Add Block [Delete] [Preview]                       │
│                                                     │
└─────────────────────────────────────────────────────────┘
```

## 📋 Pasos para Crear un Agente

### Paso 1: Configurar Información Básica
```
Flow Information Block
├─ Name: "Mi Agente"
└─ Description: "Descripción del propósito"
```

### Paso 2: Definir Variables
```
Start Block (Flow Variables)
├─ Variable 1: { name: "user_input", value: "" }
├─ Variable 2: { name: "context", value: "general" }
└─ + Add Variable
```

### Paso 3: Agregar Bloques de Funcionalidad
```
Available Blocks:
┌──────────────────┬──────────────────────────┐
│  🌐 API Call    │  🧠 LLM Instruction   │
│  🌍 Web Scraping │  🏁 Finish            │
└──────────────────┴──────────────────────────┘
```

**Click en "+" para agregar un bloque**

### Paso 4: Configurar Cada Bloque

**Para API Call:**
```
API Call Configuration
├─ URL: https://api.example.com/endpoint
├─ Method: [GET ▼]
├─ Headers: [+]
├─ Body Type: [JSON ▼]
├─ Body: { "key": "{{variable}}" }
├─ Result Variable: api_response
└─ Direct Output: [ ]
```

**Para Web Scraping:**
```
Web Scraping Configuration
├─ URL: https://example.com/page
├─ Capture As: [text ▼]
├─ Query Selector: article.content
├─ Result Variable: scraped_data
└─ Direct Output: [ ]
```

**Para LLM Instruction:**
```
LLM Instruction Configuration
├─ Instruction: "Procesa: {{scraped_data}}"
├─ Result Variable: processed_result
└─ Direct Output: [X]
```

### Paso 5: Guardar y Probar
```
[Save Agent] → Guarda el flujo completo
[Test in Chat] → Abre un chat para probar
```

## 🔗 Conexión de Bloques

Los bloques se conectan automáticamente en orden:
```
Start → Block 1 → Block 2 → ... → Finish
```

**Variables fluyen entre bloques:**
```
Start: var1, var2
  ↓
Block 1: usa {{var1}} → guarda en result1
  ↓
Block 2: usa {{result1}} → guarda en result2
  ↓
LLM: usa {{result2}} → directOutput
  ↓
Finish
```

## 💡 Atajos de Teclado

| Acción | Atajo |
|---------|--------|
| Guardar | Cmd/Ctrl + S |
| Previsualizar | Cmd/Ctrl + P |
| Cerrar panel | Esc |
| Deshacer | Cmd/Ctrl + Z |
| Rehacer | Cmd/Ctrl + Y |

## 🎨 Personalización Visual

```
Theme Settings
├─ Light Mode
├─ Dark Mode
└─ System Default
```

## 📂 Gestión de Agentes

### Ver Todos los Agentes
```
Admin > Agents
┌─────────────────────────────────┐
│  Agentes Guardados             │
├─────────────────────────────────┤
│  📄 Resumidor de Artículos   │
│  📄 Buscador Wikipedia       │
│  📄 Analizador de Sentimientos │
└─────────────────────────────────┘
```

### Editar Agente Existente
1. Click en el nombre del agente
2. Modifica la configuración
3. Click en "Save"

### Duplicar Agente
1. Click en "Duplicate"
2. Crea copia del agente
3. Modifica según necesidad

### Eliminar Agente
1. Click en "Delete"
2. Confirma eliminación

## 🚀 Uso del Agente en Chat

### Método 1: Comando Directo
```
@Resumidor_de_Artículos https://ejemplo.com/articulo
```

### Método 2: Menú Contextual
```
Chat Input
└─ Click en icono @
    └─ Selecciona agente
```

## 🐛 Debugging

### Ver Logs del Agente
```
Admin > Logs > Agent Logs
```

### Probar Variables
```
En el chat:
Test variables: @agente variable1=value1 variable2=value2
```

### Depurar Paso a Paso
```
1. Comenta bloques (//)
2. Habilita uno por uno
3. Verifica resultados de cada bloque
4. Corrige errores antes de continuar
```

## ⚡ Optimización

### Rendimiento
- **Minimiza** llamadas API en bucles
- **Usa** caché para respuestas repetitivas
- **Limita** el número de bloques LLM

### Calidad de Respuestas
- **Sé específico** en instrucciones LLM
- **Proporciona** contexto claro
- **Valida** resultados antes de finalizar

## 📊 Métricas y Análisis

### Ver Estadísticas de Uso
```
Admin > Analytics > Agent Usage
├─ Invocaciones totales
├─ Tiempo promedio de respuesta
├─ Tasa de éxito
└─ Agentes más utilizados
```

### Exportar Datos
```
Admin > Export > Agent Logs
Formato: [CSV ▼] [JSON ▼] [Excel ▼]
```

## 🔒 Seguridad

### Variables Sensibles
```
No incluyas en el agente:
❌ API Keys
❌ Passwords
❌ Tokens de autenticación

Usa variables configuradas en el sistema:
✅ {{OPENAI_API_KEY}}
✅ {{CUSTOM_API_TOKEN}}
```

### Permisos del Agente
```
Admin > Agent Permissions
├─ Workspaces permitidos
├─ Usuarios permitidos
└─ Límites de uso
```

## 🆘 Ayuda Rápida

### Problema: Agente no aparece
**Solución**: Verifica que el agente esté guardado y activo

### Problema: Error en llamada API
**Solución**: Valida URL, método y headers manualmente

### Problema: Variables no funcionan
**Solución**: Usa formato `{{nombre_variable}}` exacto

### Problema: Respuesta vacía
**Solución**: Verifica que `directOutput` esté configurado correctamente

### Problema: Flujo no termina
**Solución**: Asegúrate de tener un bloque "Finish" al final

---

**📚 Documentación adicional:**
- Guía completa: `AGENTES_GUIA.md`
- Ejemplos: `EJEMPLOS_AGENTES.md`
- Comunidad: http://localhost:3002/community-hub

**❓ ¿Necesitas más ayuda?**
- Consulta la documentación oficial
- Explora ejemplos de la comunidad
- Pregunta en el chat: "Ayuda con agentes"
