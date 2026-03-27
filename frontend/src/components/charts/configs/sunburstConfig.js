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
      data: [],
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
  {
    name: '层级1',
    children: [
      {
        name: '层级1-1', value: 15,
        children: [
          { name: '层级1-1-1', value: 5 },
          { name: '层级1-1-2', value: 10 }
        ]
      },
      { name: '层级1-2', value: 10 }
    ]
  },
  {
    name: '层级2',
    children: [
      { name: '层级2-1', value: 20 },
      {
        name: '层级2-2', value: 15,
        children: [
          { name: '层级2-2-1', value: 8 },
          { name: '层级2-2-2', value: 7 }
        ]
      }
    ]
  }
]
