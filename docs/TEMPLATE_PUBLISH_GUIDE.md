# 模板发布功能使用指南

## 🎯 功能概览

模板发布功能允许用户将自己创建的数据大屏模板分享给部门或全公司使用。

### 已实现功能

1. ✅ **模板发布对话框** - 完整的表单界面
2. ✅ **表单验证** - 必填项和格式校验
3. ✅ **缩略图上传** - 支持图片上传和预览
4. ✅ **标签管理** - 可添加最多5个标签
5. ✅ **可见范围设置** - 部门/公司/公开三种级别
6. ✅ **API集成** - 完整的后端接口调用
7. ✅ **实时更新** - 发布成功后立即显示在列表中

## 📁 新增文件

```
src/
├── api/
│   └── template.js                    # 模板管理API接口
├── components/
│   └── PublishTemplateDialog.vue      # 发布模板对话框组件
src/views/
└── TemplateLibrary.vue                # 已集成发布功能
```

## 🚀 使用方式

### 用户操作流程

1. **进入模板库**
   - 访问"模板库"页面

2. **点击发布按钮**
   - 点击右上角"发布我的模板"按钮

3. **填写模板信息**
   - 模板名称（必填，2-50字符）
   - 模板描述（必填，10-200字符）
   - 分类（必填）
   - 所属部门
   - 分辨率
   - 标签（最多5个）
   - 缩略图（必传）
   - 可见范围

4. **上传缩略图**
   - 点击上传区域
   - 选择图片文件（JPG/PNG，最大5MB）
   - 建议尺寸：800x450

5. **提交发布**
   - 点击"发布模板"按钮
   - 等待上传和处理
   - 发布成功后自动显示在列表中

### 发布模板对话框字段说明

#### 基本信息

**模板名称** (必填)
- 类型：文本
- 长度：2-50字符
- 示例：华东区销售周报

**模板描述** (必填)
- 类型：文本域
- 长度：10-200字符
- 示例：用于周会汇报，包含团队排名和KPI完成率

**分类** (必填)
- 类型：下拉选择
- 选项：
  - 业务分析 (business)
  - 物联网监控 (iot)
  - 安全监控 (security)
  - 物流供应链 (logistics)
  - 人力资源 (hr)
  - 客户服务 (service)
  - 销售管理 (sales)
  - UI设计 (design)
  - 研发效能 (development)
  - 市场营销 (marketing)
  - 财务分析 (finance)
  - 其他 (other)

**部门**
- 类型：文本
- 可选
- 示例：销售部

**分辨率**
- 类型：下拉选择
- 选项：
  - 1920 x 1080 (标准)
  - 3840 x 2160 (4K)
  - 1366 x 768 (小屏)
  - 自适应

#### 标签

- 类型：标签组
- 数量：最多5个
- 操作：
  - 点击"+添加标签"按钮
  - 输入标签内容
  - 按回车键添加
  - 点击标签上的X删除

#### 缩略图

- 类型：图片上传
- 格式：JPG、PNG
- 大小：最大5MB
- 建议尺寸：800x450
- 显示：上传后显示预览图

#### 可见范围

- 类型：单选
- 选项：
  - **仅本部门** - 只有本部门成员可见
  - **全公司** - 所有员工可见
  - **公开（需审核）** - 提交审核后展示在官方推荐区

## 🔧 API接口

### 1. 发布模板

**接口**: `POST /api/templates/publish`

**请求Body**:
```json
{
  "name": "华东区销售周报",
  "description": "用于周会汇报，包含团队排名和KPI完成率",
  "category": "sales",
  "department": "销售部",
  "resolution": "1920 x 1080",
  "tags": ["销售", "周报", "KPI"],
  "thumbnail": "https://example.com/thumbnail.jpg",
  "visibility": "department",
  "config": {
    "width": 1920,
    "height": 1080,
    "components": []
  }
}
```

**响应**:
```json
{
  "code": 200,
  "message": "发布成功",
  "data": {
    "id": "tpl-shared-001",
    "name": "华东区销售周报",
    "description": "...",
    "type": "shared",
    "isSystem": false,
    "author": "当前用户",
    "usageCount": 0,
    "createdAt": "2025-01-01",
    "updatedAt": "2025-01-01"
  }
}
```

### 2. 上传缩略图

**接口**: `POST /api/templates/upload/thumbnail`

**请求**: multipart/form-data
- file: 图片文件

**响应**:
```json
{
  "code": 200,
  "message": "上传成功",
  "data": {
    "url": "https://example.com/thumbnails/xxx.jpg"
  }
}
```

### 3. 获取模板列表

**接口**: `GET /api/templates`

**请求参数**:
- type: official/shared/custom
- category: 分类
- keyword: 搜索关键字

**响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": "tpl-shared-001",
      "name": "华东区销售周报",
      ...
    }
  ]
}
```

### 4. 获取我的模板

**接口**: `GET /api/templates/my`

**响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": "tpl-shared-001",
      "name": "我发布的模板",
      ...
    }
  ]
}
```

## 📊 数据流程

```
用户填写表单
    ↓
上传缩略图
    ↓
表单验证
    ↓
调用发布API
    ↓
后端保存数据
    ↓
返回模板信息
    ↓
更新前端列表
    ↓
显示成功提示
```

