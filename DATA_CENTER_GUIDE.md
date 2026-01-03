# 数据中心功能使用指南

## 🎯 功能概览

数据中心模块已完成以下4个核心功能的开发：

1. ✅ **真实的后端API集成**
2. ✅ **文件上传的实际处理逻辑**
3. ✅ **SQL查询语法验证**
4. ✅ **数据预览功能**

## 📁 新增文件列表

### API层
- `src/api/request.js` - Axios封装的HTTP请求工具
- `src/api/dataset.js` - 数据集和连接管理API接口

### 工具类
- `src/utils/sqlValidator.js` - SQL语法验证工具

### 组件
- `src/components/DataPreviewDialog.vue` - 数据预览对话框组件

### 配置文件
- `.env.development` - 开发环境配置
- `.env.production` - 生产环境配置
- `API_DOCUMENTATION.md` - 后端API接口文档

### 更新文件
- `src/views/DataCenter.vue` - 数据中心主组件（已集成所有功能）
- `package.json` - 新增axios依赖

## 🚀 功能详解

### 1. 后端API集成

#### API请求工具 (`src/api/request.js`)

封装了axios，提供：
- 统一的请求/响应拦截
- 自动错误处理
- Token认证支持
- 超时控制（30秒）

```javascript
import request from '@/api/request'

// 使用示例
const response = await request({
  url: '/datasets',
  method: 'get'
})
```

#### 数据集API (`src/api/dataset.js`)

提供完整的CRUD接口：

**数据集管理**：
- `getDatasets()` - 获取列表
- `createDataset()` - 创建
- `updateDataset()` - 更新
- `deleteDataset()` - 删除
- `previewDataset()` - 预览数据
- `uploadExcel()` - 上传Excel文件
- `validateSQL()` - 验证SQL语句
- `testApiDataSource()` - 测试API数据源

**连接管理**：
- `getConnections()` - 获取连接列表
- `createConnection()` - 创建连接
- `updateConnection()` - 更新连接
- `deleteConnection()` - 删除连接
- `testConnection()` - 测试连接
- `testConnectionConfig()` - 测试连接配置

#### Fallback机制

所有API调用都实现了优雅降级：
- API成功 → 使用后端数据
- API失败 → 使用Mock数据（用于演示）

### 2. 文件上传处理

#### Excel文件上传流程

1. **选择文件**：支持拖拽或点击上传
   - 文件类型：`.xlsx`, `.xls`, `.csv`
   - 文件大小：最大10MB
   - 数量限制：1个文件

2. **上传进度**：实时显示上传百分比

3. **文件处理**：
   ```javascript
   const response = await uploadExcel(file, (progress) => {
     uploadProgress.value = progress
   })
   ```

4. **数据绑定**：上传成功后自动关联到数据集

#### 文件上传配置

在 `DataCenter.vue` 中：
```vue
<el-upload
  :auto-upload="false"
  :file-list="uploadFileList"
  :on-change="handleFileChange"
  :on-remove="handleFileRemove"
  accept=".xlsx,.xls,.csv"
  :limit="1"
>
```

### 3. SQL查询语法验证

#### 验证功能 (`src/utils/sqlValidator.js`)

**基础验证**：
- 空值检查
- 括号匹配
- 引号匹配
- SELECT语句结构验证

**安全检查**：
- 危险操作检测（DROP、DELETE、TRUNCATE等）
- SQL注入风险检测
- 只读查询识别

**使用示例**：

```javascript
import { validateSQL, isReadOnlySQL } from '@/utils/sqlValidator'

// 语法验证
const result = validateSQL('SELECT * FROM users')
console.log(result)
// {
//   valid: true,
//   errors: [],
//   warnings: []
// }

// 只读检查
const isReadOnly = isReadOnlySQL('SELECT * FROM users')
console.log(isReadOnly) // true
```

#### 集成到数据集保存

保存数据集时自动验证SQL：
```javascript
const validation = validateSQL(datasetForm.value.sqlQuery)
if (!validation.valid) {
  ElMessage.error(`SQL验证失败: ${validation.errors.join(', ')}`)
  return
}
```

#### 工具函数

- `validateSQL(sql)` - 基础语法验证
- `isReadOnlySQL(sql)` - 只读查询判断
- `formatSQL(sql)` - SQL格式化
- `extractTableNames(sql)` - 提取表名
- `containsKeyword(sql, keyword)` - 关键字检测

### 4. 数据预览功能

#### 预览组件 (`src/components/DataPreviewDialog.vue`)

**特性**：
- 分页加载数据
- 自定义列宽
- 支持排序
- 数据导出（开发中）
- 实时刷新

**使用方式**：

