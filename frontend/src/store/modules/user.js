/**
 * 用户状态管理
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { userApi } from '@/api'

export const useUserStore = defineStore('user', () => {
  // 状态
  const accessToken = ref(sessionStorage.getItem('access_token') || '')
  const refreshToken = ref(sessionStorage.getItem('refresh_token') || '')
  const userInfo = ref(null)

  // 是否已登录
  const isLoggedIn = ref(!!accessToken.value)

  /**
   * 登录
   */
  async function login(loginData) {
    const res = await userApi.login(loginData)
    accessToken.value = res.access_token
    refreshToken.value = res.access_token
    sessionStorage.setItem('access_token', res.access_token)
    sessionStorage.setItem('refresh_token', res.access_token)

    // 保存用户信息
    userInfo.value = res.user
    isLoggedIn.value = true

    return res
  }

  /**
   * 注册
   */
  async function register(registerData) {
    const res = await userApi.register(registerData)

    // 保存 Token (适配后端返回格式)
    accessToken.value = res.access_token
    refreshToken.value = res.access_token
    sessionStorage.setItem('access_token', res.access_token)
    sessionStorage.setItem('refresh_token', res.access_token)

    // 保存用户信息
    userInfo.value = res.user
    isLoggedIn.value = true

    return res
  }

  /**
   * 刷新 Token
   */
  async function refreshAccessToken() {
    if (!refreshToken.value) {
      throw new Error('No refresh token')
    }

    const res = await userApi.refreshToken(refreshToken.value)

    // 更新 Access Token (适配后端返回格式)
    accessToken.value = res.access_token
    sessionStorage.setItem('access_token', res.access_token)

    return res
  }

  /**
   * 获取用户信息
   */
  async function fetchUserInfo() {
    const user = await userApi.getProfile()
    userInfo.value = user
    return user
  }

  /**
   * 更新用户信息
   */
  async function updateUserInfo(data) {
    const user = await userApi.updateProfile(data)
    userInfo.value = user
    return user
  }

  /**
   * 修改密码
   */
  async function changePassword(data) {
    await userApi.changePassword(data)
  }

  /**
   * 退出登录
   */
  function logout() {
    // JWT 是无状态的，只需清除客户端状态即可
    // 不需要调用后端 API

    // 清除状态
    accessToken.value = ''
    refreshToken.value = ''
    userInfo.value = null
    isLoggedIn.value = false

    // 清除 sessionStorage
    sessionStorage.removeItem('access_token')
    sessionStorage.removeItem('refresh_token')
  }

  return {
    // 状态
    accessToken,
    refreshToken,
    userInfo,
    isLoggedIn,

    // Actions
    login,
    register,
    refreshAccessToken,
    fetchUserInfo,
    updateUserInfo,
    changePassword,
    logout,
  }
})
