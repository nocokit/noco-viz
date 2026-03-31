<!-- 环形图 - 基于饼图，radius 设为环形 -->
<template>
  <BaseChart :option="chartOption" :style="{ width: '100%', height: '100%' }" />
</template>

<script setup>
import BaseChart from '../BaseChart.vue'
import { defaultPieConfig } from '../configs/pieConfig'
import { useChartOption, mapSeriesData } from '../utils/useChartOption'

const props = defineProps({
  config: { type: Object, default: () => ({}) },
  data: { type: Array, default: null },
  transform: { type: Function, default: null }
})

const doughnutBase = {
  ...defaultPieConfig,
  series: [{ ...defaultPieConfig.series[0], radius: ['50%', '70%'] }]
}

const chartOption = useChartOption(props, doughnutBase, 'pie', mapSeriesData)
</script>
