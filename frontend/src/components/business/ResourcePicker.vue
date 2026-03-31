<template>
  <a-modal
    v-model="visible"
    :title="title"
    :width="width"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div class="resource-picker">
      <!-- 搜索栏 -->
      <div class="picker-toolbar">
        <a-input
          v-model="searchKeyword"
          placeholder="搜索资源..."
          clearable
          @input="handleSearch"
        >
          <template #prefix><Search /></template>
        </a-input>
        <a-select v-if="showTypeFilter" v-model="selectedType" placeholder="类型" clearable style="width: 120px">
          <a-select-option v-for="type in types" :key="type.value" :label="type.label" :value="type.value" />
        </a-select>
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
                <Document />
              </div>
              <div v-if="isSelected(item)" class="resource-check">
                <Check />
              </div>
            </div>
            <div class="resource-info">
              <div class="resource-name">{{ item.name || item.title }}</div>
              <div v-if="item.size" class="resource-meta">{{ formatSize(item.size) }}</div>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <a-empty v-if="filteredItems.length === 0" :description="emptyText" />
      </div>

      <!-- 分页 -->
      <div v-if="showPagination && total > pageSize" class="picker-pagination">
        <a-pagination
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
      <a-button @click="handleClose">取消</a-button>
      <a-button type="primary" :disabled="selectedItems.length === 0" @click="handleConfirm">
        确定{{ selectedItems.length > 0 ? `(${selectedItems.length})` : '' }}
      </a-button>
    </template>
  </a-modal>
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

