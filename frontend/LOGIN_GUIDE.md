# NocoViz 登录/注册功能使用指南

## 功能概述

已实现完整的前端登录/注册页面，并与后端 API 完成对接。

## 功能特性

### 1. 登录功能
- ✅ 支持用户名、手机号、邮箱三种方式登录
- ✅ 记住我选项
- ✅ 密码可见性切换
- ✅ 表单验证
- ✅ 自动 Token 管理
- ✅ 自动跳转到之前访问的页面

### 2. 注册功能
- ✅ 用户名、手机号必填
- ✅ 邮箱可选
- ✅ 密码强度验证
- ✅ 确认密码验证
- ✅ 实时表单验证
- ✅ 注册成功自动登录

### 3. 认证管理
- ✅ JWT Token 自动注入
- ✅ Token 过期自动刷新
- ✅ 路由守卫（未登录自动跳转）
- ✅ 已登录用户访问登录页自动跳转首页

## 文件结构

```
frontend/
├── src/
│   ├── views/
│   │   └── common/
│   │       └── Login.vue           # 登录/注册页面
│   ├── api/
│   │   ├── http.js                 # HTTP 拦截器（已更新）
│   │   └── modules/
│   │       └── user.js             # 用户 API
│   ├── store/
│   │   └── modules/
│   │       └── user.js             # 用户状态管理
│   └── router/
│       └── index.js                # 路由配置（已添加守卫）
└── .env.development                # 开发环境配置
```

## API 端点

### 登录
```
POST /api/users/auth/login/
Body: {
  "username": "用户名/手机号/邮箱",
  "password": "密码"
}
Response: {
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com",
    "phone": "13800138000",
    "avatar": null,
    "is_active": true,
    "created_at": "2024-01-04T12:00:00Z"
  },
  "tokens": {
    "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
  }
}
```

### 注册
```
POST /api/users/auth/register/
Body: {
  "username": "testuser",
  "phone": "13800138000",
  "email": "test@example.com",  // 可选
  "password": "password123",
  "password_confirm": "password123"
}
Response: 同登录
```

### 刷新 Token
```
POST /api/users/auth/refresh/
Body: {
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
Response: {
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### 获取当前用户
```
GET /api/users/auth/me/
Headers: {
  "Authorization": "Bearer <access_token>"
}
Response: {
  "id": 1,
  "username": "testuser",
  ...
}
```

### 退出登录
```
POST /api/users/auth/logout/
Response: {
  "message": "退出成功"
}
```

## 使用说明

### 1. 启动后端服务
```bash
cd backend
python manage.py runserver
```

### 2. 启动前端服务
```bash
cd frontend
npm run dev
```

### 3. 访问登录页
打开浏览器访问: `http://localhost:5173/login`

### 4. 测试账号
- 用户名: `admin`
- 密码: `admin123456`

或者点击"立即注册"创建新账号。

## 设计特点

### UI/UX
- 🎨 深色主题，符合项目整体风格
- ✨ 优雅的渐变背景动画
- 💫 平滑的过渡动画
- 📱 响应式设计，支持移动端
- 🎯 符合 Element Plus 设计规范

### 技术亮点
- Vue 3 Composition API
- Pinia 状态管理
- Axios 请求拦截
- 路由守卫
- Token 自动刷新
- 错误统一处理

## 表单验证规则

### 登录
- 用户名: 必填
- 密码: 必填，最少6位

### 注册
- 用户名: 必填，3-150位，只能包含字母、数字、下划线
- 手机号: 必填，11位数字，1开头
- 邮箱: 可选，必须是有效邮箱格式
- 密码: 必填，最少6位
- 确认密码: 必填，必须与密码一致

## 路由守卫逻辑

```javascript
1. 访问需要认证的页面 && 未登录 → 跳转到登录页
2. 访问登录页 && 已登录 → 跳转到首页
3. 其他情况 → 正常访问
```

## 常见问题

### Q: 提示"请求失败"？
A: 检查后端服务是否启动，API 地址是否正确配置。

### Q: Token 过期怎么办？
A: 系统会自动使用 refresh token 刷新，无需手动处理。

### Q: 如何修改 API 地址？
A: 修改 `.env.development` 文件中的 `VITE_API_BASE_URL`。

### Q: 如何自定义登录页样式？
A: 修改 `src/views/common/Login.vue` 中的样式。

## 后续优化建议

- [ ] 添加第三方登录（微信、GitHub等）
- [ ] 添加忘记密码功能
- [ ] 添加图形验证码
- [ ] 添加手机验证码登录
- [ ] 添加账号安全设置
- [ ] 添加登录历史记录

## 相关文件

- 后端认证后端: `backend/apps/users/backends.py`
- 后端视图: `backend/apps/users/views.py`
- 后端序列化器: `backend/apps/users/serializers.py`
- 后端模型: `backend/apps/users/models.py`
