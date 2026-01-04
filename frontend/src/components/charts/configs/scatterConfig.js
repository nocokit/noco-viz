/**
 * 散点图配置
 */

export const defaultScatterConfig = {
  title: {
    text: '散点图',
    left: 'center',
    textStyle: {
      color: '#fff',
      fontSize: 16
    }
  },
  tooltip: {
    trigger: 'item',
    formatter: '{a}: ({c})'
  },
  legend: {
    data: ['数据A', '数据B'],
    top: 30,
    textStyle: {
      color: '#999'
    }
  },
  grid: {
    left: '3%',
    right: '7%',
    bottom: '7%',
    top: '15%',
    containLabel: true
  },
  xAxis: {
    type: 'value',
    scale: true,
    axisLine: {
      lineStyle: {
        color: '#666'
      }
    },
    axisLabel: {
      color: '#999'
    },
    splitLine: {
      lineStyle: {
        color: '#333'
      }
    }
  },
  yAxis: {
    type: 'value',
    scale: true,
    axisLine: {
      lineStyle: {
        color: '#666'
      }
    },
    axisLabel: {
      color: '#999'
    },
    splitLine: {
      lineStyle: {
        color: '#333'
      }
    }
  },
  series: [
    {
      name: '数据A',
      type: 'scatter',
      symbolSize: 10,
      data: [
        [10.0, 8.04], [8.07, 6.95], [13.0, 7.58], [9.05, 8.81],
        [11.0, 8.33], [14.0, 7.66], [13.4, 6.81], [10.0, 6.33],
        [14.0, 8.96], [12.5, 6.82], [9.15, 7.20], [11.5, 7.20],
        [3.03, 4.23], [12.2, 7.83], [2.02, 4.47], [1.05, 3.33],
        [4.05, 4.96], [6.03, 7.24], [12.0, 6.26], [12.0, 8.84]
      ],
      itemStyle: {
        color: '#ec4899'
      },
      emphasis: {
        itemStyle: {
          color: '#f472b6',
          borderColor: '#fff',
          borderWidth: 2
        }
      }
    },
    {
      name: '数据B',
      type: 'scatter',
      symbolSize: 10,
      data: [
        [10.0, 9.14], [8.07, 8.14], [13.0, 8.74], [9.05, 8.77],
        [11.0, 9.26], [14.0, 8.10], [6.4, 6.13], [4.0, 3.10],
        [12.0, 9.13], [7.0, 7.26], [5.0, 4.74], [11.5, 8.33],
        [3.03, 5.23], [12.2, 9.40], [2.02, 5.47], [1.05, 4.20]
      ],
      itemStyle: {
        color: '#3b82f6'
      },
      emphasis: {
        itemStyle: {
          color: '#60a5fa',
          borderColor: '#fff',
          borderWidth: 2
        }
      }
    }
  ]
}

export const mockScatterData = {
  seriesA: [
    [10.0, 8.04], [8.07, 6.95], [13.0, 7.58], [9.05, 8.81],
    [11.0, 8.33], [14.0, 7.66], [13.4, 6.81], [10.0, 6.33]
  ],
  seriesB: [
    [10.0, 9.14], [8.07, 8.14], [13.0, 8.74], [9.05, 8.77],
    [11.0, 9.26], [14.0, 8.10], [6.4, 6.13], [4.0, 3.10]
  ]
}
