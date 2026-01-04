#!/bin/bash
# 前端开发环境启动脚本

set -e

cd "$(dirname "$0")/.."

echo "=== 启动 Noco-Viz 前端开发服务器 ==="

# 检查node_modules
if [ ! -d "node_modules" ]; then
    echo "错误: 依赖未安装，请先运行: pnpm install"
    exit 1
fi

# 启动开发服务器
pnpm dev
