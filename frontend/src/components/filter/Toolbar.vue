<template>
  <div class="toolbar">
    <div class="toolbar-left">
      <slot name="left">
        <div v-if="title" class="toolbar-title">{{ title }}</div>
      </slot>
    </div>

    <div class="toolbar-center">
      <slot name="filters"></slot>
    </div>

    <div class="toolbar-right">
      <SearchBar
        v-if="showSearch"
        v-model="searchValue"
        :placeholder="searchPlaceholder"
        @search="handleSearch"
      />

      <slot name="actions">
        <el-button
          v-if="showCreate"
          type="primary"
          @click="handleCreate"
        >
          <el-icon><Plus /></el-icon>
          {{ createText }}
        </el-button>
      </slot>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import SearchBar from './SearchBar.vue'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  showSearch: {
    type: Boolean,
    default: true
  },
  searchPlaceholder: {
    type: String,
    default: '搜索...'
  },
  showCreate: {
    type: Boolean,
    default: false
  },
  createText: {
    type: String,
    default: '新建'
  }
})

const emit = defineEmits(['search', 'create'])

const searchValue = ref('')

const handleSearch = (value) => {
  emit('search', value)
}

const handleCreate = () => {
  emit('create')
}
</script>

<style scoped>
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
  padding: 12px 16px;
  background: var(--el-bg-color-overlay);
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
}

.toolbar-left {
  flex-shrink: 0;
}

.toolbar-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.toolbar-center {
  flex: 1;
  display: flex;
  gap: 12px;
  align-items: center;
}

.toolbar-right {
  flex-shrink: 0;
  display: flex;
  gap: 12px;
  align-items: center;
}

@media (max-width: 768px) {
  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .toolbar-right {
    flex-direction: column;
  }
}
</style>
