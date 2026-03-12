/**
 * 文件下载和导出工具函数
 */

import { message } from 'ant-design-vue'

/**
 * 导出CSV文件
 * @param {Array<Object>} data - 数据数组
 * @param {string} filename - 文件名（不含扩展名）
 * @param {Array<string>|Object} headers - 列头配置，可以是数组或对象映射
 * @example
 * exportToCSV([{name: '张三', age: 20}], 'users', ['name', 'age'])
 * exportToCSV([{name: '张三', age: 20}], 'users', {name: '姓名', age: '年龄'})
 */
export function exportToCSV(data, filename, headers) {
  if (!data || data.length === 0) {
    message.warning('没有数据可导出')
    return
  }

  const BOM = '\uFEFF' // UTF-8 BOM for Excel

  let headerRow, dataRows

  if (Array.isArray(headers)) {
    // headers 是数组，直接使用
    headerRow = headers.join(',')
    dataRows = data.map(row =>
      headers.map(header => {
        const value = row[header] || ''
        return `"${String(value).replace(/"/g, '""')}"`
      }).join(',')
    )
  } else {
    // headers 是对象映射 {key: 'label'}
    const keys = Object.keys(headers)
    const labels = Object.values(headers)
    headerRow = labels.join(',')
    dataRows = data.map(row =>
      keys.map(key => {
        const value = row[key] || ''
        return `"${String(value).replace(/"/g, '""')}"`
      }).join(',')
    )
  }

  const csvContent = [headerRow, ...dataRows].join('\n')
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' })
  downloadBlob(blob, `${filename}.csv`)
}

/**
 * 导出JSON文件
 * @param {Object|Array} data - 数据对象或数组
 * @param {string} filename - 文件名（不含扩展名）
 * @param {boolean} pretty - 是否格式化，默认true
 */
export function exportToJSON(data, filename, pretty = true) {
  if (!data) {
    message.warning('没有数据可导出')
    return
  }

  const jsonString = pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data)
  const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' })
  downloadBlob(blob, `${filename}.json`)
}

/**
 * 导出Excel文件（需要依赖 xlsx 库）
 * @param {Array<Object>} data - 数据数组
 * @param {string} filename - 文件名（不含扩展名）
 * @param {string} sheetName - 工作表名称，默认'Sheet1'
 */
export async function exportToExcel(data, filename, sheetName = 'Sheet1') {
  if (!data || data.length === 0) {
    message.warning('没有数据可导出')
    return
  }

  try {
    // 动态导入 xlsx 库
    const XLSX = await import('xlsx')

    // 创建工作簿和工作表
    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)

    // 导出文件
    XLSX.writeFile(workbook, `${filename}.xlsx`)
    message.success('导出成功')
  } catch (error) {
    console.error('导出Excel失败:', error)
    message.error('导出Excel失败，请确保已安装 xlsx 库')
  }
}

/**
 * 下载Blob文件
 * @param {Blob} blob - Blob对象
 * @param {string} filename - 文件名
 */
export function downloadBlob(blob, filename) {
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  // 释放URL对象
  URL.revokeObjectURL(url)

  message.success('下载成功')
}

/**
 * 下载远程文件
 * @param {string} url - 文件URL
 * @param {string} filename - 文件名
 */
export function downloadRemoteFile(url, filename) {
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('下载失败')
      }
      return response.blob()
    })
    .then(blob => downloadBlob(blob, filename))
    .catch(error => {
      console.error('下载失败:', error)
      message.error('下载失败，请稍后重试')
    })
}

/**
 * 下载Base64文件
 * @param {string} base64 - Base64字符串
 * @param {string} filename - 文件名
 * @param {string} mimeType - MIME类型，默认自动检测
 */
export function downloadBase64(base64, filename, mimeType) {
  // 如果base64包含data:前缀，提取出来
  let base64Data = base64
  let detectedMimeType = mimeType

  if (base64.includes('data:')) {
    const matches = base64.match(/data:([^;]+);base64,(.*)/)
    if (matches) {
      detectedMimeType = detectedMimeType || matches[1]
      base64Data = matches[2]
    }
  }

  // 解码base64
  const byteCharacters = atob(base64Data)
  const byteNumbers = new Array(byteCharacters.length)

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i)
  }

  const byteArray = new Uint8Array(byteNumbers)
  const blob = new Blob([byteArray], { type: detectedMimeType || 'application/octet-stream' })

  downloadBlob(blob, filename)
}

/**
 * 下载文本文件
 * @param {string} text - 文本内容
 * @param {string} filename - 文件名
 * @param {string} mimeType - MIME类型，默认'text/plain'
 */
export function downloadText(text, filename, mimeType = 'text/plain') {
  const blob = new Blob([text], { type: `${mimeType};charset=utf-8;` })
  downloadBlob(blob, filename)
}

/**
 * 导出表格数据为多种格式
 * @param {Array<Object>} data - 数据数组
 * @param {string} filename - 文件名（不含扩展名）
 * @param {string} format - 导出格式 'csv' | 'json' | 'excel'
 * @param {Object} options - 选项
 */
export function exportData(data, filename, format = 'csv', options = {}) {
  switch (format.toLowerCase()) {
    case 'csv':
      exportToCSV(data, filename, options.headers || Object.keys(data[0] || {}))
      break
    case 'json':
      exportToJSON(data, filename, options.pretty !== false)
      break
    case 'excel':
      exportToExcel(data, filename, options.sheetName)
      break
    default:
      message.error(`不支持的导出格式: ${format}`)
  }
}
