<!--
  词云图组件
  关键词频率可视化
  需要: echarts-wordcloud 插件
-->
<template>
  <div ref="chartRef" class="wordcloud-chart"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'
import { getWordCloudOption } from '@/config/charts/wordCloudConfig'

const props = defineProps({
  config: {
    type: Object,
    default: () => ({})
  },
  data: {
    type: Array,
    default: null
  }
})

const chartRef = ref(null)
let chartInstance = null
let hasWordCloud = false

// 检查 echarts-wordcloud 是否已加载
const checkWordCloud = () => {
  try {
    // 尝试导入 echarts-wordcloud，如果失败则显示提示
    require('echarts-wordcloud')
    hasWordCloud = true
  } catch (e) {
    console.warn('echarts-wordcloud 未安装，词云图功能不可用')
    hasWordCloud = false
  }
}

const initChart = () => {
  if (!chartRef.value) return

  checkWordCloud()

  if (!hasWordCloud) {
    // 显示提示信息
    showPlaceholder()
    return
  }

  // 初始化图表
  chartInstance = echarts.init(chartRef.value)

  // 获取配置选项
  const option = getWordCloudOption(props.config, props.data)

  // 设置配置
  chartInstance.setOption(option)

  // 监听窗口大小变化
  window.addEventListener('resize', handleResize)
}

const showPlaceholder = () => {
  if (!chartRef.value) return

  chartRef.value.innerHTML = `
    <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #0a1929 0%, #001529 100%); border: 1px solid #9966ff; border-radius: 4px;">
      <div style="text-align: center; color: #bcd0e3; padding: 30px;">
        <svg style="width: 64px; height: 64px; margin-bottom: 16px; color: #9966ff;" viewBox="0 0 24 24" fill="currentColor">
          <path d="M5,6 L10,6 M5.5,7 L9.5,7 M13,5 L19,5 M13.5,6 L18.5,6 M14,7 L18,7 M4,10 L9,10 M4.5,11 L8.5,11 M11,10 L16,10 M11.5,11 L15.5,11 M18,9 L21,9 M18.5,10 L20.5,10 M6,14 L12,14 M6.5,15 L11.5,15 M7,16 L11,16 M14,14 L19,14 M14.5,15 L18.5,15 M5,18 L10,18 M5.5,19 L9.5,19 M12,18 L16,18 M12.5,19 L15.5,19"/>
        </svg>
        <div style="font-size: 20px; font-weight: bold; margin-bottom: 12px; color: #9966ff;">词云图组件</div>
        <div style="font-size: 13px; opacity: 0.8; margin-bottom: 16px;">需要安装 echarts-wordcloud 插件支持</div>
        <code style="display: inline-block; padding: 8px 16px; background: rgba(153, 102, 255, 0.1); border: 1px solid #9966ff; border-radius: 4px; font-size: 12px; font-family: 'Courier New', monospace; color: #9966ff;">npm install echarts-wordcloud</code>
        <div style="margin-top: 20px; display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; align-items: center;">
          <span style="font-size: 24px; color: #00f2f2; font-weight: bold;">数据</span>
          <span style="font-size: 18px; color: #0099cc; font-weight: bold;">可视化</span>
          <span style="font-size: 28px; color: #ff6b9d; font-weight: bold;">大屏</span>
          <span style="font-size: 16px; color: #ffaa00; font-weight: bold;">图表</span>
          <span style="font-size: 20px; color: #9966ff; font-weight: bold;">ECharts</span>
        </div>
      </div>
    </div>
  `
}

const updateChart = () => {
  if (!chartInstance || !hasWordCloud) return

  const option = getWordCloudOption(props.config, props.data)
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
.wordcloud-chart {
  width: 100%;
  height: 100%;
  min-height: 300px;
}
</style>
