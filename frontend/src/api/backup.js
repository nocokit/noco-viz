/**
 * 备份恢复相关 API
 */
import request from './http'

/**
 * 获取备份列表
 */
export function getBackupList() {
  return request.get('/backup')
}

/**
 * 获取自动备份配置
 */
export function getBackupConfig() {
  return request.get('/backup/config')
}

/**
 * 更新自动备份配置
 * @param {Object} config - { autoBackupEnabled, autoBackupTime, retentionCount }
 */
export function updateBackupConfig(config) {
  return request.post('/backup/config', config)
}

/**
 * 创建手动备份
 * @param {Object} data - { note }
 */
export function createBackup(data) {
  return request.post('/backup', data)
}

/**
 * 下载备份文件
 * @param {number} id
 */
export function downloadBackup(id) {
  return request.get(`/backup/${id}/download`, {
    responseType: 'blob'
  })
}

/**
 * 恢复备份
 * @param {number} id
 */
export function restoreBackup(id) {
  return request.post(`/backup/${id}/restore`)
}

/**
 * 删除备份
 * @param {number} id
 */
export function deleteBackup(id) {
  return request.delete(`/backup/${id}`)
}

/**
 * 上传备份文件
 * @param {FormData} formData
 */
export function uploadBackup(formData) {
  return request.post('/backup/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
