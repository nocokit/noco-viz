<!--
  面积图组件
  强调数量随时间变化
-->
<template>
  <BaseChart :option="chartOption" v-bind="$attrs" />
</template>

<script setup>
import { computed } from 'vue'
import BaseChart from '../BaseChart.vue'
import { defaultAreaConfig } from '../configs/areaConfig'

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
    ...defaultAreaConfig,
    ...props.config
  }
})
</script>
