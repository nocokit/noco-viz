<!-- 热力图 - 展示数据密度分布 -->
<template>
  <BaseChart :option="chartOption" v-bind="$attrs" />
</template>

<script setup>
import BaseChart from '../BaseChart.vue'
import { defaultHeatmapConfig } from '../configs/heatmapConfig'
import { useChartOption, mapHeatmapData } from '../utils/useChartOption'

const props = defineProps({
  config: { type: Object, default: () => ({}) },
  data: { type: Array, default: null }
})

const chartOption = useChartOption(props, defaultHeatmapConfig, 'heatmap', mapHeatmapData)
</script>
