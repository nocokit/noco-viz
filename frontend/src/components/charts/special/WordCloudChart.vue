<!-- 词云图 - 关键词频率可视化 -->
<template>
  <BaseChart :option="chartOption" v-bind="$attrs" />
</template>

<script setup>
import 'echarts-wordcloud'
import BaseChart from '../BaseChart.vue'
import { defaultWordCloudConfig } from '../configs/wordCloudConfig'
import { useChartOption, mapSeriesData } from '../utils/useChartOption'

const props = defineProps({
  config: { type: Object, default: () => ({}) },
  data: { type: Array, default: null },
  transform: { type: Function, default: null }
})

const chartOption = useChartOption(props, defaultWordCloudConfig, 'wordCloud', mapSeriesData)
</script>
