/**
 * 文件上传逻辑 Composable
 */

import { ref } from 'vue'
import { ElMessage } from 'element-plus'

export function useFileUpload(options = {}) {
  const { maxSize, accept, limit = 1 } = options

  const fileList = ref([])
  const uploading = ref(false)
  const uploadProgress = ref(0)

  const handleFileChange = (file, files) => {
    // 文件大小验证
    if (maxSize && file.size > maxSize) {
      ElMessage.error(`文件大小不能超过 ${maxSize / 1024 / 1024}MB`)
      return false
    }

    // 文件类型验证
    if (accept) {
      const ext = '.' + file.name.split('.').pop().toLowerCase()
      const acceptExts = accept.split(',').map(a => a.trim())
      if (!acceptExts.includes(ext)) {
        ElMessage.error(`只支持 ${accept} 格式的文件`)
        return false
      }
    }

    // 文件数量限制
    if (limit && files.length > limit) {
      ElMessage.error(`最多只能上传 ${limit} 个文件`)
      return false
    }

    fileList.value = files
    return true
  }

  const handleFileRemove = (file, files) => {
    fileList.value = files
  }

  const uploadFile = async (apiFunc) => {
    if (fileList.value.length === 0) {
      ElMessage.warning('请先选择文件')
      return null
    }

    uploading.value = true
    uploadProgress.value = 0

    try {
      const file = fileList.value[0].raw
      const response = await apiFunc(file, (progress) => {
        uploadProgress.value = progress
      })

      if (response.code === 200) {
        ElMessage.success('上传成功')
        fileList.value = []
        return response.data
      }
    } catch (error) {
      console.error('上传失败:', error)
      ElMessage.error('上传失败')
    } finally {
      uploading.value = false
      uploadProgress.value = 0
    }
    return null
  }

  return {
    fileList,
    uploading,
    uploadProgress,
    handleFileChange,
    handleFileRemove,
    uploadFile
  }
}
