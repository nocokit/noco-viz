/**
 * 将 UI 动画配置 { animation: { enabled, duration, easing, delay } }
 * 转为 ECharts 顶层平铺格式: animation(bool), animationDuration, animationEasing, animationDelay
 */
function normalizeAnimationConfig(config) {
  if (!config || !config.animation || typeof config.animation !== 'object') return config
  const { animation, ...rest } = config
  return {
    ...rest,
    animation: animation.enabled !== false,
    animationDuration: animation.duration ?? 1000,
    animationEasing: animation.easing ?? 'cubicOut',
    animationDelay: animation.delay ?? 0,
  }
}

export function safeChartConfigMerge(baseConfig, userConfig = {}, defaultSeriesType = 'line') {
  // 将 UI 动画格式转换为 ECharts 原生格式
  const mergedConfig = { ...normalizeAnimationConfig(userConfig) }

  // 先合并基础配置
  const result = {
    ...baseConfig,
    ...mergedConfig
  }

  // 如果用户配置中有 series，需要特殊处理
  if (mergedConfig.series && Array.isArray(mergedConfig.series)) {
    result.series = mergedConfig.series.map((userSeries, index) => {
      const baseSeries = baseConfig.series?.[index] || {}

      // 深度合并 series 配置
      const merged = {
        ...baseSeries,
        ...userSeries,
        // 确保 type 属性存在，优先级：用户配置 > 基础配置 > 默认类型
        type: userSeries.type || baseSeries.type || defaultSeriesType
      }

      // 如果有嵌套的 data 配置，也要合并
      if (userSeries.data && baseSeries.data) {
        merged.data = userSeries.data
      }

      return merged
    })

    // 如果基础配置有更多 series，保留它们
    if (baseConfig.series && baseConfig.series.length > result.series.length) {
      for (let i = result.series.length; i < baseConfig.series.length; i++) {
        result.series.push(baseConfig.series[i])
      }
    }
  } else {
    // 如果用户配置中没有 series，使用基础配置的 series
    result.series = baseConfig.series
  }

  // 对于热力图，确保 xAxis 和 yAxis 保持 category 类型
  if (baseConfig.series?.[0]?.type === 'heatmap') {
    if (baseConfig.xAxis && result.xAxis) {
      result.xAxis = { ...result.xAxis, type: baseConfig.xAxis.type || 'category' }
    }
    if (baseConfig.yAxis && result.yAxis) {
      result.yAxis = { ...result.yAxis, type: baseConfig.yAxis.type || 'category' }
    }
  }

  return result
}
