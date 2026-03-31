<!-- 雷达图 - 多维度数据对比 -->
<template>
  <BaseChart :option="chartOption" v-bind="$attrs" />
</template>

<script setup>
import BaseChart from '../BaseChart.vue'
import { defaultRadarConfig } from '../configs/radarConfig'
import { useChartOption, mapRadarData } from '../utils/useChartOption'

const props = defineProps({
  config: { type: Object, default: () => ({}) },
  data: { type: [Object, Array], default: null },
  transform: { type: Function, default: null }
})

const chartOption = useChartOption(props, defaultRadarConfig, 'radar', mapRadarData)
</script>
