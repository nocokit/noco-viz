/**
 * 雷达图配置
 */

export const defaultRadarConfig = {
  title: {
    text: '雷达图',
    left: 'center',
    textStyle: {
      color: '#fff',
      fontSize: 16
    }
  },
  tooltip: {
    trigger: 'item'
  },
  legend: {
    data: [],
    top: 30,
    textStyle: {
      color: '#999'
    }
  },
  radar: {
    indicator: [],
    splitLine: {
      lineStyle: {
        color: '#333'
      }
    },
    splitArea: {
      areaStyle: {
        color: ['rgba(255, 255, 255, 0.02)', 'rgba(255, 255, 255, 0.05)']
      }
    },
    axisLine: {
      lineStyle: {
        color: '#666'
      }
    },
    name: {
      textStyle: {
        color: '#999'
      }
    }
  },
  series: [
    {
      name: '预算 vs 开销',
      type: 'radar',
      data: []
    }
  ]
}

export const mockRadarData = {
  indicator: [
    { name: '销售', max: 6500 },
    { name: '管理', max: 16000 },
    { name: '信息技术', max: 30000 },
    { name: '客服', max: 38000 },
    { name: '研发', max: 52000 },
    { name: '市场', max: 25000 }
  ],
  series: [
    { name: '预算分配', values: [4200, 3000, 20000, 35000, 50000, 18000] },
    { name: '实际开销', values: [5000, 14000, 28000, 26000, 42000, 21000] }
  ]
}
