/**
 * Mock 数据生成器
 * 用于生成各种图表类型的模拟数据
 */

/**
 * 生成随机数
 */
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * 生成柱状图/折线图数据
 */
export function generateBarLineData(count = 7) {
  const categories = []
  const values = []

  const labels = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']

  for (let i = 0; i < Math.min(count, labels.length); i++) {
    categories.push(labels[i])
    values.push(randomInt(50, 300))
  }

  return {
    categories,
    values
  }
}

/**
 * 生成饼图数据
 */
export function generatePieData(count = 5) {
  const data = []
  const labels = ['产品A', '产品B', '产品C', '产品D', '产品E', '产品F']

  for (let i = 0; i < Math.min(count, labels.length); i++) {
    data.push({
      name: labels[i],
      value: randomInt(100, 500)
    })
  }

  return { data }
}

/**
 * 根据模板类型生成 Mock 数据
 */
export function generateMockDataByTemplate(template, count = 7) {
  switch (template) {
    case 'bar':
    case 'line':
      return generateBarLineData(count)

    case 'pie':
      return generatePieData(count)

    case 'custom':
      return {
        categories: Array.from({ length: count }, (_, i) => `类目${i + 1}`),
        values: Array.from({ length: count }, () => randomInt(50, 300))
      }

    default:
      return generateBarLineData(count)
  }
}

/**
 * 格式化 JSON 字符串
 */
export function formatJSONString(jsonString) {
  try {
    const obj = JSON.parse(jsonString)
    return JSON.stringify(obj, null, 2)
  } catch (e) {
    throw new Error('JSON 格式错误')
  }
}

/**
 * 验证 JSON 数据
 */
export function validateJSON(jsonString) {
  try {
    JSON.parse(jsonString)
    return { valid: true, error: null }
  } catch (e) {
    return { valid: false, error: e.message }
  }
}
