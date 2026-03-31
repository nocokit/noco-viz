<template>
  <div ref="containerRef" class="virtual-table">
    <div class="virtual-table-header">
      <table>
        <thead>
          <tr>
            <th
              v-for="column in columns"
              :key="column.prop"
              :style="{ width: column.width || 'auto' }"
            >
              {{ column.label }}
            </th>
          </tr>
        </thead>
      </table>
    </div>

    <div class="virtual-table-body" @scroll="handleScroll">
      <div class="virtual-table-phantom" :style="{ height: totalHeight + 'px' }"></div>
      <table>
        <tbody :style="{ transform: `translateY(${offset}px)` }">
          <tr
            v-for="item in visibleData"
            :key="item[rowKey]"
            :style="{ height: rowHeight + 'px' }"
            @click="handleRowClick(item)"
          >
            <td
              v-for="column in columns"
              :key="column.prop"
              :style="{ width: column.width || 'auto' }"
            >
              <slot
                v-if="column.slot"
                :name="column.slot"
                :row="item"
                :column="column"
              ></slot>
              <span v-else>{{ item[column.prop] }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  // 数据列表
  data: {
    type: Array,
    required: true,
    default: () => []
  },
  // 列配置
  columns: {
    type: Array,
    required: true,
    default: () => []
  },
  // 行高
  rowHeight: {
    type: Number,
    default: 48
  },
  // 表格高度
  height: {
    type: [Number, String],
    default: '500px'
  },
  // 缓冲区
  buffer: {
    type: Number,
    default: 5
  },
  // 行唯一key
  rowKey: {
    type: String,
    default: 'id'
  }
})

const emit = defineEmits(['row-click', 'scroll', 'reach-bottom'])

const containerRef = ref(null)
const scrollTop = ref(0)
const containerHeight = ref(0)

const totalHeight = computed(() => props.data.length * props.rowHeight)

const startIndex = computed(() => {
  return Math.max(0, Math.floor(scrollTop.value / props.rowHeight) - props.buffer)
})

const endIndex = computed(() => {
  const end = Math.ceil((scrollTop.value + containerHeight.value) / props.rowHeight) + props.buffer
  return Math.min(props.data.length, end)
})

const visibleData = computed(() => {
  return props.data.slice(startIndex.value, endIndex.value)
})

const offset = computed(() => startIndex.value * props.rowHeight)

const handleScroll = (e) => {
  scrollTop.value = e.target.scrollTop

  emit('scroll', {
    scrollTop: scrollTop.value,
    scrollHeight: e.target.scrollHeight,
    clientHeight: e.target.clientHeight
  })

  if (scrollTop.value + containerHeight.value >= totalHeight.value - props.rowHeight) {
    emit('reach-bottom')
  }
}

const handleRowClick = (row) => {
  emit('row-click', row)
}

const updateContainerHeight = () => {
  if (containerRef.value) {
    const bodyEl = containerRef.value.querySelector('.virtual-table-body')
    if (bodyEl) {
      containerHeight.value = bodyEl.clientHeight
    }
  }
}

let resizeObserver = null

onMounted(() => {
  updateContainerHeight()

  if (window.ResizeObserver) {
    resizeObserver = new ResizeObserver(() => {
      updateContainerHeight()
    })
    resizeObserver.observe(containerRef.value)
  } else {
    window.addEventListener('resize', updateContainerHeight)
  }
})

onBeforeUnmount(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
  } else {
    window.removeEventListener('resize', updateContainerHeight)
  }
})
</script>

