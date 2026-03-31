/**
 * 热力图配置
 */

export const defaultHeatmapConfig = {
  title: {
    text: '热力图',
    left: 'center',
    textStyle: {
      color: '#fff',
      fontSize: 16
    }
  },
  tooltip: {
    position: 'top',
    formatter: (params) => {
      return `${params.name}: ${params.value[2]}`
    }
  },
  grid: {
    left: '10%',
    right: '10%',
    top: '15%',
    bottom: '10%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    splitArea: {
      show: true
    },
    axisLine: {
      lineStyle: {
        color: '#666'
      }
    },
    axisLabel: {
      color: '#999'
    }
  },
  yAxis: {
    type: 'category',
    data: ['上午', '中午', '下午', '晚上'],
    splitArea: {
      show: true
    },
    axisLine: {
      lineStyle: {
        color: '#666'
      }
    },
    axisLabel: {
      color: '#999'
    }
  },
  visualMap: {
    min: 0,
    max: 100,
    calculable: true,
    orient: 'horizontal',
    left: 'center',
    bottom: '5%',
    inRange: {
      color: ['#313695', '#4575b4', '#74add1', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
    },
    textStyle: {
      color: '#999'
    }
  },
  series: [
    {
      name: '热力值',
      type: 'heatmap',
      coordinateSystem: 'cartesian2d',
      data: [],
      label: {
        show: true,
        color: '#fff'
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
}

export const mockHeatmapData = [
  [0, 0, 10], [0, 1, 30], [0, 2, 50], [0, 3, 80],
  [1, 0, 20], [1, 1, 40], [1, 2, 60], [1, 3, 85],
  [2, 0, 15], [2, 1, 35], [2, 2, 70], [2, 3, 90],
  [3, 0, 25], [3, 1, 45], [3, 2, 65], [3, 3, 75],
  [4, 0, 30], [4, 1, 50], [4, 2, 75], [4, 3, 95],
  [5, 0, 35], [5, 1, 55], [5, 2, 80], [5, 3, 70],
  [6, 0, 40], [6, 1, 60], [6, 2, 85], [6, 3, 65]
]
