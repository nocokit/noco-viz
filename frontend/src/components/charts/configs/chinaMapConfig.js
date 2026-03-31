/**
 * 中国地图配置 - 科技感优化版
 * 注意：需要注册中国地图 JSON 数据
 */

export const defaultChinaMapConfig = {
  backgroundColor: 'transparent',

  title: {
    text: '全国数据分布',
    left: 'center',
    top: '3%',
    textStyle: {
      color: '#00f2f2',
      fontSize: 20,
      fontWeight: 'bold',
      textShadowColor: 'rgba(0, 242, 242, 0.5)',
      textShadowBlur: 10
    }
  },

  tooltip: {
    trigger: 'item',
    backgroundColor: 'rgba(10, 25, 41, 0.95)',
    borderColor: '#00f2f2',
    borderWidth: 1,
    textStyle: {
      color: '#bcd0e3',
      fontSize: 13
    },
    formatter: (params) => {
      if (params.value) {
        return `
          <div style="padding: 8px 12px;">
            <div style="color: #00f2f2; font-weight: bold; font-size: 14px; margin-bottom: 6px;">
              ${params.name}
            </div>
            <div style="color: #66ffff;">
              数值: <span style="color: #fff; font-weight: bold; font-size: 16px;">${params.value}</span>
            </div>
          </div>
        `
      }
      return `<div style="padding: 8px 12px; color: #999;">${params.name}<br/>暂无数据</div>`
    }
  },

  // 视觉映射组件
  visualMap: {
    show: true,
    min: 0,
    max: 1000,
    text: ['高', '低'],
    realtime: true,
    calculable: true,
    orient: 'vertical',
    left: '2%',
    bottom: '5%',

    // 科技感渐变色
    inRange: {
      color: [
        '#0a1929',  // 深蓝（低值）
        '#1e3a5f',  // 蓝灰
        '#2563eb',  // 蓝色
        '#3b82f6',  // 亮蓝
        '#60a5fa',  // 天蓝
        '#00f2f2',  // 青色（中值）
        '#66ffff',  // 亮青
        '#ffaa00',  // 橙色
        '#ff6b9d',  // 粉红
        '#ff4757'   // 红色（高值）
      ]
    },

    textStyle: {
      color: '#bcd0e3',
      fontSize: 12
    },

    itemWidth: 20,
    itemHeight: 140,

    // 边框样式
    borderColor: 'rgba(0, 242, 242, 0.3)',
    borderWidth: 1
  },

  // 地理坐标系组件
  geo: {
    map: 'china',
    roam: true,  // 允许缩放和平移
    scaleLimit: {
      min: 0.8,
      max: 3
    },
    zoom: 1.2,
    center: [105, 36],  // 地图中心点

    // 地图样式
    itemStyle: {
      areaColor: {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [
          { offset: 0, color: 'rgba(10, 25, 41, 0.8)' },
          { offset: 1, color: 'rgba(10, 25, 41, 0.4)' }
        ]
      },
      borderColor: 'rgba(0, 242, 242, 0.6)',
      borderWidth: 1.5,
      shadowColor: 'rgba(0, 242, 242, 0.3)',
      shadowBlur: 10
    },

    // 高亮样式
    emphasis: {
      itemStyle: {
        areaColor: 'rgba(0, 242, 242, 0.3)',
        borderColor: '#00f2f2',
        borderWidth: 2,
        shadowColor: 'rgba(0, 242, 242, 0.8)',
        shadowBlur: 20
      },
      label: {
        show: true,
        color: '#fff',
        fontSize: 13,
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 0, 0, 0.8)',
        textShadowBlur: 4
      }
    },

    // 选中样式
    select: {
      itemStyle: {
        areaColor: 'rgba(102, 255, 255, 0.4)',
        borderColor: '#66ffff',
        borderWidth: 2
      },
      label: {
        show: true,
        color: '#fff',
        fontSize: 13,
        fontWeight: 'bold'
      }
    }
  },

  series: [
    {
      name: '数据分布',
      type: 'map',
      map: 'china',
      geoIndex: 0,
      roam: true,

      // 标签样式
      label: {
        show: true,
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 10,
        fontWeight: 'normal'
      },

      // 高亮标签
      emphasis: {
        label: {
          show: true,
          color: '#fff',
          fontSize: 12,
          fontWeight: 'bold',
          textShadowColor: 'rgba(0, 0, 0, 0.8)',
          textShadowBlur: 4
        }
      },

      // 选中标签
      select: {
        label: {
          show: true,
          color: '#fff',
          fontSize: 12,
          fontWeight: 'bold'
        }
      },

      // 默认数据
      data: []
    },

    // 添加散点图层（可选，用于标注重点城市）
    {
      name: '重点城市',
      type: 'effectScatter',
      coordinateSystem: 'geo',
      rippleEffect: {
        brushType: 'stroke',
        scale: 4,
        period: 4
      },
      label: {
        show: false
      },
      symbolSize: (val) => {
        return val[2] / 50
      },
      itemStyle: {
        color: '#ff6b9d',
        shadowBlur: 10,
        shadowColor: 'rgba(255, 107, 157, 0.8)'
      },
      zlevel: 1,
      data: [
        { name: '北京', value: [116.4074, 39.9042, 850] },
        { name: '上海', value: [121.4737, 31.2304, 920] },
        { name: '广州', value: [113.2644, 23.1291, 980] },
        { name: '深圳', value: [114.0579, 22.5431, 950] }
      ]
    }
  ]
}

export const mockChinaMapData = [
  { name: '北京', value: 850 },
  { name: '上海', value: 920 },
  { name: '广东', value: 980 },
  { name: '浙江', value: 820 },
  { name: '江苏', value: 750 },
  { name: '山东', value: 680 },
  { name: '福建', value: 560 },
  { name: '四川', value: 530 },
  { name: '河南', value: 520 },
  { name: '湖北', value: 490 },
  { name: '湖南', value: 480 }
]
