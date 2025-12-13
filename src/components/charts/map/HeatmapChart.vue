<!--
  热力图组件
  展示数据密度分布
-->
<template>
  <BaseChart :option="chartOption" v-bind="$attrs" />
</template>

<script setup>
import { computed } from 'vue'
import BaseChart from '../BaseChart.vue'
import { defaultHeatmapConfig } from '../configs/heatmapConfig'

const props = defineProps({
  config: {
    type: Object,
    default: () => ({})
  },
  data: {
    type: Array,
    default: null
  }
})

const chartOption = computed(() => {
  if (props.data && Array.isArray(props.data)) {
    return {
      ...defaultHeatmapConfig,
      series: [
        {
          ...defaultHeatmapConfig.series[0],
          data: props.data
        }
      ],
      ...props.config
    }
  }

  return {
    ...defaultHeatmapConfig,
    ...props.config
  }
})
</script>
