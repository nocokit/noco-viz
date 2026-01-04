/**
 * Axios 封装
 * 统一配置、请求拦截、响应拦截、错误处理
 */
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/modules/user'

// 创建 axios 实例
const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求队列（用于 Token 刷新时暂存请求）
let isRefreshing = false
let requestQueue = []

/**
 * 请求拦截器
 */
http.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()

    // 自动注入 Token
    if (userStore.accessToken) {
      config.headers.Authorization = `Bearer ${userStore.accessToken}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

/**
 * 响应拦截器
 */
http.interceptors.response.use(
  (response) => {
    const { data } = response

    // 统一响应格式处理
    // 后端返回格式: { code: 0, message: '成功', data: {...} }
    if (data.code === 0) {
      return data.data
    } else {
      // 业务错误
      ElMessage.error(data.message || '请求失败')
      return Promise.reject(new Error(data.message || '请求失败'))
    }
  },
  async (error) => {
    const { config, response } = error

    // 处理 401 未授权
    if (response?.status === 401) {
      const userStore = useUserStore()

      // 如果正在刷新 Token，将请求加入队列
      if (isRefreshing) {
        return new Promise((resolve) => {
          requestQueue.push(() => {
            resolve(http(config))
          })
        })
      }

      // 尝试刷新 Token
      isRefreshing = true

      try {
        await userStore.refreshToken()

        // Token 刷新成功，重试所有队列中的请求
        requestQueue.forEach((callback) => callback())
        requestQueue = []

        // 重试当前请求
        return http(config)
      } catch (refreshError) {
        // Token 刷新失败，清除用户信息并跳转登录
        userStore.logout()
        ElMessage.error('登录已过期，请重新登录')
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    // 处理其他错误
    const message = response?.data?.message || error.message || '请求失败'
    ElMessage.error(message)

    return Promise.reject(error)
  }
)

export default http
