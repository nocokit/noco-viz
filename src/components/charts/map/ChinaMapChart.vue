<!--
  中国地图组件
  展示中国各省市数据分布
  注意：需要先注册中国地图JSON
-->
<template>
  <BaseChart :option="chartOption" v-bind="$attrs" />
</template>

<script setup>
import { computed, onMounted } from 'vue'
import * as echarts from 'echarts'
import BaseChart from '../BaseChart.vue'
import { defaultChinaMapConfig } from '../configs/chinaMapConfig'

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

// 注册中国地图（简化版，实际需要完整的GeoJSON）
onMounted(() => {
  // 这里应该加载真实的中国地图JSON
  // 暂时使用占位符
  if (!echarts.getMap('china')) {
    echarts.registerMap('china', {
      type: 'FeatureCollection',
      features: []
    })
  }
})

const chartOption = computed(() => {
  if (props.data && Array.isArray(props.data)) {
    return {
      ...defaultChinaMapConfig,
      series: [
        {
          ...defaultChinaMapConfig.series[0],
          data: props.data
        }
      ],
      ...props.config
    }
  }

  return {
    ...defaultChinaMapConfig,
    ...props.config
  }
})
</script>
