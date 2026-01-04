<template>
  <div class="folder-tree">
    <div class="folder-tree__header">
      <div class="folder-tree__title">{{ title }}</div>
      <el-button
        v-if="allowCreate"
        text
        :icon="Plus"
        size="small"
        @click="handleCreate"
      >
        新建
      </el-button>
    </div>

    <div class="folder-tree__content">
      <div
        v-for="folder in folderList"
        :key="folder.id"
        :class="['folder-tree__item', { 'folder-tree__item--active': isActive(folder) }]"
        @click="handleFolderClick(folder)"
      >
        <div class="folder-tree__item-content">
          <el-icon class="folder-tree__icon">
            <component :is="folder.icon || defaultIcon" />
          </el-icon>
          <span class="folder-tree__name">{{ folder.name }}</span>
          <span v-if="showCount && folder.count !== undefined" class="folder-tree__count">
            {{ folder.count }}
          </span>
        </div>

        <div v-if="allowDelete && !folder.fixed" class="folder-tree__actions">
          <el-button
            text
            size="small"
            :icon="Delete"
            @click.stop="handleDelete(folder)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Folder, Plus, Delete } from '@element-plus/icons-vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  folders: {
    type: Array,
    default: () => []
  },
  title: {
    type: String,
    default: '文件夹'
  },
  defaultIcon: {
    type: Object,
    default: () => Folder
  },
  showCount: {
    type: Boolean,
    default: true
  },
  allowCreate: {
    type: Boolean,
    default: true
  },
  allowDelete: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:modelValue', 'folder-click', 'create', 'delete'])

const folderList = computed(() => props.folders)

const isActive = (folder) => {
  return folder.id === props.modelValue
}

const handleFolderClick = (folder) => {
  emit('update:modelValue', folder.id)
  emit('folder-click', folder)
}

const handleCreate = () => {
  emit('create')
}

const handleDelete = (folder) => {
  emit('delete', folder)
}
</script>

<style scoped>
.folder-tree {
  width: 240px;
  background: var(--bg-card, #1a1b1e);
  border-right: 1px solid var(--border, #35363a);
  display: flex;
  flex-direction: column;
  height: 100%;
}

.folder-tree__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid var(--border, #35363a);
}

.folder-tree__title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary, #e8eaed);
}

.folder-tree__content {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}

.folder-tree__item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  cursor: pointer;
  transition: background 0.2s;
  user-select: none;
}

.folder-tree__item:hover {
  background: var(--bg-hover, #2d2e30);
}

.folder-tree__item--active {
  background: var(--bg-active, rgba(64, 158, 255, 0.1));
  color: var(--el-color-primary);
}

.folder-tree__item-content {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
}

.folder-tree__icon {
  font-size: 18px;
  flex-shrink: 0;
}

.folder-tree__name {
  flex: 1;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.folder-tree__count {
  font-size: 12px;
  color: var(--text-tertiary, #5f6368);
  flex-shrink: 0;
}

.folder-tree__actions {
  opacity: 0;
  transition: opacity 0.2s;
}

.folder-tree__item:hover .folder-tree__actions {
  opacity: 1;
}
</style>
