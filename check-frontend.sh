#!/bin/bash

echo "🔍 Diagnóstico del Frontend de AnythingLLM"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

cd /Users/codingsoft/GitHub/anything-llm

# 1. Verificar directorio
if [ ! -d "frontend" ]; then
    echo -e "${RED}❌ Error: No se encuentra la carpeta 'frontend'${NC}"
    exit 1
fi

echo "✅ Directorio frontend existe"

# 2. Verificar node_modules
cd frontend
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}⚠️  node_modules no encontrado. Instalando...${NC}"
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Error instalando dependencias${NC}"
        exit 1
    fi
else
    echo "✅ node_modules existe"
fi

# 3. Verificar package.json
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: No se encuentra package.json${NC}"
    exit 1
fi
echo "✅ package.json existe"

# 4. Verificar Vite
if [ ! -f "vite.config.js" ]; then
    echo -e "${RED}❌ Error: No se encuentra vite.config.js${NC}"
    exit 1
fi
echo "✅ vite.config.js existe"

# 5. Verificar puerto 3000
echo ""
echo "🔍 Verificando puerto 3000..."
PORT_3000=$(lsof -ti:3000 2>/dev/null)
if [ -n "$PORT_3000" ]; then
    echo -e "${YELLOW}⚠️  Puerto 3000 está en uso por el proceso: $PORT_3000${NC}"
    echo "   Puedes matarlo con: kill -9 $PORT_3000"
else
    echo -e "${GREEN}✅ Puerto 3000 disponible${NC}"
fi

# 6. Verificar dist
echo ""
echo "🔍 Verificando build..."
if [ -d "dist" ]; then
    echo "✅ Carpeta dist existe"
    echo "   Archivos en dist: $(ls dist/ | wc -l)"
else
    echo -e "${YELLOW}⚠️  No hay build. El frontend se compilará automáticamente.${NC}"
fi

# 7. Verificar variables de entorno
echo ""
echo "🔍 Verificando configuración..."
if [ -f ".env" ]; then
    echo "✅ Archivo .env existe"
else
    echo -e "${YELLOW}⚠️  No hay archivo .env. Se usará .env.example${NC}"
    cp .env.example .env
    echo "✅ Copiado .env.example a .env"
fi

# 8. Probar build
echo ""
echo "🔍 Probando compilación..."
npm run build > /tmp/build.log 2>&1 &
BUILD_PID=$!
sleep 10

if kill -0 $BUILD_PID 2>/dev/null; then
    kill $BUILD_PID 2>/dev/null
    echo -e "${YELLOW}⚠️  Build está tardando demasiado (puede ser normal la primera vez)${NC}"
else
    if [ -d "dist" ] && [ -f "dist/index.html" ]; then
        echo -e "${GREEN}✅ Build exitoso${NC}"
    else
        echo -e "${RED}❌ Error en el build${NC}"
        echo "   Revisa: tail -f /tmp/build.log"
    fi
fi

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "🎯 Para iniciar el frontend:"
echo ""
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "   O usa el script completo:"
echo "   ./start-hub.sh"
echo ""
echo "═══════════════════════════════════════════════════════════════"
