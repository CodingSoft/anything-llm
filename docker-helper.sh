#!/bin/bash
# Script de ayuda para gestionar Docker Compose de AnythingLLM + Community Hub

set -e

VERSION="1.1.0"
COMPOSE_FILE="docker-compose.yml"

show_help() {
    echo "🚀 AnythingLLM + Community Hub - Docker Compose Helper"
    echo ""
    echo "Uso: ./docker-helper.sh [comando]"
    echo ""
    echo "Comandos disponibles:"
    echo "  start      - Iniciar todos los servicios"
    echo "  stop       - Detener todos los servicios"
    echo "  restart    - Reiniciar todos los servicios"
    echo "  status     - Ver estado de los servicios"
    echo "  logs       - Ver logs en tiempo real"
    echo "  build      - Construir imágenes locales"
    echo "  update     - Actualizar a última versión"
    echo "  shell      - Acceder al contenedor de AnythingLLM"
    echo "  hub-shell  - Acceder al contenedor del Hub"
    echo "  clean      - Limpiar volúmenes y contenedores"
    echo "  help       - Mostrar esta ayuda"
    echo ""
    echo "URLs de acceso:"
    echo "  - AnythingLLM: http://localhost:3001"
    echo "  - Community Hub: http://localhost:5001"
    echo "  - Hub Admin: http://localhost:5001/admin"
}

start_services() {
    echo "🚀 Iniciando servicios..."
    docker-compose -f $COMPOSE_FILE up -d
    echo ""
    echo "✅ Servicios iniciados:"
    echo "  📱 AnythingLLM: http://localhost:3001"
    echo "  🎯 Community Hub: http://localhost:5001"
    echo ""
    echo "📊 Ver estado: ./docker-helper.sh status"
    echo "📜 Ver logs:   ./docker-helper.sh logs"
}

stop_services() {
    echo "🛑 Deteniendo servicios..."
    docker-compose -f $COMPOSE_FILE down
    echo "✅ Servicios detenidos"
}

restart_services() {
    echo "🔄 Reiniciando servicios..."
    docker-compose -f $COMPOSE_FILE restart
    echo "✅ Servicios reiniciados"
}

show_status() {
    echo "📊 Estado de los servicios:"
    docker-compose -f $COMPOSE_FILE ps
    echo ""
    echo "🌐 Conectividad:"
    curl -s http://localhost:3001/api/health > /dev/null && echo "  ✅ AnythingLLM: OK" || echo "  ❌ AnythingLLM: Error"
    curl -s http://localhost:5001/v1/explore > /dev/null && echo "  ✅ Community Hub: OK" || echo "  ❌ Community Hub: Error"
}

show_logs() {
    echo "📜 Mostrando logs (Ctrl+C para salir)..."
    docker-compose -f $COMPOSE_FILE logs -f
}

build_images() {
    echo "🔨 Construyendo imágenes..."
    docker-compose -f $COMPOSE_FILE build
    echo "✅ Imágenes construidas"
}

update_services() {
    echo "⬆️  Actualizando servicios..."
    docker-compose -f $COMPOSE_FILE pull
    docker-compose -f $COMPOSE_FILE up -d
    echo "✅ Servicios actualizados"
}

access_shell() {
    echo "🐚 Accediendo a AnythingLLM..."
    docker-compose -f $COMPOSE_FILE exec anythingllm sh
}

access_hub_shell() {
    echo "🐚 Accediendo a Community Hub..."
    docker-compose -f $COMPOSE_FILE exec community-hub sh
}

clean_all() {
    echo "⚠️  Esto eliminará TODOS los datos. ¿Estás seguro? (s/N)"
    read -r confirm
    if [ "$confirm" = "s" ] || [ "$confirm" = "S" ]; then
        docker-compose -f $COMPOSE_FILE down -v --remove-orphans
        echo "🧹 Todo limpiado"
    else
        echo "❌ Cancelado"
    fi
}

# Main
case "${1:-help}" in
    start)
        start_services
        ;;
    stop)
        stop_services
        ;;
    restart)
        restart_services
        ;;
    status)
        show_status
        ;;
    logs)
        show_logs
        ;;
    build)
        build_images
        ;;
    update)
        update_services
        ;;
    shell)
        access_shell
        ;;
    hub-shell)
        access_hub_shell
        ;;
    clean)
        clean_all
        ;;
    help|*)
        show_help
        ;;
esac
