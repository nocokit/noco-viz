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
            <Plus />
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
            <a-tag v-if="item.type" :type="getTagType(item.type)">
              {{ item.type }}
            </a-tag>
            <div class="card-actions">
              <a-button
                v-if="editable"
                link
                type="primary"
                size="small"
                @click.stop="handleEdit(item)"
              >
                编辑
              </a-button>
              <a-button
                v-if="deletable"
                link
                type="danger"
                size="small"
                @click.stop="handleDelete(item)"
              >
                删除
              </a-button>
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
    <a-empty
      v-if="items.length === 0"
      :description="emptyText"
      :image-size="120"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'

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

