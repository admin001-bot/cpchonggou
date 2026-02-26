#!/bin/bash

# ============================================================
# 彩票系统一键部署脚本
# 支持: 首次部署、更新部署、回滚操作
# ============================================================

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 脚本路径
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_NAME="lottery"
BACKUP_DIR="${SCRIPT_DIR}/backups"
LOG_FILE="${SCRIPT_DIR}/deploy.log"

# ============================================================
# 工具函数
# ============================================================

log() {
    echo -e "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log_info() {
    log "${BLUE}[INFO]${NC} $1"
}

log_success() {
    log "${GREEN}[SUCCESS]${NC} $1"
}

log_warn() {
    log "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    log "${RED}[ERROR]${NC} $1"
}

# 检查命令是否存在
check_command() {
    if ! command -v "$1" &> /dev/null; then
        log_error "$1 未安装，请先安装 $1"
        exit 1
    fi
}

# 显示进度条
progress_bar() {
    local duration=$1
    local sleep_interval=0.1
    local progress=0
    local bar_length=50

    while [ $progress -lt 100 ]; do
        progress=$((progress + 1))
        local filled=$((progress * bar_length / 100))
        local empty=$((bar_length - filled))
        printf "\r["
        printf "%0.s=" $(seq 1 $filled)
        printf "%0.s " $(seq 1 $empty)
        printf "] %d%%" $progress
        sleep $sleep_interval
    done
    echo ""
}

# ============================================================
# 部署前检查
# ============================================================

pre_check() {
    log_info "开始部署前检查..."

    # 检查 Docker
    check_command docker
    check_command docker-compose

    # 检查 Docker 是否运行
    if ! docker info &> /dev/null; then
        log_error "Docker 未运行，请先启动 Docker"
        exit 1
    fi

    # 检查 .env 文件
    if [ ! -f "${SCRIPT_DIR}/.env" ]; then
        log_warn ".env 文件不存在，从 .env.example 复制"
        if [ -f "${SCRIPT_DIR}/.env.example" ]; then
            cp "${SCRIPT_DIR}/.env.example" "${SCRIPT_DIR}/.env"
            log_warn "请编辑 .env 文件，修改数据库密码和 JWT 密钥！"
        else
            log_error ".env.example 文件也不存在"
            exit 1
        fi
    fi

    # 检查必要目录
    mkdir -p "${BACKUP_DIR}"
    mkdir -p "${SCRIPT_DIR}/logs/backend"
    mkdir -p "${SCRIPT_DIR}/elk/logstash/pipeline"
    mkdir -p "${SCRIPT_DIR}/elk/logstash/config"

    log_success "部署前检查完成"
}

# ============================================================
# 备份操作
# ============================================================

backup() {
    log_info "开始备份当前部署..."

    local backup_name="backup_$(date +%Y%m%d_%H%M%S)"
    local backup_path="${BACKUP_DIR}/${backup_name}"

    mkdir -p "${backup_path}"

    # 备份数据库
    log_info "备份数据库..."
    if docker ps | grep -q lottery_mysql; then
        docker exec lottery_mysql mysqldump -u root -p"${MYSQL_ROOT_PASSWORD:-lottery_root_123}" lottery > "${backup_path}/database.sql" 2>/dev/null || true
    fi

    # 备份 .env 文件
    cp "${SCRIPT_DIR}/.env" "${backup_path}/.env" 2>/dev/null || true

    # 备份 docker-compose.yml
    cp "${SCRIPT_DIR}/docker-compose.yml" "${backup_path}/docker-compose.yml" 2>/dev/null || true

    # 创建备份信息文件
    cat > "${backup_path}/info.txt" << EOF
备份时间: $(date '+%Y-%m-%d %H:%M:%S')
备份名称: ${backup_name}
Docker 版本: $(docker --version)
Docker Compose 版本: $(docker-compose --version)
EOF

    # 创建符号链接指向最新备份
    ln -sfn "${backup_name}" "${BACKUP_DIR}/latest"

    log_success "备份完成: ${backup_path}"
    echo "${backup_name}" > "${BACKUP_DIR}/last_backup.txt"
}

# ============================================================
# 部署操作
# ============================================================

