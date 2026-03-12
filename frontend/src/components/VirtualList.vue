<template>
  <div ref="containerRef" class="virtual-list" @scroll="handleScroll">
    <div class="virtual-list-phantom" :style="{ height: totalHeight + 'px' }"></div>
    <div class="virtual-list-content" :style="{ transform: `translateY(${offset}px)` }">
      <div
        v-for="item in visibleData"
        :key="item[itemKey]"
        class="virtual-list-item"
        :style="{ height: itemHeight + 'px' }"
      >
        <slot :item="item" :index="item.index"></slot>
      </div>
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
  // 每项高度
  itemHeight: {
    type: Number,
    default: 50
  },
  // 容器高度
  height: {
    type: [Number, String],
    default: '100%'
  },
  // 缓冲区数量(上下各渲染多少项)
  buffer: {
    type: Number,
    default: 5
  },
  // 唯一key字段
  itemKey: {
    type: String,
    default: 'id'
  }
})

const emit = defineEmits(['scroll', 'reach-bottom'])

// 容器引用
const containerRef = ref(null)

// 滚动位置
const scrollTop = ref(0)

// 容器高度
const containerHeight = ref(0)

// 总高度
const totalHeight = computed(() => props.data.length * props.itemHeight)

// 可见区域起始索引
const startIndex = computed(() => {
  return Math.max(0, Math.floor(scrollTop.value / props.itemHeight) - props.buffer)
})

// 可见区域结束索引
const endIndex = computed(() => {
  const end = Math.ceil((scrollTop.value + containerHeight.value) / props.itemHeight) + props.buffer
  return Math.min(props.data.length, end)
})

// 可见数据
const visibleData = computed(() => {
  return props.data.slice(startIndex.value, endIndex.value).map((item, index) => ({
    ...item,
    index: startIndex.value + index
  }))
})

// 偏移量
const offset = computed(() => startIndex.value * props.itemHeight)

// 处理滚动
const handleScroll = (e) => {
  scrollTop.value = e.target.scrollTop

  emit('scroll', {
    scrollTop: scrollTop.value,
    scrollHeight: e.target.scrollHeight,
    clientHeight: e.target.clientHeight
  })

  // 检查是否到达底部
  if (scrollTop.value + containerHeight.value >= totalHeight.value - props.itemHeight) {
    emit('reach-bottom')
  }
}

// 更新容器高度
const updateContainerHeight = () => {
  if (containerRef.value) {
    containerHeight.value = containerRef.value.clientHeight
  }
}

// 滚动到指定索引
const scrollToIndex = (index) => {
  if (containerRef.value) {
    containerRef.value.scrollTop = index * props.itemHeight
  }
}

// 滚动到顶部
const scrollToTop = () => {
  scrollToIndex(0)
}

// 滚动到底部
const scrollToBottom = () => {
  scrollToIndex(props.data.length - 1)
}

// 监听数据变化
watch(() => props.data, () => {
  // 数据变化时,如果当前滚动位置超出范围,重置到顶部
  if (scrollTop.value > totalHeight.value) {
    scrollToTop()
  }
}, { deep: true })

// 监听窗口大小变化
let resizeObserver = null

onMounted(() => {
  updateContainerHeight()

  // 使用ResizeObserver监听容器大小变化
  if (window.ResizeObserver) {
    resizeObserver = new ResizeObserver(() => {
      updateContainerHeight()
    })
    resizeObserver.observe(containerRef.value)
  } else {
    // 降级方案:监听window resize
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

// 暴露方法
defineExpose({
  scrollToIndex,
  scrollToTop,
  scrollToBottom
})
</script>

