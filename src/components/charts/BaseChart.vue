<!--
  ECharts 基础包装器组件
  所有图表组件都继承自此组件
-->
<template>
  <div ref="chartRef" :style="chartStyle"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  option: {
    type: Object,
    required: true
  },
  width: {
    type: [Number, String],
    default: '100%'
  },
  height: {
    type: [Number, String],
    default: '100%'
  },
  theme: {
    type: String,
    default: 'dark'
  }
})

const chartRef = ref(null)
let chartInstance = null

const chartStyle = computed(() => ({
  width: typeof props.width === 'number' ? `${props.width}px` : props.width,
  height: typeof props.height === 'number' ? `${props.height}px` : props.height
}))

const initChart = () => {
  if (!chartRef.value) return

  // 初始化图表实例
  chartInstance = echarts.init(chartRef.value, props.theme)
  chartInstance.setOption(props.option)

  // 添加窗口resize监听
  window.addEventListener('resize', handleResize)
}

const handleResize = () => {
  chartInstance?.resize()
}

// 监听配置变化
watch(() => props.option, (newOption) => {
  if (chartInstance) {
    chartInstance.setOption(newOption, true)
  }
}, { deep: true })

// 监听主题变化
watch(() => props.theme, () => {
  if (chartInstance) {
    chartInstance.dispose()
    initChart()
  }
})

onMounted(() => {
  initChart()
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  chartInstance?.dispose()
  chartInstance = null
})

// 暴露实例方法
defineExpose({
  getInstance: () => chartInstance,
  resize: handleResize
})
</script>

<style scoped>
div {
  width: 100%;
  height: 100%;
}
</style>