deploy() {
    log_info "开始部署应用..."

    # 加载环境变量
    if [ -f "${SCRIPT_DIR}/.env" ]; then
        set -a
        source "${SCRIPT_DIR}/.env"
        set +a
    fi

    # 停止旧服务
    log_info "停止旧服务..."
    docker-compose down --remove-orphans 2>/dev/null || true

    # 拉取最新镜像（如果需要）
    log_info "拉取基础镜像..."
    docker-compose pull mysql redis elasticsearch 2>/dev/null || true

    # 构建应用镜像
    log_info "构建应用镜像..."
    docker-compose build --no-cache backend frontend

    # 启动基础设施服务
    log_info "启动基础设施服务（MySQL、Redis、Elasticsearch）..."
    docker-compose up -d mysql redis elasticsearch

    # 等待服务就绪
    log_info "等待基础设施服务就绪..."
    sleep 30

    # 检查 MySQL 健康状态
    local retries=0
    while [ $retries -lt 30 ]; do
        if docker-compose exec -T mysql mysqladmin ping -uroot -p"${MYSQL_ROOT_PASSWORD:-lottery_root_123}" --silent 2>/dev/null; then
            log_success "MySQL 已就绪"
            break
        fi
        retries=$((retries + 1))
        log_info "等待 MySQL 就绪... (${retries}/30)"
        sleep 10
    done

    # 检查 Elasticsearch 健康状态
    retries=0
    while [ $retries -lt 30 ]; do
        if curl -s http://localhost:9200/_cluster/health | grep -q '"status":"green"\|"status":"yellow"' 2>/dev/null; then
            log_success "Elasticsearch 已就绪"
            break
        fi
        retries=$((retries + 1))
        log_info "等待 Elasticsearch 就绪... (${retries}/30)"
        sleep 10
    done

    # 启动应用服务
    log_info "启动应用服务..."
    docker-compose up -d backend frontend logstash kibana

    # 等待应用启动
    sleep 10

    # 健康检查
    log_info "执行健康检查..."

    # 检查后端健康状态
    local backend_health=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/api/health 2>/dev/null || echo "000")
    if [ "$backend_health" == "200" ]; then
        log_success "后端服务健康检查通过"
    else
        log_warn "后端服务健康检查未通过 (HTTP $backend_health)，请检查日志"
    fi

    # 检查前端健康状态
    local frontend_health=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:80 2>/dev/null || echo "000")
    if [ "$frontend_health" == "200" ] || [ "$frontend_health" == "304" ]; then
        log_success "前端服务健康检查通过"
    else
        log_warn "前端服务健康检查未通过 (HTTP $frontend_health)，请检查日志"
    fi

    # 检查 Kibana
    local kibana_health=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5601/api/status 2>/dev/null || echo "000")
    if [ "$kibana_health" == "200" ]; then
        log_success "Kibana 服务健康检查通过"
    else
        log_warn "Kibana 服务健康检查未通过 (HTTP $kibana_health)，可能需要等待更长时间"
    fi

    # 显示部署信息
    echo ""
    echo "============================================================"
    echo "  🎉 部署完成！"
    echo "============================================================"
    echo ""
    echo "  📱 前端访问: http://localhost"
    echo "  🔧 后端 API: http://localhost:8080"
    echo "  📊 Kibana:   http://localhost:5601"
    echo "  🗄️  MySQL:    localhost:3306"
    echo "  ⚡ Redis:    localhost:6379"
    echo ""
    echo "  📝 日志位置:"
    echo "     应用日志: ./logs/backend/"
    echo "     Docker 日志: docker-compose logs -f [service]"
    echo ""
    echo "  🔍 常用命令:"
    echo "     查看状态: docker-compose ps"
    echo "     查看日志: docker-compose logs -f"
    echo "     停止服务: docker-compose down"
    echo "     重启服务: docker-compose restart"
    echo ""
    echo "============================================================"

    log_success "部署脚本执行完成"
}

# ============================================================
# 回滚操作
# ============================================================

rollback() {
    log_info "开始回滚操作..."

    # 检查备份目录
    if [ ! -d "${BACKUP_DIR}" ]; then
        log_error "备份目录不存在，无法回滚"
        exit 1
    fi

    # 获取最新备份
    local latest_backup
    if [ -L "${BACKUP_DIR}/latest" ]; then
        latest_backup=$(readlink "${BACKUP_DIR}/latest")
    else
        log_error "未找到备份记录"
        exit 1
    fi

    log_info "将回滚到备份: ${latest_backup}"

    # 确认操作
    read -p "确认回滚? 这将丢失当前部署后的数据 [y/N] " confirm
    if [[ ! $confirm =~ ^[Yy]$ ]]; then
        log_info "取消回滚"
        exit 0
    fi

    # 停止当前服务
    log_info "停止当前服务..."
    docker-compose down --volumes

    # 恢复数据库
    if [ -f "${BACKUP_DIR}/${latest_backup}/database.sql" ]; then
        log_info "恢复数据库..."
        # 启动 MySQL 但不启动其他服务
        docker-compose up -d mysql
        sleep 30

        # 导入数据
        docker exec -i lottery_mysql mysql -u root -p"${MYSQL_ROOT_PASSWORD}" lottery < "${BACKUP_DIR}/${latest_backup}/database.sql"
        log_success "数据库恢复完成"
    fi

    # 恢复配置文件
    if [ -f "${BACKUP_DIR}/${latest_backup}/.env" ]; then
        cp "${BACKUP_DIR}/${latest_backup}/.env" "${SCRIPT_DIR}/.env"
        log_success "环境配置已恢复"
    fi

    log_success "回滚完成，请手动执行部署命令重新启动服务"
}

