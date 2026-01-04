#!/bin/bash
# 开发环境启动脚本

set -e

cd "$(dirname "$0")/.."

echo "=== 启动 Noco-Viz 后端开发服务器 ==="

# 检查虚拟环境
if [ ! -d ".venv" ]; then
    echo "错误: 虚拟环境不存在，请先运行 scripts/init.sh"
    exit 1
fi

# 激活虚拟环境
source .venv/bin/activate

# 运行开发服务器
python manage.py runserver 0.0.0.0:8000
