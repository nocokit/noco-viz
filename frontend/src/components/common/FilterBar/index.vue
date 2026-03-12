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
        
          <component :is="filter.icon" />
        

        <span class="filter-bar__label">{{ filter.label }}</span>

        <span v-if="showCount && filter.count !== undefined" class="filter-bar__count">
          {{ formatCount(filter.count) }}
        </span>

        <a-tag
          v-if="filter.badge"
          :type="filter.badgeType || 'info'"
          size="small"
          class="filter-bar__badge"
        >
          {{ filter.badge }}
        </a-tag>
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

