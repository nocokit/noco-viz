<!--
  散点图组件
  展示变量之间的关系
-->
<template>
  <BaseChart :option="chartOption" v-bind="$attrs" />
</template>

<script setup>
import { computed } from 'vue'
import BaseChart from '../BaseChart.vue'
import { defaultScatterConfig } from '../configs/scatterConfig'

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
    ...defaultScatterConfig,
    ...props.config
  }
})
</script>
