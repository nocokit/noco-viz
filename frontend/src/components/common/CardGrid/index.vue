<template>
  <div class="card-grid" :style="gridStyle">
    <div
      v-for="(item, index) in items"
      :key="item.id || index"
      class="card-grid__item"
      :class="{ 'card-grid__item--clickable': clickable }"
      @click="handleCardClick(item)"
    >
      <slot name="card" :item="item" :index="index">
        <!-- 默认卡片布局 -->
        <div class="card-content">
          <div class="card-header">
            <slot name="header" :item="item">
              <div class="card-icon">
                <el-icon :size="40">
                  <component :is="item.icon || defaultIcon" />
                </el-icon>
              </div>
            </slot>
          </div>

          <div class="card-body">
            <slot name="body" :item="item">
              <h3 class="card-title">{{ item.name || item.title }}</h3>
              <p class="card-description">{{ item.description }}</p>
            </slot>
          </div>

          <div class="card-footer">
            <slot name="footer" :item="item">
              <div class="card-meta">
                <span v-if="item.updatedAt">{{ formatDateTime(item.updatedAt, 'YYYY-MM-DD') }}</span>
              </div>
              <div class="card-actions">
                <slot name="actions" :item="item">
                  <el-dropdown v-if="actions.length > 0" trigger="click" @command="handleAction">
                    <el-button text circle @click.stop>
                      <el-icon><MoreFilled /></el-icon>
                    </el-button>
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item
                          v-for="action in visibleActions(item)"
                          :key="action.label"
                          :command="{ action, item }"
                          :divided="action.divided"
                          :disabled="action.disabled"
                        >
                          {{ action.label }}
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </slot>
              </div>
            </slot>
          </div>
        </div>
      </slot>
    </div>

    <!-- 空状态 -->
    <div v-if="items.length === 0" class="card-grid__empty">
      <slot name="empty">
        <EmptyState :description="emptyText" />
      </slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Document, MoreFilled } from '@element-plus/icons-vue'
import { formatDateTime } from '@/utils/formatters'
import EmptyState from '../EmptyState/index.vue'

const props = defineProps({
  items: {
    type: Array,
    default: () => []
  },
  columns: {
    type: Object,
    default: () => ({ xs: 1, sm: 2, md: 3, lg: 4 })
  },
  gap: {
    type: [String, Number],
    default: 20
  },
  minWidth: {
    type: [String, Number],
    default: 280
  },
  clickable: {
    type: Boolean,
    default: true
  },
  actions: {
    type: Array,
    default: () => []
  },
  defaultIcon: {
    type: Object,
    default: () => Document
  },
  emptyText: {
    type: String,
    default: '暂无数据'
  }
})

const emit = defineEmits(['card-click', 'action'])

const gridStyle = computed(() => {
  const gap = typeof props.gap === 'number' ? `${props.gap}px` : props.gap
  const minWidth = typeof props.minWidth === 'number' ? `${props.minWidth}px` : props.minWidth

  return {
    gap,
    gridTemplateColumns: `repeat(auto-fill, minmax(${minWidth}, 1fr))`
  }
})

const visibleActions = (item) => {
  return props.actions.filter(action => {
    if (typeof action.visible === 'function') {
      return action.visible(item)
    }
    return action.visible !== false
  })
}

const handleCardClick = (item) => {
  if (props.clickable) {
    emit('card-click', item)
  }
}

const handleAction = ({ action, item }) => {
  if (action.handler) {
    action.handler(item)
  }
  emit('action', action.type || action.label, item)
}
</script>

<style scoped>
.card-grid {
  display: grid;
  width: 100%;
}

.card-grid__item {
  background: var(--bg-card, #1a1b1e);
  border: 1px solid var(--border, #35363a);
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.card-grid__item--clickable {
  cursor: pointer;
}

.card-grid__item--clickable:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  border-color: var(--el-color-primary);
}

.card-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 20px;
}

.card-header {
  margin-bottom: 16px;
}

.card-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  background: var(--bg-elevated, #202124);
  border-radius: 12px;
  color: var(--el-color-primary);
}

.card-body {
  flex: 1;
  margin-bottom: 16px;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary, #e8eaed);
  margin: 0 0 8px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-description {
  font-size: 14px;
  color: var(--text-secondary, #9aa0a6);
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.5;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid var(--border, #35363a);
}

.card-meta {
  font-size: 12px;
  color: var(--text-tertiary, #5f6368);
}

.card-actions {
  display: flex;
  gap: 8px;
}

.card-grid__empty {
  grid-column: 1 / -1;
}
</style>
