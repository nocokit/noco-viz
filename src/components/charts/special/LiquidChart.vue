<!--
  水波图组件
  动态展示百分比数据
-->
<template>
  <BaseChart :option="chartOption" v-bind="$attrs" />
</template>

<script setup>
import { computed, onMounted } from 'vue'
import * as echarts from 'echarts'
import BaseChart from '../BaseChart.vue'
import { defaultLiquidConfig } from '../configs/liquidConfig'

// 注册水波图类型（如果已安装 echarts-liquidfill）
onMounted(async () => {
  try {
    const liquidfill = await import('echarts-liquidfill')
    // liquidfill plugin auto-registers with echarts
  } catch (e) {
    console.warn('echarts-liquidfill not installed')
  }
})

const props = defineProps({
  config: {
    type: Object,
    default: () => ({})
  },
  data: {
    type: Object,
    default: null
  }
})

const chartOption = computed(() => {
  if (props.data?.value !== undefined) {
    return {
      ...defaultLiquidConfig,
      series: [
        {
          ...defaultLiquidConfig.series[0],
          data: [props.data.value]
        }
      ],
      ...props.config
    }
  }

  return {
    ...defaultLiquidConfig,
    ...props.config
  }
})
</script>
