/**
 * 仪表盘配置
 */

export const defaultGaugeConfig = {
  title: {
    text: '仪表盘',
    left: 'center',
    textStyle: {
      color: '#fff',
      fontSize: 16
    }
  },
  tooltip: {
    formatter: '{a} <br/>{b} : {c}%'
  },
  series: [
    {
      name: '完成率',
      type: 'gauge',
      progress: {
        show: true,
        width: 18
      },
      axisLine: {
        lineStyle: {
          width: 18,
          color: [
            [0.3, '#ef4444'],
            [0.7, '#eab308'],
            [1, '#10b981']
          ]
        }
      },
      axisTick: {
        show: false
      },
      splitLine: {
        length: 15,
        lineStyle: {
          width: 2,
          color: '#999'
        }
      },
      axisLabel: {
        distance: 25,
        color: '#999',
        fontSize: 12
      },
      anchor: {
        show: true,
        showAbove: true,
        size: 25,
        itemStyle: {
          borderWidth: 10
        }
      },
      title: {
        show: false
      },
      detail: {
        valueAnimation: true,
        fontSize: 32,
        fontWeight: 'bold',
        offsetCenter: [0, '70%'],
        formatter: '{value}%',
        color: '#fff'
      },
      data: [
        {
          value: 75,
          name: '完成率'
        }
      ]
    }
  ]
}

export const mockGaugeData = {
  value: 75,
  name: '完成率'
}
