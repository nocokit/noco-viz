/**
 * 基础柱状图配置 - 赛博朋克风格
 */

export const defaultBarConfig = {
  title: {
    text: '基础柱状图',
    left: 'center',
    textStyle: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: 600
    }
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    },
    backgroundColor: 'rgba(10, 11, 13, 0.95)',
    borderColor: 'rgba(185, 103, 255, 0.3)',
    borderWidth: 1,
    textStyle: {
      color: '#e5e5e5'
    },
    extraCssText: 'box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5); backdrop-filter: blur(10px);'
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    axisLine: {
      lineStyle: {
        color: 'rgba(255, 255, 255, 0.15)'
      }
    },
    axisLabel: {
      color: '#909399'
    }
  },
  yAxis: {
    type: 'value',
    axisLine: {
      show: false
    },
    axisLabel: {
      color: '#909399'
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(255, 255, 255, 0.08)',
        type: 'dashed'
      }
    }
  },
  series: [
    {
      name: '销量',
      type: 'bar',
      data: [120, 200, 150, 80, 70, 110, 130],
      barMaxWidth: 40,
      itemStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: '#b967ff' },
            { offset: 1, color: '#7b2cbf' }
          ]
        },
        borderRadius: [4, 4, 0, 0],
        shadowBlur: 10,
        shadowColor: 'rgba(185, 103, 255, 0.4)'
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 15,
          shadowColor: 'rgba(185, 103, 255, 0.6)'
        }
      }
    }
  ]
}

export const mockBarData = {
  categories: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  values: [120, 200, 150, 80, 70, 110, 130]
}
