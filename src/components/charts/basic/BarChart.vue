<!--
  基础柱状图组件
  用于对比不同类目的数据
-->
<template>
  <BaseChart :option="chartOption" v-bind="$attrs" />
</template>

<script setup>
import { computed } from 'vue'
import BaseChart from '../BaseChart.vue'
import { defaultBarConfig } from '../configs/barConfig'

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
  // 如果有自定义数据，使用自定义数据
  if (props.data?.categories && props.data?.values) {
    return {
      ...defaultBarConfig,
      xAxis: {
        ...defaultBarConfig.xAxis,
        data: props.data.categories
      },
      series: [
        {
          ...defaultBarConfig.series[0],
          data: props.data.values
        }
      ],
      ...props.config
    }
  }

  // 否则使用默认配置
  return {
    ...defaultBarConfig,
    ...props.config
  }
})
</script>
