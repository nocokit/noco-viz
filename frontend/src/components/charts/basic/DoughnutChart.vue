<template>
  <BaseChart :option="chartOption" :style="{ width: '100%', height: '100%' }" />
</template>

<script setup>
import { computed } from 'vue'
import BaseChart from '../BaseChart.vue'

const props = defineProps({
  config: {
    type: Object,
    default: () => ({})
  }
})

const chartOption = computed(() => {
  const config = props.config || {}
  const data = config.data || [
    { name: '直接访问', value: 335 },
    { name: '邮件营销', value: 310 },
    { name: '联盟广告', value: 234 },
    { name: '视频广告', value: 135 },
    { name: '搜索引擎', value: 1548 }
  ]

  return {
    backgroundColor: 'transparent',
    title: {
      text: config.title || '环形图',
      left: 'center',
      top: 20,
      textStyle: {
        color: config.titleColor || '#fff',
        fontSize: config.titleSize || 18,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: '#00f2f2',
      borderWidth: 1,
      textStyle: {
        color: '#fff'
      }
    },
    legend: {
      orient: config.legendOrient || 'vertical',
      right: config.legendOrient === 'horizontal' ? 'center' : 10,
      bottom: config.legendOrient === 'horizontal' ? 10 : 'center',
      textStyle: {
        color: config.legendColor || '#bcd0e3',
        fontSize: config.legendSize || 12
      },
      itemWidth: 14,
      itemHeight: 14
    },
    series: [
      {
        name: config.seriesName || '数据统计',
        type: 'pie',
        radius: config.radius || ['50%', '70%'],
        center: config.center || ['50%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: config.borderColor || '#0a1e3c',
          borderWidth: 2
        },
        label: {
          show: config.showLabel !== false,
          position: 'outside',
          formatter: '{b}: {d}%',
          color: config.labelColor || '#fff',
          fontSize: config.labelSize || 12
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: 'bold'
          },
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 242, 242, 0.5)'
          }
        },
        labelLine: {
          show: config.showLabel !== false,
          lineStyle: {
            color: config.labelLineColor || '#00f2f2'
          }
        },
        data: data.map((item, index) => ({
          ...item,
          itemStyle: {
            color: config.colors?.[index] || [
              '#00f2f2', '#0099cc', '#ffaa00',
              '#ff6b9d', '#9966ff', '#00cc99'
            ][index % 6]
          }
        }))
      }
    ]
  }
})
</script>

<style scoped>
/* 环形图样式 */
</style>
