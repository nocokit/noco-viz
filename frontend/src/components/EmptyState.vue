<template>
  <a-empty :description="description || '暂无数据'">
    <template #image>
      <slot name="icon">
        <InboxOutlined style="font-size: 64px; color: #d9d9d9;" />
      </slot>
    </template>
    <template v-if="actionText || $slots.action" #description>
      <div class="empty-description">
        {{ description || '暂无数据' }}
      </div>
      <div class="empty-action">
        <slot name="action">
          <a-button v-if="actionText" type="primary" @click="handleAction">
            {{ actionText }}
          </a-button>
        </slot>
      </div>
    </template>
  </a-empty>
</template>

<script setup>
import { InboxOutlined } from '@ant-design/icons-vue'

const props = defineProps({
  description: {
    type: String,
    default: ''
  },
  actionText: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['action'])

const handleAction = () => {
  emit('action')
}
</script>

<style scoped>
.empty-description {
  margin-bottom: 16px;
  color: #8c8c8c;
  font-size: 14px;
}

.empty-action {
  margin-top: 16px;
}
</style>
