#!/bin/bash

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Noco-Space 一键启动脚本${NC}"
echo -e "${GREEN}========================================${NC}"

# 获取脚本所在目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR/backend-node"
FRONTEND_DIR="$SCRIPT_DIR/frontend"

# 检查目录是否存在
if [ ! -d "$BACKEND_DIR" ]; then
    echo -e "${RED}错误: 后端目录不存在 $BACKEND_DIR${NC}"
    exit 1
fi

if [ ! -d "$FRONTEND_DIR" ]; then
    echo -e "${RED}错误: 前端目录不存在 $FRONTEND_DIR${NC}"
    exit 1
fi

# 清理函数
cleanup() {
    echo -e "\n${YELLOW}正在停止服务...${NC}"
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null
    fi
    exit 0
}

# 捕获 Ctrl+C
trap cleanup SIGINT SIGTERM

# 检查并清理端口占用
echo -e "\n${YELLOW}检查端口占用...${NC}"
if lsof -ti:8000 >/dev/null 2>&1; then
    echo -e "${YELLOW}端口 8000 被占用，正在清理...${NC}"
    lsof -ti:8000 | xargs kill -9 2>/dev/null
    sleep 1
fi

if lsof -ti:5173 >/dev/null 2>&1; then
    echo -e "${YELLOW}端口 5173 被占用，正在清理...${NC}"
    lsof -ti:5173 | xargs kill -9 2>/dev/null
    sleep 1
fi

# 启动后端
echo -e "\n${YELLOW}[1/2] 启动后端服务...${NC}"
cd "$BACKEND_DIR"
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}检测到后端依赖未安装，正在安装...${NC}"
    npm install
fi

npm run start:dev > /tmp/noco-backend.log 2>&1 &
BACKEND_PID=$!
echo -e "${GREEN}✓ 后端服务已启动 (PID: $BACKEND_PID)${NC}"
echo -e "${GREEN}  日志文件: /tmp/noco-backend.log${NC}"

# 启动前端
echo -e "\n${YELLOW}[2/2] 启动前端服务...${NC}"
cd "$FRONTEND_DIR"
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}检测到前端依赖未安装，正在安装...${NC}"
    npm install
fi

npm run dev > /tmp/noco-frontend.log 2>&1 &
FRONTEND_PID=$!
echo -e "${GREEN}✓ 前端服务已启动 (PID: $FRONTEND_PID)${NC}"
echo -e "${GREEN}  日志文件: /tmp/noco-frontend.log${NC}"

# 等待服务启动
echo -e "\n${YELLOW}等待服务启动...${NC}"
sleep 3

# 显示服务状态
echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}  服务启动成功！${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}后端服务: http://localhost:8000${NC}"
echo -e "${GREEN}前端服务: http://localhost:5173${NC}"
echo -e "${GREEN}API文档:  http://localhost:8000/api${NC}"
echo -e "\n${YELLOW}按 Ctrl+C 停止所有服务${NC}"
echo -e "${GREEN}========================================${NC}\n"

# 实时显示日志
tail -f /tmp/noco-backend.log /tmp/noco-frontend.log
