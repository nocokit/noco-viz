<!--
  旭日图组件
  多层级关系展示
-->
<template>
  <BaseChart :option="chartOption" v-bind="$attrs" />
</template>

<script setup>
import BaseChart from '../BaseChart.vue'
import { defaultSunburstConfig } from '../configs/sunburstConfig'
import { useChartOption, mapSeriesData } from '../utils/useChartOption'

const props = defineProps({
  config: { type: Object, default: () => ({}) },
  data: { type: Array, default: null },
  transform: { type: Function, default: null }
})

const chartOption = useChartOption(props, defaultSunburstConfig, 'sunburst', mapSeriesData)
</script>
