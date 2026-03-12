#!/bin/bash

# 批量替换 console 语句为 logger
# 使用方法: bash scripts/replace-console.sh

echo "开始替换 console 语句..."

# 需要排除的文件
EXCLUDE_FILES=(
  "src/utils/logger.js"
  "src/utils/error-handler.js"
)

# 查找所有 .js 和 .vue 文件
find src -type f \( -name "*.js" -o -name "*.vue" \) | while read file; do
  # 检查是否在排除列表中
  skip=false
  for exclude in "${EXCLUDE_FILES[@]}"; do
    if [[ "$file" == *"$exclude"* ]]; then
      skip=true
      break
    fi
  done

  if [ "$skip" = true ]; then
    continue
  fi

  # 检查文件是否包含 console.log/warn/error/info/debug
  if grep -q "console\.\(log\|warn\|error\|info\|debug\)" "$file"; then
    echo "处理文件: $file"

    # 检查文件是否已经导入 logger
    if ! grep -q "import.*logger.*from.*utils/logger" "$file" && \
       ! grep -q "import.*logger.*from.*@/utils/logger" "$file"; then

      # 检查文件类型
      if [[ "$file" == *.vue ]]; then
        # Vue 文件 - 在 <script> 标签后添加导入
        if grep -q "<script setup>" "$file"; then
          sed -i '' '/<script setup>/a\
import logger from '\''@/utils/logger'\''
' "$file"
        elif grep -q "<script>" "$file"; then
          sed -i '' '/<script>/a\
import logger from '\''@/utils/logger'\''
' "$file"
        fi
      else
        # JS 文件 - 在文件开头添加导入
        sed -i '' '1i\
import logger from '\''@/utils/logger'\''\
' "$file"
      fi
    fi

    # 替换 console 语句
    sed -i '' 's/console\.log/logger.log/g' "$file"
    sed -i '' 's/console\.warn/logger.warn/g' "$file"
    sed -i '' 's/console\.error/logger.error/g' "$file"
    sed -i '' 's/console\.info/logger.info/g' "$file"
    sed -i '' 's/console\.debug/logger.debug/g' "$file"
  fi
done

echo "替换完成!"
echo "请检查代码并测试功能是否正常"
