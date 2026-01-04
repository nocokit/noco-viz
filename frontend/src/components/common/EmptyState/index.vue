<template>
  <div class="empty-state">
    <div class="empty-state__icon">
      <slot name="icon">
        <el-icon :size="iconSize">
          <component :is="iconComponent" />
        </el-icon>
      </slot>
    </div>
    <div class="empty-state__description">
      <slot>{{ description || '暂无数据' }}</slot>
    </div>
    <div v-if="actionText || $slots.action" class="empty-state__action">
      <slot name="action">
        <el-button v-if="actionText" type="primary" @click="handleAction">
          {{ actionText }}
        </el-button>
      </slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Document, FolderOpened, Picture, Loading } from '@element-plus/icons-vue'

const props = defineProps({
  description: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: 'document'
  },
  iconSize: {
    type: Number,
    default: 64
  },
  actionText: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['action'])

const iconMap = {
  document: Document,
  folder: FolderOpened,
  picture: Picture,
  loading: Loading
}

const iconComponent = computed(() => iconMap[props.icon] || Document)

const handleAction = () => {
  emit('action')
}
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: var(--el-text-color-secondary);
}

.empty-state__icon {
  margin-bottom: 16px;
  color: var(--el-text-color-placeholder);
  opacity: 0.5;
}

.empty-state__description {
  font-size: 14px;
  margin-bottom: 20px;
  color: var(--el-text-color-regular);
}

.empty-state__action {
  margin-top: 8px;
}
</style>
