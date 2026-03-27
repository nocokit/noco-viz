<!-- 散点图 - 展示变量之间的关系 -->
<template>
  <BaseChart :option="chartOption" v-bind="$attrs" />
</template>

<script setup>
import BaseChart from '../BaseChart.vue'
import { defaultScatterConfig } from '../configs/scatterConfig'
import { useChartOption, mapScatterData } from '../utils/useChartOption'

const props = defineProps({
  config: { type: Object, default: () => ({}) },
  data: { type: [Object, Array], default: null },
  transform: { type: Function, default: null }
})

const chartOption = useChartOption(props, defaultScatterConfig, 'scatter', mapScatterData)
</script>
