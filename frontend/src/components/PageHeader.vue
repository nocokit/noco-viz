<template>
  <a-page-header
    :title="title"
    :sub-title="description || subtitle"
    :style="{ marginBottom: '16px' }"
  >
    <template #extra>
      <a-space>
        <!-- 统计信息 -->
        <a-statistic
          v-for="stat in stats"
          :key="stat.label"
          :title="stat.label"
          :value="stat.value"
          :style="{ marginRight: '32px' }"
        />

        <!-- 操作按钮 -->
        <slot name="actions">
          <a-button
            v-for="action in actions"
            :key="action.key || action.text"
            :type="action.type || 'default'"
            :disabled="action.disabled"
            @click="handleAction(action)"
          >
            <template v-if="action.icon" #icon>
              <component :is="action.icon" />
            </template>
            {{ action.text }}
          </a-button>
        </slot>
      </a-space>
    </template>

    <template #default>
      <slot name="content"></slot>
    </template>
  </a-page-header>
</template>

<script setup>
const props = defineProps({
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  actions: { type: Array, default: () => [] },
  stats: { type: Array, default: () => [] }
})

const emit = defineEmits(['action'])

const handleAction = (action) => {
  if (action.handler) {
    action.handler()
  }
  emit('action', action)
}
</script>

