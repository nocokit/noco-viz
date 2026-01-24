<template>
  <el-dialog
    v-model="visible"
    :title="title"
    :width="width"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div class="resource-picker">
      <!-- 搜索栏 -->
      <div class="picker-toolbar">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索资源..."
          clearable
          @input="handleSearch"
        >
          <template #prefix><el-icon><Search /></el-icon></template>
        </el-input>
        <el-select v-if="showTypeFilter" v-model="selectedType" placeholder="类型" clearable style="width: 120px">
          <el-option v-for="type in types" :key="type.value" :label="type.label" :value="type.value" />
        </el-select>
      </div>

      <!-- 资源列表 -->
      <div v-loading="loading" class="picker-content">
        <div class="resource-grid">
          <div
            v-for="item in filteredItems"
            :key="item[itemKey]"
            class="resource-item"
            :class="{ selected: isSelected(item) }"
            @click="handleSelect(item)"
          >
            <div class="resource-preview">
              <img v-if="item.url || item.src" :src="item.url || item.src" :alt="item.name" />
              <div v-else class="resource-placeholder">
                <el-icon :size="32"><Document /></el-icon>
              </div>
              <div v-if="isSelected(item)" class="resource-check">
                <el-icon><Check /></el-icon>
              </div>
            </div>
            <div class="resource-info">
              <div class="resource-name">{{ item.name || item.title }}</div>
              <div v-if="item.size" class="resource-meta">{{ formatSize(item.size) }}</div>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <el-empty v-if="filteredItems.length === 0" :description="emptyText" />
      </div>

      <!-- 分页 -->
      <div v-if="showPagination && total > pageSize" class="picker-pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[12, 24, 48]"
          layout="total, sizes, prev, pager, next"
          @current-change="handlePageChange"
          @size-change="handleSizeChange"
        />
      </div>
    </div>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" :disabled="selectedItems.length === 0" @click="handleConfirm">
        确定{{ selectedItems.length > 0 ? `(${selectedItems.length})` : '' }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: '选择资源' },
  width: { type: String, default: '900px' },
  items: { type: Array, default: () => [] },
  itemKey: { type: String, default: 'id' },
  multiple: { type: Boolean, default: false },
  types: { type: Array, default: () => [] },
  showTypeFilter: { type: Boolean, default: false },
  showPagination: { type: Boolean, default: true },
  pageSize: { type: Number, default: 24 },
  total: { type: Number, default: 0 },
  loading: { type: Boolean, default: false },
  emptyText: { type: String, default: '暂无资源' }
})

const emit = defineEmits(['update:modelValue', 'confirm', 'search', 'page-change'])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const searchKeyword = ref('')
const selectedType = ref('')
const currentPage = ref(1)
const selectedItems = ref([])

const filteredItems = computed(() => {
  let result = props.items

  if (searchKeyword.value) {
    result = result.filter(item =>
      (item.name || item.title || '').toLowerCase().includes(searchKeyword.value.toLowerCase())
    )
  }

  if (selectedType.value) {
    result = result.filter(item => item.type === selectedType.value)
  }

  return result
})

const isSelected = (item) => {
  return selectedItems.value.some(i => i[props.itemKey] === item[props.itemKey])
}

const handleSelect = (item) => {
  if (props.multiple) {
    const index = selectedItems.value.findIndex(i => i[props.itemKey] === item[props.itemKey])
    if (index > -1) {
      selectedItems.value.splice(index, 1)
    } else {
      selectedItems.value.push(item)
    }
  } else {
    selectedItems.value = [item]
  }
}

const handleSearch = () => {
  emit('search', searchKeyword.value)
}

const handlePageChange = (page) => {
  emit('page-change', page)
}

const handleSizeChange = (size) => {
  emit('page-change', 1, size)
}

const handleConfirm = () => {
  emit('confirm', props.multiple ? selectedItems.value : selectedItems.value[0])
  handleClose()
}

const handleClose = () => {
  visible.value = false
  selectedItems.value = []
  searchKeyword.value = ''
  selectedType.value = ''
}

const formatSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

watch(() => props.modelValue, (val) => {
  if (!val) {
    selectedItems.value = []
  }
})
</script>

<style scoped>
.resource-picker {
  min-height: 400px;
}

.picker-toolbar {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.picker-content {
  min-height: 400px;
  max-height: 500px;
  overflow-y: auto;
}

.resource-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 16px;
}

.resource-item {
  cursor: pointer;
  border: 2px solid transparent;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s;
}

.resource-item:hover {
  border-color: var(--el-color-primary);
}

.resource-item.selected {
  border-color: var(--el-color-primary);
  background: var(--el-color-primary-light-9);
}

.resource-preview {
  position: relative;
  width: 100%;
  padding-top: 100%;
  background: var(--el-fill-color-light);
}

.resource-preview img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.resource-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--el-text-color-placeholder);
}

.resource-check {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  background: var(--el-color-primary);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.resource-info {
  padding: 8px;
}

.resource-name {
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.resource-meta {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-top: 4px;
}

.picker-pagination {
  margin-top: 16px;
  display: flex;
  justify-content: center;
}
</style>
