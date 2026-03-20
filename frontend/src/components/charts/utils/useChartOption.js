import { computed } from 'vue'
import { safeChartConfigMerge } from './configMerge'

/**
 * 通用图表 option 计算 composable
 * @param {object} props - 组件 props（需含 config、data、transform）
 * @param {object} defaultConfig - 图表默认配置
 * @param {string} chartType - 图表类型（传给 safeChartConfigMerge）
 * @param {function|null} mapDataFn - 数据映射函数 (baseConfig, data) => newConfig
 *
 * 数据流：
 *   props.data (用户原始数据)
 *     → props.transform(data) → 标准 list [{name, value}]  (用户提供，可选)
 *     → mapDataFn(baseConfig, data)                        (组件内部固定转换)
 *     → safeChartConfigMerge                               (合并用户 config)
 */
export function useChartOption(props, defaultConfig, chartType, mapDataFn = null) {
  return computed(() => {
    let baseConfig = { ...defaultConfig }
    if (props.data) {
      const data = typeof props.transform === 'function'
        ? props.transform(props.data)
        : props.data
      if (mapDataFn && data) {
        baseConfig = mapDataFn(baseConfig, data) ?? baseConfig
      }
    }
    return safeChartConfigMerge(baseConfig, props.config, chartType)
  })
}

// ── 常用数据映射器 ──────────────────────────────────────────

/** categories + values → xAxis.data + series[0].data（柱状图、折线图）
 *  同时支持标准 list [{name, value}] */
export function mapCategoryValues(base, data) {
  if (data?.categories && data?.values) {
    return {
      ...base,
      xAxis: { ...base.xAxis, data: data.categories },
      series: [{ ...base.series[0], data: data.values }]
    }
  }
  if (Array.isArray(data) && data.length && 'name' in data[0]) {
    return {
      ...base,
      xAxis: { ...base.xAxis, data: data.map(d => d.name) },
      series: [{ ...base.series[0], data: data.map(d => d.value) }]
    }
  }
}

/** Array → series[0].data（饼图、漏斗图、热力图、词云等） */
export function mapSeriesData(base, data) {
  if (Array.isArray(data)) {
    return { ...base, series: [{ ...base.series[0], data }] }
  }
}

/** { indicator, series } → radar.indicator + series[0].data（雷达图） */
export function mapRadarData(base, data) {
  if (data?.indicator && data?.series) {
    return {
      ...base,
      radar: { ...base.radar, indicator: data.indicator },
      legend: { ...base.legend, data: data.series.map(s => s.name) },
      series: [{
        ...base.series[0],
        data: data.series.map(s => ({
          name: s.name,
          value: s.values,
          itemStyle: s.itemStyle || base.series[0].data[0]?.itemStyle,
          areaStyle: s.areaStyle || base.series[0].data[0]?.areaStyle
        }))
      }]
    }
  }
}
