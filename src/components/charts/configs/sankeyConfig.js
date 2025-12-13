/**
 * 桑基图配置
 */

export const defaultSankeyConfig = {
  title: {
    text: '桑基图',
    left: 'center',
    textStyle: {
      color: '#fff',
      fontSize: 16
    }
  },
  tooltip: {
    trigger: 'item',
    triggerOn: 'mousemove'
  },
  series: [
    {
      type: 'sankey',
      layout: 'none',
      emphasis: {
        focus: 'adjacency'
      },
      lineStyle: {
        color: 'gradient',
        curveness: 0.5
      },
      label: {
        color: '#fff',
        fontSize: 12
      },
      data: [
        { name: 'A' },
        { name: 'B' },
        { name: 'C' },
        { name: 'D' },
        { name: 'E' }
      ],
      links: [
        { source: 'A', target: 'B', value: 10 },
        { source: 'A', target: 'C', value: 15 },
        { source: 'B', target: 'D', value: 8 },
        { source: 'B', target: 'E', value: 5 },
        { source: 'C', target: 'D', value: 12 },
        { source: 'C', target: 'E', value: 6 }
      ]
    }
  ]
}

export const mockSankeyData = {
  nodes: ['A', 'B', 'C', 'D', 'E'],
  links: [
    { source: 'A', target: 'B', value: 10 },
    { source: 'A', target: 'C', value: 15 }
  ]
}
