/**
 * 各图表类型的 JSON 数据配置
 * 统一管理：placeholder / 校验 / ECharts↔List 互转 / apply 映射
 */

// ─── 图表分组 ──────────────────────────────────────────────────────────────────

/** categories+values 类：bar / line / area */
const CATEGORY_TYPES = ['bar', 'line', 'area']

/** 单值类：gauge / liquid */
const SINGLE_VALUE_TYPES = ['gauge', 'liquid']

/** 纯数组类：pie / doughnut / funnel / word-cloud / heatmap */
const ARRAY_TYPES = ['pie', 'doughnut', 'funnel', 'word-cloud', 'heatmap']

/** 层级结构类（不支持 List 模式）：treemap / sunburst / sankey / scatter / map-china / map-3d */
const COMPLEX_TYPES = ['treemap', 'sunburst', 'sankey', 'scatter', 'map-china', 'map-3d']

// ─── Placeholder ──────────────────────────────────────────────────────────────

const ECHARTS_PLACEHOLDER = {
  bar:        '{"categories":["周一","周二","周三"],"values":[120,200,150]}',
  line:       '{"categories":["周一","周二","周三"],"values":[120,200,150]}',
  area:       '{"categories":["周一","周二","周三"],"series":[{"name":"数据A","values":[120,200,150]},{"name":"数据B","values":[80,140,110]}]}',
  gauge:      '{"value":65,"name":"完成率"}',
  liquid:     '{"value":0.65,"name":"完成率"}',
  radar:      '{"indicator":[{"name":"销售","max":6500},{"name":"管理","max":16000}],"series":[{"name":"预算","values":[4200,3000]}]}',
  pie:        '[{"name":"类目A","value":30},{"name":"类目B","value":50},{"name":"类目C","value":20}]',
  doughnut:   '[{"name":"类目A","value":30},{"name":"类目B","value":50},{"name":"类目C","value":20}]',
  funnel:     '[{"name":"展现","value":100},{"name":"点击","value":80},{"name":"转化","value":40}]',
  'word-cloud': '[{"name":"数据可视化","value":100},{"name":"大屏","value":80}]',
  heatmap:    '[[0,0,5],[0,1,3],[1,0,8],[1,1,2]]',
  treemap:    '[{"name":"分类A","value":40,"children":[{"name":"子项1","value":20},{"name":"子项2","value":20}]}]',
  sunburst:   '[{"name":"根节点","children":[{"name":"子A","value":30},{"name":"子B","value":20}]}]',
  sankey:     '{"data":[{"name":"A"},{"name":"B"},{"name":"C"}],"links":[{"source":"A","target":"B","value":10},{"source":"A","target":"C","value":5}]}',
  scatter:    '[{"name":"数据A","data":[[10,20],[30,40],[50,60]]},{"name":"数据B","data":[[15,25],[35,45],[55,65]]}]',
  'map-china':'[{"name":"广东","value":1200},{"name":"北京","value":800},{"name":"上海","value":900}]',
  'map-3d':   '[{"name":"广东","value":1200},{"name":"北京","value":800}]',
}

const LIST_PLACEHOLDER = {
  radar:      '[{"name":"销售","max":6500,"value":4200},{"name":"管理","max":16000,"value":3000}]',
  gauge:      '[{"name":"完成率","value":65}]',
  liquid:     '[{"name":"完成率","value":0.65}]',
  _default:   '[{"name":"周一","value":120},{"name":"周二","value":200},{"name":"周三","value":150}]',
}

export function getPlaceholder(chartType, dataType) {
  if (dataType === 'list') {
    return LIST_PLACEHOLDER[chartType] ?? LIST_PLACEHOLDER._default
  }
  return ECHARTS_PLACEHOLDER[chartType] ?? '[{"name":"A","value":30}]'
}

// ─── List 模式是否支持 ─────────────────────────────────────────────────────────

export function supportsListMode(chartType) {
  return !COMPLEX_TYPES.includes(chartType)
}

