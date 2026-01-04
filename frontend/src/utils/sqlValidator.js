/**
 * SQL语法验证工具
 */

// SQL关键字列表（常用）
const SQL_KEYWORDS = [
  'SELECT', 'FROM', 'WHERE', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'DROP',
  'ALTER', 'TABLE', 'INDEX', 'VIEW', 'JOIN', 'INNER', 'LEFT', 'RIGHT', 'OUTER',
  'ON', 'AND', 'OR', 'NOT', 'IN', 'BETWEEN', 'LIKE', 'IS', 'NULL', 'ORDER',
  'BY', 'GROUP', 'HAVING', 'LIMIT', 'OFFSET', 'DISTINCT', 'AS', 'UNION',
  'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'EXISTS', 'COUNT', 'SUM', 'AVG',
  'MAX', 'MIN', 'TRUNCATE', 'DESC', 'ASC'
]

// 危险操作关键字
const DANGEROUS_KEYWORDS = [
  'DROP', 'DELETE', 'TRUNCATE', 'ALTER', 'CREATE', 'GRANT', 'REVOKE'
]

/**
 * 基本SQL语法验证
 * @param {string} sql - SQL查询语句
 * @returns {Object} { valid: boolean, errors: Array, warnings: Array }
 */
export function validateSQL(sql) {
  const errors = []
  const warnings = []

  if (!sql || typeof sql !== 'string') {
    return {
      valid: false,
      errors: ['SQL语句不能为空'],
      warnings: []
    }
  }

  const trimmedSQL = sql.trim()

  // 检查是否为空
  if (trimmedSQL.length === 0) {
    errors.push('SQL语句不能为空')
  }

  // 检查是否以分号结尾（多余的分号）
  if (trimmedSQL.endsWith(';')) {
    warnings.push('建议移除SQL语句末尾的分号')
  }

  // 检查危险操作
  const upperSQL = trimmedSQL.toUpperCase()
  for (const keyword of DANGEROUS_KEYWORDS) {
    if (upperSQL.includes(keyword)) {
      warnings.push(`检测到危险操作: ${keyword}，请确保您有相应的权限`)
    }
  }

  // 检查括号匹配
  const openParens = (trimmedSQL.match(/\(/g) || []).length
  const closeParens = (trimmedSQL.match(/\)/g) || []).length
  if (openParens !== closeParens) {
    errors.push('括号不匹配')
  }

  // 检查引号匹配
  const singleQuotes = (trimmedSQL.match(/'/g) || []).length
  const doubleQuotes = (trimmedSQL.match(/"/g) || []).length
  if (singleQuotes % 2 !== 0) {
    errors.push('单引号不匹配')
  }
  if (doubleQuotes % 2 !== 0) {
    errors.push('双引号不匹配')
  }

  // 检查基本SELECT语句结构
  if (upperSQL.startsWith('SELECT')) {
    if (!upperSQL.includes('FROM')) {
      errors.push('SELECT语句缺少FROM子句')
    }
  }

  // 检查SQL注入风险（基础检查）
  const injectionPatterns = [
    /;\s*(DROP|DELETE|TRUNCATE|ALTER)\s+/i,
    /--/,  // SQL注释
    /\/\*/,  // 多行注释开始
    /\*\//   // 多行注释结束
  ]

  for (const pattern of injectionPatterns) {
    if (pattern.test(trimmedSQL)) {
      warnings.push('检测到潜在的SQL注入风险模式')
      break
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * 检查SQL是否为只读查询
 * @param {string} sql
 * @returns {boolean}
 */
export function isReadOnlySQL(sql) {
  if (!sql) return false

  const upperSQL = sql.trim().toUpperCase()

  // 只允许SELECT、SHOW、DESCRIBE、EXPLAIN等只读操作
  const readOnlyPatterns = [
    /^SELECT\s+/,
    /^SHOW\s+/,
    /^DESCRIBE\s+/,
    /^DESC\s+/,
    /^EXPLAIN\s+/
  ]

  return readOnlyPatterns.some(pattern => pattern.test(upperSQL))
}

/**
 * 格式化SQL（简单格式化）
 * @param {string} sql
 * @returns {string}
 */
export function formatSQL(sql) {
  if (!sql) return ''

  let formatted = sql.trim()

  // 移除多余的空格
  formatted = formatted.replace(/\s+/g, ' ')

  // 关键字后添加换行（简单实现）
  const keywordsForNewline = ['SELECT', 'FROM', 'WHERE', 'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT']

  keywordsForNewline.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi')
    formatted = formatted.replace(regex, `\n${keyword}`)
  })

  return formatted.trim()
}

/**
 * 提取SQL中的表名
 * @param {string} sql
 * @returns {Array<string>}
 */
export function extractTableNames(sql) {
  if (!sql) return []

  const tables = []
  const upperSQL = sql.toUpperCase()

  // 简单的FROM子句解析
  const fromMatch = upperSQL.match(/FROM\s+([a-zA-Z0-9_,\s.]+?)(?:\s+WHERE|\s+GROUP|\s+ORDER|\s+LIMIT|$)/i)

  if (fromMatch && fromMatch[1]) {
    const tablesPart = fromMatch[1].trim()
    // 分割逗号分隔的表名
    const tableParts = tablesPart.split(',').map(t => t.trim())

    tableParts.forEach(part => {
      // 移除别名（AS xxx或直接跟别名）
      const tableName = part.split(/\s+/)[0].trim()
      if (tableName && !SQL_KEYWORDS.includes(tableName.toUpperCase())) {
        tables.push(tableName)
      }
    })
  }

  return tables
}

/**
 * 检查SQL中是否包含特定关键字
 * @param {string} sql
 * @param {string} keyword
 * @returns {boolean}
 */
export function containsKeyword(sql, keyword) {
  if (!sql || !keyword) return false

  const upperSQL = sql.toUpperCase()
  const upperKeyword = keyword.toUpperCase()

  return upperSQL.includes(upperKeyword)
}
