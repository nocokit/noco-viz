<!--
  矩形树图组件
  层级数据占比可视化
-->
<template>
  <BaseChart :option="chartOption" v-bind="$attrs" />
</template>

<script setup>
import { computed } from 'vue'
import BaseChart from '../BaseChart.vue'
import { defaultTreemapConfig } from '../configs/treemapConfig'

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
  return {
    ...defaultTreemapConfig,
    ...props.config
  }
})
</script>
