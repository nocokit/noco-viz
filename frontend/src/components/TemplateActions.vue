<template>
  <div class="template-actions">
    <a-button :size="size" @click="$emit('use')">
      <Check />
      使用
    </a-button>
    <a-button v-if="showPreview" :size="size" @click="$emit('preview')">
      <View />
      预览
    </a-button>
    <a-dropdown
      v-if="showMore && !isSystem"
      trigger="click"
      @command="handleCommand"
    >
      <a-button :size="size">
        <MoreFilled />
      </a-button>
      <template #dropdown>
        <a-menu>
          <a-menu-item command="edit">
            <Edit />
            编辑
          </a-menu-item>
          <a-menu-item command="delete" divided>
            <Delete />
            删除
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
    <a-button
      v-else-if="showEdit && !isSystem"
      :size="size"
      @click="$emit('edit')"
    >
      <Edit />
      编辑
    </a-button>
    <a-button
      v-if="showDelete && !isSystem"
      :size="size"
      type="danger"
      @click="$emit('delete')"
    >
      <Delete />
      删除
    </a-button>
  </div>
</template>

<script setup>
import { CheckOutlined, EyeOutlined, EditOutlined, DeleteOutlined, MoreOutlined } from '@ant-design/icons-vue'

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

