/**
 * ECharts 科技风主题配置
 * 统一的DataV科技风格配色方案
 */

export const techTheme = {
  // 主题颜色
  color: [
    '#00f2f2', // 主题青色
    '#0099cc', // 科技蓝
    '#66ffff', // 亮青色
    '#ffaa00', // 橙色强调
    '#ff6b9d', // 粉红
    '#00cc99', // 青绿
    '#9966ff', // 紫色
    '#ff4466', // 红色
    '#b967ff', // 紫色渐变
    '#00d4aa'  // 青绿渐变
  ],

  // 背景颜色
  backgroundColor: 'transparent',

  // 文字样式
  textStyle: {
    fontFamily: 'Microsoft YaHei, Arial, sans-serif',
    fontSize: 12,
    color: '#bcd0e3'
  },

  // 标题
  title: {
    textStyle: {
      color: '#00f2f2',
      fontSize: 18,
      fontWeight: 'bold'
    },
    subtextStyle: {
      color: '#8899aa',
      fontSize: 12
    }
  },

  // 图例
  legend: {
    textStyle: {
      color: '#bcd0e3',
      fontSize: 12
    },
    pageTextStyle: {
      color: '#bcd0e3'
    }
  },

  // 提示框
  tooltip: {
    backgroundColor: 'rgba(10, 25, 41, 0.9)',
    borderColor: '#00f2f2',
    borderWidth: 1,
    textStyle: {
      color: '#bcd0e3',
      fontSize: 12
    },
    axisPointer: {
      lineStyle: {
        color: '#00f2f2',
        width: 1
      },
      crossStyle: {
        color: '#00f2f2',
        width: 1
      }
    }
  },

  // 坐标轴
  categoryAxis: {
    axisLine: {
      lineStyle: {
        color: '#00f2f2',
        width: 1
      }
    },
    axisTick: {
      lineStyle: {
        color: '#0099cc'
      }
    },
    axisLabel: {
      color: '#8899aa',
      fontSize: 11
    },
    splitLine: {
      lineStyle: {
        color: ['rgba(0, 242, 242, 0.1)']
      }
    },
    splitArea: {
      areaStyle: {
        color: ['rgba(0, 242, 242, 0.01)', 'rgba(0, 242, 242, 0.02)']
      }
    }
  },

  valueAxis: {
    axisLine: {
      lineStyle: {
        color: '#00f2f2',
        width: 1
      }
    },
    axisTick: {
      lineStyle: {
        color: '#0099cc'
      }
    },
    axisLabel: {
      color: '#8899aa',
      fontSize: 11
    },
    splitLine: {
      lineStyle: {
        color: ['rgba(0, 242, 242, 0.1)']
      }
    },
    splitArea: {
      areaStyle: {
        color: ['rgba(0, 242, 242, 0.01)', 'rgba(0, 242, 242, 0.02)']
      }
    }
  },

  logAxis: {
    axisLine: {
      lineStyle: {
        color: '#00f2f2',
        width: 1
      }
    },
    axisTick: {
      lineStyle: {
        color: '#0099cc'
      }
    },
    axisLabel: {
      color: '#8899aa',
      fontSize: 11
    },
    splitLine: {
      lineStyle: {
        color: ['rgba(0, 242, 242, 0.1)']
      }
    }
  },

  timeAxis: {
    axisLine: {
      lineStyle: {
        color: '#00f2f2',
        width: 1
      }
    },
    axisTick: {
      lineStyle: {
        color: '#0099cc'
      }
    },
    axisLabel: {
      color: '#8899aa',
      fontSize: 11
    },
    splitLine: {
      lineStyle: {
        color: ['rgba(0, 242, 242, 0.1)']
      }
    }
  },

  // 工具箱
  toolbox: {
    iconStyle: {
      borderColor: '#00f2f2'
    },
    emphasis: {
      iconStyle: {
        borderColor: '#66ffff'
      }
    }
  },

  // 数据缩放
  dataZoom: {
    backgroundColor: 'rgba(0, 21, 41, 0.3)',
    dataBackgroundColor: 'rgba(0, 242, 242, 0.1)',
    fillerColor: 'rgba(0, 242, 242, 0.2)',
    handleColor: '#00f2f2',
    handleSize: '100%',
    textStyle: {
      color: '#8899aa'
    },
    borderColor: '#00f2f2'
  },

  // 时间线
  timeline: {
    lineStyle: {
      color: '#00f2f2',
      width: 1
    },
    itemStyle: {
      color: '#00f2f2',
      borderWidth: 1
    },
    controlStyle: {
      color: '#00f2f2',
      borderColor: '#00f2f2',
      borderWidth: 0.5
    },
    checkpointStyle: {
      color: '#0099cc',
      borderColor: '#00f2f2'
    },
    label: {
      color: '#8899aa'
    },
    emphasis: {
      itemStyle: {
        color: '#66ffff'
      },
      controlStyle: {
        color: '#66ffff',
        borderColor: '#66ffff',
        borderWidth: 0.5
      },
      label: {
        color: '#bcd0e3'
      }
    }
  },

  // 视觉映射
  visualMap: {
    textStyle: {
      color: '#bcd0e3'
    },
    inRange: {
      color: ['#0a1929', '#0099cc', '#00f2f2', '#66ffff']
    }
  },

  // 雷达图
  radar: {
    name: {
      textStyle: {
        color: '#bcd0e3',
        fontSize: 12
      }
    },
    axisLine: {
      lineStyle: {
        color: 'rgba(0, 242, 242, 0.3)'
      }
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(0, 242, 242, 0.2)'
      }
    },
    splitArea: {
      areaStyle: {
        color: ['rgba(0, 242, 242, 0.05)', 'rgba(0, 153, 204, 0.05)']
      }
    }
  },

  // 地理坐标系
  geo: {
    itemStyle: {
      areaColor: '#0a1929',
      borderColor: '#00f2f2',
      borderWidth: 0.5
    },
    emphasis: {
      itemStyle: {
        areaColor: '#0099cc',
        borderColor: '#66ffff',
        borderWidth: 1
      }
    },
    label: {
      color: '#bcd0e3',
      fontSize: 11
    }
  },

  // 单轴
  singleAxis: {
    axisLine: {
      lineStyle: {
        color: '#00f2f2'
      }
    },
    axisTick: {
      lineStyle: {
        color: '#0099cc'
      }
    },
    axisLabel: {
      color: '#8899aa'
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(0, 242, 242, 0.1)'
      }
    }
  },

  // 平行坐标系
  parallel: {
    axisLine: {
      lineStyle: {
        color: '#00f2f2'
      }
    },
    axisTick: {
      lineStyle: {
        color: '#0099cc'
      }
    },
    axisLabel: {
      color: '#8899aa'
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(0, 242, 242, 0.1)'
      }
    }
  },

  // 桑基图
  sankey: {
    itemStyle: {
      borderColor: '#001529',
      borderWidth: 1
    },
    lineStyle: {
      color: 'gradient',
      curveness: 0.5,
      opacity: 0.3
    },
    label: {
      color: '#bcd0e3',
      fontSize: 11
    }
  },

  // 漏斗图
  funnel: {
    itemStyle: {
      borderColor: '#001529',
      borderWidth: 1
    },
    label: {
      color: '#bcd0e3',
      fontSize: 12
    }
  },

  // 仪表盘
  gauge: {
    axisLine: {
      lineStyle: {
        color: [
          [0.3, '#ff4466'],
          [0.7, '#ffaa00'],
          [1, '#00cc99']
        ],
        width: 10
      }
    },
    axisTick: {
      lineStyle: {
        color: '#00f2f2'
      }
    },
    axisLabel: {
      color: '#8899aa',
      fontSize: 11
    },
    splitLine: {
      lineStyle: {
        color: '#00f2f2'
      }
    },
    pointer: {
      itemStyle: {
        color: '#00f2f2'
      }
    },
    title: {
      color: '#bcd0e3',
      fontSize: 14
    },
    detail: {
      color: '#00f2f2',
      fontSize: 24,
      fontWeight: 'bold'
    }
  }
}

/**
 * 注册主题到 ECharts
 */
export function registerTechTheme(echarts) {
  echarts.registerTheme('tech', techTheme)
}
