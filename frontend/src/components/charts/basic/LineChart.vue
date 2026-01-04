<!--
  折线图组件
  展示数据趋势变化
-->
<template>
  <BaseChart :option="chartOption" v-bind="$attrs" />
</template>

<script setup>
import { computed } from 'vue'
import BaseChart from '../BaseChart.vue'
import { defaultLineConfig } from '../configs/lineConfig'

const props = defineProps({
  config: {
    type: Object,
    default: () => ({})
  },
  data: {
    type: Object,
    default: null
  }
})

const chartOption = computed(() => {
  if (props.data?.categories && props.data?.values) {
    return {
      ...defaultLineConfig,
      xAxis: {
        ...defaultLineConfig.xAxis,
        data: props.data.categories
      },
      series: [
        {
          ...defaultLineConfig.series[0],
          data: props.data.values
        }
      ],
      ...props.config
    }
  }

  return {
    ...defaultLineConfig,
    ...props.config
  }
})
</script>
