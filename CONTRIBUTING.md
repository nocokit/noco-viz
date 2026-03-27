# 贡献指南

感谢你对 Noco-Viz 的关注！我们欢迎所有形式的贡献。

## 🤝 如何贡献

### 报告 Bug

如果你发现了 Bug，请：

1. 检查 [Issues](https://github.com/nocokit/noco-viz/issues) 确认问题未被报告
2. 创建新 Issue，包含：
   - 清晰的标题
   - 详细的复现步骤
   - 预期行为和实际行为
   - 截图或错误日志
   - 环境信息（浏览器、Node 版本等）

### 提出新功能

1. 先在 [Discussions](https://github.com/nocokit/noco-viz/discussions) 讨论
2. 获得认可后创建 Feature Request Issue
3. 等待维护者审核

### 提交代码

#### 开发环境设置

```bash
# 1. Fork 项目到你的账号

# 2. 克隆你的 Fork
git clone https://github.com/YOUR_USERNAME/noco-viz.git
cd noco-viz

# 3. 添加上游仓库
git remote add upstream https://github.com/nocokit/noco-viz.git

# 4. 安装依赖
cd backend-node && npm install
cd ../frontend && pnpm install

# 5. 配置环境变量
cp backend-node/.env.example backend-node/.env
cp frontend/.env.example frontend/.env.development

# 6. 初始化数据库
cd backend-node
npm run migration:run
npm run seed

# 7. 启动开发服务器
npm run start:dev  # 后端
cd ../frontend && pnpm dev  # 前端
```

#### 代码规范

**提交前请确保：**

- ✅ 代码通过 ESLint 检查
- ✅ 代码通过 TypeScript 类型检查
- ✅ 添加了必要的测试
- ✅ 测试全部通过
- ✅ 更新了相关文档

**代码风格：**

```bash
# 运行 Lint
cd frontend && pnpm lint
cd backend-node && npm run lint

# 自动修复
cd frontend && pnpm lint:fix
cd backend-node && npm run lint:fix
```

#### 提交规范

我们使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Type 类型：**

- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式（不影响功能）
- `refactor`: 重构
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建/工具相关

**示例：**

```
feat(editor): 添加智能布局功能

- 支持 3x3、4x4、5x5 网格布局
- 自动对齐组件到网格
- 保持组件间距一致

Closes #123
```

#### Pull Request 流程

1. **创建分支**

```bash
git checkout -b feature/your-feature-name
# 或
git checkout -b fix/your-bug-fix
```

2. **开发和提交**

```bash
git add .
git commit -m "feat: your feature description"
```

3. **保持同步**

```bash
git fetch upstream
git rebase upstream/main
```

4. **推送到你的 Fork**

```bash
git push origin feature/your-feature-name
```

5. **创建 Pull Request**

- 访问 GitHub 创建 PR
- 填写 PR 模板
- 等待 Code Review

#### Code Review 标准

维护者会检查：

- ✅ 代码质量和可读性
- ✅ 是否符合项目架构
- ✅ 是否有充分的测试
- ✅ 是否更新了文档
- ✅ 是否有破坏性变更

## 📝 文档贡献

文档同样重要！你可以：

- 修正错别字
- 改进说明
- 添加示例
- 翻译文档

文档位于 `docs/` 目录。

## 🧪 测试

### 运行测试

```bash
# 前端测试
cd frontend
pnpm test

# 后端测试
cd backend-node
npm run test

# E2E 测试
cd frontend
pnpm test:e2e
```

### 编写测试

- 单元测试：测试独立函数和组件
- 集成测试：测试模块间交互
- E2E 测试：测试完整用户流程

## 🎨 设计贡献

如果你擅长设计，可以贡献：

- UI/UX 改进建议
- 图标和插图
- 主题设计
- 品牌素材

## 🌍 国际化

帮助我们翻译到更多语言：

1. 复制 `frontend/src/locales/zh-CN.json`
2. 翻译为目标语言
3. 提交 PR

## 💬 社区

- [Discord](https://discord.gg/nocokit) - 实时讨论
- [GitHub Discussions](https://github.com/nocokit/noco-viz/discussions) - 长期讨论
- 微信群 - 添加 `nocokit-helper` 备注「贡献」

## 📜 行为准则

请遵守我们的 [行为准则](CODE_OF_CONDUCT.md)：

- 尊重他人
- 包容不同观点
- 接受建设性批评
- 关注社区利益

## 🏆 贡献者

感谢所有贡献者！你的名字将出现在：

- README.md 贡献者列表
- 项目官网
- Release Notes

## ❓ 需要帮助？

- 查看 [FAQ](docs/faq.md)
- 在 [Discussions](https://github.com/nocokit/noco-viz/discussions) 提问
- 加入 [Discord](https://discord.gg/nocokit)

---

再次感谢你的贡献！🎉
