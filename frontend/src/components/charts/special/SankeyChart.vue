<!-- 桑基图 - 展示数据流向关系 -->
<template>
  <BaseChart :option="chartOption" v-bind="$attrs" />
</template>

<script setup>
import BaseChart from '../BaseChart.vue'
import { defaultSankeyConfig } from '../configs/sankeyConfig'
import { useChartOption, mapSankeyData } from '../utils/useChartOption'

const props = defineProps({
  config: { type: Object, default: () => ({}) },
  data: { type: [Object, Array], default: null },
  transform: { type: Function, default: null }
})

const chartOption = useChartOption(props, defaultSankeyConfig, 'sankey', mapSankeyData)
</script>
