/**
 * 大屏组件配置 JSON Schema
 * 定义所有组件通用和特定的配置属性
 */

/**
 * 基础配置 Schema - 所有组件共有
 */
export const baseConfigSchema = {
  // 位置和尺寸
  position: {
    type: 'object',
    properties: {
      x: { type: 'number', default: 0, label: 'X坐标' },
      y: { type: 'number', default: 0, label: 'Y坐标' },
      w: { type: 'number', default: 400, label: '宽度', min: 50 },
      h: { type: 'number', default: 300, label: '高度', min: 50 },
      rotation: { type: 'number', default: 0, label: '旋转角度', min: 0, max: 360, unit: '°' }
    }
  },

  // 视觉样式
  visual: {
    type: 'object',
    properties: {
      // 边框
      border: {
        type: 'object',
        properties: {
          show: { type: 'boolean', default: false, label: '显示边框' },
          color: { type: 'color', default: '#3b82f6', label: '边框颜色' },
          width: { type: 'number', default: 1, label: '边框宽度', min: 0, max: 20, unit: 'px' },
          style: {
            type: 'select',
            default: 'solid',
            label: '边框样式',
            options: [
              { label: '实线', value: 'solid' },
              { label: '虚线', value: 'dashed' },
              { label: '点线', value: 'dotted' }
            ]
          },
          radius: { type: 'number', default: 0, label: '圆角半径', min: 0, max: 100, unit: 'px' }
        }
      },

      // 阴影
      shadow: {
        type: 'object',
        properties: {
          show: { type: 'boolean', default: false, label: '显示阴影' },
          offsetX: { type: 'number', default: 0, label: '水平偏移', min: -50, max: 50, unit: 'px' },
          offsetY: { type: 'number', default: 4, label: '垂直偏移', min: -50, max: 50, unit: 'px' },
          blur: { type: 'number', default: 8, label: '模糊半径', min: 0, max: 50, unit: 'px' },
          color: { type: 'color', default: 'rgba(0,0,0,0.3)', label: '阴影颜色' }
        }
      },

      // 背景
      background: {
        type: 'object',
        properties: {
          type: {
            type: 'select',
            default: 'color',
            label: '背景类型',
            options: [
              { label: '纯色', value: 'color' },
              { label: '渐变', value: 'gradient' },
              { label: '图片', value: 'image' }
            ]
          },
          color: { type: 'color', default: 'transparent', label: '背景色' },
          gradient: {
            type: 'object',
            properties: {
              startColor: { type: 'color', default: '#667eea', label: '起始色' },
              endColor: { type: 'color', default: '#764ba2', label: '结束色' },
              angle: { type: 'number', default: 135, label: '渐变角度', min: 0, max: 360, unit: '°' }
            }
          },
          image: {
            type: 'object',
            properties: {
              url: { type: 'string', default: '', label: '图片URL' },
              fit: {
                type: 'select',
                default: 'cover',
                label: '适应方式',
                options: [
                  { label: '覆盖', value: 'cover' },
                  { label: '包含', value: 'contain' },
                  { label: '拉伸', value: 'fill' }
                ]
              }
            }
          }
        }
      },

      // 透明度
      opacity: { type: 'number', default: 100, label: '透明度', min: 0, max: 100, unit: '%' }
    }
  }
}

/**
 * ECharts 图表通用配置 Schema
 */
