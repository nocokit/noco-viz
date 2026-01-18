# Noco-Space 快速启动指南

## 当前状态

✅ **开发环境已启动并运行正常**

- 前端: http://localhost:5174
- 后端: http://localhost:8000
- API文档: http://localhost:8000/api/docs

## 已修复的问题

### 1. 用户菜单缺失 ✅
在 `MainLayout.vue` 左下角添加了用户菜单，包含：
- 用户信息显示
- 个人资料
- 账户设置
- 退出登录

### 2. 菜单图标错误 ✅
修复了 `menu.js` 中的图标引用错误（Share → Upload）

### 3. Vite 代理配置 ✅
完善了 `vite.config.js` 的 API 代理配置

## 如何使用

### 方式一：使用启动脚本（推荐）

```bash
# 一键启动前后端
./start.sh
```

### 方式二：手动启动

```bash
# 终端1 - 启动后端
cd backend-node
npm run start:dev

# 终端2 - 启动前端
cd frontend
npm run dev
```

## 访问应用

1. 打开浏览器访问: http://localhost:5174
2. 使用测试账户登录（需要先在数据库中创建用户）
3. 浏览各个功能模块

## 主要功能模块

### 工作台
- **项目管理** (`/projects`) - 管理数据可视化大屏和报表项目
- **轮播管理** (`/playlist`) - 管理大屏轮播播放列表
- **企业模板库** (`/templates`) - 浏览和使用预制模板

### 数据中心
- **连接配置** (`/connections`) - 配置数据库和API连接
- **数据集管理** (`/datasets`) - 管理SQL、Excel和API数据集

### 资产管理
- **媒体资源库** (`/media`) - 管理图片、视频等媒体文件
- **自定义组件** (`/components`) - 管理自定义可视化组件

### 安全与权限
- **组织架构** (`/organization`) - 管理组织结构
- **角色列表** (`/role-list`) - 管理系统角色
- **角色权限** (`/role-permission`) - 配置角色权限
- **审计日志** (`/audit`) - 查看系统操作日志

### 运维中心
- **系统监控** (`/monitor`) - 监控系统运行状态
- **数据源监控** (`/datasource-monitor`) - 监控数据源连接状态
- **集成发布** (`/integration`) - 管理项目发布和集成

### 系统设置
- **系统配置** (`/settings`) - 系统参数配置
- **IP白名单** (`/whitelist`) - 配置访问白名单
- **备份恢复** (`/backup`) - 数据备份和恢复
- **回收站** (`/recycle`) - 查看已删除的项目

## 开发相关

### 技术栈

**前端**
- Vue 3 (Composition API)
- Vite 7
- Element Plus
- Pinia (状态管理)
- Vue Router
- Axios

**后端**
- NestJS
- TypeORM
- MySQL
- JWT 认证
- Swagger API 文档

### 项目结构

```
noco-space/
├── frontend/              # 前端项目
│   ├── src/
│   │   ├── api/          # API 接口
│   │   ├── components/   # 组件
│   │   ├── config/       # 配置文件
│   │   ├── layout/       # 布局组件
│   │   ├── router/       # 路由配置
│   │   ├── store/        # 状态管理
│   │   └── views/        # 页面视图
│   └── vite.config.js    # Vite 配置
│
├── backend-node/         # 后端项目
│   ├── src/
│   │   ├── modules/      # 业务模块
│   │   ├── main.ts       # 入口文件
│   │   └── app.module.ts # 根模块
│   └── .env              # 环境变量
│
└── start.sh              # 一键启动脚本
```

### API 测试

使用 Swagger 文档测试 API:
http://localhost:8000/api/docs

或使用 curl:

```bash
# 获取项目列表
curl http://localhost:8000/api/projects

# 登录
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

## 待处理事项

### 需要 sudo 权限

如果需要执行生产构建，需要先修复 npm 缓存权限：

```bash
sudo chown -R 501:20 "/Users/bojue/.npm"
cd frontend
npm install -D sass-embedded
npm run build
```

### 可选优化

1. **清理多余的后端进程**
   ```bash
   lsof -ti:8000 | xargs kill -9
   cd backend-node && npm run start:dev
   ```

2. **清理占用 5173 端口的进程**
   ```bash
   lsof -ti:5173 | xargs kill -9
   ```

## 常见问题

### Q: 前端无法连接后端？
A: 检查后端是否在 8000 端口运行，查看 vite.config.js 的代理配置

### Q: 登录失败？
A: 确保数据库中有用户数据，检查用户名和密码是否正确

### Q: 页面显示空白？
A: 打开浏览器控制台查看错误信息，检查路由配置和组件导入

### Q: API 请求 404？
A: 检查后端服务是否正常运行，查看 API 路径是否正确

## 更多信息

- 详细测试报告: `TEST-REPORT.md`
- API 文档: http://localhost:8000/api/docs
- 项目文档: `docs/` 目录

## 联系支持

如有问题，请查看:
- GitHub Issues
- 项目文档
- API 文档
