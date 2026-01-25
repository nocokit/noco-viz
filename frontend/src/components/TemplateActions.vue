<template>
  <div class="template-actions">
    <el-button :size="size" @click="$emit('use')">
      <el-icon><Check /></el-icon>
      使用
    </el-button>
    <el-button v-if="showPreview" :size="size" @click="$emit('preview')">
      <el-icon><View /></el-icon>
      预览
    </el-button>
    <el-dropdown
      v-if="showMore && !isSystem"
      trigger="click"
      @command="handleCommand"
    >
      <el-button :size="size">
        <el-icon><MoreFilled /></el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="edit">
            <el-icon><Edit /></el-icon>
            编辑
          </el-dropdown-item>
          <el-dropdown-item command="delete" divided>
            <el-icon><Delete /></el-icon>
            删除
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <el-button
      v-else-if="showEdit && !isSystem"
      :size="size"
      @click="$emit('edit')"
    >
      <el-icon><Edit /></el-icon>
      编辑
    </el-button>
    <el-button
      v-if="showDelete && !isSystem"
      :size="size"
      type="danger"
      @click="$emit('delete')"
    >
      <el-icon><Delete /></el-icon>
      删除
    </el-button>
  </div>
</template>

<script setup>
import { Check, View, Edit, Delete, MoreFilled } from '@element-plus/icons-vue'

defineProps({
  isSystem: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: 'small'
  },
  showPreview: {
    type: Boolean,
    default: true
  },
  showMore: {
    type: Boolean,
    default: true
  },
  showEdit: {
    type: Boolean,
    default: false
  },
  showDelete: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['use', 'preview', 'edit', 'delete'])

const handleCommand = (command) => {
  emit(command)
}
</script>

<style scoped>
.template-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}
</style>
