/**
 * 矩形树图配置
 */

export const defaultTreemapConfig = {
  title: {
    text: '矩形树图',
    left: 'center',
    textStyle: {
      color: '#fff',
      fontSize: 16
    }
  },
  tooltip: {
    formatter: (info) => {
      const value = info.value
      return `${info.name}: ${value}`
    }
  },
  series: [
    {
      type: 'treemap',
      data: [],
      label: {
        show: true,
        formatter: '{b}',
        color: '#fff',
        fontSize: 12
      },
      breadcrumb: {
        show: false
      },
      roam: false,
      nodeClick: false,
      itemStyle: {
        borderColor: '#000',
        borderWidth: 2,
        gapWidth: 2
      }
    }
  ]
}

export const mockTreemapData = [
  {
    name: '分类A', value: 120,
    children: [
      { name: 'A-1', value: 60 },
      { name: 'A-2', value: 40 },
      { name: 'A-3', value: 20 }
    ]
  },
  {
    name: '分类B', value: 180,
    children: [
      { name: 'B-1', value: 90 },
      { name: 'B-2', value: 60 },
      { name: 'B-3', value: 30 }
    ]
  },
  {
    name: '分类C', value: 140,
    children: [
      { name: 'C-1', value: 70 },
      { name: 'C-2', value: 50 },
      { name: 'C-3', value: 20 }
    ]
  }
]
