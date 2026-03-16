<!--
  词云图组件
  关键词频率可视化
-->
<template>
  <div ref="chartRef" class="wordcloud-chart" :style="{ width: width + 'px', height: height + 'px' }"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'
import 'echarts-wordcloud'
import { getWordCloudOption } from '@/config/charts/wordCloudConfig'

const props = defineProps({
  config: {
    type: Object,
    default: () => ({})
  },
  data: {
    type: Array,
    default: null
  },
  width: {
    type: Number,
    default: 400
  },
  height: {
    type: Number,
    default: 300
  }
})

const chartRef = ref(null)
let chartInstance = null

const initChart = () => {
  if (!chartRef.value) return
  if (chartInstance) {
    chartInstance.dispose()
  }
  chartInstance = echarts.init(chartRef.value)
  updateChart()
}

const updateChart = () => {
  if (!chartInstance) return
  const option = getWordCloudOption(props.config, props.data)
  chartInstance.setOption(option, true)
}

watch(
  () => [props.config, props.data],
  () => updateChart(),
  { deep: true }
)

watch(
  () => [props.width, props.height],
  () => {
    if (chartInstance) {
      chartInstance.resize()
    }
  }
)

onMounted(() => {
  initChart()
})

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
})
</script>

<style scoped>
.wordcloud-chart {
  width: 100%;
  height: 100%;
}
</style>
