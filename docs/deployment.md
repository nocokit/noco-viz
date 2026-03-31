# Noco-Viz 部署指南

## 快速启动

### 使用一键启动脚本（推荐）

```bash
# 1. 克隆项目
git clone https://github.com/nocokit/noco-viz.git
cd noco-viz

# 2. 配置环境变量
cp backend-node/.env.example backend-node/.env
# 编辑 backend-node/.env 配置数据库连接

# 3. 一键启动
./start.sh
```

启动脚本会自动：
- 检查并安装依赖
- 初始化数据库
- 启动后端服务（端口 8000）
- 启动前端服务（端口 5173）

访问 http://localhost:5173 即可使用。

---

## 手动部署

### 环境要求

- Node.js >= 20.19.0
- MySQL >= 8.0
- npm 或 pnpm

### 后端部署

```bash
cd backend-node

# 1. 安装依赖
npm install

# 2. 配置环境变量
cp .env.example .env
# 编辑 .env 文件，配置数据库连接信息

# 3. 初始化数据库
npm run db:init

# 4. 启动服务
npm run start:dev  # 开发模式
# 或
npm run build && npm run start:prod  # 生产模式
```

后端服务默认运行在 http://localhost:8000

### 前端部署

```bash
cd frontend

# 1. 安装依赖
pnpm install

# 2. 启动开发服务器
pnpm dev

# 3. 或构建生产版本
pnpm build
```

前端服务默认运行在 http://localhost:5173

---

## 数据库初始化

### 自动初始化（推荐）

```bash
cd backend-node
npm run db:init
```

这会自动：
- 创建数据库表结构
- 插入初始数据
- 创建默认管理员账号

### 手动初始化

如果自动初始化失败，可以手动执行：

```bash
# 1. 创建数据库
mysql -u root -p
CREATE DATABASE noco_viz CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 2. 运行迁移
cd backend-node
npm run typeorm migration:run

# 3. 插入种子数据
npm run db:seed
```

---

## 默认账号

初始化完成后，使用以下账号登录：

- 用户名：`admin`
- 密码：`admin123`

**⚠️ 生产环境请立即修改默认密码！**

---

## 生产环境部署

### 使用 Docker（推荐）

```bash
# 1. 构建镜像
docker-compose build

# 2. 启动服务
docker-compose up -d

# 3. 查看日志
docker-compose logs -f
```

### 使用部署脚本

```bash
# 编辑 deploy.sh 配置部署路径
vim deploy.sh

# 执行部署
./deploy.sh
```

---

## 环境变量说明

### 后端环境变量（backend-node/.env）

```bash
# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=noco_viz

# 服务端口
PORT=8000

# JWT 密钥（生产环境必须修改）
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# 许可证类型（community/professional/enterprise）
LICENSE_TYPE=community
```

---

## 常见问题

### 1. 数据库连接失败

检查：
- MySQL 服务是否启动
- .env 中的数据库配置是否正确
- 数据库用户是否有足够权限

### 2. 端口被占用

修改端口：
- 后端：编辑 `backend-node/.env` 中的 `PORT`
- 前端：编辑 `frontend/vite.config.js` 中的 `server.port`

### 3. 依赖安装失败

尝试：
```bash
# 清理缓存
npm cache clean --force
rm -rf node_modules package-lock.json

# 重新安装
npm install
```

---

## 技术支持

如遇问题，欢迎：
- 提交 [Issue](https://github.com/nocokit/noco-viz/issues)
- 查看 [常见问题](../docs/faq.md)
- 联系我们：contact@noco-viz.com
