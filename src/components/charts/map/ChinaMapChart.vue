<!--
  中国地图组件
  展示中国各省市数据分布
  注意：需要先注册中国地图JSON
-->
<template>
  <BaseChart :option="chartOption" v-bind="$attrs" />
</template>

<script setup>
import { computed } from 'vue'
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

// 在模块加载时立即注册中国地图（而不是等到 onMounted）
if (!echarts.getMap('china')) {
  // 简化版中国地图 GeoJSON，仅包含省份名称和基本边界
  // 生产环境应使用完整的中国地图 JSON 数据
  echarts.registerMap('china', {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        id: '110000',
        properties: { name: '北京', cp: [116.4074, 39.9042] },
        geometry: { type: 'Polygon', coordinates: [[[116.4, 39.9], [116.5, 39.9], [116.5, 40.0], [116.4, 40.0], [116.4, 39.9]]] }
      },
      {
        type: 'Feature',
        id: '310000',
        properties: { name: '上海', cp: [121.4737, 31.2304] },
        geometry: { type: 'Polygon', coordinates: [[[121.4, 31.2], [121.5, 31.2], [121.5, 31.3], [121.4, 31.3], [121.4, 31.2]]] }
      },
      {
        type: 'Feature',
        id: '440000',
        properties: { name: '广东', cp: [113.2644, 23.1292] },
        geometry: { type: 'Polygon', coordinates: [[[113.2, 23.1], [113.3, 23.1], [113.3, 23.2], [113.2, 23.2], [113.2, 23.1]]] }
      },
      {
        type: 'Feature',
        id: '330000',
        properties: { name: '浙江', cp: [120.1536, 30.2875] },
        geometry: { type: 'Polygon', coordinates: [[[120.1, 30.2], [120.2, 30.2], [120.2, 30.3], [120.1, 30.3], [120.1, 30.2]]] }
      },
      {
        type: 'Feature',
        id: '320000',
        properties: { name: '江苏', cp: [118.7969, 32.0603] },
        geometry: { type: 'Polygon', coordinates: [[[118.7, 32.0], [118.8, 32.0], [118.8, 32.1], [118.7, 32.1], [118.7, 32.0]]] }
      },
      {
        type: 'Feature',
        id: '510000',
        properties: { name: '四川', cp: [104.0665, 30.5723] },
        geometry: { type: 'Polygon', coordinates: [[[104.0, 30.5], [104.1, 30.5], [104.1, 30.6], [104.0, 30.6], [104.0, 30.5]]] }
      },
      {
        type: 'Feature',
        id: '420000',
        properties: { name: '湖北', cp: [114.3055, 30.5931] },
        geometry: { type: 'Polygon', coordinates: [[[114.3, 30.5], [114.4, 30.5], [114.4, 30.6], [114.3, 30.6], [114.3, 30.5]]] }
      },
      {
        type: 'Feature',
        id: '430000',
        properties: { name: '湖南', cp: [112.9834, 28.1129] },
        geometry: { type: 'Polygon', coordinates: [[[112.9, 28.1], [113.0, 28.1], [113.0, 28.2], [112.9, 28.2], [112.9, 28.1]]] }
      }
    ]
  })
}

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
