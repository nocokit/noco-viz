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
          <el-button
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
        <el-icon class="folder-icon" :class="{ open: isActive(folder) }">
          <component :is="getFolderIcon(folder)" />
        </el-icon>

        <!-- 文件夹名称 -->
        <span class="folder-name">{{ folder.name }}</span>

        <!-- 数量徽章 -->
        <span v-if="showCount && folder.count !== undefined" class="folder-count">
          {{ folder.count }}
        </span>

        <!-- 操作按钮 -->
        <div v-if="!isDefaultFolder(folder)" class="folder-actions">
          <el-dropdown
            v-if="allowEdit || allowDelete"
            trigger="click"
            @command="handleCommand($event, folder)"
          >
            <el-icon class="action-icon" @click.stop>
              <MoreFilled />
            </el-icon>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item v-if="allowEdit" command="rename" :icon="Edit">
                  重命名
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="allowDelete"
                  command="delete"
                  :icon="Delete"
                  divided
                >
                  删除
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="folders.length === 0" class="empty-state">
        <el-icon><FolderOpened /></el-icon>
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
import {
  Folder,
  FolderOpened,
  Plus,
  Edit,
  Delete,
  MoreFilled
} from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus'

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
      await ElMessageBox.confirm(
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

<style scoped>
.folder-tree-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--bg-card);
  border-right: 1px solid var(--border);
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--border);
}

.header-left {
  flex: 1;
  min-width: 0;
}

.panel-title {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
}

.header-right {
  flex-shrink: 0;
}

.folder-list {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-sm);
}

.folder-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-base);
  user-select: none;
  position: relative;
}

.folder-item:hover {
  background: var(--bg-hover);
}

.folder-item.active {
  background: var(--bg-active);
  color: var(--color-primary);
}

.folder-item.dragging {
  opacity: 0.5;
}

.folder-icon {
  flex-shrink: 0;
  font-size: 18px;
  color: var(--text-secondary);
  transition: all var(--transition-base);
}

.folder-item.active .folder-icon {
  color: var(--color-primary);
}

.folder-icon.open {
  transform: scale(1.1);
}

.folder-name {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: var(--font-size-sm);
}

.folder-count {
  flex-shrink: 0;
  padding: 2px 8px;
  background: var(--bg-elevated);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
}

.folder-item.active .folder-count {
  background: var(--color-primary);
  color: #fff;
}

.folder-actions {
  flex-shrink: 0;
  opacity: 0;
  transition: opacity var(--transition-base);
}

.folder-item:hover .folder-actions {
  opacity: 1;
}

.action-icon {
  padding: 4px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-base);
}

.action-icon:hover {
  background: var(--bg-elevated);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-3xl) var(--spacing-lg);
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  text-align: center;
}

.empty-state .el-icon {
  font-size: 48px;
  opacity: 0.3;
}

.panel-footer {
  padding: var(--spacing-lg);
  border-top: 1px solid var(--border);
}

/* 滚动条 */
.folder-list::-webkit-scrollbar {
  width: 6px;
}

.folder-list::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: var(--radius-sm);
}

.folder-list::-webkit-scrollbar-thumb:hover {
  background: var(--text-tertiary);
}
</style>
