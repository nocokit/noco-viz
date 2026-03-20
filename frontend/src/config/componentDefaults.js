/**
 * 组件默认属性配置
 * key: 组件类型
 * value: 组件默认属性
 */
export const componentDefaults = {
  // 基础图表 - 默认有内边距
  'bar': {
    paddingVertical: 8,
    paddingHorizontal: 8,
    bgColor: 'transparent',
    opacity: 100,
    borderWidth: 0,
    borderRadius: 4
  },
  'line': {
    paddingVertical: 8,
    paddingHorizontal: 8,
    bgColor: 'transparent',
    opacity: 100,
    borderWidth: 0,
    borderRadius: 4
  },
  'pie': {
    paddingVertical: 8,
    paddingHorizontal: 8,
    bgColor: 'transparent',
    opacity: 100,
    borderWidth: 0,
    borderRadius: 4
  },
  'area': {
    paddingVertical: 8,
    paddingHorizontal: 8,
    bgColor: 'transparent',
    opacity: 100,
    borderWidth: 0,
    borderRadius: 4
  },
  'scatter': {
    paddingVertical: 8,
    paddingHorizontal: 8,
    bgColor: 'transparent',
    opacity: 100,
    borderWidth: 0,
    borderRadius: 4
  },
  'radar': {
    paddingVertical: 8,
    paddingHorizontal: 8,
    bgColor: 'transparent',
    opacity: 100,
    borderWidth: 0,
    borderRadius: 4
  },
  'gauge': {
    paddingVertical: 8,
    paddingHorizontal: 8,
    bgColor: 'transparent',
    opacity: 100,
    borderWidth: 0,
    borderRadius: 4
  },
  'funnel': {
    paddingVertical: 8,
    paddingHorizontal: 8,
    bgColor: 'transparent',
    opacity: 100,
    borderWidth: 0,
    borderRadius: 4
  },

  // 地图类
  'map-china': {
    paddingVertical: 8,
    paddingHorizontal: 8,
    bgColor: 'transparent',
    opacity: 100,
    borderWidth: 0,
    borderRadius: 4
  },
  'map-3d': {
    paddingVertical: 8,
    paddingHorizontal: 8,
    bgColor: 'transparent',
    opacity: 100,
    borderWidth: 0,
    borderRadius: 4
  },
  'heatmap': {
    paddingVertical: 8,
    paddingHorizontal: 8,
    bgColor: 'transparent',
    opacity: 100,
    borderWidth: 0,
    borderRadius: 4
  },

  // 特殊图表
  'liquid': {
    paddingVertical: 8,
    paddingHorizontal: 8,
    bgColor: 'transparent',
    opacity: 100,
    borderWidth: 0,
    borderRadius: 4
  },
  'word-cloud': {
    paddingVertical: 8,
    paddingHorizontal: 8,
    bgColor: 'transparent',
    opacity: 100,
    borderWidth: 0,
    borderRadius: 4
  },
  'sankey': {
    paddingVertical: 8,
    paddingHorizontal: 8,
    bgColor: 'transparent',
    opacity: 100,
    borderWidth: 0,
    borderRadius: 4
  },
  'treemap': {
    paddingVertical: 8,
    paddingHorizontal: 8,
    bgColor: 'transparent',
    opacity: 100,
    borderWidth: 0,
    borderRadius: 4
  },
  'sunburst': {
    paddingVertical: 8,
    paddingHorizontal: 8,
    bgColor: 'transparent',
    opacity: 100,
    borderWidth: 0,
    borderRadius: 4
  },

  // 底图装饰 - 无内边距
  'border-01': {
    paddingVertical: 0,
    paddingHorizontal: 0,
    bgColor: 'transparent',
    opacity: 100,
    borderWidth: 0,
    borderRadius: 0
  },
  'border-02': {
    paddingVertical: 0,
    paddingHorizontal: 0,
    bgColor: 'transparent',
    opacity: 100,
    borderWidth: 0,
    borderRadius: 0
  },
  'border-03': {
    paddingVertical: 0,
    paddingHorizontal: 0,
    bgColor: 'transparent',
    opacity: 100,
    borderWidth: 0,
    borderRadius: 0
  },
  'border-04': {
    paddingVertical: 0,
    paddingHorizontal: 0,
    bgColor: 'transparent',
    opacity: 100,
    borderWidth: 0,
    borderRadius: 0
  },
  'decoration-01': {
    paddingVertical: 0,
    paddingHorizontal: 0,
    bgColor: 'transparent',
    opacity: 100,
    borderWidth: 0,
    borderRadius: 0
  },
  'decoration-02': {
    paddingVertical: 0,
    paddingHorizontal: 0,
    bgColor: 'transparent',
    opacity: 100,
    borderWidth: 0,
    borderRadius: 0
  },
  'decoration-03': {
    paddingVertical: 0,
    paddingHorizontal: 0,
    bgColor: 'transparent',
    opacity: 100,
    borderWidth: 0,
    borderRadius: 0
  },

  // 容器背景 - 无内边距
  'bg-box': {
    paddingVertical: 0,
    paddingHorizontal: 0,
    bgColor: 'transparent',
    opacity: 100,
    borderWidth: 0,
    borderRadius: 0
  },

  // 背景图片 - 无内边距，默认铺满
  'bg-image': {
    paddingVertical: 0,
    paddingHorizontal: 0,
    bgColor: 'transparent',
    opacity: 100,
    borderWidth: 0,
    borderRadius: 0
  }
}

/**
 * 获取组件默认属性
 * @param {string} type - 组件类型
 * @returns {object} 默认属性对象
 */
export function getComponentDefaults(type) {
  return componentDefaults[type] || {
    paddingVertical: 8,
    paddingHorizontal: 8,
    bgColor: 'transparent',
    opacity: 100,
    borderWidth: 0,
    borderRadius: 4
  }
}
