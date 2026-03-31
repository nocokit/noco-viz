import { computed } from 'vue'
import { safeChartConfigMerge } from './configMerge'

/**
 * 将 props.data 规范化为可用的数据对象
 * - null / undefined → null（跳过映射，用默认配置渲染）
 * - string → 尝试 JSON.parse，失败返回 null
 * - 其他类型 → 原样返回
 */
function normalizeData(raw) {
  if (raw == null) return null
  if (typeof raw === 'string') {
    const trimmed = raw.trim()
    if (!trimmed) return null
    try {
      return JSON.parse(trimmed)
    } catch {
      return null
    }
  }
  return raw
}

/**
 * 通用图表 option 计算 composable
 * @param {object} props - 组件 props（需含 config、data、transform）
 * @param {object} defaultConfig - 图表默认配置
 * @param {string} chartType - 图表类型（传给 safeChartConfigMerge）
 * @param {function|null} mapDataFn - 数据映射函数 (baseConfig, data) => newConfig
 *
 * 数据流：
 *   props.data (用户原始数据，可能为 null / string / object)
 *     → normalizeData()                                      (规范化：string→parse，空→null)
 *     → props.transform(data) → 标准 list [{name, value}]  (用户提供，可选，异常安全)
 *     → mapDataFn(baseConfig, data)                        (组件内部固定转换，异常安全)
 *     → safeChartConfigMerge                               (合并用户 config)
 */
export function useChartOption(props, defaultConfig, chartType, mapDataFn = null) {
  return computed(() => {
    let baseConfig = { ...defaultConfig }

    const normalized = normalizeData(props.data)

    if (normalized != null) {
      // transform 可能是用户自定义函数，需防止抛出异常
      let data = normalized
      if (typeof props.transform === 'function') {
        try {
          const result = props.transform(normalized)
          if (result != null) data = result
        } catch {
          // transform 执行失败，使用原始数据
        }
      }

      if (mapDataFn) {
        try {
          const result = mapDataFn(baseConfig, data)
          if (result !== undefined && result !== null) {
            baseConfig = result
          }
        } catch (e) {
          console.warn(`[${chartType}] mapDataFn 执行失败:`, e)
          // mapDataFn 执行失败，回退到默认配置
        }
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
  return base
}

/** Array → series[0].data（饼图、漏斗图、词云等） */
export function mapSeriesData(base, data) {
  if (Array.isArray(data)) {
    return { ...base, series: [{ ...base.series[0], data }] }
  }
  return base
}

/** Array → series[0].data（热力图，保留 xAxis 和 yAxis） */
export function mapHeatmapData(base, data) {
  if (Array.isArray(data)) {
    return {
      ...base,
      xAxis: { ...base.xAxis },
      yAxis: { ...base.yAxis },
      series: [{ ...base.series[0], data }]
    }
  }
  return base
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
  return base
}

/** { categories, series[{name, values}] } → xAxis.data + multiple series（面积图多系列） */
export function mapAreaData(base, data) {
  if (data?.categories && data?.series && Array.isArray(data.series)) {
    return {
      ...base,
      xAxis: { ...base.xAxis, data: data.categories },
      series: data.series.map((s, i) => ({
        ...(base.series[i] || base.series[0]),
        name: s.name,
        data: s.values
      }))
    }
  }
  // 兼容单系列 {categories, values}
  if (data?.categories && data?.values) {
    return {
      ...base,
      xAxis: { ...base.xAxis, data: data.categories },
      series: [{ ...base.series[0], data: data.values }]
    }
  }
  return base
}

/** { value, name } → series[0].data（仪表盘） */
export function mapSingleValue(base, data) {
  if (data && 'value' in data) {
    return { ...base, series: [{ ...base.series[0], data: [{ value: data.value, name: data.name ?? '' }] }] }
  }
  if (Array.isArray(data)) {
    return { ...base, series: [{ ...base.series[0], data: data.map(d => ({ value: typeof d === 'number' ? d : d.value, name: d.name ?? '' })) }] }
  }
  return base
}

/** { value, name } → series[0].data（水波图，需要纯数值数组实现多层波浪） */
export function mapLiquidData(base, data) {
  if (data && 'value' in data) {
    const v = Number(data.value)
    // 生成三层波浪：主值、主值-0.05、主值-0.1，让视觉效果更丰富
    return { ...base, series: [{ ...base.series[0], data: [v, Math.max(0, v - 0.05), Math.max(0, v - 0.1)] }] }
  }
  if (Array.isArray(data)) {
    return { ...base, series: [{ ...base.series[0], data: data.map(d => (typeof d === 'number' ? d : Number(d.value))) }] }
  }
  return base
}

/** Array of {name, data[]} → multiple scatter series */
export function mapScatterData(base, data) {
  if (Array.isArray(data) && data.length && data[0].data) {
    return {
      ...base,
      series: data.map((s, i) => ({
        ...(base.series[i] || base.series[0]),
        name: s.name ?? `系列${i + 1}`,
        data: s.data
      }))
    }
  }
  // 兼容单数组 [[x,y], ...]
  if (Array.isArray(data) && data.length && Array.isArray(data[0])) {
    return { ...base, series: [{ ...base.series[0], data }] }
  }
  return base
}

/** { data, links } → sankey series */
export function mapSankeyData(base, data) {
  if (data?.data && data?.links) {
    return { ...base, series: [{ ...base.series[0], data: data.data, links: data.links }] }
  }
  return base
}
