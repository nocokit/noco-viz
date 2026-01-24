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

<style scoped>
.grid-view {
  width: 100%;
  min-height: 200px;
}

.grid-container {
  display: grid;
}

.grid-auto {
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
}

.grid-fixed-1 {
  grid-template-columns: repeat(1, 1fr);
}

.grid-fixed-2 {
  grid-template-columns: repeat(2, 1fr);
}

.grid-fixed-3 {
  grid-template-columns: repeat(3, 1fr);
}

.grid-fixed-4 {
  grid-template-columns: repeat(4, 1fr);
}

.grid-fixed-5 {
  grid-template-columns: repeat(5, 1fr);
}

.grid-fixed-6 {
  grid-template-columns: repeat(6, 1fr);
}

.grid-item {
  min-width: 0;
}

.grid-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

@media (max-width: 1200px) {
  .grid-fixed-6 {
    grid-template-columns: repeat(4, 1fr);
  }

  .grid-fixed-5 {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .grid-auto {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }

  .grid-fixed-4,
  .grid-fixed-5,
  .grid-fixed-6 {
    grid-template-columns: repeat(2, 1fr);
  }

  .grid-fixed-3 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .grid-auto,
  .grid-fixed-2,
  .grid-fixed-3,
  .grid-fixed-4,
  .grid-fixed-5,
  .grid-fixed-6 {
    grid-template-columns: 1fr;
  }
}
</style>
