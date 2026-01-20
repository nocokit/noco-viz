/**
 * Axios 封装
 * 统一配置、请求拦截、响应拦截、错误处理
 */
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/modules/user'

// 创建 axios 实例
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
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
request.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()

    // 自动注入 Token
    if (userStore.accessToken) {
      config.headers.Authorization = `Bearer ${userStore.accessToken}`
    }

    // 禁用 GET 请求缓存
    if (config.method === 'get') {
      config.headers['Cache-Control'] = 'no-cache'
      config.headers['Pragma'] = 'no-cache'
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
request.interceptors.response.use(
  (response) => {
    // HTTP 状态码 2xx 表示成功，直接返回响应数据
    // NestJS 默认直接返回数据，不需要额外解包
    return response.data
  },
  async (error) => {
    const { config, response } = error

    // 处理 401 未授权
    if (response?.status === 401) {
      const userStore = useUserStore()

      // 登录、注册、刷新Token等接口不需要自动刷新Token
      const noRetryUrls = ['/users/auth/login/', '/users/auth/register/', '/users/auth/refresh/', '/users/auth/logout/']
      const isNoRetryUrl = noRetryUrls.some(url => config.url?.includes(url))

      // 如果是登录等接口，或者没有refreshToken，直接返回错误
      if (isNoRetryUrl || !userStore.refreshToken) {
        // 不显示错误提示，由业务代码处理
        return Promise.reject(response?.data || error)
      }

      // 如果正在刷新 Token，将请求加入队列
      if (isRefreshing) {
        return new Promise((resolve) => {
          requestQueue.push(() => {
            resolve(request(config))
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
        return request(config)
      } catch (refreshError) {
        // Token 刷新失败，清除本地状态（不发送请求）
        userStore.accessToken = ''
        userStore.refreshToken = ''
        userStore.userInfo = null
        userStore.isLoggedIn = false
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')

        ElMessage.error('登录已过期，请重新登录')

        // 跳转到登录页
        if (window.location.pathname !== '/login') {
          window.location.href = '/login'
        }

        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    // 处理其他错误
    let message = '请求失败'

    if (response?.data) {
      // 尝试从响应中提取错误信息
      const errorData = response.data

      if (errorData.detail) {
        // DRF 标准错误格式
        message = errorData.detail
      } else if (errorData.message) {
        // 自定义错误格式
        message = errorData.message
      } else if (typeof errorData === 'string') {
        message = errorData
      } else if (typeof errorData === 'object') {
        // 字段验证错误
        const firstError = Object.values(errorData)[0]
        if (Array.isArray(firstError)) {
          message = firstError[0]
        } else if (typeof firstError === 'string') {
          message = firstError
        }
      }
    } else {
      message = error.message || '请求失败'
    }

    ElMessage.error(message)

    return Promise.reject(response?.data || error)
  }
)

export default request
