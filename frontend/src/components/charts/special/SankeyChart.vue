<!--
  桑基图组件
  展示数据流向关系
-->
<template>
  <BaseChart :option="chartOption" v-bind="$attrs" />
</template>

<script setup>
import { computed } from 'vue'
import BaseChart from '../BaseChart.vue'
import { defaultSankeyConfig } from '../configs/sankeyConfig'

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
    ...defaultSankeyConfig,
    ...props.config
  }
})
</script>
