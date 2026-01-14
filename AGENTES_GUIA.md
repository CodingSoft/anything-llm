# Guía de Configuración de Agentes de IA en AnythingLLM

## 🤖 ¿Qué son los Agentes de IA?

Los agentes en AnythingLLM son flujos visuales sin código que permiten automatizar tareas complejas utilizando múltiples pasos y capacidades de IA. Los agentes pueden:
- Realizar llamadas a APIs
- Hacer scraping de páginas web
- Procesar datos con instrucciones LLM
- Usar variables y pasar datos entre pasos

## 🚀 Cómo acceder al Constructor de Agentes

1. **Ingresa a AnythingLLM** en http://localhost:3002/
2. Ve a **Admin > Agent Builder** en el menú lateral
3. Crea un nuevo agente o edita uno existente

## 📦 Tipos de Bloques Disponibles

### 1. **Flow Information** (Información del Flujo)
- **Descripción**: Información básica del flujo
- **Configuración**:
  - `name`: Nombre del agente
  - `description`: Descripción del propósito del agente

### 2. **Start - Flow Variables** (Variables del Flujo)
- **Descripción**: Configura variables y configuraciones del agente
- **Configuración**:
  - `variables`: Array de variables con:
    - `name`: Nombre de la variable
    - `value`: Valor inicial (opcional)

**Ejemplo**:
```json
{
  "variables": [
    { "name": "user_query", "value": "" },
    { "name": "max_results", "value": "5" }
  ]
}
```

### 3. **API Call** (Llamada a API)
- **Descripción**: Realiza una solicitud HTTP
- **Configuración**:
  - `url`: URL del endpoint de la API
  - `method`: Método HTTP (GET, POST, PUT, DELETE)
  - `headers`: Array de headers personalizados
  - `bodyType`: Tipo de body (json, form-data)
  - `body`: Contenido del body (para POST/PUT)
  - `formData`: Array de campos para form-data
  - `responseVariable`: Nombre de la variable para guardar la respuesta
  - `directOutput`: Si es true, envía la respuesta directamente al usuario

**Ejemplo - Llamada a API del clima**:
```json
{
  "url": "https://api.openweathermap.org/data/2.5/weather",
  "method": "GET",
  "headers": [],
  "bodyType": "json",
  "body": "",
  "formData": [],
  "responseVariable": "weather_data",
  "directOutput": false
}
```

### 4. **LLM Instruction** (Instrucción LLM)
- **Descripción**: Procesa datos usando instrucciones del LLM
- **Configuración**:
  - `instruction`: Instrucción para el LLM (puede usar variables con `{{variable_name}}`)
  - `resultVariable`: Nombre de la variable para guardar el resultado
  - `directOutput`: Si es true, envía el resultado directamente al usuario

**Ejemplo**:
```json
{
  "instruction": "Analiza el siguiente texto y extrae las entidades principales:\n\n{{api_response}}",
  "resultVariable": "analysis_result",
  "directOutput": false
}
```

### 5. **Web Scraping** (Web Scraping)
- **Descripción**: Extrae contenido de una página web
- **Configuración**:
  - `url`: URL de la página web
  - `captureAs`: Formato de captura (text, html, markdown)
  - `querySelector`: Selector CSS para extraer contenido específico (opcional)
  - `resultVariable`: Nombre de la variable para guardar el resultado
  - `directOutput`: Si es true, envía el resultado directamente al usuario

**Ejemplo**:
```json
{
  "url": "https://example.com/article",
  "captureAs": "text",
  "querySelector": "article.content",
  "resultVariable": "scraped_content",
  "directOutput": false
}
```

### 6. **Finish** (Finalizar Flujo)
- **Descripción**: Marca el final del flujo del agente
- **Configuración**: No requiere configuración

## 🔧 Ejemplo Completo: Agente de Investigación

Este agente toma una consulta, busca información en la web, y proporciona un resumen.

