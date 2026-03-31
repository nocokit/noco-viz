<template>
  <div class="grid-control">
    <ToolbarButton
      :active="enabled"
      title="显示/隐藏网格"
      @click="$emit('toggle')"
    >
      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
        <path d="M10 10h4v4h-4v-4zm0-6h4v4h-4V4zm0 12h4v4h-4v-4zM4 10h4v4H4v-4zm0-6h4v4H4V4zm0 12h4v4H4v-4zm12-6h4v4h-4v-4zm0-6h4v4h-4V4zm0 12h4v4h-4v-4z"/>
      </svg>
    </ToolbarButton>

    <a-dropdown v-if="enabled" trigger="click">
      <ToolbarButton title="网格类型">
        <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
          <path d="M7 10l5 5 5-5z"/>
        </svg>
      </ToolbarButton>
      <template #overlay>
        <a-menu @click="({ key }) => $emit('change-type', key)">
          <template v-for="item in gridTypeOptions">
            <a-menu-divider v-if="item.divider" :key="'divider-' + item.key" />
            <a-menu-item v-else :key="item.key">
              <span :style="{ fontWeight: type === item.key ? 'bold' : 'normal' }">
                {{ item.label }}
              </span>
            </a-menu-item>
          </template>
        </a-menu>
      </template>
    </a-dropdown>
  </div>
</template>

<script setup>
import ToolbarButton from './ToolbarButton.vue'
import { gridTypeOptionsConfig } from '../config/toolbarConfig.js'

defineProps({
  enabled: Boolean,
  type: String
})

defineEmits(['toggle', 'change-type'])

const gridTypeOptions = gridTypeOptionsConfig
</script>

<style scoped>
.grid-control {
  display: flex;
  align-items: center;
  gap: 4px;
}
</style>
