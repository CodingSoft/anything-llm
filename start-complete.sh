#!/bin/bash

echo "🚀 Iniciando AnythingLLM + Community Hub + Frontend"
echo "═══════════════════════════════════════════════════════"

# Limpiar puertos primero
lsof -ti:5001 -ti:3001 -ti:3000 2>/dev/null | xargs kill -9 2>/dev/null
sleep 2

# Iniciar Hub
echo "🌐 [1/3] Iniciando Community Hub..."
cd hub-server
npm run dev > /tmp/hub.log 2>&1 &
HUB_PID=$!
cd ..
sleep 3

# Iniciar AnythingLLM Server
echo "⚙️  [2/3] Iniciando AnythingLLM Server..."
cd server
USE_LOCAL_HUB=true npm run dev > /tmp/server.log 2>&1 &
SERVER_PID=$!
cd ..
sleep 5

# Iniciar Frontend
echo "🎨 [3/3] Iniciando Frontend..."
cd frontend
npm run dev > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

echo ""
echo "⏳ Esperando servicios..."
sleep 5

echo ""
echo "✅ TODO LISTO!"
echo "═══════════════════════════════════════════════════════"
echo ""
echo "🔗 URLs Disponibles:"
echo "  • Frontend:        http://localhost:3000"
echo "  • API Server:      http://localhost:3001"
echo "  • Hub Directo:     http://localhost:5001"
echo "  • Hub via Proxy:   http://localhost:3001/community-hub/"
echo ""
echo "⚠️  Presiona Ctrl+C para detener todo"
echo ""

# Mantener script vivo
trap "echo ''; echo '🛑 Deteniendo...'; kill $HUB_PID $SERVER_PID $FRONTEND_PID 2>/dev/null; exit 0" SIGINT
wait
