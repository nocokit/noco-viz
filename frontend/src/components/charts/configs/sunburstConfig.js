/**
 * 旭日图配置
 */

export const defaultSunburstConfig = {
  title: {
    text: '旭日图',
    left: 'center',
    textStyle: {
      color: '#fff',
      fontSize: 16
    }
  },
  tooltip: {
    trigger: 'item'
  },
  series: [
    {
      type: 'sunburst',
      data: [
        {
          name: '层级1',
          itemStyle: { color: '#ec4899' },
          children: [
            {
              name: '层级1-1',
              value: 15,
              itemStyle: { color: '#f472b6' },
              children: [
                { name: '层级1-1-1', value: 5, itemStyle: { color: '#f9a8d4' } },
                { name: '层级1-1-2', value: 10, itemStyle: { color: '#fbcfe8' } }
              ]
            },
            {
              name: '层级1-2',
              value: 10,
              itemStyle: { color: '#f472b6' }
            }
          ]
        },
        {
          name: '层级2',
          itemStyle: { color: '#3b82f6' },
          children: [
            {
              name: '层级2-1',
              value: 20,
              itemStyle: { color: '#60a5fa' }
            },
            {
              name: '层级2-2',
              value: 15,
              itemStyle: { color: '#60a5fa' },
              children: [
                { name: '层级2-2-1', value: 8, itemStyle: { color: '#93c5fd' } },
                { name: '层级2-2-2', value: 7, itemStyle: { color: '#dbeafe' } }
              ]
            }
          ]
        }
      ],
      radius: [0, '90%'],
      label: {
        rotate: 'radial',
        color: '#fff'
      },
      itemStyle: {
        borderWidth: 2,
        borderColor: '#000'
      }
    }
  ]
}

export const mockSunburstData = [
  { name: '层级1', value: 25 },
  { name: '层级2', value: 35 }
]
