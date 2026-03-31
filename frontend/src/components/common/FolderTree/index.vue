<template>
  <div class="folder-tree">
    <div class="folder-tree__header">
      <div class="folder-tree__title">{{ title }}</div>
      <a-button
        v-if="allowCreate"
        text
        :icon="Plus"
        size="small"
        @click="handleCreate"
      >
        新建
      </a-button>
    </div>

    <div class="folder-tree__content">
      <div
        v-for="folder in folderList"
        :key="folder.id"
        :class="['folder-tree__item', { 'folder-tree__item--active': isActive(folder) }]"
        @click="handleFolderClick(folder)"
      >
        <div class="folder-tree__item-content">
          
            <component :is="folder.icon || defaultIcon" />
          
          <span class="folder-tree__name">{{ folder.name }}</span>
          <span v-if="showCount && folder.count !== undefined" class="folder-tree__count">
            {{ folder.count }}
          </span>
        </div>

        <div v-if="allowDelete && !folder.fixed" class="folder-tree__actions">
          <a-button
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
import { FolderOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons-vue'

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

