<!--
  饼图组件
  展示数据占比关系
-->
<template>
  <BaseChart :option="chartOption" v-bind="$attrs" />
</template>

<script setup>
import { computed } from 'vue'
import BaseChart from '../BaseChart.vue'
import { defaultPieConfig } from '../configs/pieConfig'

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
      ...defaultPieConfig,
      series: [
        {
          ...defaultPieConfig.series[0],
          data: props.data
        }
      ],
      ...props.config
    }
  }

  return {
    ...defaultPieConfig,
    ...props.config
  }
})
</script>
