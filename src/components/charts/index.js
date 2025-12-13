/**
 * 图表组件统一导出
 * 所有图表组件通过此文件导入
 */

// 基础图表
import BarChart from './basic/BarChart.vue'
import LineChart from './basic/LineChart.vue'
import PieChart from './basic/PieChart.vue'
import AreaChart from './basic/AreaChart.vue'

// 高级图表
import RadarChart from './advanced/RadarChart.vue'
import GaugeChart from './advanced/GaugeChart.vue'
import ScatterChart from './advanced/ScatterChart.vue'
import FunnelChart from './advanced/FunnelChart.vue'

// 地图图表
import ChinaMapChart from './map/ChinaMapChart.vue'
import Map3DChart from './map/Map3DChart.vue'
import HeatmapChart from './map/HeatmapChart.vue'

// 特效图表
import LiquidChart from './special/LiquidChart.vue'
import WordCloudChart from './special/WordCloudChart.vue'
import SankeyChart from './special/SankeyChart.vue'
import TreemapChart from './special/TreemapChart.vue'
import SunburstChart from './special/SunburstChart.vue'

// 信息组件
import TextComponent from './info/TextComponent.vue'
import NumberFlipComponent from './info/NumberFlipComponent.vue'
import KpiCardComponent from './info/KpiCardComponent.vue'
import ProgressBarComponent from './info/ProgressBarComponent.vue'
import TableComponent from './info/TableComponent.vue'

// 组件映射表
export const chartComponents = {
  // 基础图表
  bar: BarChart,
  line: LineChart,
  pie: PieChart,
  area: AreaChart,

  // 高级图表
  scatter: ScatterChart,
  radar: RadarChart,
  gauge: GaugeChart,
  funnel: FunnelChart,

  // 地图图表
  'map-china': ChinaMapChart,
  'map-3d': Map3DChart,
  heatmap: HeatmapChart,

  // 特效图表
  liquid: LiquidChart,
  'word-cloud': WordCloudChart,
  sankey: SankeyChart,
  treemap: TreemapChart,
  sunburst: SunburstChart,

  // 信息组件
  text: TextComponent,
  'number-flip': NumberFlipComponent,
  'kpi-card': KpiCardComponent,
  'progress-bar': ProgressBarComponent,
  table: TableComponent
}

/**
 * 根据类型获取图表组件
 */
export function getChartComponent(type) {
  return chartComponents[type] || BarChart
}

// 默认导出所有组件
export default chartComponents

// 单独导出
export {
  BarChart,
  LineChart,
  PieChart,
  AreaChart,
  ScatterChart,
  RadarChart,
  GaugeChart,
  FunnelChart,
  ChinaMapChart,
  Map3DChart,
  HeatmapChart,
  LiquidChart,
  WordCloudChart,
  SankeyChart,
  TreemapChart,
  SunburstChart,
  TextComponent,
  NumberFlipComponent,
  KpiCardComponent,
  ProgressBarComponent,
  TableComponent
}
