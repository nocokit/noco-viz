<!--
  矩形树图组件
  层级数据占比可视化
-->
<template>
  <BaseChart :option="chartOption" v-bind="$attrs" />
</template>

<script setup>
import BaseChart from '../BaseChart.vue'
import { defaultTreemapConfig } from '../configs/treemapConfig'
import { useChartOption } from '../utils/useChartOption'

const props = defineProps({
  config: { type: Object, default: () => ({}) },
  data: { type: Array, default: null },
  transform: { type: Function, default: null }
})

const chartOption = useChartOption(props, defaultTreemapConfig, 'treemap')
</script>