## 💡 功能特点

### 1. 智能验证

- **实时验证**: 表单字段失去焦点时验证
- **提交验证**: 点击发布前完整验证
- **友好提示**: 清晰的错误提示信息

### 2. 文件上传

- **拖拽上传**: 支持拖拽图片文件
- **预览功能**: 上传后立即预览
- **进度显示**: 实时显示上传进度
- **格式限制**: 只允许图片格式
- **大小限制**: 最大5MB

### 3. 标签管理

- **动态添加**: 点击按钮添加标签
- **数量限制**: 最多5个标签
- **快速删除**: 点击X删除标签
- **去重处理**: 自动过滤重复标签

### 4. 可见范围

- **部门级别**: 仅本部门可见
- **公司级别**: 全公司可见
- **公开审核**: 提交审核后成为官方模板

### 5. Mock数据降级

- **优雅降级**: API失败时使用Mock数据
- **完整流程**: 仍可完成发布流程
- **开发友好**: 无需后端即可测试

## 🎨 UI/UX设计

### 对话框布局

- 宽度：700px
- 标签宽度：100px
- 表单项间距：标准Element Plus间距
- 响应式：适配不同屏幕尺寸

### 缩略图上传区

- 默认高度：200px
- 虚线边框：2px
- 悬停效果：主题色边框
- 预览模式：自适应容器

### 按钮状态

- **取消按钮**: 默认样式
- **发布按钮**: 主题色（蓝色）
- **加载状态**: 显示"发布中..."文字
- **禁用状态**: 表单未通过验证时禁用

## 🔍 代码示例

### 打开发布对话框

```vue
<template>
  <el-button @click="handlePublishTemplate">
    发布我的模板
  </el-button>

  <PublishTemplateDialog
    v-model="publishDialogVisible"
    @success="handlePublishSuccess"
  />
</template>

<script setup>
import { ref } from 'vue'
import PublishTemplateDialog from '@/components/PublishTemplateDialog.vue'

const publishDialogVisible = ref(false)

const handlePublishTemplate = () => {
  publishDialogVisible.value = true
}

const handlePublishSuccess = (template) => {
  console.log('发布成功:', template)
  // 更新模板列表
}
</script>
```

### 调用发布API

```javascript
import { publishTemplate } from '@/api/template'

const submitData = {
  name: '模板名称',
  description: '模板描述',
  category: 'business',
  thumbnail: 'https://example.com/thumb.jpg',
  // ... 其他字段
}

const response = await publishTemplate(submitData)
if (response.code === 200) {
  console.log('发布成功:', response.data)
}
```

## 🐛 故障排查

### 缩略图上传失败

**问题**: 点击上传后没有反应

**解决方案**:
1. 检查文件大小（≤5MB）
2. 确认文件格式（JPG/PNG）
3. 查看浏览器控制台错误
4. 验证后端上传接口

### 表单验证失败

**问题**: 无法点击发布按钮

**解决方案**:
1. 检查必填项是否填写
2. 确认字段长度符合要求
3. 查看错误提示信息
4. 必须上传缩略图

### API请求失败

**问题**: 发布时提示失败

**解决方案**:
1. 检查网络连接
2. 确认后端服务运行
3. 查看接口返回信息
4. Mock降级会自动生效

## 📝 后端实现建议

### 数据表设计

```sql
CREATE TABLE templates (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  description VARCHAR(200) NOT NULL,
  type VARCHAR(20) NOT NULL,
  category VARCHAR(50),
  department VARCHAR(50),
  resolution VARCHAR(50),
  tags JSON,
  thumbnail VARCHAR(500),
  visibility VARCHAR(20),
  config JSON,
  author_id VARCHAR(50),
  author_name VARCHAR(50),
  is_system BOOLEAN DEFAULT FALSE,
  usage_count INT DEFAULT 0,
  status VARCHAR(20) DEFAULT 'published',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 文件存储

**本地存储**:
```javascript
const multer = require('multer')
const storage = multer.diskStorage({
  destination: './uploads/thumbnails/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname)
  }
})
```

**云存储** (推荐):
- 阿里云OSS
- 腾讯云COS
- AWS S3

### 权限控制

```javascript
// 检查用户权限
function checkPermission(userId, visibility) {
  if (visibility === 'public') {
    // 需要管理员审核
    return 'pending_review'
  }
  return 'published'
}
```

## 🎉 总结

模板发布功能已完整实现：

✅ **完整表单** - 包含所有必要字段
✅ **文件上传** - 支持缩略图上传和预览
✅ **表单验证** - 完善的字段验证
✅ **API集成** - 前后端接口对接
✅ **实时更新** - 发布后立即显示
✅ **优雅降级** - API失败时使用Mock

可直接使用或根据需求扩展！

## 📚 相关文件

- `src/components/PublishTemplateDialog.vue` - 发布对话框组件
- `src/api/template.js` - 模板API接口
- `src/views/TemplateLibrary.vue` - 模板库页面
- `src/config/templates.js` - 模板数据配置
- `src/types/template.ts` - 模板类型定义
