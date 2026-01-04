/**
 * 赛博朋克图表主题配置
 * Cyberpunk Chart Theme
 */

// 主色盘 - 赛博朋克风格
export const cyberpunkColors = [
  '#00f0ff', // 青色 Cyan
  '#b967ff', // 紫色 Purple
  '#05ffa1', // 翠绿 Mint
  '#ff006e', // 品红 Magenta
  '#ffbe0b', // 金黄 Gold
  '#fb5607', // 橙红 Orange
  '#8338ec', // 深紫 Deep Purple
  '#3a86ff'  // 亮蓝 Bright Blue
]

// 渐变色配置
export const cyberpunkGradients = {
  cyan: {
    type: 'linear',
    x: 0, y: 0, x2: 0, y2: 1,
    colorStops: [
      { offset: 0, color: '#00f0ff' },
      { offset: 1, color: '#0088cc' }
    ]
  },
  purple: {
    type: 'linear',
    x: 0, y: 0, x2: 0, y2: 1,
    colorStops: [
      { offset: 0, color: '#b967ff' },
      { offset: 1, color: '#7b2cbf' }
    ]
  },
  mint: {
    type: 'linear',
    x: 0, y: 0, x2: 0, y2: 1,
    colorStops: [
      { offset: 0, color: '#05ffa1' },
      { offset: 1, color: '#00b377' }
    ]
  },
  magenta: {
    type: 'linear',
    x: 0, y: 0, x2: 0, y2: 1,
    colorStops: [
      { offset: 0, color: '#ff006e' },
      { offset: 1, color: '#c9004f' }
    ]
  }
}

// 发光效果配置
export const glowEffect = {
  shadowBlur: 10,
  shadowColor: 'rgba(0, 240, 255, 0.5)'
}

// 完整的 ECharts 主题配置
export const cyberpunkTheme = {
  color: cyberpunkColors,

  backgroundColor: 'transparent',

  textStyle: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    color: '#e5e5e5'
  },

  title: {
    textStyle: {
      color: '#ffffff',
      fontWeight: 600
    },
    subtextStyle: {
      color: '#909399'
    }
  },

  line: {
    itemStyle: {
      borderWidth: 2
    },
    lineStyle: {
      width: 3,
      shadowBlur: 10,
      shadowColor: 'rgba(0, 240, 255, 0.3)'
    },
    symbolSize: 8,
    symbol: 'circle',
    smooth: true,
    areaStyle: {
      opacity: 0.3
    }
  },

  bar: {
    itemStyle: {
      borderRadius: [4, 4, 0, 0],
      shadowBlur: 8,
      shadowColor: 'rgba(0, 240, 255, 0.3)'
    },
    barMaxWidth: 40
  },

  pie: {
    itemStyle: {
      borderRadius: 4,
      borderColor: 'rgba(0, 0, 0, 0.5)',
      borderWidth: 2,
      shadowBlur: 10,
      shadowColor: 'rgba(0, 0, 0, 0.3)'
    },
    label: {
      color: '#e5e5e5',
      fontSize: 12,
      fontWeight: 500
    },
    labelLine: {
      lineStyle: {
        color: '#555',
        width: 1
      }
    },
    emphasis: {
      itemStyle: {
        shadowBlur: 20,
        shadowColor: 'rgba(0, 240, 255, 0.5)'
      }
    }
  },

  radar: {
    axisName: {
      color: '#e5e5e5',
      fontSize: 12
    },
    axisLine: {
      lineStyle: {
        color: 'rgba(255, 255, 255, 0.15)'
      }
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(255, 255, 255, 0.1)'
      }
    },
    splitArea: {
      areaStyle: {
        color: ['rgba(0, 240, 255, 0.03)', 'rgba(185, 103, 255, 0.03)']
      }
    }
  },

  gauge: {
    axisLine: {
      lineStyle: {
        width: 20,
        color: [
          [0.3, '#05ffa1'],
          [0.7, '#00f0ff'],
          [1, '#ff006e']
        ]
      }
    },
    axisTick: {
      length: 8,
      lineStyle: {
        color: 'rgba(255, 255, 255, 0.3)'
      }
    },
    splitLine: {
      length: 15,
      lineStyle: {
        color: 'rgba(255, 255, 255, 0.3)'
      }
    },
    axisLabel: {
      color: '#e5e5e5',
      fontSize: 12
    },
    detail: {
      fontSize: 28,
      color: '#ffffff',
      fontWeight: 600
    },
    title: {
      color: '#909399',
      fontSize: 14
    }
  },

  categoryAxis: {
    axisLine: {
      show: true,
      lineStyle: {
        color: 'rgba(255, 255, 255, 0.15)'
      }
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      color: '#909399',
      fontSize: 11
    },
    splitLine: {
      show: false
    },
    splitArea: {
      show: false
    }
  },

  valueAxis: {
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      color: '#909399',
      fontSize: 11
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(255, 255, 255, 0.08)',
        type: 'dashed'
      }
    }
  },

  legend: {
    textStyle: {
      color: '#e5e5e5',
      fontSize: 12
    },
    icon: 'circle',
    itemWidth: 10,
    itemHeight: 10
  },

  tooltip: {
    backgroundColor: 'rgba(10, 11, 13, 0.95)',
    borderColor: 'rgba(64, 158, 255, 0.3)',
    borderWidth: 1,
    textStyle: {
      color: '#e5e5e5',
      fontSize: 12
    },
    extraCssText: 'box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5); backdrop-filter: blur(10px);'
  }
}

// 应用主题到 ECharts 实例
export function applyCyberpunkTheme(chartInstance) {
  if (!chartInstance) return

  const option = chartInstance.getOption()

  // 如果图表已有配置，合并主题
  if (option) {
    chartInstance.setOption({
      color: cyberpunkColors,
      ...cyberpunkTheme
    }, false)
  }
}

// 获取带渐变的颜色配置
export function getGradientColor(colorName = 'cyan') {
  return cyberpunkGradients[colorName] || cyberpunkGradients.cyan
}

// 为系列数据添加发光效果
export function addGlowToSeries(series) {
  if (Array.isArray(series)) {
    return series.map(s => ({
      ...s,
      itemStyle: {
        ...s.itemStyle,
        shadowBlur: 10,
        shadowColor: 'rgba(0, 240, 255, 0.5)'
      }
    }))
  }

  return {
    ...series,
    itemStyle: {
      ...series.itemStyle,
      shadowBlur: 10,
      shadowColor: 'rgba(0, 240, 255, 0.5)'
    }
  }
}