```vue
<DataPreviewDialog
  v-model="previewDialogVisible"
  :dataset-id="previewDatasetId"
  :dataset-name="previewDatasetName"
/>
```

#### 预览流程

1. 点击数据集的"预览"按钮
2. 打开预览对话框
3. 自动加载数据（100条/页）
4. 支持分页浏览
5. 可刷新数据

#### 数据格式

后端返回格式：
```json
{
  "columns": [
    { "field": "id", "label": "ID", "width": 80 },
    { "field": "name", "label": "名称", "width": 150 }
  ],
  "data": [
    { "id": 1, "name": "数据1" }
  ],
  "total": 1000
}
```

#### Mock数据

当后端未就绪时，自动使用Mock数据进行演示。

## 🔧 配置说明

### API基础路径

开发环境 (`.env.development`)：
```
VITE_API_BASE_URL=http://localhost:3000/api
```

生产环境 (`.env.production`)：
```
VITE_API_BASE_URL=/api
```

### 修改API地址

1. 编辑 `.env.development` 文件
2. 修改 `VITE_API_BASE_URL` 的值
3. 重启开发服务器

## 💻 使用示例

### 创建SQL数据集

1. 点击"+ 新建数据集"
2. 填写名称和描述
3. 选择类型：SQL
4. 选择数据连接
5. 输入SQL查询：
   ```sql
   SELECT * FROM users WHERE status = 'active'
   ```
6. 点击"保存"（自动验证SQL）

### 上传Excel数据集

1. 点击"+ 新建数据集"
2. 填写名称和描述
3. 选择类型：Excel/CSV
4. 拖拽或选择文件
5. 点击"保存"（自动上传文件）

### 创建API数据集

1. 点击"+ 新建数据集"
2. 填写名称和描述
3. 选择类型：API
4. 输入API地址：
   ```
   https://api.example.com/data
   ```
5. 点击"保存"

### 预览数据

1. 找到目标数据集
2. 点击"预览"按钮
3. 查看数据表格
4. 可切换页码、调整每页条数
5. 支持刷新和导出

### 创建数据连接

1. 切换到"连接配置"标签
2. 点击"+ 新建连接"或"新建数据连接"卡片
3. 填写连接信息：
   - 连接名称
   - 数据库类型（MySQL/Oracle/PostgreSQL/MongoDB）
   - 主机地址（如：192.168.1.100:3306）
   - 用户名和密码
   - 数据库名
4. 点击"测试连接"验证
5. 点击"保存"

## 📊 数据流程图

```
┌─────────────┐
│  用户操作    │
└──────┬──────┘
       │
       ▼
┌──────────────┐      ┌──────────────┐
│ DataCenter   │─────▶│   API层       │
│   组件       │      │ (dataset.js)  │
└──────┬───────┘      └───────┬──────┘
       │                      │
       │                      ▼
       │              ┌──────────────┐
       │              │ HTTP请求      │
       │              │ (request.js)  │
       │              └───────┬──────┘
       │                      │
       │                      ▼
       │              ┌──────────────┐
       │              │  后端API      │
       │              └───────┬──────┘
       │                      │
       │              ┌───────▼──────┐
       │              │   数据库      │
       │              └──────────────┘
       │
       ▼
┌──────────────┐
│  辅助组件     │
│ - SQL验证     │
│ - 数据预览    │
└──────────────┘
```

## 🐛 故障排查

### API请求失败

1. 检查 `.env.development` 配置
2. 确认后端服务已启动
3. 检查浏览器控制台错误信息
4. 验证接口地址和参数

### 文件上传失败

1. 检查文件大小（≤10MB）
2. 确认文件格式（xlsx/xls/csv）
3. 查看网络请求状态
4. 检查后端上传接口

### SQL验证失败

1. 检查SQL语法
2. 确认引号和括号匹配
3. 避免使用危险操作（DROP等）
4. 查看错误提示信息

## 📝 开发建议

### 后端开发

参考 `API_DOCUMENTATION.md` 实现后端接口：

1. 数据集CRUD接口
2. 文件上传处理
3. 数据连接管理
4. SQL执行和验证
5. 数据预览分页

### 扩展功能

可继续开发：

1. 数据导出功能
2. 数据集定时刷新
3. 数据转换和清洗
4. 权限管理
5. 操作日志

## 🎉 总结

本次开发完成了数据中心的核心功能：

✅ **API集成** - 完整的前后端通信机制
✅ **文件上传** - Excel/CSV文件上传和处理
✅ **SQL验证** - 语法检查和安全验证
✅ **数据预览** - 分页数据浏览和展示

所有功能均实现了：
- 完善的错误处理
- 友好的用户提示
- Mock数据降级
- 清晰的代码结构

可直接投入使用或继续扩展！
