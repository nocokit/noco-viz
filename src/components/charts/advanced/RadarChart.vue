<!--
  雷达图组件
  多维度数据对比
-->
<template>
  <BaseChart :option="chartOption" v-bind="$attrs" />
</template>

<script setup>
import { computed } from 'vue'
import BaseChart from '../BaseChart.vue'
import { defaultRadarConfig } from '../configs/radarConfig'

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
  return {
    ...defaultRadarConfig,
    ...props.config
  }
})
</script>
