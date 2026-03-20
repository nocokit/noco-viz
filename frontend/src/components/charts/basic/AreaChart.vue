<!-- 面积图 - 强调数量随时间变化 -->
<template>
  <BaseChart :option="chartOption" v-bind="$attrs" />
</template>

<script setup>
import BaseChart from '../BaseChart.vue'
import { defaultAreaConfig } from '../configs/areaConfig'
import { useChartOption, mapCategoryValues } from '../utils/useChartOption'

const props = defineProps({
  config: { type: Object, default: () => ({}) },
  data: { type: [Object, Array], default: null },
  transform: { type: Function, default: null }
})

const chartOption = useChartOption(props, defaultAreaConfig, 'line', mapCategoryValues)
</script>
