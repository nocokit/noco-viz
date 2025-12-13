/**
 * 大屏编辑器 - 图表组件配置
 * 共20个常见图表组件，分为5大类
 */

export const chartCategories = [
  {
    id: 'basic',
    name: '基础图表',
    icon: 'chart',
    charts: [
      {
        type: 'bar',
        name: '基础柱状图',
        icon: 'bar',
        defaultSize: { w: 400, h: 300 },
        description: '用于对比不同类目的数据',
        color: '#00f2f2' // DataV 青色
      },
      {
        type: 'line',
        name: '折线图',
        icon: 'line',
        defaultSize: { w: 400, h: 300 },
        description: '展示数据趋势变化',
        color: '#0099cc' // 科技蓝
      },
      {
        type: 'pie',
        name: '饼图',
        icon: 'pie',
        defaultSize: { w: 350, h: 350 },
        description: '展示数据占比关系',
        color: '#ffaa00' // 橙色强调
      },
      {
        type: 'area',
        name: '面积图',
        icon: 'area',
        defaultSize: { w: 400, h: 300 },
        description: '强调数量随时间变化',
        color: '#66ffff' // 亮青色
      }
    ]
  },
  {
    id: 'advanced',
    name: '高级图表',
    icon: 'chart-advanced',
    charts: [
      {
        type: 'scatter',
        name: '散点图',
        icon: 'scatter',
        defaultSize: { w: 400, h: 300 },
        description: '展示变量之间的关系',
        color: '#ff6b9d' // 粉红
      },
      {
        type: 'radar',
        name: '雷达图',
        icon: 'radar',
        defaultSize: { w: 350, h: 350 },
        description: '多维度数据对比',
        color: '#00f2f2' // 主题青色
      },
      {
        type: 'gauge',
        name: '仪表盘',
        icon: 'gauge',
        defaultSize: { w: 300, h: 300 },
        description: '展示进度或指标完成度',
        color: '#ffaa00' // 橙色
      },
      {
        type: 'funnel',
        name: '漏斗图',
        icon: 'funnel',
        defaultSize: { w: 350, h: 350 },
        description: '业务流程转化率分析',
        color: '#006699' // 深蓝
      }
    ]
  },
  {
    id: 'map',
    name: '地图图表',
    icon: 'map',
    charts: [
      // {
      //   type: 'map-china',
      //   name: '中国地图',
      //   icon: 'map',
      //   defaultSize: { w: 500, h: 400 },
      //   description: '展示中国各省市数据分布',
      //   color: '#00f2f2'
      // },
      // {
      //   type: 'map-3d',
      //   name: '3D地图',
      //   icon: 'map-3d',
      //   defaultSize: { w: 500, h: 400 },
      //   description: '立体地图可视化',
      //   color: '#0099cc'
      // },
      {
        type: 'heatmap',
        name: '热力图',
        icon: 'heatmap',
        defaultSize: { w: 400, h: 300 },
        description: '展示数据密度分布',
        color: '#ff4466' // 红色热力
      }
    ]
  },
  {
    id: 'special',
    name: '特效图表',
    icon: 'special',
    charts: [
      {
        type: 'liquid',
        name: '水波图',
        icon: 'liquid',
        defaultSize: { w: 250, h: 250 },
        description: '动态展示百分比数据',
        color: '#00f2f2' // 青色水波
      },
      {
        type: 'word-cloud',
        name: '词云图',
        icon: 'word-cloud',
        defaultSize: { w: 400, h: 300 },
        description: '关键词频率可视化',
        color: '#9966ff' // 紫色
      },
      {
        type: 'sankey',
        name: '桑基图',
        icon: 'sankey',
        defaultSize: { w: 500, h: 400 },
        description: '展示数据流向关系',
        color: '#00cc99' // 青绿
      },
      {
        type: 'treemap',
        name: '矩形树图',
        icon: 'treemap',
        defaultSize: { w: 400, h: 350 },
        description: '层级数据占比可视化',
        color: '#ffaa00' // 橙色
      },
      {
        type: 'sunburst',
        name: '旭日图',
        icon: 'sunburst',
        defaultSize: { w: 350, h: 350 },
        description: '多层级关系展示',
        color: '#ff88cc' // 粉色
      }
    ]
  },
  {
    id: 'info',
    name: '信息组件',
    icon: 'info',
    charts: [
      {
        type: 'text',
        name: '通用标题',
        icon: 'text',
        defaultSize: { w: 300, h: 60 },
        description: '可自定义样式的文本',
        color: '#bcd0e3' // 浅蓝灰
      },
      {
        type: 'number-flip',
        name: '数字翻牌器',
        icon: 'number',
        defaultSize: { w: 200, h: 100 },
        description: '动态数字展示',
        color: '#00f2f2' // 青色
      },
      {
        type: 'kpi-card',
        name: 'KPI指标卡',
        icon: 'kpi',
        defaultSize: { w: 250, h: 120 },
        description: '关键指标展示卡片',
        color: '#00cc99' // 青绿
      },
      {
        type: 'progress-bar',
        name: '进度条',
        icon: 'progress',
        defaultSize: { w: 300, h: 40 },
        description: '展示任务完成进度',
        color: '#66ffff' // 亮青
      },
      {
        type: 'table',
        name: '数据表格',
        icon: 'table',
        defaultSize: { w: 500, h: 300 },
        description: '结构化数据展示',
        color: '#8899aa' // 灰蓝
      }
    ]
  },
  {
    id: 'decoration',
    name: '底图装饰',
    icon: 'decoration',
    charts: [
      {
        type: 'border-01',
        name: '边框01',
        icon: 'border-01',
        defaultSize: { w: 400, h: 300 },
        description: '科技感边框装饰',
        color: '#00f2f2'
      },
      {
        type: 'border-02',
        name: '边框02',
        icon: 'border-02',
        defaultSize: { w: 400, h: 300 },
        description: '双线边框',
        color: '#0099cc'
      },
      {
        type: 'border-03',
        name: '边框03',
        icon: 'border-03',
        defaultSize: { w: 400, h: 300 },
        description: '四角装饰边框',
        color: '#ffaa00'
      },
      {
        type: 'border-04',
        name: '边框04',
        icon: 'border-04',
        defaultSize: { w: 400, h: 300 },
        description: '动态流光边框',
        color: '#66ffff'
      },
      {
        type: 'decoration-01',
        name: '装饰01',
        icon: 'decoration-01',
        defaultSize: { w: 200, h: 50 },
        description: '标题装饰线',
        color: '#00f2f2'
      },
      {
        type: 'decoration-02',
        name: '装饰02',
        icon: 'decoration-02',
        defaultSize: { w: 150, h: 150 },
        description: '角标装饰',
        color: '#ffaa00'
      },
      {
        type: 'decoration-03',
        name: '装饰03',
        icon: 'decoration-03',
        defaultSize: { w: 300, h: 100 },
        description: '分隔线装饰',
        color: '#0099cc'
      },
      {
        type: 'bg-box',
        name: '容器背景',
        icon: 'bg-box',
        defaultSize: { w: 500, h: 400 },
        description: '数据展示容器背景',
        color: '#003366'
      }
    ]
  }
]

