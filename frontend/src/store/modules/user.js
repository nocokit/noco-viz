/**
 * 用户状态管理
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { userApi } from '@/api'

export const useUserStore = defineStore('user', () => {
  // 状态
  const accessToken = ref(localStorage.getItem('access_token') || '')
  const refreshToken = ref(localStorage.getItem('refresh_token') || '')
  const userInfo = ref(null)

  // 是否已登录
  const isLoggedIn = ref(!!accessToken.value)

  /**
   * 登录
   */
  async function login(loginData) {
    const res = await userApi.login(loginData)
    console.log('登录成功:', res)
    // 保存 Token
    accessToken.value = res.tokens.access
    refreshToken.value = res.tokens.refresh
    localStorage.setItem('access_token', res.tokens.access)
    localStorage.setItem('refresh_token', res.tokens.refresh)

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

    // 保存 Token
    accessToken.value = res.tokens.access
    refreshToken.value = res.tokens.refresh
    localStorage.setItem('access_token', res.tokens.access)
    localStorage.setItem('refresh_token', res.tokens.refresh)

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

    // 更新 Access Token
    accessToken.value = res.access
    localStorage.setItem('access_token', res.access)

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

    // 清除 localStorage
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
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
    refreshToken: refreshAccessToken,
    fetchUserInfo,
    updateUserInfo,
    changePassword,
    logout,
  }
})
