<template>
  <aside class="folder-tree-panel">
    <!-- 头部 -->
    <div class="panel-header">
      <div class="header-left">
        <slot name="header-left">
          <span class="panel-title">{{ title }}</span>
        </slot>
      </div>
      <div class="header-right">
        <slot name="header-right">
          <a-button
            v-if="allowCreate"
            :icon="Plus"
            circle
            size="small"
            @click="handleCreate"
          />
        </slot>
      </div>
    </div>

    <!-- 文件夹列表 -->
    <div class="folder-list">
      <div
        v-for="folder in folders"
        :key="folder.id"
        :class="['folder-item', {
          active: isActive(folder),
          dragging: draggingFolder?.id === folder.id
        }]"
        :draggable="allowDrag && !isDefaultFolder(folder)"
        @click="handleSelect(folder)"
        @dragstart="handleDragStart($event, folder)"
        @dragover="handleDragOver($event, folder)"
        @drop="handleDrop($event, folder)"
        @dragend="handleDragEnd"
      >
        <!-- 文件夹图标 -->
        
          <component :is="getFolderIcon(folder)" />
        

        <!-- 文件夹名称 -->
        <span class="folder-name">{{ folder.name }}</span>

        <!-- 数量徽章 -->
        <span v-if="showCount && folder.count !== undefined" class="folder-count">
          {{ folder.count }}
        </span>

        <!-- 操作按钮 -->
        <div v-if="!isDefaultFolder(folder)" class="folder-actions">
          <a-dropdown
            v-if="allowEdit || allowDelete"
            trigger="click"
            @command="handleCommand($event, folder)"
          >
            <MoreFilled />
            <template #dropdown>
              <a-dropdown-menu>
                <a-dropdown-item v-if="allowEdit" command="rename" :icon="Edit">
                  重命名
                </a-menu-item>
                <a-dropdown-item
                  v-if="allowDelete"
                  command="delete"
                  :icon="Delete"
                  divided
                >
                  删除
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="folders.length === 0" class="empty-state">
        <FolderOpened />
        <span>{{ emptyText }}</span>
      </div>
    </div>

    <!-- 底部插槽 -->
    <div v-if="$slots.footer" class="panel-footer">
      <slot name="footer"></slot>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed } from 'vue'
import { FolderOutlined, FolderOpenOutlined, PlusOutlined, EditOutlined, DeleteOutlined, MoreOutlined } from '@ant-design/icons-vue'
import { message, ElMessageBox } from '@/utils/ui'

const props = defineProps({
  // 当前选中的文件夹
  modelValue: {
    type: [String, Number],
    default: null
  },
  // 文件夹列表
  folders: {
    type: Array,
    required: true
    // [{ id, name, count, icon, isDefault }]
  },
  // 标题
  title: {
    type: String,
    default: '文件夹'
  },
  // 是否显示数量
  showCount: {
    type: Boolean,
    default: true
  },
  // 是否允许创建
  allowCreate: {
    type: Boolean,
    default: true
  },
  // 是否允许编辑
  allowEdit: {
    type: Boolean,
    default: true
  },
  // 是否允许删除
  allowDelete: {
    type: Boolean,
    default: true
  },
  // 是否允许拖拽
  allowDrag: {
    type: Boolean,
    default: false
  },
  // 默认文件夹ID列表
  defaultFolders: {
    type: Array,
    default: () => ['all', 'recent', 'favorites']
  },
  // 空状态文本
  emptyText: {
    type: String,
    default: '暂无文件夹'
  }
})

const emit = defineEmits([
  'update:modelValue',
  'select',
  'create',
  'rename',
  'delete',
  'move'
])

// 拖拽中的文件夹
const draggingFolder = ref(null)

// 是否是默认文件夹
const isDefaultFolder = (folder) => {
  return folder.isDefault || props.defaultFolders.includes(folder.id)
}

// 是否激活
const isActive = (folder) => {
  return props.modelValue === folder.id
}

// 获取文件夹图标
const getFolderIcon = (folder) => {
  if (folder.icon) return folder.icon
  return isActive(folder) ? FolderOpened : Folder
}

// 选择文件夹
const handleSelect = (folder) => {
  emit('update:modelValue', folder.id)
  emit('select', folder)
}

// 创建文件夹
const handleCreate = async () => {
  try {
    const { value } = await ElMessageBox.prompt('请输入文件夹名称', '新建文件夹', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputPattern: /\S+/,
      inputErrorMessage: '文件夹名称不能为空'
    })

    if (value) {
      emit('create', value.trim())
    }
  } catch (error) {
    // 用户取消
  }
}

// 处理命令
const handleCommand = async (command, folder) => {
  if (command === 'rename') {
    try {
      const { value } = await ElMessageBox.prompt(
        '请输入新的文件夹名称',
        '重命名文件夹',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValue: folder.name,
          inputPattern: /\S+/,
          inputErrorMessage: '文件夹名称不能为空'
        }
      )

      if (value && value.trim() !== folder.name) {
        emit('rename', { folder, newName: value.trim() })
      }
    } catch (error) {
      // 用户取消
    }
  } else if (command === 'delete') {
    try {
      await Modal.confirm(
        `确定要删除文件夹"${folder.name}"吗？`,
        '删除确认',
        {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )

      emit('delete', folder)
    } catch (error) {
      // 用户取消
    }
  }
}

// 拖拽开始
const handleDragStart = (event, folder) => {
  if (!props.allowDrag || isDefaultFolder(folder)) {
    event.preventDefault()
    return
  }

  draggingFolder.value = folder
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('text/plain', folder.id)
}

// 拖拽经过
const handleDragOver = (event, folder) => {
  if (!draggingFolder.value || draggingFolder.value.id === folder.id) {
    return
  }

  event.preventDefault()
  event.dataTransfer.dropEffect = 'move'
}

// 放置
const handleDrop = (event, targetFolder) => {
  event.preventDefault()

  if (!draggingFolder.value || draggingFolder.value.id === targetFolder.id) {
    return
  }

  emit('move', {
    source: draggingFolder.value,
    target: targetFolder
  })

  draggingFolder.value = null
}

// 拖拽结束
const handleDragEnd = () => {
  draggingFolder.value = null
}

// 暴露方法
defineExpose({
  selectFolder: handleSelect,
  createFolder: handleCreate
})
</script>

