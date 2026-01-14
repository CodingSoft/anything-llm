#!/bin/bash
# Deploy AnythingLLM from GitHub Container Registry to VPS
# Usage: ./deploy-ghcr.sh [IMAGE_TAG]
# Example: ./deploy-ghcr.sh latest
#          ./deploy-ghcr.sh master-sha123456

set -e

# Configuration
REGISTRY="ghcr.io"
IMAGE_NAME="CodingSoft/anything-llm"
CONTAINER_NAME="anythingllm"
VOLUMES="anything-llm_anythingllm-storage anything-llm_anythingllm-logs anything-llm_anythingllm-documents"
ENV_FILE="/root/.env.prod"
NETWORK="anything-llm"
PORT="3001"

# Image tag (default: latest)
IMAGE_TAG="${1:-latest}"
FULL_IMAGE="${REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

# Check if running on VPS
if [ ! -f "/root/.env.prod" ]; then
    log_error "This script should be run on the VPS"
fi

# Main deployment
log_info "Deploying AnythingLLM from GHCR..."
echo ""
log_info "Image: ${FULL_IMAGE}"
echo ""

# Create backup
log_info "Creating backup..."
BACKUP_DIR="/root/backups/anythingllm-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"
docker run --rm -v anything-llm_anythingllm-storage:/data -v "$BACKUP_DIR:/backup" ubuntu tar czf "/backup/storage-backup.tar.gz" -C /data . || true
log_success "Backup created at $BACKUP_DIR"
echo ""

# Pull new image
log_info "Pulling new image from GHCR..."
if ! docker pull "$FULL_IMAGE"; then
    log_error "Failed to pull image $FULL_IMAGE"
fi
log_success "Image pulled successfully"
echo ""

# Stop and remove old container
log_info "Stopping old container..."
if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    docker stop "$CONTAINER_NAME" || true
    docker rm "$CONTAINER_NAME" || true
    log_success "Old container removed"
else
    log_warning "No existing container found"
fi
echo ""

# Create network if not exists
log_info "Ensuring network exists..."
if ! docker network ls --format '{{.Names}}' | grep -q "^${NETWORK}$"; then
    docker network create --driver bridge "$NETWORK"
    log_success "Network created"
fi
echo ""

# Create new container
log_info "Creating new container..."
docker run -d \
  --name "$CONTAINER_NAME" \
  --cap-add SYS_ADMIN \
  -p "$PORT:3001" \
  -v anything-llm_anythingllm-storage:/app/server/storage \
  -v anything-llm_anythingllm-logs:/app/server/logs \
  -v anything-llm_anythingllm-documents:/app/server/documents \
  --env-file "$ENV_FILE" \
  --add-host host.docker.internal:host-gateway \
  --network "$NETWORK" \
  --restart unless-stopped \
  "$FULL_IMAGE"

log_success "Container created"
echo ""

# Wait for container to be healthy
log_info "Waiting for container to be healthy..."
MAX_WAIT=60
WAIT_TIME=0
while [ $WAIT_TIME -lt $MAX_WAIT ]; do
    STATUS=$(docker inspect --format='{{.State.Health.Status}}' "$CONTAINER_NAME" 2>/dev/null || echo "starting")
    if [ "$STATUS" = "healthy" ]; then
        log_success "Container is healthy!"
        break
    elif [ "$STATUS" = "unhealthy" ]; then
        log_error "Container is unhealthy. Check logs: docker logs $CONTAINER_NAME"
    fi
    sleep 5
    WAIT_TIME=$((WAIT_TIME + 5))
done

if [ $WAIT_TIME -ge $MAX_WAIT ]; then
    log_warning "Container health check timed out. Check logs: docker logs $CONTAINER_NAME"
fi

echo ""
log_success "Deployment completed!"
echo ""
echo "Container status:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}\t{{.Image}}" | grep "$CONTAINER_NAME"
echo ""
echo "Application URL: https://anythingllm.codingsoft.org"
