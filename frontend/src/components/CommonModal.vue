<!--
  公共模态框组件
  基于 Ant Design Vue Modal
  通过 props 和 slots 控制样式和内容
-->
<template>
  <a-modal
    :open="visible"
    :title="title"
    :width="width"
    :mask-closable="closeOnClickModal"
    :confirm-loading="loading"
    :body-style="bodyStyle"
    @cancel="handleClose"
    @ok="handleConfirm"
  >
    <!-- 内容区 -->
    <slot></slot>

    <!-- 底部 -->
    <template v-if="showFooter" #footer>
      <slot name="footer">
        <a-button @click="handleClose" :disabled="loading">
          {{ cancelText }}
        </a-button>
        <a-button
          type="primary"
          @click="handleConfirm"
          :loading="loading"
          :disabled="confirmDisabled"
        >
          {{ confirmText }}
        </a-button>
      </slot>
    </template>

    <!-- 如果不显示底部，传入 null -->
    <template v-else #footer>
      <span></span>
    </template>
  </a-modal>
</template>

<script setup>
const props = defineProps({
  // 控制显示/隐藏
  visible: {
    type: Boolean,
    default: false
  },
  // 标题
  title: {
    type: String,
    default: '提示'
  },
  // 宽度
  width: {
    type: [String, Number],
    default: 600
  },
  // 是否显示底部
  showFooter: {
    type: Boolean,
    default: true
  },
  // 取消按钮文字
  cancelText: {
    type: String,
    default: '取消'
  },
  // 确认按钮文字
  confirmText: {
    type: String,
    default: '确认'
  },
  // 加载状态
  loading: {
    type: Boolean,
    default: false
  },
  // 确认按钮禁用状态
  confirmDisabled: {
    type: Boolean,
    default: false
  },
  // 点击遮罩层是否关闭
  closeOnClickModal: {
    type: Boolean,
    default: true
  },
  // body样式
  bodyStyle: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:visible', 'confirm', 'close', 'cancel'])

// 关闭模态框
const handleClose = () => {
  emit('update:visible', false)
  emit('close')
  emit('cancel')
}

// 确认
const handleConfirm = () => {
  emit('confirm')
}
</script>

