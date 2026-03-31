/**
 * 折线图配置 - 赛博朋克风格
 */
import { createTitleConfig, commonAxisTooltip, commonLegend, commonGrid, commonCategoryXAxis, commonValueYAxis, cyberpunkColors } from './commonConfig'

export const defaultLineConfig = {
  title: createTitleConfig('折线图'),
  tooltip: commonAxisTooltip,
  legend: {
    ...commonLegend,
    data: ['销量']
  },
  grid: commonGrid,
  xAxis: {
    ...commonCategoryXAxis,
    boundaryGap: false,
    data: []
  },
  yAxis: commonValueYAxis,
  series: [
    {
      name: '销量',
      type: 'line',
      smooth: true,
      data: [],
      lineStyle: {
        color: cyberpunkColors.cyan,
        width: 3,
        shadowBlur: 10,
        shadowColor: 'rgba(0, 240, 255, 0.5)'
      },
      itemStyle: {
        color: cyberpunkColors.cyan,
        borderColor: '#fff',
        borderWidth: 2,
        shadowBlur: 8,
        shadowColor: 'rgba(0, 240, 255, 0.6)'
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(0, 240, 255, 0.4)' },
            { offset: 1, color: 'rgba(0, 240, 255, 0)' }
          ]
        }
      }
    }
  ]
}

export const mockLineData = {
  categories: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  values: [120, 132, 101, 134, 90, 230, 210]
}
