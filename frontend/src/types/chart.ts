/**
 * 图表相关类型定义
 */

import type { ID } from './common'

// 图表类型
export type ChartType =
  | 'bar'
  | 'line'
  | 'pie'
  | 'area'
  | 'scatter'
  | 'radar'
  | 'gauge'
  | 'funnel'
  | 'heatmap'
  | 'map'
  | 'map3d'
  | 'wordcloud'
  | 'liquid'
  | 'sankey'
  | 'sunburst'
  | 'treemap'

// 图表数据接口
export interface ChartData {
  categories?: string[]
  values?: number[] | number[][]
  series?: ChartSeriesData[]
  [key: string]: any
}

// 图表系列数据
export interface ChartSeriesData {
  name: string
  data: number[]
  type?: string
  [key: string]: any
}

// 图表配置接口
export interface ChartConfig {
  title?: ChartTitleConfig
  legend?: ChartLegendConfig
  tooltip?: ChartTooltipConfig
  xAxis?: ChartAxisConfig
  yAxis?: ChartAxisConfig
  grid?: ChartGridConfig
  color?: string[]
  series?: any[]
  [key: string]: any
}

// 标题配置
export interface ChartTitleConfig {
  show?: boolean
  text?: string
  subtext?: string
  left?: string | number
  top?: string | number
  textStyle?: TextStyleConfig
  [key: string]: any
}

// 图例配置
export interface ChartLegendConfig {
  show?: boolean
  orient?: 'horizontal' | 'vertical'
  left?: string | number
  top?: string | number
  bottom?: string | number
  right?: string | number
  [key: string]: any
}

// 提示框配置
export interface ChartTooltipConfig {
  show?: boolean
  trigger?: 'item' | 'axis'
  formatter?: string | Function
  [key: string]: any
}

// 坐标轴配置
export interface ChartAxisConfig {
  show?: boolean
  type?: 'category' | 'value' | 'time' | 'log'
  data?: any[]
  name?: string
  axisLabel?: any
  axisLine?: any
  [key: string]: any
}

// 网格配置
export interface ChartGridConfig {
  left?: string | number
  top?: string | number
  right?: string | number
  bottom?: string | number
  containLabel?: boolean
  [key: string]: any
}

// 文本样式配置
export interface TextStyleConfig {
  color?: string
  fontSize?: number
  fontWeight?: string | number
  fontFamily?: string
  [key: string]: any
}

// 图表组件 Props
export interface ChartComponentProps {
  config?: ChartConfig
  data?: ChartData
  width?: string | number
  height?: string | number
  loading?: boolean
}
