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
let hasEchartsGL = false

// 检查 echarts-gl 是否已加载
const checkEchartsGL = () => {
  try {
    // 尝试导入 echarts-gl，如果失败则显示提示
    require('echarts-gl')
    hasEchartsGL = true
  } catch (e) {
    console.warn('echarts-gl 未安装，3D地图功能不可用')
    hasEchartsGL = false
  }
}

const initChart = () => {
  if (!chartRef.value) return

  checkEchartsGL()

  if (!hasEchartsGL) {
    // 显示提示信息
    showPlaceholder()
    return
  }

  // 初始化图表
  chartInstance = echarts.init(chartRef.value)

  // 获取配置选项
  const option = getMap3DOption(props.config, props.data)

  // 设置配置
  chartInstance.setOption(option)

  // 监听窗口大小变化
  window.addEventListener('resize', handleResize)
}

const showPlaceholder = () => {
  if (!chartRef.value) return

  chartRef.value.innerHTML = `
    <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #0a1929 0%, #001529 100%); border: 1px solid #00f2f2; border-radius: 4px;">
      <div style="text-align: center; color: #bcd0e3; padding: 30px;">
        <svg style="width: 64px; height: 64px; margin-bottom: 16px; color: #00f2f2;" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12,3 L21,8 L21,16 L12,21 L3,16 L3,8 Z M12,3 L12,12 M12,12 L21,16 M12,12 L3,16 M8,6 L8,11 L12,13 M16,11 L16,6 L12,4 M6,14 L8,15 M10,16 L12,17 M14,16 L16,15 M18,14 L19,13.5"/>
        </svg>
        <div style="font-size: 20px; font-weight: bold; margin-bottom: 12px; color: #00f2f2;">3D地图组件</div>
        <div style="font-size: 13px; opacity: 0.8; margin-bottom: 16px;">需要安装 echarts-gl 插件支持</div>
        <code style="display: inline-block; padding: 8px 16px; background: rgba(0, 242, 242, 0.1); border: 1px solid #00f2f2; border-radius: 4px; font-size: 12px; font-family: 'Courier New', monospace; color: #00f2f2;">npm install echarts-gl</code>
      </div>
    </div>
  `
}

const updateChart = () => {
  if (!chartInstance || !hasEchartsGL) return

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
