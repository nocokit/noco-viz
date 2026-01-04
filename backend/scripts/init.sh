#!/bin/bash
# 初始化脚本

set -e

cd "$(dirname "$0")/.."

echo "=== 初始化 Noco-Viz 后端项目 ==="

# 创建虚拟环境
if [ ! -d ".venv" ]; then
    echo "创建虚拟环境..."
    python3 -m venv .venv
fi

# 激活虚拟环境
source .venv/bin/activate

# 安装依赖
echo "安装依赖..."
pip install --upgrade pip
pip install -r requirements.txt

# 创建logs目录
mkdir -p logs

# 复制环境变量文件
if [ ! -f ".env" ]; then
    echo "创建.env文件..."
    cp .env.example .env
    echo "请修改 .env 文件中的配置"
fi

echo "初始化完成！接下来请："
echo "1. 修改 .env 文件"
echo "2. 运行 scripts/migrate.sh 执行数据库迁移"
echo "3. 运行 scripts/dev.sh 启动开发服务器"
