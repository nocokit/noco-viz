<!--
  漏斗图组件
  业务流程转化率分析
-->
<template>
  <BaseChart :option="chartOption" v-bind="$attrs" />
</template>

<script setup>
import { computed } from 'vue'
import BaseChart from '../BaseChart.vue'
import { defaultFunnelConfig } from '../configs/funnelConfig'

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
      ...defaultFunnelConfig,
      series: [
        {
          ...defaultFunnelConfig.series[0],
          data: props.data
        }
      ],
      ...props.config
    }
  }

  return {
    ...defaultFunnelConfig,
    ...props.config
  }
})
</script>
