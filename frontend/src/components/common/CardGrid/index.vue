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
                
                  <component :is="item.icon || defaultIcon" />
                
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
                  <a-dropdown v-if="actions.length > 0" trigger="click" @command="handleAction">
                    <a-button text circle @click.stop>
                      <MoreFilled />
                    </a-button>
                    <template #dropdown>
                      <a-menu>
                        <a-menu-item
                          v-for="action in visibleActions(item)"
                          :key="action.label"
                          :command="{ action, item }"
                          :divided="action.divided"
                          :disabled="action.disabled"
                        >
                          {{ action.label }}
                        </a-menu-item>
                      </a-menu>
                    </template>
                  </a-dropdown>
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
import { FileOutlined, MoreOutlined } from '@ant-design/icons-vue'
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

