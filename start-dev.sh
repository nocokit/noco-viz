#!/bin/bash

# NocoViz 开发环境快速启动脚本

echo "=========================================="
echo "  NocoViz 开发环境启动"
echo "=========================================="
echo ""

# 检查是否在项目根目录
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "❌ 错误: 请在项目根目录执行此脚本"
    exit 1
fi

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}📋 启动选项:${NC}"
echo "  1. 启动后端服务（Django）"
echo "  2. 启动前端服务（Vite）"
echo "  3. 同时启动前后端"
echo "  4. 初始化项目（首次运行）"
echo ""

read -p "请选择 [1-4]: " choice

case $choice in
    1)
        echo -e "${GREEN}🚀 启动后端服务...${NC}"
        cd backend
        python manage.py runserver
        ;;
    2)
        echo -e "${GREEN}🚀 启动前端服务...${NC}"
        cd frontend
        npm run dev
        ;;
    3)
        echo -e "${GREEN}🚀 同时启动前后端服务...${NC}"
        echo ""

        # 启动后端
        echo -e "${YELLOW}启动后端服务 (Django)...${NC}"
        cd backend
        python manage.py runserver &
        BACKEND_PID=$!
        cd ..

        # 等待后端启动
        sleep 3

        # 启动前端
        echo -e "${YELLOW}启动前端服务 (Vite)...${NC}"
        cd frontend
        npm run dev &
        FRONTEND_PID=$!
        cd ..

        echo ""
        echo -e "${GREEN}✅ 服务已启动!${NC}"
        echo "  - 后端: http://localhost:8000"
        echo "  - 前端: http://localhost:5173"
        echo "  - 登录页: http://localhost:5173/login"
        echo ""
        echo "按 Ctrl+C 停止所有服务"

        # 等待用户中断
        trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
        wait
        ;;
    4)
        echo -e "${GREEN}🔧 初始化项目...${NC}"
        echo ""

        # 后端初始化
        echo -e "${YELLOW}[1/4] 安装后端依赖...${NC}"
        cd backend
        pip install -r requirements.txt

        echo -e "${YELLOW}[2/4] 运行数据库迁移...${NC}"
        python manage.py migrate

        echo -e "${YELLOW}[3/4] 创建超级用户 (可跳过)...${NC}"
        python manage.py createsuperuser || echo "跳过创建超级用户"
        cd ..

        # 前端初始化
        echo -e "${YELLOW}[4/4] 安装前端依赖...${NC}"
        cd frontend
        npm install
        cd ..

        echo ""
        echo -e "${GREEN}✅ 项目初始化完成!${NC}"
        echo "现在可以选择选项 3 启动服务"
        ;;
    *)
        echo -e "${RED}❌ 无效选项${NC}"
        exit 1
        ;;
esac
