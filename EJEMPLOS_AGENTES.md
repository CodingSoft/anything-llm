# Ejemplos de Configuraciones de Agentes

## Ejemplo 1: Agente de Resumen de Artículos Web

Este agente toma una URL de un artículo, extrae el contenido y genera un resumen.

```json
{
  "flow_info": {
    "id": "flow_info",
    "type": "flowInfo",
    "config": {
      "name": "Resumidor de Artículos",
      "description": "Extrae y resume contenido de páginas web"
    }
  },
  "start": {
    "id": "start",
    "type": "start",
    "config": {
      "variables": [
        { "name": "article_url", "value": "https://example.com/article" }
      ]
    }
  },
  "scrape_article": {
    "id": "scrape_article",
    "type": "webScraping",
    "config": {
      "url": "{{article_url}}",
      "captureAs": "text",
      "querySelector": "article",
      "resultVariable": "article_content",
      "directOutput": false
    }
  },
  "summarize": {
    "id": "summarize",
    "type": "llmInstruction",
    "config": {
      "instruction": "Genera un resumen conciso del siguiente artículo en español. Incluye los puntos principales y una conclusión:\n\n{{article_content}}",
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

## Ejemplo 2: Agente de Búsqueda en Wikipedia

Busca información en Wikipedia y proporciona un resumen estructurado.

```json
{
  "flow_info": {
    "id": "flow_info",
    "type": "flowInfo",
    "config": {
      "name": "Buscador Wikipedia",
      "description": "Busca y resume información de Wikipedia"
    }
  },
  "start": {
    "id": "start",
    "type": "start",
    "config": {
      "variables": [
        { "name": "search_term", "value": "" }
      ]
    }
  },
  "search_wikipedia": {
    "id": "search_wikipedia",
    "type": "apiCall",
    "config": {
      "url": "https://es.wikipedia.org/api/rest_v1/page/summary/{{search_term}}",
      "method": "GET",
      "headers": [
        { "name": "User-Agent", "value": "AnythingLLM-Agent/1.0" }
      ],
      "bodyType": "json",
      "body": "",
      "formData": [],
      "responseVariable": "wiki_response",
      "directOutput": false
    }
  },
  "format_response": {
    "id": "format_response",
    "type": "llmInstruction",
    "config": {
      "instruction": "Basado en la información de Wikipedia, proporciona una respuesta estructurada que incluya:\n\n1. Título del artículo\n2. Breve resumen\n3. Puntos clave\n4. Fuentes relevantes\n\nRespuesta de Wikipedia:\n\n{{wiki_response}}",
      "resultVariable": "formatted_answer",
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

## Ejemplo 3: Agente de Análisis de Sentimientos

Analiza el sentimiento de un texto proporcionado.

```json
{
  "flow_info": {
    "id": "flow_info",
    "type": "flowInfo",
    "config": {
      "name": "Analizador de Sentimientos",
      "description": "Analiza el sentimiento emocional de textos"
    }
  },
  "start": {
    "id": "start",
    "type": "start",
    "config": {
      "variables": [
        { "name": "text_to_analyze", "value": "" }
      ]
    }
  },
  "analyze_sentiment": {
    "id": "analyze_sentiment",
    "type": "llmInstruction",
    "config": {
      "instruction": "Analiza el sentimiento del siguiente texto en español. Proporciona:\n\n1. Sentimiento general (positivo, negativo, neutral)\n2. Nivel de confianza (0-100%)\n3. Emociones detectadas\n4. Justificación breve\n\nTexto:\n\n{{text_to_analyze}}",
      "resultVariable": "sentiment_analysis",
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

## Ejemplo 4: Agente de Extracción de Noticias

Extrae noticias recientes sobre un tema específico.

```json
{
  "flow_info": {
    "id": "flow_info",
    "type": "flowInfo",
    "config": {
      "name": "Extractor de Noticias",
      "description": "Busca noticias sobre un tema específico"
    }
  },
  "start": {
    "id": "start",
    "type": "start",
    "config": {
      "variables": [
        { "name": "topic", "value": "tecnología" },
        { "name": "max_results", "value": "5" }
      ]
    }
  },
  "search_news": {
    "id": "search_news",
    "type": "webScraping",
    "config": {
      "url": "https://news.google.com/search?q={{topic}}&hl=es",
      "captureAs": "text",
      "querySelector": ".SoaBEf",
      "resultVariable": "news_results",
      "directOutput": false
    }
  },
  "summarize_news": {
    "id": "summarize_news",
    "type": "llmInstruction",
    "config": {
      "instruction": "Resumir las siguientes noticias sobre {{topic}}. Proporciona una lista de hasta {{max_results}} noticias con sus títulos y resúmenes breves:\n\n{{news_results}}",
      "resultVariable": "news_summary",
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

## Ejemplo 5: Agente de Traducción Multilingüe

Traduce texto a múltiples idiomas.

```json
{
  "flow_info": {
    "id": "flow_info",
    "type": "flowInfo",
    "config": {
      "name": "Traductor Multilingüe",
      "description": "Traduce texto a múltiples idiomas"
    }
  },
  "start": {
    "id": "start",
    "type": "start",
    "config": {
      "variables": [
        { "name": "text", "value": "" },
        { "name": "target_languages", "value": "inglés, francés, alemán" }
      ]
    }
  },
  "translate": {
    "id": "translate",
    "type": "llmInstruction",
    "config": {
      "instruction": "Traduce el siguiente texto al español y a los siguientes idiomas: {{target_languages}}. Presenta cada traducción en un formato claro con el idioma como título:\n\nTexto original: {{text}}",
      "resultVariable": "translations",
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

## Ejemplo 6: Agente de Generación de Ideas

Genera ideas creativas basadas en un tema.

```json
{
  "flow_info": {
    "id": "flow_info",
    "type": "flowInfo",
    "config": {
      "name": "Generador de Ideas",
      "description": "Genera ideas creativas sobre cualquier tema"
    }
  },
  "start": {
    "id": "start",
    "type": "start",
    "config": {
      "variables": [
        { "name": "topic", "value": "" },
        { "name": "idea_count", "value": "5" }
      ]
    }
  },
  "brainstorm": {
    "id": "brainstorm",
    "type": "llmInstruction",
    "config": {
      "instruction": "Genera {{idea_count}} ideas creativas e innovadoras sobre el tema: {{topic}}. Para cada idea, proporciona:\n\n1. Título de la idea\n2. Descripción breve\n3. Posibles beneficios\n4. Consideraciones de implementación\n\nSé creativo y piensa fuera de la caja.",
      "resultVariable": "ideas",
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

## Ejemplo 7: Agente de Análisis de Competidores

Analiza productos o servicios de competidores.

```json
{
  "flow_info": {
    "id": "flow_info",
    "type": "flowInfo",
    "config": {
      "name": "Analizador de Competidores",
      "description": "Analiza productos de competidores"
    }
  },
  "start": {
    "id": "start",
    "type": "start",
    "config": {
      "variables": [
        { "name": "product_name", "value": "" },
        { "name": "company_url", "value": "https://competidor.com" }
      ]
    }
  },
  "scrape_competitor": {
    "id": "scrape_competitor",
    "type": "webScraping",
    "config": {
      "url": "{{company_url}}",
      "captureAs": "text",
      "querySelector": "main, .product-info",
      "resultVariable": "competitor_data",
      "directOutput": false
    }
  },
  "analyze_competitor": {
    "id": "analyze_competitor",
    "type": "llmInstruction",
    "config": {
      "instruction": "Analiza el producto '{{product_name}}' basado en la información de la competidora. Proporciona:\n\n1. Características principales\n2. Puntos fuertes\n3. Debilidades\n4. Diferenciadores\n5. Oportunidades de mejora\n\nInformación del competidor:\n\n{{competitor_data}}",
      "resultVariable": "analysis",
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

## Ejemplo 8: Agente de Planificación de Proyectos

Genera planes de proyectos detallados.

```json
{
  "flow_info": {
    "id": "flow_info",
    "type": "flowInfo",
    "config": {
      "name": "Planificador de Proyectos",
      "description": "Genera planes de proyectos detallados"
    }
  },
  "start": {
    "id": "start",
    "type": "start",
    "config": {
      "variables": [
        { "name": "project_description", "value": "" },
        { "name": "timeline", "value": "4 semanas" }
      ]
    }
  },
  "create_plan": {
    "id": "create_plan",
    "type": "llmInstruction",
    "config": {
      "instruction": "Crea un plan de proyecto detallado para: {{project_description}}. El plan debe cubrir un periodo de {{timeline}}. Incluye:\n\n1. Objetivos del proyecto\n2. Entregables principales\n3. Fases del proyecto con fechas estimadas\n4. Recursos necesarios\n5. Riesgos potenciales y mitigación\n6. Métricas de éxito\n7. Hitos clave\n\nSé específico y práctico.",
      "resultVariable": "project_plan",
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

## Ejemplo 9: Agente de Generación de Contenido SEO

Genera contenido optimizado para SEO.

```json
{
  "flow_info": {
    "id": "flow_info",
    "type": "flowInfo",
    "config": {
      "name": "Generador SEO",
      "description": "Genera contenido optimizado para SEO"
    }
  },
  "start": {
    "id": "start",
    "type": "start",
    "config": {
      "variables": [
        { "name": "keyword", "value": "" },
        { "name": "content_type", "value": "artículo de blog" }
      ]
    }
  },
  "generate_seo_content": {
    "id": "generate_seo_content",
    "type": "llmInstruction",
    "config": {
      "instruction": "Genera un {{content_type}} optimizado para SEO sobre la palabra clave: {{keyword}}. Incluye:\n\n1. Título SEO optimizado (60-70 caracteres)\n2. Meta descripción (150-160 caracteres)\n3. Slug de URL amigable\n4. Contenido principal con H1, H2, H3\n5. Palabras clave secundarias a incluir\n6. Call-to-action\n7. Alt text sugerido para imágenes\n8. Links internos sugeridos\n\nUsa un tono profesional y atractivo.",
      "resultVariable": "seo_content",
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

## Ejemplo 10: Agente de Análisis Financiero Simple

Analiza información financiera básica.

```json
{
  "flow_info": {
    "id": "flow_info",
    "type": "flowInfo",
    "config": {
      "name": "Analista Financiero",
      "description": "Análisis financiero básico"
    }
  },
  "start": {
    "id": "start",
    "type": "start",
    "config": {
      "variables": [
        { "name": "financial_data", "value": "" }
      ]
    }
  },
  "analyze_financials": {
    "id": "analyze_financials",
    "type": "llmInstruction",
    "config": {
      "instruction": "Analiza los siguientes datos financieros y proporciona:\n\n1. Resumen ejecutivo\n2. Análisis de tendencias\n3. Puntos fuertes y áreas de mejora\n4. Recomendaciones\n5. Alertas o indicadores de preocupación\n\nDatos financieros:\n\n{{financial_data}}\n\nNota: Este es un análisis general y no constituye asesoramiento financiero profesional.",
      "resultVariable": "financial_analysis",
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

## Cómo Usar Estos Ejemplos

1. **Copia** la configuración JSON del ejemplo deseado
2. **Ve a** Admin > Agent Builder en AnythingLLM
3. **Crea** un nuevo agente
4. **Pega** la configuración JSON en el editor
5. **Guarda** el agente
6. **Prueba** el agente en un chat con `/@nombre_agente`

## Personalización

Cada ejemplo puede personalizarse:
- Cambia nombres y descripciones
- Ajusta variables según tus necesidades
- Modifica instrucciones LLM para obtener resultados específicos
- Agrega más bloques para funcionalidades adicionales
- Combina múltiples ejemplos en un agente más complejo

---

**¿Necesitas un tipo de agente específico que no está aquí? Puedo ayudarte a crearlo.**
