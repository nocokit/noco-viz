<template>
  <div class="folder-navigator">
    <!-- 头部 -->
    <div class="navigator-header">
      <span class="header-title">{{ title }}</span>
      <a-button
        v-if="allowCreate"
        link
        type="primary"
        @click="handleCreate"
        class="btn-create"
      >
        <Plus />
      </a-button>
    </div>

    <!-- 搜索框 -->
    <a-input
      v-if="searchable"
      v-model:value="searchQuery"
      placeholder="搜索文件夹..."
      clearable
      class="search-input"
    >
      <template #prefix>
        <Search />
      </template>
    </a-input>

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
          
            <component :is="folder.icon || 'Folder'" />
          
          <span class="folder-name">{{ folder.name }}</span>
          <a-badge
            v-if="showCount && folder.count !== undefined"
            :value="folder.count"
            :max="99"
            class="folder-count"
          />
        </div>
      </div>

      <a-divider v-if="defaultFolders.length > 0 && filteredFolders.length > 0" />

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
              <DCaret />
              <Folder />
              <span class="folder-name">{{ folder.name }}</span>
              <a-badge
                v-if="showCount && folder.count !== undefined"
                :value="folder.count"
                :max="99"
                class="folder-count"
              />
            </div>
            <div v-if="allowEdit || allowDelete" class="folder-actions">
              <a-dropdown @command="(cmd) => handleAction(cmd, folder)">
                <MoreFilled />
                <template #dropdown>
                  <a-dropdown-menu>
                    <a-dropdown-item v-if="allowEdit" command="edit">
                      <Edit />
                      编辑
                    </a-menu-item>
                    <a-dropdown-item v-if="allowDelete" command="delete" divided>
                      <Delete />
                      删除
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
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
            <Folder />
            <span class="folder-name">{{ folder.name }}</span>
            <a-badge
              v-if="showCount && folder.count !== undefined"
              :value="folder.count"
              :max="99"
              class="folder-count"
            />
          </div>
          <div v-if="allowEdit || allowDelete" class="folder-actions">
            <a-dropdown @command="(cmd) => handleAction(cmd, folder)">
              <MoreFilled />
              <template #dropdown>
                <a-dropdown-menu>
                  <a-dropdown-item v-if="allowEdit" command="edit">
                    <Edit />
                    编辑
                  </a-menu-item>
                  <a-dropdown-item v-if="allowDelete" command="delete" divided>
                    <Delete />
                    删除
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </div>
        </div>
      </template>

      <!-- 空状态 -->
      <a-empty
        v-if="filteredFolders.length === 0 && defaultFolders.length === 0"
        :description="emptyText"
        :image-size="80"
      />
    </div>

    <!-- 创建/编辑文件夹对话框 -->
    <a-modal
      v-model="dialogVisible"
      :title="dialogMode === 'create' ? '新建文件夹' : '编辑文件夹'"
      width="400px"
    >
      <a-form :model="folderForm" label-width="80px">
        <a-form-item label="名称" required>
          <a-input
            v-model="folderForm.name"
            placeholder="请输入文件夹名称"
            maxlength="20"
            show-word-limit
          />
        </a-form-item>
        <a-form-item label="颜色">
          <input type="color" v-model="folderForm.color" style="width: 100%; height: 32px; border: 1px solid #d9d9d9; border-radius: 4px; cursor: pointer;" />
        </a-form-item>
        <a-form-item label="图标">
          <a-select v-model="folderForm.icon" placeholder="选择图标">
            <a-select-option label="文件夹" value="Folder" />
            <a-select-option label="文档" value="Document" />
            <a-select-option label="收藏" value="Star" />
            <a-select-option label="标签" value="Collection" />
          </a-select>
        </a-form-item>
      </a-form>
      <template #footer>
        <a-button @click="dialogVisible = false">取消</a-button>
        <a-button type="primary" @click="handleSave">保存</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { message, Modal } from 'ant-design-vue'
import { PlusOutlined, SearchOutlined, FolderOutlined, EditOutlined, DeleteOutlined, MoreOutlined, DownOutlined } from '@ant-design/icons-vue'
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
    await Modal.confirm(
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
    message.warning('请输入文件夹名称')
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

