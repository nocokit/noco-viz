#!/bin/bash

# ============================================
# NocoViz 一键部署脚本
# 用途: 快速部署到生产服务器
# ============================================

set -e

# 配置变量
PROJECT_NAME="noco-viz"
DEPLOY_USER="www-data"
DEPLOY_PATH="/var/www/${PROJECT_NAME}"
BACKUP_PATH="${DEPLOY_PATH}/backups"
LOG_PATH="${DEPLOY_PATH}/logs"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查是否为root用户
check_root() {
    if [ "$EUID" -ne 0 ]; then
        log_error "请使用 root 用户或 sudo 运行此脚本"
        exit 1
    fi
}

# 创建必要的目录
create_directories() {
    log_info "创建部署目录..."
    mkdir -p ${DEPLOY_PATH}/{backend,frontend,uploads,logs}
    mkdir -p ${BACKUP_PATH}
    chown -R ${DEPLOY_USER}:${DEPLOY_USER} ${DEPLOY_PATH}
}

# 备份数据库
backup_database() {
    log_info "备份数据库..."
    BACKUP_FILE="${BACKUP_PATH}/noco_viz_db_$(date +%Y%m%d_%H%M%S).sql"
    mysqldump -uroot -p noco_viz_db > ${BACKUP_FILE}
    gzip ${BACKUP_FILE}
    log_info "数据库备份完成: ${BACKUP_FILE}.gz"
}

# 部署后端
deploy_backend() {
    log_info "部署后端..."

    # 停止后端服务
    pm2 stop noco-viz-backend || true

    # 复制代码
    cp -r backend-node/* ${DEPLOY_PATH}/backend/
    cd ${DEPLOY_PATH}/backend

    # 安装依赖
    npm install --production

    # 构建
    npm run build

    # 启动服务
    pm2 start dist/main.js --name noco-viz-backend --max-memory-restart 500M
    pm2 save

    log_info "后端部署完成"
}

# 部署前端
deploy_frontend() {
    log_info "部署前端..."

    # 构建前端
    cd frontend
    npm install
    npm run build

    # 复制构建产物
    rm -rf ${DEPLOY_PATH}/frontend/*
    cp -r dist/* ${DEPLOY_PATH}/frontend/

    # 设置权限
    chown -R ${DEPLOY_USER}:${DEPLOY_USER} ${DEPLOY_PATH}/frontend

    log_info "前端部署完成"
}

# 更新数据库
update_database() {
    log_info "更新数据库..."
    mysql -uroot -p noco_viz_db < database/migration.sql
    log_info "数据库更新完成"
}

# 配置Nginx
configure_nginx() {
    log_info "配置 Nginx..."

    cat > /etc/nginx/sites-available/${PROJECT_NAME} <<'EOF'
server {
    listen 80;
    server_name your-domain.com;

    # 前端静态文件
    location / {
        root /var/www/noco-viz/frontend;
        try_files $uri $uri/ /index.html;

        # 缓存静态资源
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # 后端API代理
    location /api {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;

        # 超时设置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # 上传文件
    location /uploads {
        alias /var/www/noco-viz/uploads;
        expires 1y;
        add_header Cache-Control "public";
    }

    # Gzip压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json application/xml+rss;
}
EOF

    # 启用站点
    ln -sf /etc/nginx/sites-available/${PROJECT_NAME} /etc/nginx/sites-enabled/

    # 测试配置
    nginx -t

    # 重启Nginx
    systemctl reload nginx

    log_info "Nginx 配置完成"
}

# 主函数
main() {
    log_info "开始部署 ${PROJECT_NAME}..."

    check_root

    # 询问是否备份数据库
    read -p "是否备份数据库? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        backup_database
    fi

    create_directories

    # 询问是否更新数据库
    read -p "是否更新数据库? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        update_database
    fi

    deploy_backend
    deploy_frontend

    # 询问是否配置Nginx
    read -p "是否配置 Nginx? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        configure_nginx
    fi

    log_info "部署完成！"
    log_info "后端服务: http://localhost:8000"
    log_info "前端服务: http://your-domain.com"
    log_info ""
    log_info "查看后端日志: pm2 logs noco-viz-backend"
    log_info "查看Nginx日志: tail -f /var/log/nginx/access.log"
}

# 执行主函数
main "$@"
