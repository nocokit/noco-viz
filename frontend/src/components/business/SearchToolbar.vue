<template>
  <div class="search-toolbar">
    <div class="toolbar-left">
      <!-- 搜索框 -->
      <el-input
        v-model="searchValue"
        :placeholder="placeholder"
        :style="{ width: searchWidth }"
        clearable
        @input="handleSearch"
        @clear="handleClear"
      >
        <template #prefix><el-icon><Search /></el-icon></template>
      </el-input>

      <!-- 筛选器插槽 -->
      <slot name="filters" />
    </div>

    <div class="toolbar-right">
      <!-- 统计信息 -->
      <div v-if="showStats" class="toolbar-stats">
        <slot name="stats">
          <span class="stat-item">
            <span class="stat-label">{{ statsLabel }}：</span>
            <span class="stat-value">{{ total }}</span>
          </span>
        </slot>
      </div>

      <!-- 操作按钮 -->
      <slot name="actions">
        <el-button
          v-if="showCreate"
          type="primary"
          :icon="createIcon"
          @click="$emit('create')"
        >
          {{ createText }}
        </el-button>
      </slot>

      <!-- 更多操作 -->
      <slot name="extra" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'

const props = defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: '搜索...' },
  searchWidth: { type: String, default: '300px' },
  debounce: { type: Number, default: 300 },
  showStats: { type: Boolean, default: false },
  statsLabel: { type: String, default: '总数' },
  total: { type: Number, default: 0 },
  showCreate: { type: Boolean, default: false },
  createText: { type: String, default: '新建' },
  createIcon: { type: String, default: 'Plus' }
})

const emit = defineEmits(['update:modelValue', 'search', 'clear', 'create'])

const searchValue = ref(props.modelValue)

const handleSearch = useDebounceFn(() => {
  emit('update:modelValue', searchValue.value)
  emit('search', searchValue.value)
}, props.debounce)

const handleClear = () => {
  searchValue.value = ''
  emit('update:modelValue', '')
  emit('clear')
}

watch(() => props.modelValue, (val) => {
  searchValue.value = val
})
</script>

<style scoped>
.search-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px;
  background: var(--el-bg-color);
  border-radius: 8px;
  margin-bottom: 16px;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.toolbar-stats {
  display: flex;
  gap: 16px;
  padding: 0 16px;
  border-left: 1px solid var(--el-border-color);
}

.stat-item {
  font-size: 14px;
}

.stat-label {
  color: var(--el-text-color-secondary);
}

.stat-value {
  color: var(--el-color-primary);
  font-weight: 500;
  margin-left: 4px;
}
</style>
