<!-- 仪表盘 - 展示进度或指标完成度 -->
<template>
  <BaseChart :option="chartOption" v-bind="$attrs" />
</template>

<script setup>
import BaseChart from '../BaseChart.vue'
import { defaultGaugeConfig } from '../configs/gaugeConfig'
import { useChartOption, mapSingleValue } from '../utils/useChartOption'

const props = defineProps({
  config: { type: Object, default: () => ({}) },
  data: { type: [Object, Array], default: null },
  transform: { type: Function, default: null }
})

const chartOption = useChartOption(props, defaultGaugeConfig, 'gauge', mapSingleValue)
</script>
