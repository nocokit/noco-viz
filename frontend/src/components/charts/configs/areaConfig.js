/**
 * 面积图配置
 */
import { createTitleConfig, commonAxisTooltip, commonLegend, commonGrid, commonCategoryXAxis, commonValueYAxis } from './commonConfig'

export const defaultAreaConfig = {
  title: createTitleConfig('面积图'),
  tooltip: {
    ...commonAxisTooltip,
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: '#6a7985'
      }
    }
  },
  legend: {
    ...commonLegend,
    data: ['数据A', '数据B']
  },
  grid: commonGrid,
  xAxis: {
    ...commonCategoryXAxis,
    boundaryGap: false,
    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  },
  yAxis: commonValueYAxis,
  series: [
    {
      name: '数据A',
      type: 'line',
      smooth: true,
      data: [120, 132, 101, 134, 90, 230, 210],
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(139, 92, 246, 0.5)' },
            { offset: 1, color: 'rgba(139, 92, 246, 0)' }
          ]
        }
      },
      lineStyle: {
        color: '#8b5cf6',
        width: 2
      },
      itemStyle: {
        color: '#8b5cf6'
      }
    },
    {
      name: '数据B',
      type: 'line',
      smooth: true,
      data: [220, 182, 191, 234, 290, 330, 310],
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(236, 72, 153, 0.5)' },
            { offset: 1, color: 'rgba(236, 72, 153, 0)' }
          ]
        }
      },
      lineStyle: {
        color: '#ec4899',
        width: 2
      },
      itemStyle: {
        color: '#ec4899'
      }
    }
  ]
}

export const mockAreaData = {
  categories: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  series: [
    { name: '数据A', values: [120, 132, 101, 134, 90, 230, 210] },
    { name: '数据B', values: [220, 182, 191, 234, 290, 330, 310] }
  ]
}
