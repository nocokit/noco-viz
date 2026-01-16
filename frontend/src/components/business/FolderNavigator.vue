<template>
  <div class="folder-navigator">
    <!-- 头部 -->
    <div class="navigator-header">
      <span class="header-title">{{ title }}</span>
      <el-button
        v-if="allowCreate"
        link
        type="primary"
        @click="handleCreate"
        class="btn-create"
      >
        <el-icon><Plus /></el-icon>
      </el-button>
    </div>

    <!-- 搜索框 -->
    <el-input
      v-if="searchable"
      v-model="searchQuery"
      placeholder="搜索文件夹..."
      clearable
      class="search-input"
    >
      <template #prefix>
        <el-icon><Search /></el-icon>
      </template>
    </el-input>

    <!-- 文件夹列表 -->
    <div class="folder-list">
      <!-- 默认文件夹 -->
      <div
        v-for="folder in defaultFolders"
        :key="folder.id"
        :class="['folder-item', { active: activeFolder === folder.id }]"
        @click="handleSelect(folder)"
      >
        <div class="folder-content">
          <el-icon class="folder-icon">
            <component :is="folder.icon || 'Folder'" />
          </el-icon>
          <span class="folder-name">{{ folder.name }}</span>
          <el-badge
            v-if="showCount && folder.count !== undefined"
            :value="folder.count"
            :max="99"
            class="folder-count"
          />
        </div>
      </div>

      <el-divider v-if="defaultFolders.length > 0 && filteredFolders.length > 0" />

      <!-- 自定义文件夹 -->
      <draggable
        v-if="draggable"
        v-model="sortedFolders"
        item-key="id"
        :animation="200"
        handle=".drag-handle"
        @end="handleDragEnd"
      >
        <template #item="{ element: folder }">
          <div
            :class="['folder-item', { active: activeFolder === folder.id }]"
            @click="handleSelect(folder)"
          >
            <div class="folder-content">
              <el-icon v-if="draggable" class="drag-handle">
                <DCaret />
              </el-icon>
              <el-icon class="folder-icon" :style="{ color: folder.color }">
                <Folder />
              </el-icon>
              <span class="folder-name">{{ folder.name }}</span>
              <el-badge
                v-if="showCount && folder.count !== undefined"
                :value="folder.count"
                :max="99"
                class="folder-count"
              />
            </div>
            <div v-if="allowEdit || allowDelete" class="folder-actions">
              <el-dropdown @command="(cmd) => handleAction(cmd, folder)">
                <el-icon class="action-icon"><MoreFilled /></el-icon>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item v-if="allowEdit" command="edit">
                      <el-icon><Edit /></el-icon>
                      编辑
                    </el-dropdown-item>
                    <el-dropdown-item v-if="allowDelete" command="delete" divided>
                      <el-icon><Delete /></el-icon>
                      删除
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
        </template>
      </draggable>

      <!-- 非拖拽模式 -->
      <template v-else>
        <div
          v-for="folder in filteredFolders"
          :key="folder.id"
          :class="['folder-item', { active: activeFolder === folder.id }]"
          @click="handleSelect(folder)"
        >
          <div class="folder-content">
            <el-icon class="folder-icon" :style="{ color: folder.color }">
              <Folder />
            </el-icon>
            <span class="folder-name">{{ folder.name }}</span>
            <el-badge
              v-if="showCount && folder.count !== undefined"
              :value="folder.count"
              :max="99"
              class="folder-count"
            />
          </div>
          <div v-if="allowEdit || allowDelete" class="folder-actions">
            <el-dropdown @command="(cmd) => handleAction(cmd, folder)">
              <el-icon class="action-icon"><MoreFilled /></el-icon>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item v-if="allowEdit" command="edit">
                    <el-icon><Edit /></el-icon>
                    编辑
                  </el-dropdown-item>
                  <el-dropdown-item v-if="allowDelete" command="delete" divided>
                    <el-icon><Delete /></el-icon>
                    删除
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </template>

      <!-- 空状态 -->
      <el-empty
        v-if="filteredFolders.length === 0 && defaultFolders.length === 0"
        :description="emptyText"
        :image-size="80"
      />
    </div>

    <!-- 创建/编辑文件夹对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogMode === 'create' ? '新建文件夹' : '编辑文件夹'"
      width="400px"
    >
      <el-form :model="folderForm" label-width="80px">
        <el-form-item label="名称" required>
          <el-input
            v-model="folderForm.name"
            placeholder="请输入文件夹名称"
            maxlength="20"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="颜色">
          <el-color-picker v-model="folderForm.color" />
        </el-form-item>
        <el-form-item label="图标">
          <el-select v-model="folderForm.icon" placeholder="选择图标">
            <el-option label="文件夹" value="Folder" />
            <el-option label="文档" value="Document" />
            <el-option label="收藏" value="Star" />
            <el-option label="标签" value="Collection" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Plus,
  Search,
  Folder,
  Edit,
  Delete,
  MoreFilled,
  DCaret
} from '@element-plus/icons-vue'
import draggable from 'vuedraggable'

