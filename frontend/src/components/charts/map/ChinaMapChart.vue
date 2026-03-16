<!--
  中国地图组件
  展示中国各省市数据分布
  注意：需要先注册中国地图JSON
-->
<template>
  <BaseChart :option="chartOption" v-bind="$attrs" />
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
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

const mapReady = ref(!!echarts.getMap('china'))

onMounted(async () => {
  if (echarts.getMap('china')) {
    mapReady.value = true
    return
  }
  try {
    const res = await fetch('https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json')
    const geoJson = await res.json()
    echarts.registerMap('china', geoJson)
    mapReady.value = true
  } catch (e) {
    console.error('中国地图数据加载失败', e)
  }
})

const chartOption = computed(() => {
  if (!mapReady.value) return {}

  if (props.data && Array.isArray(props.data)) {
    return {
      ...defaultChinaMapConfig,
      series: [
        {
          ...defaultChinaMapConfig.series[0],
          data: props.data
        },
        defaultChinaMapConfig.series[1]
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
