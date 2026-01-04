# 登录功能测试指南

## 快速测试步骤

### 1. 启动后端服务

```bash
cd /Users/michael/projects/noco-viz/backend

# 确保已安装依赖
pip install -r requirements.txt

# 运行数据库迁移
python manage.py migrate

# 创建超级用户（可选，用于测试）
python manage.py createsuperuser

# 启动开发服务器
python manage.py runserver
```

后端服务将运行在: `http://localhost:8000`

### 2. 启动前端服务

```bash
cd /Users/michael/projects/noco-viz/frontend

# 确保已安装依赖
npm install

# 启动开发服务器
npm run dev
```

前端服务将运行在: `http://localhost:5173`

### 3. 访问登录页

打开浏览器访问: `http://localhost:5173/login`

## 测试场景

### 场景1: 用户注册
1. 点击"立即注册"切换到注册模式
2. 填写注册信息:
   - 用户名: `testuser`
   - 手机号: `13800138000`
   - 邮箱: `test@example.com` (可选)
   - 密码: `test123456`
   - 确认密码: `test123456`
3. 点击"注册"按钮
4. 预期结果:
   - ✅ 注册成功提示
   - ✅ 自动登录
   - ✅ 跳转到首页 `/projects`

### 场景2: 用户名登录
1. 在登录页填写:
   - 用户名: `testuser`
   - 密码: `test123456`
2. 点击"登录"按钮
3. 预期结果:
   - ✅ 登录成功提示
   - ✅ 跳转到首页

### 场景3: 手机号登录
1. 在登录页填写:
   - 用户名: `13800138000` (输入注册时的手机号)
   - 密码: `test123456`
2. 点击"登录"按钮
3. 预期结果:
   - ✅ 登录成功

### 场景4: 邮箱登录
1. 在登录页填写:
   - 用户名: `test@example.com` (输入注册时的邮箱)
   - 密码: `test123456`
2. 点击"登录"按钮
3. 预期结果:
   - ✅ 登录成功

### 场景5: 错误处理
1. 测试错误用户名:
   - 用户名: `wronguser`
   - 密码: `test123456`
   - 预期: ❌ "用户名/手机号/邮箱或密码错误"

2. 测试错误密码:
   - 用户名: `testuser`
   - 密码: `wrongpassword`
   - 预期: ❌ "用户名/手机号/邮箱或密码错误"

3. 测试表单验证:
   - 不填写用户名，点击登录
   - 预期: ❌ "请输入用户名/手机号/邮箱"

4. 测试密码长度:
   - 注册时输入5位密码
   - 预期: ❌ "密码长度至少6位"

5. 测试密码不一致:
   - 注册时两次密码不同
   - 预期: ❌ "两次密码不一致"

6. 测试手机号格式:
   - 注册时输入错误手机号: `12345678901`
   - 预期: ❌ "请输入正确的手机号"

### 场景6: 路由守卫
1. 未登录状态访问 `http://localhost:5173/projects`
   - 预期: 自动跳转到 `/login?redirect=/projects`

2. 登录后访问 `http://localhost:5173/login`
   - 预期: 自动跳转到首页 `/`

3. 登录后访问带 redirect 的登录页
   - 访问 `/login?redirect=/projects`
   - 登录成功后跳转到 `/projects`

### 场景7: Token 自动刷新
1. 登录成功后
2. 等待 Token 过期（默认2小时）
3. 继续访问需要认证的页面
4. 预期:
   - ✅ 自动使用 refresh token 刷新
   - ✅ 请求成功完成

### 场景8: 退出登录
1. 登录后，在系统中找到退出按钮（需要在 Layout 中添加）
2. 点击退出
3. 预期:
   - ✅ 清除本地 Token
   - ✅ 跳转到登录页

## API 测试（使用 curl）

### 测试注册
```bash
curl -X POST http://localhost:8000/api/users/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "phone": "13800138000",
    "email": "test@example.com",
    "password": "test123456",
    "password_confirm": "test123456"
  }'
```

### 测试登录（用户名）
```bash
curl -X POST http://localhost:8000/api/users/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "test123456"
  }'
```

### 测试登录（手机号）
```bash
curl -X POST http://localhost:8000/api/users/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "13800138000",
    "password": "test123456"
  }'
```

### 测试登录（邮箱）
```bash
curl -X POST http://localhost:8000/api/users/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test@example.com",
    "password": "test123456"
  }'
```

### 测试获取用户信息
```bash
# 先登录获取 token
ACCESS_TOKEN="your_access_token_here"

curl -X GET http://localhost:8000/api/users/auth/me/ \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

### 测试刷新 Token
```bash
REFRESH_TOKEN="your_refresh_token_here"

curl -X POST http://localhost:8000/api/users/auth/refresh/ \
  -H "Content-Type: application/json" \
  -d "{\"refresh\": \"$REFRESH_TOKEN\"}"
```

## 检查清单

### 后端检查
- [ ] Django 服务正常运行
- [ ] 数据库迁移完成
- [ ] CORS 配置正确
- [ ] 认证后端配置正确
- [ ] API 端点可访问

### 前端检查
- [ ] 开发服务器正常运行
- [ ] API 地址配置正确（`.env.development`）
- [ ] 登录页面样式正常
- [ ] 表单验证工作正常
- [ ] 路由守卫生效

### 功能检查
- [ ] 注册功能正常
- [ ] 用户名登录正常
- [ ] 手机号登录正常
- [ ] 邮箱登录正常
- [ ] Token 自动注入
- [ ] 错误信息正确显示
- [ ] 登录后自动跳转

## 常见问题排查

### 1. CORS 错误
如果看到 CORS 相关错误，检查后端 `settings/base.py`:
```python
INSTALLED_APPS = [
    'corsheaders',  # 确保已安装
    ...
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # 确保在最前面
    ...
]

CORS_ALLOW_ALL_ORIGINS = True  # 开发环境
```

### 2. 404 错误
检查 API 地址是否正确:
- 前端: `.env.development` 中的 `VITE_API_BASE_URL`
- 后端: URL 配置是否包含 `/api/users/`

### 3. Token 未注入
检查 `src/api/http.js` 请求拦截器是否正确配置

### 4. 页面样式异常
检查 Element Plus 是否正确安装和引入

## 性能测试

### 登录性能
```bash
# 使用 Apache Bench 进行压力测试
ab -n 1000 -c 10 -p login.json -T application/json \
  http://localhost:8000/api/users/auth/login/

# login.json 内容:
# {"username":"testuser","password":"test123456"}
```

## 安全检查

- [ ] 密码不在前端显示
- [ ] Token 存储在 localStorage（生产环境建议使用 httpOnly cookie）
- [ ] 密码传输使用 HTTPS（生产环境）
- [ ] 实施密码强度要求
- [ ] 防止暴力破解（添加验证码、限制登录次数等）

## 下一步

测试通过后，可以继续开发:
1. 在 Layout 中添加用户头像和退出按钮
2. 添加用户个人中心页面
3. 添加修改密码功能
4. 添加忘记密码功能
5. 集成第三方登录
