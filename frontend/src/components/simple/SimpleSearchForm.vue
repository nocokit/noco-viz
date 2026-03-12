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
        <a-input
          v-if="field.type === 'text' || !field.type"
          :placeholder="field.placeholder || field.label"
          :value="searchData[field.key]"
          @update:value="handleInput(field.key, $event)"
          allow-clear
        />

        <!-- 下拉选择 -->
        <a-select
          v-else-if="field.type === 'select'"
          :value="searchData[field.key]"
          @update:value="handleInput(field.key, $event)"
          :placeholder="field.placeholder || `全部${field.label}`"
          allow-clear
          style="width: 100%"
        >
          <a-select-option
            v-for="option in field.options"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </a-select-option>
        </a-select>

        <!-- 日期选择 -->
        <a-date-picker
          v-else-if="field.type === 'date'"
          :value="searchData[field.key]"
          @update:value="handleInput(field.key, $event)"
          style="width: 100%"
        />
      </div>
    </div>

    <div class="search-actions">
      <a-button type="primary" @click="handleSearch">
        <template #icon><SearchOutlined /></template>
        搜索
      </a-button>
      <a-button @click="handleReset">
        重置
      </a-button>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { SearchOutlined } from '@ant-design/icons-vue'

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

