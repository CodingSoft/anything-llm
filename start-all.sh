#!/bin/bash

echo "🚀 Iniciando AnythingLLM + Community Hub"
echo ""

# Detectar directorio del script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "📍 Directorio: $SCRIPT_DIR"
echo ""

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "🌐 Iniciando Community Hub (puerto 5001)..."
cd "$SCRIPT_DIR/hub-server"
USE_LOCAL_HUB=true npm run dev &
HUB_PID=$!
cd "$SCRIPT_DIR"

echo "⚙️  Iniciando AnythingLLM Server (puerto 3001)..."
cd "$SCRIPT_DIR/server"
USE_LOCAL_HUB=true npm run dev &
SERVER_PID=$!
cd "$SCRIPT_DIR"

echo "🎨 Iniciando Frontend (puerto 3000)..."
cd "$SCRIPT_DIR/frontend"
npm run dev &
FRONTEND_PID=$!
cd "$SCRIPT_DIR"

echo ""
echo "⏳ Esperando 5 segundos..."
sleep 5

echo ""
echo -e "${GREEN}✅ Servicios iniciados:${NC}"
echo ""
echo "🌐 Frontend:     http://localhost:3000"
echo "⚙️  API:          http://localhost:3001"
echo "📦 Hub Directo:  http://localhost:5001"
echo ""
echo -e "${YELLOW}⚠️  Presiona Ctrl+C para detener todo${NC}"
echo ""

# Esperar por Ctrl+C
trap "echo ''; echo '🛑 Deteniendo servicios...'; kill $HUB_PID $SERVER_PID $FRONTEND_PID 2>/dev/null; exit 0" SIGINT SIGTERM
wait
