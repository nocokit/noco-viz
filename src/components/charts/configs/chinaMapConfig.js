/**
 * 中国地图配置
 * 注意：需要注册中国地图 JSON 数据
 */

export const defaultChinaMapConfig = {
  title: {
    text: '中国地图',
    left: 'center',
    textStyle: {
      color: '#fff',
      fontSize: 16
    }
  },
  tooltip: {
    trigger: 'item',
    formatter: '{b}: {c}'
  },
  visualMap: {
    min: 0,
    max: 1000,
    text: ['高', '低'],
    realtime: false,
    calculable: true,
    inRange: {
      color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
    },
    textStyle: {
      color: '#999'
    }
  },
  series: [
    {
      name: '数据',
      type: 'map',
      map: 'china',
      roam: true,
      label: {
        show: true,
        color: '#fff',
        fontSize: 10
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 12,
          fontWeight: 'bold'
        },
        itemStyle: {
          areaColor: '#3b82f6'
        }
      },
      itemStyle: {
        borderColor: '#000',
        borderWidth: 1
      },
      data: [
        { name: '北京', value: 500 },
        { name: '上海', value: 800 },
        { name: '广东', value: 900 },
        { name: '浙江', value: 700 },
        { name: '江苏', value: 650 },
        { name: '四川', value: 400 },
        { name: '湖北', value: 350 },
        { name: '湖南', value: 300 }
      ]
    }
  ]
}

export const mockChinaMapData = [
  { name: '北京', value: 500 },
  { name: '上海', value: 800 },
  { name: '广东', value: 900 }
]