```json
{
  "flow_info": {
    "id": "flow_info",
    "type": "flowInfo",
    "config": {
      "name": "Agente de Investigación",
      "description": "Busca información web y proporciona resumen"
    }
  },
  "start": {
    "id": "start",
    "type": "start",
    "config": {
      "variables": [
        { "name": "query", "value": "" }
      ]
    }
  },
  "step_1": {
    "id": "step_1",
    "type": "webScraping",
    "config": {
      "url": "https://www.google.com/search?q={{query}}",
      "captureAs": "text",
      "resultVariable": "search_results"
    }
  },
  "step_2": {
    "id": "step_2",
    "type": "llmInstruction",
    "config": {
      "instruction": "Resume los siguientes resultados de búsqueda en un párrafo conciso:\n\n{{search_results}}",
      "resultVariable": "summary",
      "directOutput": true
    }
  },
  "finish": {
    "id": "finish",
    "type": "finish",
    "config": {}
  }
}
```

## 💡 Consejos de Uso

### 1. **Usar Variables Efectivamente**
- Las variables se definen en el bloque "Start"
- Usa variables en otros bloques con `{{nombre_variable}}`
- Los resultados de bloques pueden ser capturados y reutilizados

### 2. **Encadenamiento de Bloques**
- Los bloques se ejecutan en orden secuencial
- El resultado de un bloque puede usarse en el siguiente
- Usa `resultVariable` para capturar resultados

### 3. **Manejo de Errores**
- Si una API falla, el flujo se detendrá
- Usa LLM Instructions para manejar errores gracefully
- Considera bloques alternativos para manejar failures

### 4. **DirectOutput**
- Configura `directOutput: true` en el último bloque si quieres enviar el resultado directamente al usuario
- Si es false, el resultado queda en una variable para uso posterior

### 5. **Testing**
- Guarda el agente y pruébalo en un chat con `/@nombre_agente`
- Revisa los logs para depurar problemas
- Ajusta las configuraciones según sea necesario

## 🎯 Escenarios de Uso

### **Escenario 1: Agente de Noticias**
1. Start: Variable `topic`
2. Web Scraping: Scrapea sitio de noticias para el `topic`
3. LLM Instruction: Extrae puntos clave
4. Finish

### **Escenario 2: Agente de Análisis de Datos**
1. Start: Variable `data_source`
2. API Call: Obtiene datos de la API
3. LLM Instruction: Analiza y resume datos
4. Finish

### **Escenario 3: Agente de Integración Múltiple**
1. Start: Variables `user_input`, `contexto`
2. API Call: Consulta API externa
3. LLM Instruction: Procesa respuesta con contexto
4. API Call: Guarda resultado en base de datos
5. Finish

## 📖 Documentación Adicional

- [Documentación oficial de Agentes](https://anythingllm.codingsoft.org/agent/custom/introduction)
- [Community Hub](http://localhost:3002/community-hub) - Agentes compartidos por la comunidad
- [API de Agentes](http://localhost:3002/api/docs) - Documentación API

## ❓ Preguntas Frecuentes

**Q: ¿Cómo invoco un agente desde el chat?**
A: Usa el comando `/@nombre_agente` en cualquier chat.

**Q: ¿Puedo usar agentes en cualquier workspace?**
A: Sí, los agentes están disponibles globalmente en todos los workspaces.

**Q: ¿Qué pasa si un bloque falla?**
A: El flujo se detendrá y mostrará un mensaje de error.

**Q: ¿Puedo compartir mi agente con otros?**
A: Sí, puedes publicar tu agente en el Community Hub.

**Q: ¿Hay límites en el número de bloques?**
A: No hay límites estrictos, pero flujos muy largos pueden ser difíciles de mantener.

## 🆘 Problemas Comunes y Soluciones

**Problema**: El agente no se invoca
- **Solución**: Verifica que el nombre del agente sea correcto al usar `/@nombre`

**Problema**: Error en llamada API
- **Solución**: Verifica URL, método, headers y body. Prueba la API manualmente primero.

**Problema**: Variables no se reemplazan
- **Solución**: Asegúrate de usar sintaxis `{{nombre_variable}}` correctamente.

**Problema**: El resultado es incorrecto
- **Solución**: Revisa la instrucción LLM y asegúrate de que sea clara y específica.

---

**¿Necesitas ayuda con algún tipo específico de agente? Puedo ayudarte a crear configuraciones personalizadas para tus necesidades.**
