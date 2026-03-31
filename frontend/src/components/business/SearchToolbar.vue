<template>
  <a-flex justify="space-between" align="center" :wrap="true" :gap="12">
    <a-flex align="center" :gap="12" :wrap="true">
      <!-- 搜索框 -->
      <a-input-search
        v-model:value="searchValue"
        :placeholder="placeholder"
        :style="{ width: searchWidth }"
        allow-clear
        @search="handleSearch"
        @change="handleInput"
      />

      <!-- 筛选器插槽 -->
      <slot name="filters" />
    </a-flex>

    <a-flex align="center" :gap="12">
      <!-- 统计信息 -->
      <slot v-if="showStats" name="stats">
        <a-typography-text type="secondary">
          {{ statsLabel }}：<a-typography-text strong>{{ total }}</a-typography-text>
        </a-typography-text>
      </slot>

      <!-- 操作按钮 -->
      <slot name="actions">
        <a-button
          v-if="showCreate"
          type="primary"
          @click="$emit('create')"
        >
          <template #icon><PlusOutlined /></template>
          {{ createText }}
        </a-button>
      </slot>

      <!-- 更多操作 -->
      <slot name="extra" />
    </a-flex>
  </a-flex>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { PlusOutlined } from '@ant-design/icons-vue'

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

const debouncedSearch = useDebounceFn(() => {
  emit('update:modelValue', searchValue.value)
  emit('search', searchValue.value)
}, props.debounce)

const handleInput = () => {
  debouncedSearch()
}

const handleSearch = (value) => {
  emit('update:modelValue', value)
  emit('search', value)
}

watch(() => props.modelValue, (val) => {
  searchValue.value = val
})
</script>

