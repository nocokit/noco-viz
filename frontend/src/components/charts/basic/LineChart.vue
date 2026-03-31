<!-- 折线图 - 展示数据趋势变化 -->
<template>
  <BaseChart :option="chartOption" v-bind="$attrs" />
</template>

<script setup>
import BaseChart from '../BaseChart.vue'
import { defaultLineConfig } from '../configs/lineConfig'
import { useChartOption, mapCategoryValues } from '../utils/useChartOption'

const props = defineProps({
  config: { type: Object, default: () => ({}) },
  data: { type: [Object, Array], default: null },
  transform: { type: Function, default: null }
})

const chartOption = useChartOption(props, defaultLineConfig, 'line', mapCategoryValues)
</script>
