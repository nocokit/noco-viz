/**
 * 折线图配置 - 赛博朋克风格
 */

export const defaultLineConfig = {
  title: {
    text: '折线图',
    left: 'center',
    textStyle: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: 600
    }
  },
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(10, 11, 13, 0.95)',
    borderColor: 'rgba(0, 240, 255, 0.3)',
    borderWidth: 1,
    textStyle: {
      color: '#e5e5e5'
    },
    extraCssText: 'box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5); backdrop-filter: blur(10px);'
  },
  legend: {
    data: ['销量'],
    top: 30,
    textStyle: {
      color: '#e5e5e5'
    },
    icon: 'circle'
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    top: '15%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    axisLine: {
      lineStyle: {
        color: 'rgba(255, 255, 255, 0.15)'
      }
    },
    axisLabel: {
      color: '#909399'
    }
  },
  yAxis: {
    type: 'value',
    axisLine: {
      show: false
    },
    axisLabel: {
      color: '#909399'
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(255, 255, 255, 0.08)',
        type: 'dashed'
      }
    }
  },
  series: [
    {
      name: '销量',
      type: 'line',
      smooth: true,
      data: [120, 132, 101, 134, 90, 230, 210],
      lineStyle: {
        color: '#00f0ff',
        width: 3,
        shadowBlur: 10,
        shadowColor: 'rgba(0, 240, 255, 0.5)'
      },
      itemStyle: {
        color: '#00f0ff',
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
