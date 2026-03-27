/**
 * 水波图配置
 * 需要 echarts-liquidfill 插件
 */

export const defaultLiquidConfig = {
  title: {
    text: '水波图',
    left: 'center',
    top: 10,
    textStyle: {
      color: '#fff',
      fontSize: 16
    }
  },
  series: [
    {
      type: 'liquidFill',
      data: [],
      radius: '80%',
      center: ['50%', '50%'],
      color: ['#06b6d4', '#0891b2', '#0e7490'],
      outline: {
        show: true,
        borderDistance: 8,
        itemStyle: {
          borderColor: '#06b6d4',
          borderWidth: 3,
          shadowBlur: 20,
          shadowColor: 'rgba(6, 182, 212, 0.5)'
        }
      },
      label: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        formatter: (param) => {
          return `${(param.value * 100).toFixed(0)}%`
        }
      },
      backgroundStyle: {
        color: 'rgba(6, 182, 212, 0.1)'
      },
      itemStyle: {
        shadowBlur: 0
      },
      emphasis: {
        itemStyle: {
          opacity: 0.9
        }
      }
    }
  ]
}

export const mockLiquidData = {
  value: 0.75,
  name: '完成率'
}
