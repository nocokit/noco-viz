<!--
  旭日图组件
  多层级关系展示
-->
<template>
  <BaseChart :option="chartOption" v-bind="$attrs" />
</template>

<script setup>
import { computed } from 'vue'
import BaseChart from '../BaseChart.vue'
import { defaultSunburstConfig } from '../configs/sunburstConfig'

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
    ...defaultSunburstConfig,
    ...props.config
  }
})
</script>
