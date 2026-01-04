<template>
  <span :class="['status-badge', `status-badge--${computedType}`]" :style="customStyle">
    <span v-if="withDot" class="status-badge__dot"></span>
    <span class="status-badge__text">{{ text || defaultText }}</span>
  </span>
</template>

<script setup>
import { computed } from 'vue'
import { getStatusColor } from '@/utils/color'

const props = defineProps({
  // 状态类型: success, error, warning, info, default
  type: {
    type: String,
    default: ''
  },
  // 显示文本
  text: {
    type: String,
    default: ''
  },
  // 状态值(用于自动推断type)
  status: {
    type: String,
    default: ''
  },
  // 是否显示圆点
  withDot: {
    type: Boolean,
    default: true
  },
  // 自定义颜色
  color: {
    type: String,
    default: ''
  }
})

const statusMap = {
  success: { text: '成功', type: 'success' },
  running: { text: '运行中', type: 'success' },
  active: { text: '激活', type: 'success' },
  online: { text: '在线', type: 'success' },
  connected: { text: '已连接', type: 'success' },

  error: { text: '错误', type: 'error' },
  failed: { text: '失败', type: 'error' },
  offline: { text: '离线', type: 'error' },
  disconnected: { text: '已断开', type: 'error' },

  warning: { text: '警告', type: 'warning' },
  pending: { text: '待处理', type: 'warning' },
  processing: { text: '处理中', type: 'warning' },

  info: { text: '信息', type: 'info' },
  cached: { text: '已缓存', type: 'info' },

  default: { text: '默认', type: 'default' },
  disabled: { text: '已禁用', type: 'default' },
  draft: { text: '草稿', type: 'default' },
  idle: { text: '闲置', type: 'default' }
}

const computedType = computed(() => {
  if (props.type) return props.type
  if (props.status && statusMap[props.status]) {
    return statusMap[props.status].type
  }
  return 'default'
})

const defaultText = computed(() => {
  if (props.status && statusMap[props.status]) {
    return statusMap[props.status].text
  }
  return ''
})

const customStyle = computed(() => {
  if (props.color) {
    return {
      color: props.color,
      background: `${props.color}1A`, // 10% opacity
      borderColor: `${props.color}33`  // 20% opacity
    }
  }
  return {}
})
</script>

<style scoped>
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 12px;
  border: 1px solid;
  white-space: nowrap;
  font-weight: 500;
}

.status-badge__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: currentColor;
}

.status-badge--success {
  color: #67c23a;
  background: rgba(103, 194, 58, 0.1);
  border-color: rgba(103, 194, 58, 0.2);
}

.status-badge--error {
  color: #f56c6c;
  background: rgba(245, 108, 108, 0.1);
  border-color: rgba(245, 108, 108, 0.2);
}

.status-badge--warning {
  color: #e6a23c;
  background: rgba(230, 162, 60, 0.1);
  border-color: rgba(230, 162, 60, 0.2);
}

.status-badge--info {
  color: #409eff;
  background: rgba(64, 158, 255, 0.1);
  border-color: rgba(64, 158, 255, 0.2);
}

.status-badge--default {
  color: #909399;
  background: rgba(144, 147, 153, 0.1);
  border-color: rgba(144, 147, 153, 0.2);
}
</style>
