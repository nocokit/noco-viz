#!/bin/bash
# 数据库迁移脚本

set -e

cd "$(dirname "$0")/.."

echo "=== 执行数据库迁移 ==="

# 检查虚拟环境
if [ ! -d ".venv" ]; then
    echo "错误: 虚拟环境不存在，请先运行 scripts/init.sh"
    exit 1
fi

# 激活虚拟环境
source .venv/bin/activate

# 生成迁移文件
echo "生成迁移文件..."
python manage.py makemigrations

# 执行迁移
echo "执行迁移..."
python manage.py migrate

echo "迁移完成！"
