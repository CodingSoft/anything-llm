#!/bin/bash

# Script para publicar imagen Docker en GitHub Container Registry
# Usage: ./publish-docker.sh [VERSION]

VERSION=${1:-"1.1.0"}
OWNER="CodingSoft"
REPO="anything-llm-hub"
IMAGE_NAME="ghcr.io/${OWNER}/${REPO}"

echo "🐳 Building Docker image for Community Hub v${VERSION}..."

# Construir imagen
cd hub-server
docker build -t ${IMAGE_NAME}:${VERSION} -t ${IMAGE_NAME}:latest .

echo "✅ Image built successfully"
echo ""
echo "🔐 Login to GitHub Container Registry..."
echo "NOTA: Necesitas un GitHub Personal Access Token (PAT) con permisos 'write:packages'"
echo ""
echo "Para publicar, ejecuta estos comandos manualmente:"
echo ""
echo "1. Generar token en: https://github.com/settings/tokens"
echo "   - Seleccionar scopes: read:packages, write:packages, delete:packages"
echo ""
echo "2. Login en GitHub Container Registry:"
echo "   echo YOUR_PAT | docker login ghcr.io -u CodingSoft --password-stdin"
echo ""
echo "3. Push la imagen:"
echo "   docker push ${IMAGE_NAME}:${VERSION}"
echo "   docker push ${IMAGE_NAME}:latest"
echo ""
echo "4. Verificar en:"
echo "   https://github.com/CodingSoft?tab=packages"
echo ""
echo "📦 Image tags creados:"
echo "   - ${IMAGE_NAME}:${VERSION}"
echo "   - ${IMAGE_NAME}:latest"
