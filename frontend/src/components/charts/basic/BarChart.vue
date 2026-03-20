<!-- 基础柱状图 - 用于对比不同类目的数据 -->
<template>
  <BaseChart :option="chartOption" v-bind="$attrs" />
</template>

<script setup>
import BaseChart from '../BaseChart.vue'
import { defaultBarConfig } from '../configs/barConfig'
import { useChartOption, mapCategoryValues } from '../utils/useChartOption'

const props = defineProps({
  config: { type: Object, default: () => ({}) },
  data: { type: [Object, Array], default: null },
  transform: { type: Function, default: null }
})

const chartOption = useChartOption(props, defaultBarConfig, 'bar', mapCategoryValues)
</script>