const props = defineProps({
  // 当前激活的文件夹
  activeFolder: {
    type: [String, Number],
    default: null
  },
  // 文件夹列表
  folders: {
    type: Array,
    default: () => []
  },
  // 默认文件夹（如：全部、最近、收藏等）
  defaultFolders: {
    type: Array,
    default: () => []
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
  // 是否可搜索
  searchable: {
    type: Boolean,
    default: true
  },
  // 是否可拖拽排序
  draggable: {
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
  // 空状态文本
  emptyText: {
    type: String,
    default: '暂无文件夹'
  }
})

const emit = defineEmits([
  'update:activeFolder',
  'select',
  'create',
  'edit',
  'delete',
  'sort'
])

// 状态
const searchQuery = ref('')
const dialogVisible = ref(false)
const dialogMode = ref('create')
const folderForm = ref({
  id: null,
  name: '',
  color: '#409EFF',
  icon: 'Folder'
})
const sortedFolders = ref([...props.folders])

// 计算属性
const filteredFolders = computed(() => {
  if (!searchQuery.value) {
    return sortedFolders.value
  }
  const query = searchQuery.value.toLowerCase()
  return sortedFolders.value.filter(folder =>
    folder.name.toLowerCase().includes(query)
  )
})

// 方法
const handleSelect = (folder) => {
  emit('update:activeFolder', folder.id)
  emit('select', folder)
}

const handleCreate = () => {
  dialogMode.value = 'create'
  folderForm.value = {
    id: null,
    name: '',
    color: '#409EFF',
    icon: 'Folder'
  }
  dialogVisible.value = true
}

const handleAction = (command, folder) => {
  if (command === 'edit') {
    handleEdit(folder)
  } else if (command === 'delete') {
    handleDelete(folder)
  }
}

const handleEdit = (folder) => {
  dialogMode.value = 'edit'
  folderForm.value = { ...folder }
  dialogVisible.value = true
}

const handleDelete = async (folder) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除文件夹 "${folder.name}" 吗？`,
      '确认删除',
      {
        type: 'warning',
        confirmButtonText: '删除',
        cancelButtonText: '取消'
      }
    )
    emit('delete', folder)
  } catch {
    // 用户取消
  }
}

const handleSave = () => {
  if (!folderForm.value.name.trim()) {
    ElMessage.warning('请输入文件夹名称')
    return
  }

  if (dialogMode.value === 'create') {
    emit('create', { ...folderForm.value })
  } else {
    emit('edit', { ...folderForm.value })
  }

  dialogVisible.value = false
}

const handleDragEnd = () => {
  emit('sort', sortedFolders.value)
}

// 暴露方法
defineExpose({
  openCreateDialog: handleCreate
})
</script>

<style scoped lang="scss">
.folder-navigator {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;

  .navigator-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    border-bottom: 1px solid #e4e7ed;

    .header-title {
      font-size: 16px;
      font-weight: 500;
      color: #303133;
    }

    .btn-create {
      padding: 4px;
    }
  }

  .search-input {
    margin: 12px 16px;
  }

  .folder-list {
    flex: 1;
    overflow-y: auto;
    padding: 8px;

    .folder-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 12px;
      margin-bottom: 4px;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        background: #f5f7fa;

        .folder-actions {
          opacity: 1;
        }
      }

      &.active {
        background: #ecf5ff;
        color: #409eff;

        .folder-icon {
          color: #409eff;
        }
      }

      .folder-content {
        display: flex;
        align-items: center;
        gap: 8px;
        flex: 1;
        min-width: 0;

        .drag-handle {
          cursor: move;
          color: #909399;
          font-size: 14px;
        }

        .folder-icon {
          font-size: 18px;
          color: #606266;
          flex-shrink: 0;
        }

        .folder-name {
          flex: 1;
          font-size: 14px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .folder-count {
          flex-shrink: 0;
        }
      }

      .folder-actions {
        opacity: 0;
        transition: opacity 0.2s;

        .action-icon {
          font-size: 16px;
          color: #909399;
          cursor: pointer;

          &:hover {
            color: #409eff;
          }
        }
      }
    }
  }
}
</style>
