/**
 * 用户相关 API
 */
import http from '../http'

export const userApi = {
  /**
   * 用户注册
   * @param {Object} data - { username, phone, password, password_confirm }
   */
  register(data) {
    return http.post('/api/users/auth/register/', data)
  },

  /**
   * 用户登录
   * @param {Object} data - { username, password }
   */
  login(data) {
    return http.post('/api/users/auth/login/', data)
  },

  /**
   * 刷新 Token
   * @param {string} refreshToken
   */
  refreshToken(refreshToken) {
    return http.post('/api/users/auth/refresh/', { refresh: refreshToken })
  },

  /**
   * 获取当前用户信息
   */
  getProfile() {
    return http.get('/api/users/auth/me/')
  },

  /**
   * 更新用户信息
   * @param {Object} data - { email, phone, avatar, ... }
   */
  updateProfile(data) {
    return http.put('/api/users/auth/me/', data)
  },

  /**
   * 修改密码
   * @param {Object} data - { old_password, new_password, new_password_confirm }
   */
  changePassword(data) {
    return http.post('/api/users/auth/change_password/', data)
  },

  /**
   * 退出登录
   */
  logout() {
    return http.post('/api/users/auth/logout/')
  },
}
