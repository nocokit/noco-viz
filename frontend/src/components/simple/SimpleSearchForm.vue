<template>
  <div class="simple-search-form">
    <div class="search-fields">
      <!-- 搜索字段 -->
      <div
        v-for="field in config.fields"
        :key="field.key"
        class="search-field"
      >
        <!-- 文本输入 -->
        <input
          v-if="field.type === 'text' || !field.type"
          type="text"
          class="search-input"
          :placeholder="field.placeholder || field.label"
          :value="searchData[field.key]"
          @input="handleInput(field.key, $event.target.value)"
        >

        <!-- 下拉选择 -->
        <select
          v-else-if="field.type === 'select'"
          class="search-select"
          :value="searchData[field.key]"
          @change="handleInput(field.key, $event.target.value)"
        >
          <option value="">{{ field.placeholder || `全部${field.label}` }}</option>
          <option
            v-for="option in field.options"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>

        <!-- 日期选择 -->
        <input
          v-else-if="field.type === 'date'"
          type="date"
          class="search-input"
          :value="searchData[field.key]"
          @input="handleInput(field.key, $event.target.value)"
        >
      </div>
    </div>

    <div class="search-actions">
      <button class="btn btn-primary" @click="handleSearch">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
        </svg>
        搜索
      </button>
      <button class="btn" @click="handleReset">
        重置
      </button>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const props = defineProps({
  // 搜索配置
  config: {
    type: Object,
    required: true,
    // 配置示例：
    // {
    //   fields: [
    //     { key: 'keyword', label: '关键词', type: 'text', placeholder: '搜索IP或备注' },
    //     { key: 'type', label: '类型', type: 'select', options: [
    //       { label: '单IP', value: 'single' },
    //       { label: 'CIDR', value: 'cidr' }
    //     ]},
    //     { key: 'date', label: '日期', type: 'date' }
    //   ]
    // }
  }
})

const emit = defineEmits(['search', 'reset'])

// 搜索数据
const searchData = reactive({})

// 初始化搜索数据
const initSearchData = () => {
  props.config.fields?.forEach(field => {
    searchData[field.key] = ''
  })
}

initSearchData()

// 处理输入
const handleInput = (key, value) => {
  searchData[key] = value
}

// 处理搜索
const handleSearch = () => {
  emit('search', { ...searchData })
}

// 处理重置
const handleReset = () => {
  props.config.fields?.forEach(field => {
    searchData[field.key] = ''
  })
  emit('reset')
}
</script>

<style scoped>
.simple-search-form {
  display: flex;
  gap: 16px;
  align-items: flex-end;
  padding: 16px;
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
  margin-bottom: 0px;
}

.search-fields {
  flex: 1;
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.search-field {
  width: 260px;
}

.search-input,
.search-select {
  width: 100%;
  height: 32px;
  padding: 0 12px;
  background: var(--el-fill-color-blank);
  border: 1px solid var(--el-border-color);
  border-radius: 6px;
  color: var(--el-text-color-primary);
  font-size: 13px;
}

.search-input::placeholder {
  color: var(--el-text-color-placeholder);
}

.search-input:focus,
.search-select:focus {
  outline: none;
  border-color: var(--el-color-primary);
}

.search-select {
  cursor: pointer;
}

.search-actions {
  display: flex;
  gap: 8px;
}

.btn {
  height: 32px;
  padding: 0 14px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  border: 1px solid var(--el-border-color);
  background: var(--el-bg-color);
  color: var(--el-text-color-regular);
  transition: 0.2s;
  white-space: nowrap;
}

.btn:hover {
  border-color: var(--el-color-primary);
  color: var(--el-color-primary);
}

.btn-primary {
  background: var(--el-color-primary);
  border-color: var(--el-color-primary);
  color: #fff;
}

.btn-primary:hover {
  background: var(--el-color-primary-light-3);
  border-color: var(--el-color-primary-light-3);
}
</style>
