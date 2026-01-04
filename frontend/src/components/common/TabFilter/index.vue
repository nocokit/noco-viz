<template>
  <div class="tab-filter">
    <div
      v-for="tab in tabs"
      :key="tab.key || tab.value"
      :class="['tab-filter__item', { 'tab-filter__item--active': isActive(tab) }]"
      @click="handleTabClick(tab)"
    >
      <span class="tab-filter__label">{{ tab.label }}</span>
      <span v-if="showCount && tab.count !== undefined" class="tab-filter__count">
        ({{ tab.count }})
      </span>
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
  tabs: {
    type: Array,
    required: true
  },
  showCount: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const isActive = (tab) => {
  const value = tab.key || tab.value
  return value === props.modelValue
}

const handleTabClick = (tab) => {
  const value = tab.key || tab.value
  if (value !== props.modelValue) {
    emit('update:modelValue', value)
    emit('change', value, tab)
  }
}
</script>

<style scoped>
.tab-filter {
  display: flex;
  gap: 24px;
  padding: 0 24px;
  border-bottom: 2px solid var(--border, #35363a);
  background: var(--bg-card, #1a1b1e);
}

.tab-filter__item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 12px 0;
  font-size: 14px;
  color: var(--text-secondary, #9aa0a6);
  cursor: pointer;
  transition: color 0.3s;
  user-select: none;
}

.tab-filter__item:hover {
  color: var(--text-primary, #e8eaed);
}

.tab-filter__item--active {
  color: var(--el-color-primary);
  font-weight: 500;
}

.tab-filter__item--active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--el-color-primary);
  transition: all 0.3s;
}

.tab-filter__label {
  white-space: nowrap;
}

.tab-filter__count {
  font-size: 12px;
  opacity: 0.8;
}

@media (max-width: 768px) {
  .tab-filter {
    gap: 16px;
    padding: 0 16px;
    overflow-x: auto;
  }

  .tab-filter__item {
    font-size: 13px;
  }
}
</style>