export const chartConfigSchema = {
  // 标题
  title: {
    type: 'object',
    properties: {
      show: { type: 'boolean', default: true, label: '显示标题' },
      text: { type: 'string', default: '图表标题', label: '主标题' },
      subtext: { type: 'string', default: '', label: '副标题' },
      textStyle: {
        type: 'object',
        properties: {
          fontSize: { type: 'number', default: 16, label: '字体大小', min: 12, max: 48, unit: 'px' },
          fontWeight: {
            type: 'select',
            default: 'normal',
            label: '字体粗细',
            options: [
              { label: '正常', value: 'normal' },
              { label: '加粗', value: 'bold' },
              { label: '特粗', value: '900' }
            ]
          },
          color: { type: 'color', default: '#fff', label: '字体颜色' },
          fontFamily: { type: 'string', default: 'inherit', label: '字体' }
        }
      },
      left: {
        type: 'select',
        default: 'center',
        label: '水平位置',
        options: [
          { label: '左对齐', value: 'left' },
          { label: '居中', value: 'center' },
          { label: '右对齐', value: 'right' }
        ]
      },
      top: { type: 'number', default: 10, label: '上边距', min: 0, max: 200, unit: 'px' }
    }
  },

  // 图例
  legend: {
    type: 'object',
    properties: {
      show: { type: 'boolean', default: true, label: '显示图例' },
      orient: {
        type: 'select',
        default: 'horizontal',
        label: '布局方向',
        options: [
          { label: '横向', value: 'horizontal' },
          { label: '纵向', value: 'vertical' }
        ]
      },
      top: {
        type: 'select',
        default: 'bottom',
        label: '垂直位置',
        options: [
          { label: '顶部', value: 'top' },
          { label: '中间', value: 'middle' },
          { label: '底部', value: 'bottom' }
        ]
      },
      left: {
        type: 'select',
        default: 'center',
        label: '水平位置',
        options: [
          { label: '左侧', value: 'left' },
          { label: '居中', value: 'center' },
          { label: '右侧', value: 'right' }
        ]
      },
      textStyle: {
        type: 'object',
        properties: {
          color: { type: 'color', default: '#999', label: '文字颜色' },
          fontSize: { type: 'number', default: 12, label: '字体大小', min: 10, max: 24, unit: 'px' }
        }
      },
      icon: {
        type: 'select',
        default: 'circle',
        label: '图标形状',
        options: [
          { label: '圆形', value: 'circle' },
          { label: '矩形', value: 'rect' },
          { label: '圆角矩形', value: 'roundRect' },
          { label: '三角形', value: 'triangle' },
          { label: '菱形', value: 'diamond' }
        ]
      }
    }
  },

  // 提示框
  tooltip: {
    type: 'object',
    properties: {
      show: { type: 'boolean', default: true, label: '显示提示框' },
      trigger: {
        type: 'select',
        default: 'item',
        label: '触发类型',
        options: [
          { label: '数据项', value: 'item' },
          { label: '坐标轴', value: 'axis' },
          { label: '无', value: 'none' }
        ]
      },
      backgroundColor: { type: 'color', default: 'rgba(50,50,50,0.9)', label: '背景色' },
      borderColor: { type: 'color', default: '#333', label: '边框颜色' },
      borderWidth: { type: 'number', default: 0, label: '边框宽度', min: 0, max: 5, unit: 'px' },
      textStyle: {
        type: 'object',
        properties: {
          color: { type: 'color', default: '#fff', label: '文字颜色' },
          fontSize: { type: 'number', default: 12, label: '字体大小', min: 10, max: 20, unit: 'px' }
        }
      }
    }
  },

  // 网格/内边距
  grid: {
    type: 'object',
    properties: {
      left: { type: 'string', default: '10%', label: '左边距' },
      right: { type: 'string', default: '10%', label: '右边距' },
      top: { type: 'string', default: '15%', label: '上边距' },
      bottom: { type: 'string', default: '10%', label: '下边距' },
      containLabel: { type: 'boolean', default: true, label: '包含标签' }
    }
  },

  // 坐标轴 (适用于柱状图、折线图等)
  xAxis: {
    type: 'object',
    properties: {
      show: { type: 'boolean', default: true, label: '显示X轴' },
      name: { type: 'string', default: '', label: '轴名称' },
      axisLine: {
        type: 'object',
        properties: {
          show: { type: 'boolean', default: true, label: '显示轴线' },
          lineStyle: {
            type: 'object',
            properties: {
              color: { type: 'color', default: '#666', label: '轴线颜色' },
              width: { type: 'number', default: 1, label: '轴线宽度', min: 0, max: 5, unit: 'px' }
            }
          }
        }
      },
      axisLabel: {
        type: 'object',
        properties: {
          show: { type: 'boolean', default: true, label: '显示标签' },
          color: { type: 'color', default: '#999', label: '标签颜色' },
          fontSize: { type: 'number', default: 12, label: '字体大小', min: 10, max: 20, unit: 'px' },
          rotate: { type: 'number', default: 0, label: '旋转角度', min: -90, max: 90, unit: '°' }
        }
      },
      splitLine: {
        type: 'object',
        properties: {
          show: { type: 'boolean', default: false, label: '显示网格线' },
          lineStyle: {
            type: 'object',
            properties: {
              color: { type: 'color', default: '#333', label: '网格线颜色' },
              type: {
                type: 'select',
                default: 'solid',
                label: '线条类型',
                options: [
                  { label: '实线', value: 'solid' },
                  { label: '虚线', value: 'dashed' },
                  { label: '点线', value: 'dotted' }
                ]
              }
            }
          }
        }
      }
    }
  },

  yAxis: {
    type: 'object',
    properties: {
      show: { type: 'boolean', default: true, label: '显示Y轴' },
      name: { type: 'string', default: '', label: '轴名称' },
      axisLine: {
        type: 'object',
        properties: {
          show: { type: 'boolean', default: true, label: '显示轴线' },
          lineStyle: {
            type: 'object',
            properties: {
              color: { type: 'color', default: '#666', label: '轴线颜色' },
              width: { type: 'number', default: 1, label: '轴线宽度', min: 0, max: 5, unit: 'px' }
            }
          }
        }
      },
      axisLabel: {
        type: 'object',
        properties: {
          show: { type: 'boolean', default: true, label: '显示标签' },
          color: { type: 'color', default: '#999', label: '标签颜色' },
          fontSize: { type: 'number', default: 12, label: '字体大小', min: 10, max: 20, unit: 'px' }
        }
      },
      splitLine: {
        type: 'object',
        properties: {
          show: { type: 'boolean', default: true, label: '显示网格线' },
          lineStyle: {
            type: 'object',
            properties: {
              color: { type: 'color', default: '#333', label: '网格线颜色' },
              type: {
                type: 'select',
                default: 'solid',
                label: '线条类型',
                options: [
                  { label: '实线', value: 'solid' },
                  { label: '虚线', value: 'dashed' },
                  { label: '点线', value: 'dotted' }
                ]
              }
            }
          }
        }
      }
    }
  },

  // 系列配置
  series: {
    type: 'object',
    properties: {
      // 柱状图特有
      barWidth: { type: 'number', default: null, label: '柱宽度', min: 0, max: 100, unit: 'px' },
      barGap: { type: 'string', default: '30%', label: '柱间距' },

      // 折线图特有
      lineWidth: { type: 'number', default: 2, label: '线宽度', min: 1, max: 10, unit: 'px' },
      smooth: { type: 'boolean', default: false, label: '平滑曲线' },

      // 通用
      showLabel: { type: 'boolean', default: false, label: '显示数值标签' },
      labelPosition: {
        type: 'select',
        default: 'top',
        label: '标签位置',
        options: [
          { label: '顶部', value: 'top' },
          { label: '内部', value: 'inside' },
          { label: '底部', value: 'bottom' }
        ]
      },
      labelColor: { type: 'color', default: '#fff', label: '标签颜色' },

      // 颜色配置
      colorType: {
        type: 'select',
        default: 'single',
        label: '颜色类型',
        options: [
          { label: '单色', value: 'single' },
          { label: '渐变', value: 'gradient' },
          { label: '多色', value: 'multi' }
        ]
      },
      color: { type: 'color', default: '#3b82f6', label: '颜色' },
      gradientStart: { type: 'color', default: '#3b82f6', label: '渐变起始色' },
      gradientEnd: { type: 'color', default: '#1d4ed8', label: '渐变结束色' }
    }
  },

  // 动画
  animation: {
    type: 'object',
    properties: {
      enabled: { type: 'boolean', default: true, label: '启用动画' },
      duration: { type: 'number', default: 1000, label: '动画时长', min: 0, max: 5000, unit: 'ms' },
      easing: {
        type: 'select',
        default: 'cubicOut',
        label: '缓动函数',
        options: [
          { label: '线性', value: 'linear' },
          { label: '缓入', value: 'cubicIn' },
          { label: '缓出', value: 'cubicOut' },
          { label: '缓入缓出', value: 'cubicInOut' },
          { label: '弹性', value: 'elasticOut' }
        ]
      },
      delay: { type: 'number', default: 0, label: '延迟时间', min: 0, max: 2000, unit: 'ms' }
    }
  }
}

