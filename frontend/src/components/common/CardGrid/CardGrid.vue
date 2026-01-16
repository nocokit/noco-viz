<template>
  <div class="card-grid" v-loading="loading">
    <div class="grid-container" :style="gridStyle">
      <!-- 新建卡片 -->
      <div
        v-if="creatable"
        class="card-item create-card"
        @click="handleCreate"
      >
        <slot name="create-card">
          <div class="create-icon">
            <el-icon><Plus /></el-icon>
          </div>
          <h3 class="create-title">{{ createButtonText }}</h3>
          <p class="create-desc">{{ createButtonDesc }}</p>
        </slot>
      </div>

      <!-- 数据卡片 -->
      <div
        v-for="(item, index) in items"
        :key="item[itemKey] || index"
        :class="['card-item', { selected: isSelected(item), error: item[errorField] }]"
        @click="handleCardClick(item)"
      >
        <slot name="card" :item="item" :index="index">
          <!-- 默认卡片布局 -->
          <div class="card-header">
            <el-tag v-if="item.type" :type="getTagType(item.type)">
              {{ item.type }}
            </el-tag>
            <div class="card-actions">
              <el-button
                v-if="editable"
                link
                type="primary"
                size="small"
                @click.stop="handleEdit(item)"
              >
                编辑
              </el-button>
              <el-button
                v-if="deletable"
                link
                type="danger"
                size="small"
                @click.stop="handleDelete(item)"
              >
                删除
              </el-button>
            </div>
          </div>

          <h3 class="card-title">{{ item[titleField] }}</h3>
          <p class="card-desc">{{ item[descField] }}</p>

          <div class="card-footer">
            <slot name="card-footer" :item="item"></slot>
          </div>
        </slot>
      </div>
    </div>

    <!-- 空状态 -->
    <el-empty
      v-if="items.length === 0"
      :description="emptyText"
      :image-size="120"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Plus } from '@element-plus/icons-vue'

const props = defineProps({
  // 数据列表
  items: {
    type: Array,
    default: () => []
  },
  // 加载状态
  loading: {
    type: Boolean,
    default: false
  },
  // 唯一键字段
  itemKey: {
    type: String,
    default: 'id'
  },
  // 标题字段
  titleField: {
    type: String,
    default: 'name'
  },
  // 描述字段
  descField: {
    type: String,
    default: 'description'
  },
  // 错误状态字段
  errorField: {
    type: String,
    default: 'error'
  },
  // 网格列数
  columns: {
    type: [Number, String],
    default: 'auto'
  },
  // 最小列宽
  minColumnWidth: {
    type: String,
    default: '280px'
  },
  // 间距
  gap: {
    type: String,
    default: '20px'
  },
  // 是否可创建
  creatable: {
    type: Boolean,
    default: true
  },
  // 创建按钮文字
  createButtonText: {
    type: String,
    default: '新建'
  },
  // 创建按钮描述
  createButtonDesc: {
    type: String,
    default: '点击创建'
  },
  // 是否可编辑
  editable: {
    type: Boolean,
    default: true
  },
  // 是否可删除
  deletable: {
    type: Boolean,
    default: true
  },
  // 是否可选择
  selectable: {
    type: Boolean,
    default: false
  },
  // 已选中项
  selectedItems: {
    type: Array,
    default: () => []
  },
  // 空状态文本
  emptyText: {
    type: String,
    default: '暂无数据'
  }
})

const emit = defineEmits([
  'create',
  'edit',
  'delete',
  'card-click',
  'selection-change'
])

// 计算属性
const gridStyle = computed(() => {
  if (typeof props.columns === 'number') {
    return {
      display: 'grid',
      gridTemplateColumns: `repeat(${props.columns}, 1fr)`,
      gap: props.gap
    }
  }
  return {
    display: 'grid',
    gridTemplateColumns: `repeat(auto-fill, minmax(${props.minColumnWidth}, 1fr))`,
    gap: props.gap
  }
})

// 方法
const handleCreate = () => {
  emit('create')
}

const handleEdit = (item) => {
  emit('edit', item)
}

const handleDelete = (item) => {
  emit('delete', item)
}

const handleCardClick = (item) => {
  if (props.selectable) {
    toggleSelection(item)
  }
  emit('card-click', item)
}

const isSelected = (item) => {
  return props.selectedItems.some(
    selected => selected[props.itemKey] === item[props.itemKey]
  )
}

const toggleSelection = (item) => {
  const newSelection = isSelected(item)
    ? props.selectedItems.filter(
        selected => selected[props.itemKey] !== item[props.itemKey]
      )
    : [...props.selectedItems, item]

  emit('selection-change', newSelection)
}

const getTagType = (type) => {
  const typeMap = {
    sql: 'primary',
    api: 'warning',
    excel: 'success',
    json: ''
  }
  return typeMap[type] || ''
}
</script>

<style scoped lang="scss">
.card-grid {
  width: 100%;
  min-height: 200px;

  .grid-container {
    margin-bottom: 20px;
  }

  .card-item {
    background: #181b21;
    border: 1px solid #2a2e35;
    border-radius: 8px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    min-height: 160px;
    transition: all 0.2s;
    cursor: pointer;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
      background: #22262e;
      border-color: #444;
    }

    &.selected {
      border-color: #409eff;
      background: rgba(64, 158, 255, 0.1);
    }

    &.error {
      border-color: rgba(239, 68, 68, 0.4);
      background: linear-gradient(180deg, rgba(239, 68, 68, 0.05) 0%, #181b21 40%);

      &:hover {
        border-color: #ef4444;
        box-shadow: 0 10px 25px -5px rgba(239, 68, 68, 0.15);
      }
    }
  }

  .create-card {
    border: 1px dashed #444;
    background: transparent;
    justify-content: center;
    align-items: center;

    &:hover {
      border-color: #f59e0b;
      background: rgba(245, 158, 11, 0.05);

      .create-icon {
        color: #f59e0b;
        transform: scale(1.1);
      }
    }
  }

  .create-icon {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: #1e293b;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #788595;
    font-size: 24px;
    transition: all 0.2s;
    margin-bottom: 12px;
  }

  .create-title {
    color: #fff;
    font-size: 14px;
    font-weight: 500;
    margin: 0 0 4px 0;
  }

  .create-desc {
    font-size: 12px;
    color: #64748b;
    margin: 0;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 8px;
    gap: 8px;
  }

  .card-actions {
    display: flex;
    gap: 4px;
    opacity: 0;
    transition: opacity 0.2s;
  }

  .card-item:hover .card-actions {
    opacity: 1;
  }

  .card-title {
    font-size: 14px;
    font-weight: 600;
    color: #fff;
    margin: 0 0 6px 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .card-desc {
    font-size: 11px;
    color: #94a3b8;
    line-height: 1.5;
    margin: 0 0 16px 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    min-height: 33px;
  }

  .card-footer {
    margin-top: auto;
    padding-top: 12px;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
  }
}
</style>