/**
 * 获取所有图表的扁平化列表
 */
export function getAllCharts() {
  return chartCategories.flatMap(category =>
    category.charts.map(chart => ({
      ...chart,
      category: category.id,
      categoryName: category.name
    }))
  )
}

/**
 * 根据类型获取图表配置
 */
export function getChartByType(type) {
  const allCharts = getAllCharts()
  return allCharts.find(chart => chart.type === type)
}

/**
 * 图表图标SVG路径映射 - DataV 风格
 * 采用线性图标设计，更具科技感和现代感
 */
export const chartIcons = {
  // 基础图表 - 对应HTML中的基础统计图表
  bar: 'M2,20 L2,4 M22,20 L2,20 M6,20 L6,12 M10,20 L10,8 M14,20 L14,14 M18,20 L18,6',
  line: 'M2,18 L6,12 L10,14 L14,8 L18,10 L22,6',
  pie: 'M12,2 A10,10 0 0,1 22,12 L12,12 Z M12,2 A10,10 0 1,0 22,12',
  area: 'M2,18 L6,12 L10,14 L14,8 L18,10 L22,6 L22,20 L2,20 Z',

  // 高级图表 - 复杂分析场景
  scatter: 'M7,8 L7,8.01 M11,6 L11,6.01 M15,12 L15,12.01 M19,9 L19,9.01 M9,14 L9,14.01 M13,16 L13,16.01 M17,7 L17,7.01 M5,11 L5,11.01',
  radar: 'M12,3 L19,9 L16,19 L8,19 L5,9 Z M12,3 L12,12 M19,9 L12,12 M16,19 L12,12 M8,19 L12,12 M5,9 L12,12',
  gauge: 'M4,14 A8,8 0 0,1 20,14 M12,14 L8,10 M6,14 L6,14.5 M10,6 L10,7 M14,6 L14,7 M18,14 L18,14.5',
  funnel: 'M3,4 L21,4 L18,10 L6,10 Z M6,10 L8,14 L16,14 L18,10 M8,14 L10,18 L14,18 L16,14',

  // 地图图表
  map: 'M2,6 L8,3 L16,6 L22,3 L22,18 L16,21 L8,18 L2,21 Z M8,3 L8,18 M16,6 L16,21',
  'map-3d': 'M12,2 L2,7 L2,17 L12,22 L22,17 L22,7 Z M12,2 L12,22 M2,7 L12,12 M22,7 L12,12',
  heatmap: 'M3,3 L9,3 L9,9 L3,9 Z M11,3 L17,3 L17,9 L11,9 Z M19,3 L21,3 L21,9 L19,9 M3,11 L9,11 L9,17 L3,17 Z M11,11 L17,11 L17,17 L11,17 Z M19,11 L21,11 L21,17 L19,17 Z M3,19 L9,19 L9,21 L3,21 Z',

  // 特效图表 - 高级可视化效果
  liquid: 'M12,2 C17,2 21,6 21,11 C21,16.5 16.5,21 12,21 C7.5,21 3,16.5 3,11 C3,6 7,2 12,2 Z M6,13 Q9,10 12,10 T18,13 Q15,16 12,16 T6,13',
  'word-cloud': 'M4,7 L10,7 M13,6 L20,6 M6,10 L14,10 M16,10 L21,10 M5,13 L11,13 M14,13 L19,13 M7,16 L15,16 M17,16 L20,16',
  sankey: 'M2,6 L8,6 L8,18 L2,18 Z M10,6 Q12,9 14,9 M10,12 Q12,12 14,12 M10,18 Q12,15 14,15 M14,8 L20,8 L20,10 L14,10 Z M14,14 L20,14 L20,16 L14,16 Z',
  treemap: 'M2,2 L22,2 L22,22 L2,22 Z M2,10 L12,10 M12,2 L12,22 M15,2 L15,22 M2,16 L12,16',
  sunburst: 'M12,2 A10,10 0 0,1 22,12 A10,10 0 0,1 12,22 A10,10 0 0,1 2,12 A10,10 0 0,1 12,2 M12,2 L12,22 M2,12 L22,12 M6.34,6.34 L17.66,17.66 M6.34,17.66 L17.66,6.34',

  // 信息组件 - 大屏信息展示
  text: 'M3,7 L21,7 M3,12 L21,12 M3,17 L15,17',
  number: 'M8,2 L8,22 M16,2 L16,22 M2,8 L22,8 M2,16 L22,16',
  kpi: 'M2,3 L22,3 L22,11 L2,11 Z M6,6 L18,6 L18,8 L6,8 Z M2,14 L11,14 L11,22 L2,22 Z M14,14 L22,14 L22,22 L14,22 Z',
  progress: 'M2,10 L22,10 L22,14 L2,14 Z M2,10 L16,10 L16,14 L2,14 Z',
  table: 'M2,2 L22,2 L22,22 L2,22 Z M2,8 L22,8 M2,14 L22,14 M8,2 L8,22 M16,2 L16,22',

  // 分类图标
  chart: 'M2,2 L2,22 L22,22 M6,16 L10,12 L14,14 L18,8 L22,10',
  'chart-advanced': 'M12,2 L20,10 L17,21 L7,21 L4,10 Z',
  special: 'M12,2 L14.5,9 L22,10 L17,15 L18.5,22 L12,18.5 L5.5,22 L7,15 L2,10 L9.5,9 Z',
  info: 'M12,2 A10,10 0 0,1 22,12 A10,10 0 0,1 12,22 A10,10 0 0,1 2,12 A10,10 0 0,1 12,2 M12,7 L12,13 M12,16 L12.01,16',

  // 底图装饰组件 - DataV 科技风格
  decoration: 'M12,2 L22,12 L12,22 L2,12 Z M7,12 L12,7 L17,12 L12,17 Z',

  // 边框系列
  'border-01': 'M2,2 L22,2 L22,22 L2,22 Z M2,2 L6,6 M22,2 L18,6 M22,22 L18,18 M2,22 L6,18',
  'border-02': 'M3,3 L21,3 L21,21 L3,21 Z M2,2 L22,2 L22,22 L2,22 Z',
  'border-03': 'M2,2 L8,2 M22,2 L16,2 M2,22 L8,22 M22,22 L16,22 M2,2 L2,8 M22,2 L22,8 M2,22 L2,16 M22,22 L22,16 M2,2 L4,4 M22,2 L20,4 M2,22 L4,20 M22,22 L20,20',
  'border-04': 'M2,2 L22,2 L22,22 L2,22 Z M2,12 L22,12 M12,2 L12,22 M6,2 L6,6 M18,2 L18,6 M6,22 L6,18 M18,22 L18,18',

  // 装饰系列
  'decoration-01': 'M2,12 L8,12 M16,12 L22,12 M12,6 L12,18 M8,8 L16,8 M8,16 L16,16',
  'decoration-02': 'M2,2 L10,2 L10,10 L2,10 Z M14,14 L22,14 L22,22 L14,22 Z M6,6 L18,18 M18,6 L6,18',
  'decoration-03': 'M2,12 L22,12 M2,8 L6,12 L2,16 M22,8 L18,12 L22,16 M10,8 L12,10 L14,8 M10,16 L12,14 L14,16',

  // 容器背景
  'bg-box': 'M2,2 L22,2 L22,22 L2,22 Z M2,2 L22,22 M22,2 L2,22 M12,2 L12,22 M2,12 L22,12'
}
