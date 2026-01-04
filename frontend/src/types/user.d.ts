/**
 * 用户相关类型定义
 */

export interface User {
  id: number
  username: string
  email?: string
  phone?: string
  avatar?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface LoginData {
  username: string
  password: string
}

export interface RegisterData {
  username: string
  phone: string
  password: string
  password_confirm: string
}

export interface TokenData {
  access: string
  refresh: string
}

export interface LoginResponse {
  user: User
  tokens: TokenData
}

export interface ChangePasswordData {
  old_password: string
  new_password: string
  new_password_confirm: string
}
