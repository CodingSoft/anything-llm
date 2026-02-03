#!/bin/bash

echo "🔧 Instalando dependencia faltante..."
cd server
npm install http-proxy-middleware --legacy-peer-deps

echo ""
echo "🚀 Iniciando servicios..."
cd ../hub-server
npm run dev &
sleep 3

cd ../server
USE_LOCAL_HUB=true npm run dev &
sleep 3

cd ../frontend
npm run dev
