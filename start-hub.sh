#!/bin/bash

# 🚀 Script para iniciar AnythingLLM con Community Hub

echo "🎯 Iniciando AnythingLLM completo (Frontend + Backend + Hub)..."
echo ""

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar si estamos en el directorio correcto
if [ ! -d "hub-server" ] || [ ! -d "server" ] || [ ! -d "frontend" ]; then
    echo -e "${RED}❌ Error: Debes ejecutar este script desde la raíz del proyecto${NC}"
    echo "   cd /ruta/a/anything-llm"
    exit 1
fi

# Verificar si concurrently está instalado
if ! command -v npx &> /dev/null; then
    echo -e "${RED}❌ Error: npx no está instalado${NC}"
    exit 1
fi

echo "📦 Verificando e instalando dependencias..."
echo ""

# Instalar dependencias si no existen
if [ ! -d "hub-server/node_modules" ]; then
    echo "  📥 Instalando dependencias del Hub..."
    cd hub-server && npm install && cd ..
fi

if [ ! -d "server/node_modules/http-proxy-middleware" ]; then
    echo "  📥 Instalando http-proxy-middleware..."
    cd server && npm install http-proxy-middleware && cd ..
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "  📥 Instalando dependencias del Frontend..."
    cd frontend && npm install && cd ..
fi

echo -e "${GREEN}✅ Dependencias listas${NC}"
echo ""

# Función para limpiar procesos al salir
cleanup() {
    echo ""
    echo "🛑 Deteniendo servidores..."
    kill $HUB_PID $SERVER_PID $FRONTEND_PID 2>/dev/null
    wait $HUB_PID $SERVER_PID $FRONTEND_PID 2>/dev/null
    echo -e "${GREEN}✅ Servidores detenidos${NC}"
    exit 0
}

trap cleanup SIGINT SIGTERM

echo -e "${BLUE}🚀 Iniciando servicios...${NC}"
echo ""

# Iniciar el servidor del Hub
echo "🌐 [1/3] Iniciando Community Hub (puerto 5001)..."
cd hub-server
USE_LOCAL_HUB=true npm run dev > /tmp/hub.log 2>&1 &
HUB_PID=$!
cd ..

# Iniciar AnythingLLM Server
echo "⚙️  [2/3] Iniciando AnythingLLM Server (puerto 3001)..."
cd server
USE_LOCAL_HUB=true npm run dev > /tmp/server.log 2>&1 &
SERVER_PID=$!
cd ..

# Iniciar Frontend
echo "🎨 [3/3] Iniciando Frontend (puerto 3000)..."
cd frontend
npm run dev > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

# Esperar a que los servicios estén listos
echo ""
echo "⏳ Esperando a que los servicios estén listos..."
sleep 8

# Verificar estado de los servicios
echo ""
echo -e "${BLUE}📊 Estado de los servicios:${NC}"
echo ""

# Verificar Hub
if kill -0 $HUB_PID 2>/dev/null; then
    echo -e "  ${GREEN}✅${NC} Community Hub:     http://localhost:5001"
else
    echo -e "  ${RED}❌${NC} Community Hub:     ERROR (ver /tmp/hub.log)"
fi

# Verificar Server
if kill -0 $SERVER_PID 2>/dev/null; then
    echo -e "  ${GREEN}✅${NC} AnythingLLM API:   http://localhost:3001"
else
    echo -e "  ${RED}❌${NC} AnythingLLM API:   ERROR (ver /tmp/server.log)"
fi

# Verificar Frontend
if kill -0 $FRONTEND_PID 2>/dev/null; then
    echo -e "  ${GREEN}✅${NC} Frontend:          http://localhost:3000"
else
    echo -e "  ${RED}❌${NC} Frontend:          ERROR (ver /tmp/frontend.log)"
fi

echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  ✅ TODO LISTO!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${BLUE}🔗 URLs principales:${NC}"
echo "  • Frontend:           http://localhost:3000"
echo "  • API Backend:        http://localhost:3001"
echo ""
echo -e "${BLUE}🔗 Community Hub:${NC}"
echo "  • Hub Directo:        http://localhost:5001"
echo "  • Via Frontend:       http://localhost:3000/community-hub/"
echo "  • Hub Admin:          http://localhost:3000/community-hub/admin"
echo ""
echo -e "${YELLOW}⚠️  Comandos útiles:${NC}"
echo "  • Ver logs Hub:       tail -f /tmp/hub.log"
echo "  • Ver logs Server:    tail -f /tmp/server.log"
echo "  • Ver logs Frontend:  tail -f /tmp/frontend.log"
echo ""
echo -e "${YELLOW}⚠️  Presiona Ctrl+C para detener todos los servicios${NC}"
echo ""

# Mantener el script ejecutándose y mostrar logs en tiempo real
echo "📋 Logs en tiempo real (Hub + Server):"
echo "──────────────────────────────────────────────────────────"
tail -f /tmp/hub.log /tmp/server.log /tmp/frontend.log 2>/dev/null

wait