// ─── 校验 ─────────────────────────────────────────────────────────────────────

/**
 * 校验 JSON 数据是否符合图表要求
 * @returns {string} 错误信息，空字符串表示合法
 */
export function validateJson(parsed, chartType, dataType) {
  if (dataType === 'list') {
    if (!Array.isArray(parsed)) return 'List 格式需要数组 [ ... ]'

    if (chartType === 'radar') {
      if (parsed.length > 0 && !('name' in parsed[0] && 'max' in parsed[0] && 'value' in parsed[0])) {
        return '雷达图需要 [{name, max, value}] 格式'
      }
    }
    if (SINGLE_VALUE_TYPES.includes(chartType)) {
      if (parsed.length === 0 || !('value' in parsed[0])) {
        return `${chartType} 需要 [{name, value}] 格式`
      }
    }
    if (chartType === 'heatmap') {
      if (parsed.length > 0 && !Array.isArray(parsed[0])) {
        return 'heatmap List 格式需要 [[x,y,value], ...]'
      }
    }
    return ''
  }

  // ECharts 模式
  if (chartType === 'radar') {
    if (!parsed.indicator || !Array.isArray(parsed.indicator)) return '雷达图需要 indicator 数组'
    if (!parsed.series || !Array.isArray(parsed.series) || !parsed.series[0]?.values) return '雷达图需要 series[0].values 数组'
    const indLen = parsed.indicator.length
    const mismatch = parsed.series.find(s => s.values?.length !== indLen)
    if (mismatch) return `series "${mismatch.name}" values 长度(${mismatch.values.length})与 indicator(${indLen})不一致`
    return ''
  }
  if (chartType === 'area') {
    if (!parsed.categories) return '面积图需要 categories 字段'
    if (!parsed.values && !parsed.series) return '面积图需要 values 或 series 字段'
    return ''
  }
  if (CATEGORY_TYPES.includes(chartType)) {
    if (!parsed.categories || !parsed.values) return '需要 {categories, values} 格式'
    if (parsed.categories.length !== parsed.values.length) return 'categories 与 values 长度不一致'
    return ''
  }
  if (SINGLE_VALUE_TYPES.includes(chartType)) {
    if (!('value' in parsed)) return `${chartType} 需要 {value, name?} 格式`
    return ''
  }
  if (chartType === 'sankey') {
    if (!parsed.data || !parsed.links) return 'sankey 需要 {data, links} 格式'
    return ''
  }
  if (ARRAY_TYPES.includes(chartType)) {
    if (!Array.isArray(parsed)) return '需要数组格式 [ ... ]'
    return ''
  }
  // treemap / sunburst / scatter / map 等：只验 JSON 合法
  return ''
}

// ─── ECharts ↔ List 互转 ──────────────────────────────────────────────────────

/** ECharts 格式 → List 格式 */
export function echartsToList(parsed, chartType) {
  if (chartType === 'area') {
    // 面积图只取第一个系列转 List
    if (parsed.categories && parsed.series?.[0]?.values) {
      return parsed.categories.map((name, i) => ({ name, value: parsed.series[0].values[i] ?? 0 }))
    }
    if (parsed.categories && parsed.values) {
      return parsed.categories.map((name, i) => ({ name, value: parsed.values[i] ?? 0 }))
    }
  }
  if (CATEGORY_TYPES.includes(chartType) && parsed.categories && parsed.values) {
    return parsed.categories.map((name, i) => ({ name, value: parsed.values[i] ?? 0 }))
  }
  if (SINGLE_VALUE_TYPES.includes(chartType) && 'value' in parsed) {
    return [{ name: parsed.name ?? '完成率', value: parsed.value }]
  }
  if (chartType === 'radar' && parsed.indicator && parsed.series) {
    const vals = parsed.series[0]?.values ?? []
    return parsed.indicator.map((ind, i) => ({ name: ind.name, max: ind.max, value: vals[i] ?? 0 }))
  }
  if (Array.isArray(parsed)) return parsed
  return null
}

