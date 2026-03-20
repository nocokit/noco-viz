<!-- 饼图 - 展示数据占比关系 -->
<template>
  <BaseChart :option="chartOption" v-bind="$attrs" />
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

const chartOption = useChartOption(props, defaultPieConfig, 'pie', mapSeriesData)
</script>
