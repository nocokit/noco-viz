<!-- 漏斗图 - 业务流程转化率分析 -->
<template>
  <BaseChart :option="chartOption" v-bind="$attrs" />
</template>

<script setup>
import BaseChart from '../BaseChart.vue'
import { defaultFunnelConfig } from '../configs/funnelConfig'
import { useChartOption, mapSeriesData } from '../utils/useChartOption'

const props = defineProps({
  config: { type: Object, default: () => ({}) },
  data: { type: Array, default: null },
  transform: { type: Function, default: null }
})

const chartOption = useChartOption(props, defaultFunnelConfig, 'funnel', mapSeriesData)
</script>