/** List 格式 → ECharts 格式 */
export function listToEcharts(parsed, chartType) {
  if (!Array.isArray(parsed) || parsed.length === 0) return null

  if (chartType === 'area') {
    return {
      categories: parsed.map(d => d.name ?? ''),
      series: [{ name: '数据A', values: parsed.map(d => Number(d.value) || 0) }]
    }
  }
  if (CATEGORY_TYPES.includes(chartType)) {
    return {
      categories: parsed.map(d => d.name ?? ''),
      values: parsed.map(d => Number(d.value) || 0)
    }
  }
  if (SINGLE_VALUE_TYPES.includes(chartType)) {
    return { name: parsed[0]?.name ?? '完成率', value: Number(parsed[0]?.value) || 0 }
  }
  if (chartType === 'radar') {
    return {
      indicator: parsed.map(d => ({ name: d.name, max: d.max })),
      series: [{ name: '数据', values: parsed.map(d => Number(d.value) || 0) }]
    }
  }
  // pie / doughnut / funnel / wordCloud / heatmap 等：保持数组
  return parsed
}

// ─── Apply 映射：List → 图表内部数据格式 ──────────────────────────────────────

/**
 * 将 List 数组映射为图表组件消费的 data 格式
 */
export function mapListToChartData(list, chartType) {
  if (chartType === 'area') {
    return {
      categories: list.map(d => d.name ?? ''),
      series: [{ name: '数据A', values: list.map(d => Number(d.value) || 0) }]
    }
  }
  if (CATEGORY_TYPES.includes(chartType)) {
    return {
      categories: list.map(d => d.name ?? ''),
      values: list.map(d => Number(d.value) || 0)
    }
  }
  if (SINGLE_VALUE_TYPES.includes(chartType)) {
    return { value: Number(list[0]?.value) || 0, name: list[0]?.name || '完成率' }
  }
  if (chartType === 'radar') {
    return {
      indicator: list.map(d => ({ name: d.name, max: d.max })),
      series: [{ name: '数据', values: list.map(d => Number(d.value) || 0) }]
    }
  }
  // heatmap: [[x,y,v],...] 格式与 ECharts 完全一致，直接透传
  if (chartType === 'heatmap') return list
  // pie / doughnut / funnel / word-cloud：标准 [{name, value}]
  return list.map(d => ({ name: d.name, value: Number(d.value) || 0 }))
}

// ─── ECharts 模式 apply 校验 ──────────────────────────────────────────────────

/**
 * apply 时对 ECharts 格式做最终校验，返回错误信息或空字符串
 */
export function validateEchartsApply(raw, chartType) {
  if (chartType === 'radar') {
    if (!raw.indicator || !Array.isArray(raw.indicator)) return '雷达图需要 indicator 数组'
    if (!raw.series?.[0]?.values) return '雷达图需要 series[0].values 数组'
    const indLen = raw.indicator.length
    const mismatch = raw.series.find(s => s.values?.length !== indLen)
    if (mismatch) return `series "${mismatch.name}" values 长度与 indicator 不一致`
  }
  if (chartType === 'area') {
    if (!raw.categories) return '面积图需要 categories 字段'
    if (!raw.values && !raw.series) return '面积图需要 values 或 series 字段'
  }
  if (CATEGORY_TYPES.includes(chartType)) {
    if (!raw.categories || !raw.values) return '需要 {categories, values} 格式'
    if (raw.categories.length !== raw.values.length) return 'categories 与 values 长度不一致'
  }
  if (SINGLE_VALUE_TYPES.includes(chartType)) {
    if (!('value' in raw)) return `${chartType} 需要 {value, name?} 格式`
  }
  if (chartType === 'sankey') {
    if (!raw.data || !raw.links) return 'sankey 需要 {data, links} 格式'
  }
  return ''
}
