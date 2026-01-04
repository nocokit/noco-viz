/**
 * 漏斗图配置
 */

export const defaultFunnelConfig = {
  title: {
    text: '漏斗图',
    left: 'center',
    textStyle: {
      color: '#fff',
      fontSize: 16
    }
  },
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b} : {c}%'
  },
  legend: {
    orient: 'vertical',
    left: 'left',
    top: 'center',
    textStyle: {
      color: '#999'
    }
  },
  series: [
    {
      name: '转化率',
      type: 'funnel',
      left: '20%',
      width: '60%',
      label: {
        color: '#fff',
        formatter: '{b}: {c}%'
      },
      labelLine: {
        show: true,
        lineStyle: {
          color: '#666'
        }
      },
      itemStyle: {
        borderColor: '#000',
        borderWidth: 2
      },
      emphasis: {
        label: {
          fontSize: 16,
          fontWeight: 'bold'
        }
      },
      data: [
        { value: 100, name: '访问', itemStyle: { color: '#14b8a6' } },
        { value: 80, name: '咨询', itemStyle: { color: '#3b82f6' } },
        { value: 60, name: '订单', itemStyle: { color: '#8b5cf6' } },
        { value: 40, name: '点击', itemStyle: { color: '#ec4899' } },
        { value: 20, name: '成交', itemStyle: { color: '#f59e0b' } }
      ]
    }
  ]
}

export const mockFunnelData = [
  { value: 100, name: '访问' },
  { value: 80, name: '咨询' },
  { value: 60, name: '订单' },
  { value: 40, name: '点击' },
  { value: 20, name: '成交' }
]
