/**
 * 基础柱状图配置 - 赛博朋克风格
 */
import { createTitleConfig, commonAxisTooltip, commonGrid, commonCategoryXAxis, commonValueYAxis, cyberpunkColors } from './commonConfig'

export const defaultBarConfig = {
  title: createTitleConfig('基础柱状图'),
  tooltip: {
    ...commonAxisTooltip,
    axisPointer: {
      type: 'shadow'
    },
    borderColor: 'rgba(185, 103, 255, 0.3)'
  },
  grid: {
    ...commonGrid,
    top: '10%'
  },
  xAxis: {
    ...commonCategoryXAxis,
    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  },
  yAxis: commonValueYAxis,
  series: [
    {
      name: '销量',
      type: 'bar',
      data: [120, 200, 150, 80, 70, 110, 130],
      barMaxWidth: 40,
      itemStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: cyberpunkColors.purple },
            { offset: 1, color: '#7b2cbf' }
          ]
        },
        borderRadius: [4, 4, 0, 0],
        shadowBlur: 10,
        shadowColor: 'rgba(185, 103, 255, 0.4)'
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 15,
          shadowColor: 'rgba(185, 103, 255, 0.6)'
        }
      }
    }
  ]
}

export const mockBarData = {
  categories: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  values: [120, 200, 150, 80, 70, 110, 130]
}
