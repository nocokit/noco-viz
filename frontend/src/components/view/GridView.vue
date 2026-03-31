<template>
  <div v-loading="loading" class="grid-view">
    <div v-if="data.length === 0" class="grid-empty">
      <slot name="empty">
        <EmptyState />
      </slot>
    </div>
    <div v-else :class="['grid-container', gridClass]" :style="gridStyle">
      <div
        v-for="(item, index) in data"
        :key="getItemKey(item, index)"
        class="grid-item"
      >
        <slot name="item" :item="item" :index="index">
          {{ item }}
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import EmptyState from '../state/EmptyState.vue'

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  },
  columns: {
    type: Number,
    default: 0
  },
  minWidth: {
    type: String,
    default: '320px'
  },
  gap: {
    type: String,
    default: '20px'
  },
  loading: {
    type: Boolean,
    default: false
  },
  itemKey: {
    type: String,
    default: 'id'
  }
})

const gridClass = computed(() => {
  return props.columns > 0 ? `grid-fixed-${props.columns}` : 'grid-auto'
})

const gridStyle = computed(() => {
  const style = {
    gap: props.gap
  }

  if (props.columns === 0) {
    style.gridTemplateColumns = `repeat(auto-fill, minmax(${props.minWidth}, 1fr))`
  }

  return style
})

const getItemKey = (item, index) => {
  return item[props.itemKey] || index
}
</script>

