<!--
  仪表盘组件
  展示进度或指标完成度
-->
<template>
  <BaseChart :option="chartOption" v-bind="$attrs" />
</template>

<script setup>
import { computed } from 'vue'
import BaseChart from '../BaseChart.vue'
import { defaultGaugeConfig } from '../configs/gaugeConfig'

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
  if (props.data?.value) {
    return {
      ...defaultGaugeConfig,
      series: [
        {
          ...defaultGaugeConfig.series[0],
          data: [
            {
              value: props.data.value,
              name: props.data.name || '完成率'
            }
          ]
        }
      ],
      ...props.config
    }
  }

  return {
    ...defaultGaugeConfig,
    ...props.config
  }
})
</script>
