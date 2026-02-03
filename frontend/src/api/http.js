/**
 * Axios 封装
 * 统一配置、请求拦截、响应拦截、错误处理
 */
import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/store/modules/user'
import { RequestCanceler } from '@/utils/request-optimizer'

// 创建请求取消管理器
const requestCanceler = new RequestCanceler()

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

// 401 确认对话框状态（防止重复弹窗）
let is401ConfirmShowing = false

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

    // 添加请求取消功能
    const controller = new AbortController()
    config.signal = controller.signal

    // 为每个请求生成唯一key
    const requestKey = `${config.method}:${config.url}:${JSON.stringify(config.params || {})}`
    requestCanceler.add(requestKey, controller)

    // 保存requestKey到config中,用于后续取消
    config.requestKey = requestKey

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
    // 请求完成,移除请求记录
    if (response.config.requestKey) {
      requestCanceler.remove(response.config.requestKey)
    }

    // HTTP 状态码 2xx 表示成功
    // NestJS 返回格式: { success: true, data: {...}, timestamp, path }
    // 解包返回 data 字段
    if (response.data && response.data.success && response.data.data !== undefined) {
      return response.data.data
    }
    // 兼容直接返回数据的情况
    return response.data
  },
  async (error) => {
    const { config, response } = error

    // 请求失败,移除请求记录
    if (config?.requestKey) {
      requestCanceler.remove(config.requestKey)
    }

    if (axios.isCancel(error)) {
      return Promise.reject({ message: '请求已取消', cancelled: true })
    }

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
        await userStore.refreshAccessToken()

        // Token 刷新成功，重试所有队列中的请求
        requestQueue.forEach((callback) => callback())
        requestQueue = []

        // 重试当前请求
        return request(config)
      } catch (refreshError) {
        // Token 刷新失败，显示二次确认对话框
        if (!is401ConfirmShowing) {
          is401ConfirmShowing = true

          try {
            await ElMessageBox.confirm(
              '您的登录状态已过期，需要重新登录才能继续操作。',
              '登录已过期',
              {
                confirmButtonText: '重新登录',
                cancelButtonText: '取消',
                type: 'warning',
                closeOnClickModal: false,
                closeOnPressEscape: false,
                showClose: false
              }
            )

            // 用户确认后，清除本地状态并跳转到登录页
            userStore.accessToken = ''
            userStore.refreshToken = ''
            userStore.userInfo = null
            userStore.isLoggedIn = false
            sessionStorage.removeItem('access_token')
            sessionStorage.removeItem('refresh_token')

            // 跳转到登录页
            if (window.location.pathname !== '/login') {
              window.location.href = '/login'
            }
          } catch (cancelError) {
            // 用户取消操作
          } finally {
            is401ConfirmShowing = false
          }
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
        // NestJS 标准错误格式
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
    } else if (error.code === 'ECONNABORTED') {
      message = '请求超时，请稍后重试'
    } else if (error.code === 'ERR_NETWORK') {
      message = '网络连接失败，请检查网络'
    } else {
      message = error.message || '请求失败'
    }

    // 构造统一的错误对象
    const errorObj = {
      message,
      status: response?.status,
      data: response?.data,
      code: error.code
    }

    // 不在拦截器中显示错误提示，由业务代码决定是否显示
    // ElMessage.error(message)

    return Promise.reject(errorObj)
  }
)

/**
 * 取消所有待处理的请求
 */
export function cancelAllRequests() {
  requestCanceler.cancelAll()
}

/**
 * 取消指定请求
 */
export function cancelRequest(requestKey) {
  requestCanceler.cancel(requestKey)
}

export default request
