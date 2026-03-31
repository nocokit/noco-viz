/**
 * 用户相关 API
 */
import request from '../http'

export const userApi = {
  /**
   * 用户注册
   * @param {Object} data - { username, phone, password, password_confirm }
   */
  register(data) {
    return request.post('/auth/register', data)
  },

  /**
   * 用户登录
   * @param {Object} data - { username, password }
   */
  login(data) {
    return request.post('/auth/login', data)
  },

  /**
   * 刷新 Token
   * @param {string} refreshToken
   */
  refreshToken(refreshToken) {
    return request.post('/auth/refresh', { refresh: refreshToken })
  },

  /**
   * 获取当前用户信息
   */
  getProfile() {
    return request.get('/auth/profile')
  },

  /**
   * 更新用户信息
   * @param {Object} data - { email, phone, avatar, ... }
   */
  updateProfile(data) {
    return request.put('/auth/profile', data)
  },

  /**
   * 修改密码
   * @param {Object} data - { old_password, new_password, new_password_confirm }
   */
  changePassword(data) {
    return request.post('/auth/change-password', data)
  },

  /**
   * 退出登录
   */
  logout() {
    return request.post('/auth/logout')
  },
}
