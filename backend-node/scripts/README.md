# 数据库脚本使用说明

本目录包含数据库初始化和数据填充脚本，用于快速搭建开发和演示环境。

## 📁 脚本文件

### 1. `init-database.js` - 数据库初始化脚本

**功能：**
- 清空所有表的现有数据
- 重置自增ID
- 创建默认角色（超级管理员、管理员、编辑者、查看者）
- 创建默认管理员账号
- 创建系统配置项

**使用场景：**
- 首次部署系统
- 重置数据库到初始状态
- 清除所有数据但保留表结构

**执行方式：**
```bash
# 方式1：直接执行
node scripts/init-database.js

# 方式2：使用 npm 脚本
npm run db:init
```

**执行结果：**
- 创建 4 个默认角色
- 创建 1 个管理员账号（用户名：admin，密码：123456）
- 创建 18 个系统配置项

---

### 2. `seed-mock-data.js` - Mock 数据填充脚本

**功能：**
- 创建测试用户账号
- 创建示例数据连接
- 创建示例数据集
- 创建示例模板
- 创建示例项目
- 创建示例媒体文件
- 创建示例播放列表
- 创建 IP 白名单记录
- 创建备份记录

**使用场景：**
- 开发环境数据填充
- 演示环境准备
- 功能测试

**执行方式：**
```bash
# 方式1：直接执行
node scripts/seed-mock-data.js

# 方式2：使用 npm 脚本
npm run db:seed
```

**执行结果：**
- 用户：5 个（1个管理员 + 4个测试用户）
- 数据连接：4 个（MySQL、PostgreSQL、Oracle、SQL Server）
- 数据集：5 个（包含 SQL、API、Excel 类型）
- 模板：5 个（仪表板、报表、图表等）
- 项目：4 个（不同状态的项目）
- 媒体文件：5 个（图片、文档、视频）
- 播放列表：3 个
- IP白名单：4 个
- 备份记录：3 个

---

### 3. 完整重置（初始化 + 填充）

**执行方式：**
```bash
# 方式1：手动执行两个脚本
node scripts/init-database.js && node scripts/seed-mock-data.js

# 方式2：使用 npm 脚本（推荐）
npm run db:reset
```

这个命令会先执行初始化脚本清空数据，然后执行填充脚本添加 Mock 数据。

---

## 🔐 默认账号信息

### 管理员账号
- **用户名：** `admin`
- **密码：** `123456`
- **角色：** 超级管理员
- **权限：** 所有权限

### 测试账号
| 用户名 | 密码 | 角色 | 说明 |
|--------|------|------|------|
| editor1 | 123456 | 编辑者 | 可创建和编辑内容 |
| editor2 | 123456 | 编辑者 | 可创建和编辑内容 |
| viewer1 | 123456 | 查看者 | 只读权限 |
| admin2 | 123456 | 管理员 | 管理员权限 |

---

## ⚙️ 配置说明

脚本使用 `.env` 文件中的数据库配置：

```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=admin123
DB_DATABASE=noco_viz_db
```

确保在执行脚本前：
1. MySQL 服务已启动
2. 数据库已创建
3. `.env` 文件配置正确

---

## 📊 Mock 数据详情

### 数据连接
- MySQL 生产数据库
- PostgreSQL 分析库
- Oracle 数据仓库
- SQL Server 报表库

### 数据集
- 销售数据统计（SQL 类型）
- 用户行为分析（SQL 类型）
- 产品库存数据（API 类型）
- 网站流量统计（Excel 类型）
- 销售额趋势（Excel 类型）

### 模板
- 销售仪表板（已发布，官方模板）
- 用户分析报表（已发布，官方模板）
- 库存监控大屏（已发布，官方模板）
- 网站流量分析（已发布）
- 财务报表（草稿）

### 项目
- 2024年度销售分析（已发布）
- 用户增长报告（已发布）
- 仓库库存监控（已发布）
- 网站运营数据（���稿）

---

## ⚠️ 注意事项

1. **数据安全：** 初始化脚本会清空所有表数据，请在生产环境谨慎使用
2. **执行顺序：** 必须先执行 `init-database.js`，再执行 `seed-mock-data.js`
3. **数据库连接：** 确保数据库服务正常运行且连接配置正确
4. **权限要求：** 数据库用户需要有 INSERT、DELETE、ALTER 权限
5. **密码安全：** 默认密码仅用于开发环境，生产环境请修改

---

## 🔧 故障排查

### 1. 连接失败
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```
**解决方案：** 检查 MySQL 服务是否启动，端口是否正确

### 2. 权限错误
```
Error: Access denied for user 'root'@'localhost'
```
**解决方案：** 检查 `.env` 中的数据库用户名和密码

### 3. 数据库不存在
```
Error: Unknown database 'noco_viz_db'
```
**解决方案：** 先创建数据库
```sql
CREATE DATABASE noco_viz_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 4. 表结构不匹配
```
Error: Unknown column 'xxx' in 'field list'
```
**解决方案：** 确保数据库表结构是最新的，运行 TypeORM 迁移

---

## 📝 开发建议

### 开发环境初始化流程
```bash
# 1. 安装依赖
npm install

# 2. 配置环境变量
cp .env.example .env
# 编辑 .env 文件

# 3. 创建数据库
mysql -u root -p -e "CREATE DATABASE noco_viz_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 4. 初始化数据库并填充数据
npm run db:reset

# 5. 启动开发服务器
npm run start:dev
```

### 定期重置开发数据
```bash
# 当开发数据混乱时，可以快速重置
npm run db:reset
```

---

## 🎯 最佳实践

1. **开发环境：** 使用 `npm run db:reset` 快速重置数据
2. **测试环境：** 定期执行 `npm run db:reset` 保持数据一致性
3. **生产环境：**
   - ⚠️ 不要使用这些脚本
   - 使用专业的数据库迁移工具
   - 做好数据备份

4. **自定义 Mock 数据：**
   - 修改 `seed-mock-data.js` 中的数据数组
   - 根据实际需求调整数据量和内容
   - 保持数据的关联性和一致性

---

## 📚 相关文档

- [NestJS 官方文档](https://docs.nestjs.com/)
- [TypeORM 官方文档](https://typeorm.io/)
- [MySQL 官方文档](https://dev.mysql.com/doc/)

---

## 🤝 贡献

如果您发现脚本有问题或需要改进，欢迎提交 Issue 或 Pull Request。
