<template>
  <div class="simple-toolbar">
    <!-- 左侧：搜索表单区域 -->
    <div v-if="showSearch || searchForm" class="toolbar-left">
      <!-- 简单搜索框（旧版兼容） -->
      <a-input
        v-if="showSearch && !searchForm"
        :placeholder="searchPlaceholder"
        :value="search"
        @update:value="$emit('update:search', $event)"
        allow-clear
        style="width: 200px"
      />

      <!-- 高级搜索表单（新版） -->
      <div v-if="searchForm" class="search-form">
        <template v-for="field in searchForm.fields" :key="field.name">
          <!-- 输入框 -->
          <a-input
            v-if="field.type === 'input'"
            v-model="searchData[field.name]"
            :placeholder="field.placeholder"
            :clearable="field.clearable !== false"
            size="default"
            class="search-field"
            @clear="handleSearch"
            @keyup.enter="handleSearch"
          >
            <template v-if="field.label" #prepend>{{ field.label }}</template>
          </a-input>

          <!-- 下拉选择 -->
          <a-select
            v-else-if="field.type === 'select'"
            v-model="searchData[field.name]"
            :placeholder="field.placeholder"
            :clearable="field.clearable !== false"
            size="default"
            class="search-field"
            @change="handleSearch"
          >
            <template v-if="field.label" #prefix>{{ field.label }}</template>
            <a-select-option
              v-for="option in field.options"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </a-select>

          <!-- 日期选择 -->
          <a-date-picker
            v-else-if="field.type === 'date' || field.type === 'daterange'"
            v-model="searchData[field.name]"
            :type="field.type === 'daterange' ? 'daterange' : 'date'"
            :placeholder="field.placeholder"
            :clearable="field.clearable !== false"
            size="default"
            class="search-field"
            @change="handleSearch"
          />
        </template>

        <!-- 搜索按钮 -->
        <a-button type="primary" size="default" @click="handleSearch">
          搜索
        </a-button>
        <a-button size="default" @click="handleReset">
          重置
        </a-button>
      </div>
    </div>

    <!-- 右侧：操作按钮区域 -->
    <div class="toolbar-right">
      <!-- 批量删除按钮 -->
      <a-button
        v-if="selectedCount > 0"
        danger
        @click="$emit('batch-delete')"
      >
        <template #icon><DeleteOutlined /></template>
        批量删除 ({{ selectedCount }})
      </a-button>

      <!-- 操作按钮 -->
      <a-button
        v-for="action in actions"
        :key="action.key"
        :type="action.type === 'primary' ? 'primary' : 'default'"
        @click="$emit('action', action.key)"
      >
        <template v-if="action.icon === 'plus'" #icon>
          <PlusOutlined />
        </template>
        {{ action.label }}
      </a-button>

      <!-- 刷新按钮 -->
      <a-button
        v-if="showRefresh"
        @click="$emit('refresh')"
        title="刷新"
      >
        <template #icon><ReloadOutlined /></template>
      </a-button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { PlusOutlined, ReloadOutlined, DeleteOutlined } from '@ant-design/icons-vue'

const props = defineProps({
  search: {
    type: String,
    default: ''
  },
  searchPlaceholder: {
    type: String,
    default: '搜索...'
  },
  showSearch: {
    type: Boolean,
    default: true
  },
  showRefresh: {
    type: Boolean,
    default: true
  },
  actions: {
    type: Array,
    default: () => []
  },
  // 新增：搜索表单配置
  searchForm: {
    type: Object,
    default: null
    // 格式：{ fields: [{ name, label, type, placeholder, options, clearable }] }
  },
  // 选中的数量
  selectedCount: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['update:search', 'action', 'refresh', 'search', 'reset'])

// 搜索表单数据
const searchData = ref({})

// 初始化搜索数据
if (props.searchForm) {
  props.searchForm.fields.forEach(field => {
    searchData.value[field.name] = field.defaultValue || ''
  })
}

// 处理搜索
const handleSearch = () => {
  emit('search', { ...searchData.value })
}

// 处理重置
const handleReset = () => {
  if (props.searchForm) {
    props.searchForm.fields.forEach(field => {
      searchData.value[field.name] = field.defaultValue || ''
    })
  }
  emit('reset')
  emit('search', { ...searchData.value })
}
</script>

<style scoped>
.simple-toolbar {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 8px;
  gap: 8px;
}

.toolbar-left {
  flex: 1;
  display: flex;
  align-items: center;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.search-form {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.search-field {
  width: 200px;
}
</style>