/**
 * 信息组件配置 Schema
 */
export const infoComponentSchema = {
  // 文本组件
  text: {
    type: 'object',
    properties: {
      text: { type: 'string', default: '通用标题', label: '文本内容' },
      fontSize: { type: 'number', default: 24, label: '字体大小', min: 12, max: 72, unit: 'px' },
      fontFamily: {
        type: 'select',
        default: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        label: '字体',
        options: [
          { label: '系统默认', value: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' },
          { label: 'Arial', value: 'Arial, sans-serif' },
          { label: 'Helvetica', value: 'Helvetica, Arial, sans-serif' },
          { label: 'Times New Roman', value: '"Times New Roman", Times, serif' },
          { label: 'Georgia', value: 'Georgia, serif' },
          { label: 'Courier New', value: '"Courier New", Courier, monospace' },
          { label: 'Verdana', value: 'Verdana, sans-serif' },
          { label: 'Trebuchet MS', value: '"Trebuchet MS", sans-serif' },
          { label: 'Comic Sans MS', value: '"Comic Sans MS", cursive' },
          { label: 'Impact', value: 'Impact, sans-serif' }
        ]
      },
      fontWeight: {
        type: 'select',
        default: '600',
        label: '字体粗细',
        options: [
          { label: '正常', value: 'normal' },
          { label: '中等', value: '500' },
          { label: '加粗', value: '600' },
          { label: '特粗', value: 'bold' }
        ]
      },
      color: { type: 'color', default: '#fff', label: '文字颜色' },
      textAlign: {
        type: 'select',
        default: 'center',
        label: '对齐方式',
        options: [
          { label: '左对齐', value: 'left' },
          { label: '居中', value: 'center' },
          { label: '右对齐', value: 'right' }
        ]
      },
      lineHeight: { type: 'number', default: 1.5, label: '行高', min: 1, max: 3, step: 0.1 },
      letterSpacing: { type: 'number', default: 0, label: '字间距', min: -5, max: 20, unit: 'px' },
      textShadow: { type: 'boolean', default: false, label: '文字阴影' }
    }
  },

  // 数字翻牌器
  numberFlip: {
    type: 'object',
    properties: {
      value: { type: 'number', default: 12345, label: '数值' },
      prefix: { type: 'string', default: '', label: '前缀' },
      suffix: { type: 'string', default: '', label: '后缀' },
      duration: { type: 'number', default: 2000, label: '翻转时长', min: 500, max: 5000, unit: 'ms' },
      decimals: { type: 'number', default: 0, label: '小数位数', min: 0, max: 4 },
      fontSize: { type: 'number', default: 48, label: '字体大小', min: 24, max: 100, unit: 'px' },
      color: { type: 'color', default: '#3b82f6', label: '数字颜色' }
    }
  },

  // KPI指标卡
  kpiCard: {
    type: 'object',
    properties: {
      title: { type: 'string', default: 'KPI指标', label: '标题' },
      value: { type: 'number', default: 1234, label: '数值' },
      unit: { type: 'string', default: '', label: '单位' },
      trend: {
        type: 'select',
        default: 'up',
        label: '趋势',
        options: [
          { label: '上升', value: 'up' },
          { label: '下降', value: 'down' },
          { label: '无变化', value: 'flat' }
        ]
      },
      trendValue: { type: 'string', default: '+12.5%', label: '趋势值' },
      icon: { type: 'string', default: '', label: '图标' },
      bgColor: { type: 'color', default: 'rgba(59, 130, 246, 0.1)', label: '背景色' }
    }
  },

  // 进度条
  progressBar: {
    type: 'object',
    properties: {
      value: { type: 'number', default: 60, label: '进度值', min: 0, max: 100 },
      showText: { type: 'boolean', default: true, label: '显示文字' },
      height: { type: 'number', default: 20, label: '高度', min: 10, max: 50, unit: 'px' },
      color: { type: 'color', default: '#10b981', label: '进度条颜色' },
      bgColor: { type: 'color', default: 'rgba(255,255,255,0.1)', label: '背景色' },
      borderRadius: { type: 'number', default: 10, label: '圆角', min: 0, max: 25, unit: 'px' },
      striped: { type: 'boolean', default: false, label: '条纹样式' },
      animated: { type: 'boolean', default: false, label: '动画效果' }
    }
  },

  // 数据表格
  table: {
    type: 'object',
    properties: {
      headerBgColor: { type: 'color', default: '#1f2937', label: '表头背景色' },
      headerTextColor: { type: 'color', default: '#fff', label: '表头文字颜色' },
      rowBgColor: { type: 'color', default: 'transparent', label: '行背景色' },
      rowHoverColor: { type: 'color', default: 'rgba(255,255,255,0.05)', label: '行悬停色' },
      borderColor: { type: 'color', default: '#374151', label: '边框颜色' },
      fontSize: { type: 'number', default: 12, label: '字体大小', min: 10, max: 18, unit: 'px' },
      stripe: { type: 'boolean', default: true, label: '斑马纹' },
      showHeader: { type: 'boolean', default: true, label: '显示表头' }
    }
  }
}

/**
 * 根据组件类型获取配置 Schema
 */
export function getComponentSchema(componentType) {
  const schemas = {
    // 基础图表
    bar: ['title', 'legend', 'tooltip', 'grid', 'xAxis', 'yAxis', 'series', 'animation'],
    line: ['title', 'legend', 'tooltip', 'grid', 'xAxis', 'yAxis', 'series', 'animation'],
    pie: ['title', 'legend', 'tooltip', 'series', 'animation'],
    area: ['title', 'legend', 'tooltip', 'grid', 'xAxis', 'yAxis', 'series', 'animation'],

    // 高级图表
    scatter: ['title', 'legend', 'tooltip', 'grid', 'xAxis', 'yAxis', 'animation'],
    radar: ['title', 'legend', 'tooltip', 'animation'],
    gauge: ['title', 'tooltip', 'animation'],
    funnel: ['title', 'legend', 'tooltip', 'animation'],

    // 地图
    'map-china': ['title', 'tooltip', 'animation'],
    'map-3d': ['title', 'tooltip'],
    heatmap: ['title', 'tooltip', 'grid', 'xAxis', 'yAxis', 'animation'],

    // 特效图表
    liquid: ['title', 'animation'],
    'word-cloud': ['tooltip'],
    sankey: ['title', 'tooltip', 'animation'],
    treemap: ['title', 'tooltip', 'animation'],
    sunburst: ['title', 'tooltip', 'animation'],

    // 信息组件
    text: ['text'],
    'number-flip': ['numberFlip'],
    'kpi-card': ['kpiCard'],
    'progress-bar': ['progressBar'],
    table: ['table']
  }

  const configKeys = schemas[componentType] || []
  const result = {}

  configKeys.forEach(key => {
    if (chartConfigSchema[key]) {
      result[key] = chartConfigSchema[key]
    } else if (infoComponentSchema[key]) {
      result[key] = infoComponentSchema[key]
    }
  })

  return result
}

/**
 * 获取默认配置值
 */
export function getDefaultConfig(schema) {
  const config = {}

  function traverse(obj, target) {
    if (obj.type === 'object' && obj.properties) {
      Object.keys(obj.properties).forEach(key => {
        const prop = obj.properties[key]
        if (prop.type === 'object' && prop.properties) {
          target[key] = {}
          traverse(prop, target[key])
        } else if (prop.default !== undefined) {
          target[key] = prop.default
        }
      })
    }
  }

  traverse(schema, config)
  return config
}

/**
 * 组件类型分类配置
 */
export const componentCategories = {
  chart: ['bar', 'line', 'pie', 'area', 'scatter', 'radar', 'gauge', 'funnel',
          'map-china', 'map-3d', 'heatmap', 'liquid', 'word-cloud', 'sankey', 'treemap', 'sunburst'],
  info: ['text', 'number-flip', 'kpi-card', 'progress-bar', 'table']
}

/**
 * 判断组件是否为图表类型
 */
export function isChartComponent(componentType) {
  return componentCategories.chart.includes(componentType)
}
