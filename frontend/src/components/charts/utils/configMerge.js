/**
 * 安全合并图表配置
 * 确保 series 的 type 属性不会被意外覆盖
 *
 * @param {Object} baseConfig - 基础配置（包含默认的 series type）
 * @param {Object} userConfig - 用户自定义配置
 * @param {string} defaultSeriesType - 默认的 series type（如 'bar', 'line', 'pie' 等）
 * @returns {Object} 合并后的配置
 */
export function safeChartConfigMerge(baseConfig, userConfig = {}, defaultSeriesType = 'line') {
  // 深拷贝用户配置
  const mergedConfig = { ...userConfig }

  // 如果用户配置中有 series，确保每个 series 都有 type 属性
  if (mergedConfig.series && Array.isArray(mergedConfig.series)) {
    mergedConfig.series = mergedConfig.series.map((userSeries, index) => {
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
    if (baseConfig.series && baseConfig.series.length > mergedConfig.series.length) {
      for (let i = mergedConfig.series.length; i < baseConfig.series.length; i++) {
        mergedConfig.series.push(baseConfig.series[i])
      }
    }
  }

  return {
    ...baseConfig,
    ...mergedConfig
  }
}
