<template>
  <el-popconfirm
    :title="title"
    :confirm-button-text="confirmText"
    :cancel-button-text="cancelText"
    :width="width"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  >
    <template #reference>
      <el-button
        :type="type"
        :size="size"
        :disabled="disabled"
        :loading="loading"
        :icon="icon"
        :text="text"
        :link="link"
      >
        <slot>{{ buttonText }}</slot>
      </el-button>
    </template>
    <template v-if="message" #default>
      <div class="confirm-message">{{ message }}</div>
    </template>
  </el-popconfirm>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    default: '确定要执行此操作吗？'
  },
  message: {
    type: String,
    default: ''
  },
  confirmText: {
    type: String,
    default: '确定'
  },
  cancelText: {
    type: String,
    default: '取消'
  },
  width: {
    type: [String, Number],
    default: 200
  },
  type: {
    type: String,
    default: 'default'
  },
  size: {
    type: String,
    default: 'default'
  },
  buttonText: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  icon: {
    type: [String, Object],
    default: null
  },
  text: {
    type: Boolean,
    default: false
  },
  link: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['confirm', 'cancel'])

const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  emit('cancel')
}
</script>

<style scoped>
.confirm-message {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  line-height: 1.6;
  margin-top: 8px;
}
</style>
