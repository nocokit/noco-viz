<template>
  <div :class="['filter-bar', `filter-bar--${style}`]">
    <div class="filter-bar__main">
      <div
        v-for="filter in filters"
        :key="filter.id || filter.value"
        :class="[
          'filter-bar__item',
          {
            'filter-bar__item--active': isActive(filter),
            'filter-bar__item--disabled': filter.disabled
          }
        ]"
        @click="handleFilterClick(filter)"
      >
        <el-icon v-if="filter.icon" class="filter-bar__icon">
          <component :is="filter.icon" />
        </el-icon>

        <span class="filter-bar__label">{{ filter.label }}</span>

        <span v-if="showCount && filter.count !== undefined" class="filter-bar__count">
          {{ formatCount(filter.count) }}
        </span>

        <el-tag
          v-if="filter.badge"
          :type="filter.badgeType || 'info'"
          size="small"
          class="filter-bar__badge"
        >
          {{ filter.badge }}
        </el-tag>
      </div>
    </div>

    <!-- 右侧额外内容 -->
    <div v-if="$slots.extra" class="filter-bar__extra">
      <slot name="extra"></slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    required: true
  },
  filters: {
    type: Array,
    required: true,
    validator: (filters) => {
      return filters.every(f => f.label && (f.id || f.value !== undefined))
    }
  },
  showCount: {
    type: Boolean,
    default: true
  },
  style: {
    type: String,
    default: 'tabs', // 'tabs' | 'pills' | 'buttons'
    validator: (value) => ['tabs', 'pills', 'buttons'].includes(value)
  },
  countFormat: {
    type: Function,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const isActive = (filter) => {
  const value = filter.id || filter.value
  return value === props.modelValue
}

const handleFilterClick = (filter) => {
  if (filter.disabled) return

  const value = filter.id || filter.value
  if (value !== props.modelValue) {
    emit('update:modelValue', value)
    emit('change', value, filter)
  }
}

const formatCount = (count) => {
  if (props.countFormat) {
    return props.countFormat(count)
  }
  // 默认格式化：大于9999显示 9999+
  if (count > 9999) return '9999+'
  return `(${count})`
}
</script>

<style scoped>
.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--bg-card, #1a1b1e);
}

.filter-bar__main {
  display: flex;
  flex: 1;
  min-width: 0;
}

.filter-bar__extra {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: 24px;
}

/* Tabs 风格 */
.filter-bar--tabs {
  border-bottom: 2px solid var(--border, #35363a);
}

.filter-bar--tabs .filter-bar__main {
  gap: 24px;
  padding: 0 24px;
}

.filter-bar--tabs .filter-bar__item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 12px 0;
  font-size: 14px;
  color: var(--text-secondary, #9aa0a6);
  cursor: pointer;
  transition: color 0.3s;
  user-select: none;
  white-space: nowrap;
}

.filter-bar--tabs .filter-bar__item:hover:not(.filter-bar__item--disabled) {
  color: var(--text-primary, #e8eaed);
}

.filter-bar--tabs .filter-bar__item--active {
  color: var(--el-color-primary);
  font-weight: 500;
}

.filter-bar--tabs .filter-bar__item--active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--el-color-primary);
  transition: all 0.3s;
}

/* Pills 风格 */
.filter-bar--pills {
  padding: 12px 24px;
}

.filter-bar--pills .filter-bar__main {
  gap: 12px;
}

.filter-bar--pills .filter-bar__item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  font-size: 14px;
  color: var(--text-secondary, #9aa0a6);
  background: transparent;
  border: 1px solid var(--border, #35363a);
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
  user-select: none;
  white-space: nowrap;
}

.filter-bar--pills .filter-bar__item:hover:not(.filter-bar__item--disabled) {
  color: var(--text-primary, #e8eaed);
  border-color: var(--el-color-primary);
}

.filter-bar--pills .filter-bar__item--active {
  color: #fff;
  background: var(--el-color-primary);
  border-color: var(--el-color-primary);
}

/* Buttons 风格 */
.filter-bar--buttons {
  padding: 12px 24px;
}

.filter-bar--buttons .filter-bar__main {
  gap: 8px;
}

.filter-bar--buttons .filter-bar__item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  font-size: 14px;
  color: var(--text-secondary, #9aa0a6);
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  user-select: none;
  white-space: nowrap;
}

.filter-bar--buttons .filter-bar__item:hover:not(.filter-bar__item--disabled) {
  color: var(--text-primary, #e8eaed);
  background: rgba(255, 255, 255, 0.08);
}

.filter-bar--buttons .filter-bar__item--active {
  color: var(--el-color-primary);
  background: var(--el-color-primary-light-9);
  font-weight: 500;
}

/* 通用样式 */
.filter-bar__item--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.filter-bar__icon {
  font-size: 16px;
}

.filter-bar__label {
  white-space: nowrap;
}

.filter-bar__count {
  font-size: 12px;
  opacity: 0.8;
}

.filter-bar__badge {
  margin-left: 4px;
}

@media (max-width: 768px) {
  .filter-bar--tabs .filter-bar__main,
  .filter-bar--pills,
  .filter-bar--buttons {
    padding: 0 16px;
    overflow-x: auto;
    scrollbar-width: none;
  }

  .filter-bar--tabs .filter-bar__main::-webkit-scrollbar,
  .filter-bar--pills::-webkit-scrollbar,
  .filter-bar--buttons::-webkit-scrollbar {
    display: none;
  }

  .filter-bar__item {
    font-size: 13px;
  }

  .filter-bar__extra {
    margin-left: 12px;
  }
}
</style>
