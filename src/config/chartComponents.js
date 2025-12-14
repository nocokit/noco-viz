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
      {
        type: 'map-china',
        name: '中国地图',
        icon: 'map',
        defaultSize: { w: 500, h: 400 },
        description: '展示中国各省市数据分布',
        color: '#00f2f2'
      },
      {
        type: 'map-3d',
        name: '3D地图',
        icon: 'map-3d',
        defaultSize: { w: 500, h: 400 },
        description: '立体地图可视化',
        color: '#0099cc'
      },
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
 * 图表图标SVG路径映射 - DataV 科技风格
 * 采用科技感几何线条设计，突出未来感和数据可视化特征
 * 所有图标基于 24x24 画布设计
 */
export const chartIcons = {
  // ==================== 基础图表 ====================
  // 柱状图 - 科技感渐变柱体，带数据点标识
  bar: 'M3,20 L3,4 L4,4 L4,20 Z M6,20 L6,10 L8,10 L8,20 Z M7,9 L7,8.5 M10,20 L10,7 L12,7 L12,20 Z M11,6 L11,5.5 M14,20 L14,12 L16,12 L16,20 Z M15,11 L15,10.5 M18,20 L18,5 L20,5 L20,20 Z M19,4 L19,3.5 M2,20 L22,20 M2,4 L2,20',

  // 折线图 - 动态科技曲线，带节点高光
  line: 'M2,3 L2,21 L22,21 M4,16 L7,12 L10,14 L13,8 L16,10 L19,6 L22,9 M7,12 A0.8,0.8 0 1,0 7.01,12 M10,14 A0.8,0.8 0 1,0 10.01,14 M13,8 A0.8,0.8 0 1,0 13.01,8 M16,10 A0.8,0.8 0 1,0 16.01,10 M19,6 A0.8,0.8 0 1,0 19.01,6',

  // 饼图 - 环形科技饼，带分割效果
  pie: 'M12,4 A8,8 0 0,1 20,12 L12,12 Z M12,4 A8,8 0 0,0 4,12 L12,12 Z M12,4 A8,8 0 1,0 12,20 L12,12 Z M12,12 L15,9 M12,12 L9,9 M12,12 L12,8 M12,12 A1,1 0 1,0 12.01,12',

  // 面积图 - 渐变填充区域，科技流动感
  area: 'M2,3 L2,21 L22,21 M3,16 L6,12 L9,14 L12,8 L15,11 L18,7 L21,10 L21,20 L3,20 Z M6,12 L6,11 M9,14 L9,13 M12,8 L12,7 M15,11 L15,10 M18,7 L18,6',

  // ==================== 高级图表 ====================
  // 散点图 - 多维散点，带十字定位
  scatter: 'M2,3 L2,21 L22,21 M7,10 L7.8,10 M6.6,10 L7.4,10 M7,9.6 L7,10.4 M11,7 L11.8,7 M10.6,7 L11.4,7 M11,6.6 L11,7.4 M15,14 L15.8,14 M14.6,14 L15.4,14 M15,13.6 L15,14.4 M19,9 L19.8,9 M18.6,9 L19.4,9 M19,8.6 L19,9.4 M8,16 L8.8,16 M7.6,16 L8.4,16 M8,15.6 L8,16.4 M13,12 L13.8,12 M12.6,12 L13.4,12 M13,11.6 L13,12.4 M17,8 L17.8,8 M16.6,8 L17.4,8 M17,7.6 L17,8.4 M6,13 L6.8,13 M5.6,13 L6.4,13 M6,12.6 L6,13.4',

  // 雷达图 - 六边形网格，科技扫描感
  radar: 'M12,3 L18,7.5 L18,16.5 L12,21 L6,16.5 L6,7.5 Z M12,6 L16,9 L16,15 L12,18 L8,15 L8,9 Z M12,9 L14,10.5 L14,13.5 L12,15 L10,13.5 L10,10.5 Z M12,3 L12,21 M6,7.5 L18,16.5 M6,16.5 L18,7.5 M12,12 L15,10 M12,12 L17,14',

  // 仪表盘 - 半圆弧度，指针动态
  gauge: 'M4,15 A8,8 0 0,1 20,15 M6,16 A6,6 0 0,1 18,16 M12,15 L8.5,11.5 M12,15 A1.5,1.5 0 1,0 12.01,15 M5,15.5 L5,17 M8,10 L8.5,11.5 M10.5,7 L11,8.5 M13,7 L13.5,8.5 M16,10 L16.5,11.5 M19,15.5 L19,17 M12,20 L12,15',

  // 漏斗图 - 多层梯形，流程转化
  funnel: 'M4,4 L20,4 L18,9 L6,9 Z M6,9 L18,9 L16,14 L8,14 Z M8,14 L16,14 L14,19 L10,19 Z M4,4 L4.5,4.5 M20,4 L19.5,4.5 M6,9 L6.5,9.5 M18,9 L17.5,9.5 M8,14 L8.5,14.5 M16,14 L15.5,14.5',

  // ==================== 地图图表 ====================
  // 地图 - 区域划分，坐标网格
  map: 'M3,3 L21,3 L21,21 L3,21 Z M3,9 L21,9 M3,15 L21,15 M9,3 L9,21 M15,3 L15,21 M12,6 A2,2 0 1,0 12.01,6 M7,12 A1.5,1.5 0 1,0 7.01,12 M17,17 A1.5,1.5 0 1,0 17.01,17 M14,10 L14,14 L10,14',

  // 3D地图 - 立方体投影，空间层次
  'map-3d': 'M12,3 L21,8 L21,16 L12,21 L3,16 L3,8 Z M12,3 L12,12 M12,12 L21,16 M12,12 L3,16 M8,6 L8,11 L12,13 M16,11 L16,6 L12,4 M6,14 L8,15 M10,16 L12,17 M14,16 L16,15 M18,14 L19,13.5',

  // 热力图 - 方格渐变，密度表示
  heatmap: 'M3,3 L21,3 L21,21 L3,21 Z M3,9 L21,9 M3,15 L21,15 M9,3 L9,21 M15,3 L15,21 M4.5,4.5 L7.5,4.5 L7.5,7.5 L4.5,7.5 Z M10.5,4.5 L13.5,4.5 L13.5,7.5 L10.5,7.5 Z M16.5,10.5 L19.5,10.5 L19.5,13.5 L16.5,13.5 Z M4.5,16.5 L7.5,16.5 L7.5,19.5 L4.5,19.5 Z',

  // ==================== 特效图表 ====================
  // 水波图 - 液体流动，波纹效果
  liquid: 'M12,2 C17,2 20,5 20,10 C20,16 16,22 12,22 C8,22 4,16 4,10 C4,5 7,2 12,2 Z M6,12 Q8,10 10,10 T14,10 T18,10 M6,14 Q8,12 10,12 T14,12 T18,12 M7,16 Q9,14 11,14 T15,14 T17,14 M12,10 L12,9',

  // 词云图 - 文字散布，权重可视
  'word-cloud': 'M5,6 L10,6 M5.5,7 L9.5,7 M13,5 L19,5 M13.5,6 L18.5,6 M14,7 L18,7 M4,10 L9,10 M4.5,11 L8.5,11 M11,10 L16,10 M11.5,11 L15.5,11 M18,9 L21,9 M18.5,10 L20.5,10 M6,14 L12,14 M6.5,15 L11.5,15 M7,16 L11,16 M14,14 L19,14 M14.5,15 L18.5,15 M5,18 L10,18 M5.5,19 L9.5,19 M12,18 L16,18 M12.5,19 L15.5,19',

  // 桑基图 - 流向关系，能量流动
  sankey: 'M3,6 L7,6 L7,10 L3,10 Z M3,14 L7,14 L7,18 L3,18 Z M17,6 L21,6 L21,10 L17,10 Z M17,14 L21,14 L21,18 L17,18 Z M7,7 Q12,7 12,8 L12,10 Q12,11 17,11 M7,9 Q10,9 10,12 L10,14 Q10,16 17,16 M7,16 Q12,16 12,14 L12,12 Q12,10 17,10',

  // 矩形树图 - 嵌套矩形，层级分布
  treemap: 'M2,2 L22,2 L22,22 L2,22 Z M2,11 L11,11 M11,2 L11,22 M15,2 L15,22 M19,2 L19,22 M2,6 L11,6 M2,16 L11,16 M11,8 L22,8 M11,14 L22,14 M15,11 L15,8 M19,11 L19,8',

  // 旭日图 - 多层圆环，辐射结构
  sunburst: 'M12,2 A10,10 0 0,1 22,12 A10,10 0 0,1 12,22 A10,10 0 0,1 2,12 A10,10 0 0,1 12,2 M12,6 A6,6 0 0,1 18,12 A6,6 0 0,1 12,18 A6,6 0 0,1 6,12 A6,6 0 0,1 12,6 M12,2 L12,22 M2,12 L22,12 M5.75,5.75 L18.25,18.25 M5.75,18.25 L18.25,5.75 M12,6 L12,18 M6,12 L18,12',

  // ==================== 信息组件 ====================
  // 文本标题 - 排版线条，科技边框
  text: 'M2,4 L22,4 M2,5 L22,5 M4,10 L20,10 M4,11 L20,11 M4,16 L16,16 M4,17 L16,17 M2,3 L2,6 M22,3 L22,6 M2,20 L2,18 M22,20 L22,18',

  // 数字翻牌器 - 数码管风格，分段显示
  number: 'M4,3 L9,3 L9,11 L4,11 Z M4,5 L9,5 M4,7 L9,7 M4,9 L9,9 M15,3 L20,3 L20,11 L15,11 Z M15,5 L20,5 M15,7 L20,7 M15,9 L20,9 M4,13 L9,13 L9,21 L4,21 Z M4,15 L9,15 M4,17 L9,17 M4,19 L9,19 M15,13 L20,13 L20,21 L15,21 Z M15,15 L20,15 M15,17 L20,17 M15,19 L20,19',

  // KPI指标卡 - 信息模块，数据面板
  kpi: 'M2,3 L22,3 L22,10 L2,10 Z M4,5 L12,5 L12,8 L4,8 Z M14,5 L20,5 M14,8 L17,8 M2,13 L10,13 L10,22 L2,22 Z M4,15 L8,15 M4,17 L8,17 M4,19 L8,19 M13,13 L22,13 L22,22 L13,22 Z M15,15 L20,15 M15,17 L20,17 M15,19 L20,19',

  // 进度条 - 轨道填充，动态进度
  progress: 'M2,10 L22,10 L22,14 L2,14 Z M3,11 L15,11 L15,13 L3,13 Z M15,10 L15,14 M15,12 L16,12 L16.5,11.5 L17,12 L16.5,12.5 L16,12 M2,9 L2,15 M22,9 L22,15 M6,11 L6,13 M9,11 L9,13 M12,11 L12,13',

  // 数据表格 - 网格布局，行列分明
  table: 'M2,2 L22,2 L22,22 L2,22 Z M2,7 L22,7 M2,12 L22,12 M2,17 L22,17 M8,2 L8,22 M14,2 L14,22 M3,4 L6,4 M9,4 L12,4 M15,4 L18,4 M3,9 L6,9 M9,9 L12,9 M15,9 L18,9 M3,14 L6,14 M9,14 L12,14 M15,14 L18,14 M3,19 L6,19 M9,19 L12,19 M15,19 L18,19',

  // ==================== 分类图标 ====================
  // 基础图表分类 - 综合图表元素
  chart: 'M2,2 L2,22 L22,22 M2.5,2.5 L2.5,21.5 L21.5,21.5 M5,16 L8,12 L11,14 L14,9 L17,11 L20,7 M8,12 A0.8,0.8 0 1,0 8.01,12 M11,14 A0.8,0.8 0 1,0 11.01,14 M14,9 A0.8,0.8 0 1,0 14.01,9',

  // 高级图表分类 - 多边形科技
  'chart-advanced': 'M12,2 L20,8 L18,20 L6,20 L4,8 Z M12,2 L12,12 M4,8 L12,12 M20,8 L12,12 M6,20 L12,12 M18,20 L12,12 M12,8 A1,1 0 1,0 12.01,8 M8,14 A0.8,0.8 0 1,0 8.01,14 M16,14 A0.8,0.8 0 1,0 16.01,14',

  // 特效图表分类 - 星形光芒
  special: 'M12,2 L13,9 L20,9 L15,14 L17,21 L12,17 L7,21 L9,14 L4,9 L11,9 Z M12,7 L12.5,9.5 M12,11 L12,12.5 M9.5,9.5 L11,11 M14.5,9.5 L13,11 M10,13.5 L11.5,15 M14,13.5 L12.5,15',

  // 信息组件分类 - 圆形info
  info: 'M12,2 A10,10 0 0,1 22,12 A10,10 0 0,1 12,22 A10,10 0 0,1 2,12 A10,10 0 0,1 12,2 M12,3 A9,9 0 0,1 21,12 A9,9 0 0,1 12,21 A9,9 0 0,1 3,12 A9,9 0 0,1 12,3 M12,8 L12,9 M12,11 L12,17 M11.5,11 L12.5,11 M11.5,17 L12.5,17',

  // ==================== 装饰组件 ====================
  // 装饰分类 - 菱形嵌套
  decoration: 'M12,2 L22,12 L12,22 L2,12 Z M12,6 L18,12 L12,18 L6,12 Z M12,10 L14,12 L12,14 L10,12 Z M7,12 L12,7 M17,12 L12,7 M7,12 L12,17 M17,12 L12,17',

  // 边框01 - 四角科技切角
  'border-01': 'M2,8 L2,2 L8,2 M16,2 L22,2 L22,8 M22,16 L22,22 L16,22 M8,22 L2,22 L2,16 M2,2 L4,4 L4,6 M22,2 L20,4 L20,6 M22,22 L20,20 L20,18 M2,22 L4,20 L4,18 M6,2 L6,4 M18,2 L18,4 M22,6 L20,6 M22,18 L20,18 M18,22 L18,20 M6,22 L6,20 M2,18 L4,18 M2,6 L4,6',

  // 边框02 - 双层边框
  'border-02': 'M2,2 L22,2 L22,22 L2,22 Z M4,4 L20,4 L20,20 L4,20 Z M2,2 L4,4 M22,2 L20,4 M22,22 L20,20 M2,22 L4,20 M12,2 L12,4 M22,12 L20,12 M12,22 L12,20 M2,12 L4,12',

  // 边框03 - 断线边框，四角强调
  'border-03': 'M2,2 L8,2 M16,2 L22,2 M22,2 L22,8 M22,16 L22,22 M22,22 L16,22 M8,22 L2,22 M2,22 L2,16 M2,8 L2,2 M2,2 L5,5 M22,2 L19,5 M22,22 L19,19 M2,22 L5,19 M7,2 L7,4 M17,2 L17,4 M22,7 L20,7 M22,17 L20,17 M17,22 L17,20 M7,22 L7,20 M2,17 L4,17 M2,7 L4,7',

  // 边框04 - 动态流光边框
  'border-04': 'M2,2 L22,2 L22,22 L2,22 Z M2,12 L22,12 M12,2 L12,22 M7,2 L7,5 M17,2 L17,5 M22,7 L19,7 M22,17 L19,17 M17,22 L17,19 M7,22 L7,19 M2,17 L5,17 M2,7 L5,7 M7,12 L7,10 M17,12 L17,10 M12,7 L14,7 M12,17 L14,17',

  // 装饰01 - 中心扩散装饰
  'decoration-01': 'M2,12 L8,12 M16,12 L22,12 M12,2 L12,8 M12,16 L12,22 M12,12 A1,1 0 1,0 12.01,12 M10,10 L14,10 L14,14 L10,14 Z M8,8 L9,9 M16,8 L15,9 M16,16 L15,15 M8,16 L9,15',

  // 装饰02 - 对角装饰块
  'decoration-02': 'M2,2 L10,2 L10,10 L2,10 Z M14,14 L22,14 L22,22 L14,22 Z M3,3 L9,3 L9,9 L3,9 Z M15,15 L21,15 L21,21 L15,21 Z M5,5 L7,7 M19,19 L17,17 M2,10 L10,2 M14,22 L22,14',

  // 装饰03 - 箭头分隔线
  'decoration-03': 'M2,12 L22,12 M2,11 L22,11 M2,13 L22,13 M3,8 L6,11 L3,14 M21,8 L18,11 L21,14 M10,8 L12,10 L14,8 M10,16 L12,14 L14,16 M7,12 L9,12 M15,12 L17,12',

  // 容器背景 - 网格科技背景
  'bg-box': 'M2,2 L22,2 L22,22 L2,22 Z M2,8 L22,8 M2,14 L22,14 M8,2 L8,22 M14,2 L14,22 M2,2 L4,4 M22,2 L20,4 M22,22 L20,20 M2,22 L4,20 M12,2 L12,4 M22,12 L20,12 M12,22 L12,20 M2,12 L4,12'
}
