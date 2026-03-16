<!--
  3D地图组件
  立体地图可视化
  需要: echarts-gl 插件
-->
<template>
  <div ref="chartRef" class="map-3d-chart"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'
import 'echarts-gl'
import { getMap3DOption } from '@/config/charts/map3DConfig'

const props = defineProps({
  config: {
    type: Object,
    default: () => ({})
  },
  data: {
    type: [Array, Object],
    default: null
  }
})

const chartRef = ref(null)
let chartInstance = null
const mapReady = ref(false)

// 加载中国地图数据
const loadChinaMap = async () => {
  if (echarts.getMap('china')) {
    mapReady.value = true
    return
  }

  try {
    const res = await fetch('https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json')
    const geoJson = await res.json()
    echarts.registerMap('china', geoJson)
    mapReady.value = true
  } catch (e) {
    console.error('中国地图数据加载失败', e)
    showError('地图数据加载失败')
  }
}

const initChart = async () => {
  if (!chartRef.value) return

  // 先加载地图数据
  await loadChinaMap()

  if (!mapReady.value) return

  // 初始化图表
  chartInstance = echarts.init(chartRef.value)

  // 获取配置选项
  const option = getMap3DOption(props.config, props.data)

  // 设置配置
  chartInstance.setOption(option)

  // 监听窗口大小变化
  window.addEventListener('resize', handleResize)
}

const showError = (message) => {
  if (!chartRef.value) return

  chartRef.value.innerHTML = `
    <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #0a1929 0%, #001529 100%); border: 1px solid #ff4466; border-radius: 4px;">
      <div style="text-align: center; color: #bcd0e3; padding: 30px;">
        <svg style="width: 64px; height: 64px; margin-bottom: 16px; color: #ff4466;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <div style="font-size: 16px; font-weight: bold; color: #ff4466;">${message}</div>
      </div>
    </div>
  `
}

const updateChart = () => {
  if (!chartInstance || !mapReady.value) return

  const option = getMap3DOption(props.config, props.data)
  chartInstance.setOption(option, true)
}

const handleResize = () => {
  if (chartInstance) {
    chartInstance.resize()
  }
}

// 监听配置和数据变化
watch(
  () => [props.config, props.data],
  () => {
    updateChart()
  },
  { deep: true }
)

onMounted(() => {
  initChart()
})

onUnmounted(() => {
  if (chartInstance) {
    window.removeEventListener('resize', handleResize)
    chartInstance.dispose()
    chartInstance = null
  }
})
</script>

<style scoped>
.map-3d-chart {
  width: 100%;
  height: 100%;
  min-height: 400px;
}
</style>