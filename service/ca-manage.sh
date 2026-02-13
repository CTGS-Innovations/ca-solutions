#!/usr/bin/env bash
#
# ca-manage.sh — Management script for Computer Ally Solutions service
#
# Usage: ./ca-manage.sh {install|uninstall|start|stop|restart|status|logs|build|port}
#

set -euo pipefail

SERVICE_NAME="ca-solutions"
SERVICE_FILE="${SERVICE_NAME}.service"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
SYSTEMD_DIR="/etc/systemd/system"
PORT=20100

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

info()  { echo -e "${GREEN}[INFO]${NC} $*"; }
warn()  { echo -e "${YELLOW}[WARN]${NC} $*"; }
error() { echo -e "${RED}[ERROR]${NC} $*"; }

require_sudo() {
    if [[ $EUID -ne 0 ]]; then
        error "This action requires sudo. Run: sudo $0 $1"
        exit 1
    fi
}

cmd_install() {
    require_sudo "install"

    info "Building application..."
    cd "$PROJECT_DIR"
    sudo -u corey /usr/bin/npx next build

    info "Installing systemd service..."
    cp "$SCRIPT_DIR/$SERVICE_FILE" "$SYSTEMD_DIR/$SERVICE_FILE"

    systemctl daemon-reload
    systemctl enable "$SERVICE_NAME"
    systemctl start "$SERVICE_NAME"

    info "Service installed and started."
    echo ""
    cmd_status
    echo ""
    info "Application running at http://localhost:${PORT}"
    info "Configure your Cloudflare Tunnel to point to http://localhost:${PORT}"
}

cmd_uninstall() {
    require_sudo "uninstall"

    info "Stopping and disabling service..."
    systemctl stop "$SERVICE_NAME" 2>/dev/null || true
    systemctl disable "$SERVICE_NAME" 2>/dev/null || true
    rm -f "$SYSTEMD_DIR/$SERVICE_FILE"
    systemctl daemon-reload

    info "Service uninstalled."
}

cmd_start() {
    require_sudo "start"
    info "Starting ${SERVICE_NAME}..."
    systemctl start "$SERVICE_NAME"
    cmd_status
}

cmd_stop() {
    require_sudo "stop"
    info "Stopping ${SERVICE_NAME}..."
    systemctl stop "$SERVICE_NAME"
    cmd_status
}

cmd_restart() {
    require_sudo "restart"
    info "Restarting ${SERVICE_NAME}..."
    systemctl restart "$SERVICE_NAME"
    sleep 2
    cmd_status
}

cmd_status() {
    echo ""
    systemctl status "$SERVICE_NAME" --no-pager -l 2>/dev/null || true
    echo ""

    # Quick health check
    if curl -s -o /dev/null -w "" "http://localhost:${PORT}" 2>/dev/null; then
        info "Health check: ${GREEN}OK${NC} — http://localhost:${PORT} is responding"
    else
        warn "Health check: Service may still be starting or is not responding on port ${PORT}"
    fi
}

cmd_logs() {
    local lines="${2:-50}"
    local follow="${3:-}"

    if [[ "$follow" == "-f" || "$follow" == "--follow" ]]; then
        info "Following logs for ${SERVICE_NAME} (Ctrl+C to stop)..."
        journalctl -u "$SERVICE_NAME" -f --no-pager
    else
        info "Last ${lines} log lines for ${SERVICE_NAME}:"
        journalctl -u "$SERVICE_NAME" -n "$lines" --no-pager
    fi
}

cmd_build() {
    info "Building application..."
    cd "$PROJECT_DIR"
    /usr/bin/npx next build
    info "Build complete. Restart the service to pick up changes:"
    info "  sudo $0 restart"
}

cmd_port() {
    info "Service port: ${PORT}"
    info "Checking if port ${PORT} is in use..."
    if ss -tlnp 2>/dev/null | grep -q ":${PORT} "; then
        ss -tlnp 2>/dev/null | grep ":${PORT} "
    else
        warn "Nothing is currently listening on port ${PORT}"
    fi
}

cmd_help() {
    echo ""
    echo "Computer Ally Solutions — Service Manager"
    echo ""
    echo "Usage: $0 <command> [options]"
    echo ""
    echo "Commands:"
    echo "  install      Install and start the systemd service (requires sudo)"
    echo "  uninstall    Stop, disable, and remove the service (requires sudo)"
    echo "  start        Start the service (requires sudo)"
    echo "  stop         Stop the service (requires sudo)"
    echo "  restart      Restart the service (requires sudo)"
    echo "  status       Show service status and health check"
    echo "  logs [N]     Show last N log lines (default: 50)"
    echo "  logs N -f    Follow logs in real-time"
    echo "  build        Build the app (run before restart to deploy changes)"
    echo "  port         Show configured port and check if it's in use"
    echo "  help         Show this help message"
    echo ""
    echo "Quick start:"
    echo "  sudo $0 install     # First-time setup"
    echo "  sudo $0 restart     # After code changes"
    echo "  $0 logs 100 -f      # Tail logs"
    echo ""
    echo "Port: ${PORT}"
    echo "Project: ${PROJECT_DIR}"
    echo ""
}

# --- Main ---
case "${1:-help}" in
    install)    cmd_install ;;
    uninstall)  cmd_uninstall ;;
    start)      cmd_start ;;
    stop)       cmd_stop ;;
    restart)    cmd_restart ;;
    status)     cmd_status ;;
    logs)       cmd_logs "$@" ;;
    build)      cmd_build ;;
    port)       cmd_port ;;
    help|--help|-h)  cmd_help ;;
    *)
        error "Unknown command: $1"
        cmd_help
        exit 1
        ;;
esac
