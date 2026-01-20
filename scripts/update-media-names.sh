#!/bin/bash

# 批量更新媒体文件名称为中文

API_BASE_URL="http://localhost:8000/api"

# 文件名到中文名称的映射
declare -A NAME_MAPPING=(
  ["template-business-dashboard.jpg"]="商业仪表盘"
  ["template-factory-monitoring.jpg"]="工厂监控"
  ["template-security-monitoring.jpg"]="安全监控"
  ["template-supply-chain.jpg"]="供应链监控"
  ["template-hr-dashboard.jpg"]="人力资源看板"
  ["template-customer-service.jpg"]="客户服务分析"
  ["template-sales-weekly.jpg"]="销售周报"
  ["template-minimal-charts.jpg"]="极简数据图表"
  ["template-dev-efficiency.jpg"]="研发效能看板"
  ["template-marketing-monitor.jpg"]="营销活动监控"
  ["template-finance-monthly.jpg"]="财务月度汇总"
)

echo "开始更新媒体文件名称..."
echo ""

# 1. 登录获取token
echo "正在登录..."
TOKEN=$(curl -s -X POST "$API_BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' | \
  python3 -c "import sys, json; print(json.load(sys.stdin)['access_token'])")

if [ -z "$TOKEN" ]; then
  echo "✗ 登录失败"
  exit 1
fi
echo "✓ 登录成功"
echo ""

# 2. 获取媒体列表并更新
echo "正在获取媒体列表并更新..."
echo ""

SUCCESS_COUNT=0
SKIP_COUNT=0

# 获取媒体列表
MEDIA_LIST=$(curl -s "$API_BASE_URL/media" \
  -H "Authorization: Bearer $TOKEN")

# 遍历每个媒体文件
echo "$MEDIA_LIST" | python3 -c "
import sys, json

data = json.load(sys.stdin)
for item in data['data']:
    print(f\"{item['id']}|{item['name']}\")
" | while IFS='|' read -r ID NAME; do
  # 查找对应的中文名称
  CHINESE_NAME="${NAME_MAPPING[$NAME]}"

  if [ -n "$CHINESE_NAME" ]; then
    echo "更新: $NAME -> $CHINESE_NAME"

    # 更新媒体名称
    RESPONSE=$(curl -s -X PATCH "$API_BASE_URL/media/$ID" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d "{\"name\":\"$CHINESE_NAME\"}")

    if [ $? -eq 0 ]; then
      echo "  ✓ 更新成功 (ID: $ID)"
      ((SUCCESS_COUNT++))
    else
      echo "  ✗ 更新失败 (ID: $ID)"
    fi
  else
    echo "跳过: $NAME (未找到对应的中文名称)"
    ((SKIP_COUNT++))
  fi
  echo ""
done

echo "====================================="
echo "更新完成!"
echo "====================================="