# ============================================================
# 状态检查
# ============================================================

check_status() {
    log_info "检查服务状态..."

    echo ""
    echo "============================================================"
    echo "  Docker 容器状态"
    echo "============================================================"
    docker-compose ps

    echo ""
    echo "============================================================"
    echo "  资源使用情况"
    echo "============================================================"
    docker system df

    echo ""
    echo "============================================================"
    echo "  服务健康检查"
    echo "============================================================"

    # 检查 MySQL
    if docker-compose exec -T mysql mysqladmin ping -uroot -p"${MYSQL_ROOT_PASSWORD}" --silent 2>/dev/null; then
        echo "✅ MySQL: 运行正常"
    else
        echo "❌ MySQL: 异常"
    fi

    # 检查 Redis
    if docker-compose exec -T redis redis-cli ping 2>/dev/null | grep -q PONG; then
        echo "✅ Redis: 运行正常"
    else
        echo "❌ Redis: 异常"
    fi

    # 检查后端
    local backend_status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/api/health 2>/dev/null || echo "000")
    if [ "$backend_status" == "200" ]; then
        echo "✅ 后端服务: 运行正常"
    else
        echo "❌ 后端服务: 异常 (HTTP $backend_status)"
    fi

    # 检查 Elasticsearch
    local es_status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:9200/_cluster/health 2>/dev/null || echo "000")
    if [ "$es_status" == "200" ]; then
        echo "✅ Elasticsearch: 运行正常"
    else
        echo "❌ Elasticsearch: 异常 (HTTP $es_status)"
    fi

    echo ""
    echo "============================================================"
}

# ============================================================
# 查看日志
# ============================================================

view_logs() {
    local service=$1
    local lines=${2:-100}

    if [ -z "$service" ]; then
        echo "用法: $0 logs [service] [lines]"
        echo ""
        echo "可用服务:"
        docker-compose config --services
        exit 1
    fi

    docker-compose logs --tail="$lines" -f "$service"
}

# ============================================================
# 主函数
# ============================================================

show_help() {
    cat << EOF
彩票系统部署管理脚本

用法: $0 [命令] [选项]

命令:
  deploy     部署应用（完整部署流程）
  backup     备份当前部署
  rollback   回滚到上次备份
  status     查看服务状态
  logs       查看日志 [service] [lines]
  stop       停止所有服务
  restart    重启所有服务
  update     更新部署（保留数据）
  clean      清理未使用的 Docker 资源

选项:
  -h, --help  显示此帮助信息

示例:
  $0 deploy           # 完整部署
  $0 status          # 查看状态
  $0 logs backend    # 查看后端日志
  $0 logs backend 50 # 查看后端最近50行日志
  $0 rollback        # 回滚到备份

EOF
}

main() {
    # 切换脚本所在目录
    cd "$SCRIPT_DIR"

    case "${1:-}" in
        deploy)
            pre_check
            backup
            deploy
            ;;
        backup)
            backup
            ;;
        rollback)
            rollback
            ;;
        status)
            check_status
            ;;
        logs)
            view_logs "$2" "${3:-100}"
            ;;
        stop)
            log_info "停止所有服务..."
            docker-compose down
            log_success "所有服务已停止"
            ;;
        restart)
            log_info "重启所有服务..."
            docker-compose restart
            log_success "所有服务已重启"
            ;;
        update)
            log_info "更新部署..."
            docker-compose pull
            docker-compose up -d --build
            log_success "更新完成"
            ;;
        clean)
            log_info "清理 Docker 资源..."
            docker system prune -f
            docker volume prune -f
            log_success "清理完成"
            ;;
        -h|--help|help)
            show_help
            ;;
        *)
            echo "未知命令: ${1:-}"
            echo ""
            show_help
            exit 1
            ;;
    esac
}

# 执行主函数
main "$@"
