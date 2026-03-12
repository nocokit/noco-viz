<template>
  <div class="panel-view flex-col">
    <div class="panel-header">
      <span>图层管理 ({{ components.length }})</span>
      <svg style="width:16px;height:16px;cursor:pointer" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path>
      </svg>
    </div>

    <div class="panel-body" style="padding: 8px 0;">
      <div
        v-for="comp in reversedComponents"
        :key="comp.id"
        :class="[
          'layer-item',
          {
            selected: selectedIds.includes(comp.id),
            locked: comp.locked
          }
        ]"
        @click="$emit('select', comp.id, $event)"
      >
        <svg class="layer-icon" viewBox="0 0 24 24">
          <path d="M5 13l4 4L19 7" fill="none" stroke="currentColor" stroke-width="2"></path>
        </svg>
        <span class="layer-name">{{ comp.name }}</span>
        <div class="layer-actions">
          <!-- 锁定/解锁按钮 -->
          <svg
            v-if="comp.locked"
            class="action-mini"
            viewBox="0 0 24 24"
            fill="currentColor"
            @click.stop="$emit('toggle-lock', comp.id)"
            title="解锁"
          >
            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6h1.9c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm0 12H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/>
          </svg>
          <svg
            v-else
            class="action-mini"
            viewBox="0 0 24 24"
            fill="currentColor"
            @click.stop="$emit('toggle-lock', comp.id)"
            title="锁定"
          >
            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/>
          </svg>
          <!-- 删除按钮 -->
          <svg
            class="action-mini"
            viewBox="0 0 24 24"
            fill="currentColor"
            @click.stop="$emit('delete', comp.id)"
            title="删除"
          >
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </div>
      </div>

      <div v-if="components.length === 0" style="padding: 20px; text-align: center; color: #666;">
        暂无图层
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  components: {
    type: Array,
    required: true
  },
  selectedIds: {
    type: Array,
    required: true
  }
})

defineEmits(['select', 'toggle-lock', 'delete'])

const reversedComponents = computed(() => {
  return [...props.components].reverse()
})
</script>

<style scoped>
.panel-view {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.flex-col {
  flex-direction: column;
}

.panel-header {
  height: 44px;
  min-height: 44px;
  border-bottom: 1px solid #2a2e35;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: #9ca3af;
  text-transform: uppercase;
}

.panel-body {
  flex: 1;
  overflow-y: auto;
}

.layer-item {
  display: flex;
  align-items: center;
  height: 32px;
  padding: 0 12px;
  font-size: 13px;
  color: #9ca3af;
  border-left: 2px solid transparent;
  cursor: pointer;
  transition: all 0.15s ease;
}

.layer-item:hover {
  background: rgba(255, 255, 255, 0.04);
  color: #e5e7eb;
}

.layer-item.selected {
  background: rgba(59, 130, 246, 0.1);
  color: #e5e7eb;
  border-left-color: #3b82f6;
  font-weight: 500;
}

.layer-item.locked {
  opacity: 0.5;
  cursor: not-allowed;
}

.layer-item.locked .layer-name {
  text-decoration: line-through;
}

.layer-icon {
  width: 14px;
  height: 14px;
  margin-right: 8px;
  opacity: 0.7;
  flex-shrink: 0;
}

.layer-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.layer-actions {
  margin-left: auto;
  display: flex;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.15s ease;
  flex-shrink: 0;
}

.layer-item:hover .layer-actions {
  opacity: 1;
}

.layer-item.locked .layer-actions {
  opacity: 1;
}

.action-mini {
  width: 14px;
  height: 14px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.action-mini:hover {
  color: #3b82f6;
  transform: scale(1.2);
}
</style>
