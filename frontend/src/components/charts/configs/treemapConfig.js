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
      data: [
        {
          name: '分类A',
          value: 120,
          itemStyle: { color: '#3b82f6' },
          children: [
            { name: 'A-1', value: 60, itemStyle: { color: '#60a5fa' } },
            { name: 'A-2', value: 40, itemStyle: { color: '#93c5fd' } },
            { name: 'A-3', value: 20, itemStyle: { color: '#dbeafe' } }
          ]
        },
        {
          name: '分类B',
          value: 180,
          itemStyle: { color: '#10b981' },
          children: [
            { name: 'B-1', value: 90, itemStyle: { color: '#34d399' } },
            { name: 'B-2', value: 60, itemStyle: { color: '#6ee7b7' } },
            { name: 'B-3', value: 30, itemStyle: { color: '#a7f3d0' } }
          ]
        },
        {
          name: '分类C',
          value: 140,
          itemStyle: { color: '#f59e0b' },
          children: [
            { name: 'C-1', value: 70, itemStyle: { color: '#fbbf24' } },
            { name: 'C-2', value: 50, itemStyle: { color: '#fcd34d' } },
            { name: 'C-3', value: 20, itemStyle: { color: '#fde68a' } }
          ]
        }
      ],
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
  { name: '分类A', value: 120 },
  { name: '分类B', value: 180 },
  { name: '分类C', value: 140 }
]
