<!-- 水波图 - 动态展示百分比数据 -->
<template>
  <BaseChart :option="chartOption" v-bind="$attrs" />
</template>

<script setup>
import 'echarts-liquidfill'
import BaseChart from '../BaseChart.vue'
import { defaultLiquidConfig } from '../configs/liquidConfig'
import { useChartOption } from '../utils/useChartOption'

const props = defineProps({
  config: { type: Object, default: () => ({}) },
  data: { type: [Object, Array], default: null },
  transform: { type: Function, default: null }
})

const chartOption = useChartOption(props, defaultLiquidConfig, 'liquidFill', (base, data) => {
  if (data?.value !== undefined) {
    return { ...base, series: [{ ...base.series[0], data: [data.value] }] }
  }
})
</script>
