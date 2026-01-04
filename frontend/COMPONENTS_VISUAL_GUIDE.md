# 🎨 组件可视化指南

## 📐 组件架构图

```
公共组件库 (23个)
│
├── 🏗️ 布局组件 (3个)
│   ├── PageLayout ⭐ 新增
│   ├── PageHeader
│   └── CardGrid
│
├── 🔍 筛选导航 (5个)
│   ├── FilterBar ⭐ 新增
│   ├── TabFilter
│   ├── SearchBar
│   ├── TabNavigation
│   └── Breadcrumb ⭐ 新增
│
├── 💬 弹窗组件 (3个)
│   ├── StepModal ⭐ 新增
│   ├── FormModal
│   └── ConfirmDialog
│
├── 📊 数据展示 (7个)
│   ├── DataTable 🔧 增强
│   ├── InfoCard ⭐ 新增
│   ├── ProjectCard
│   ├── StatusBadge
│   ├── EmptyState
│   ├── DetailPanel
│   └── LoadingState ⭐ 新增
│
├── ⚡ 操作组件 (2个)
│   ├── ActionDropdown ⭐ 新增
│   └── ActionButton
│
└── 📁 文件上传 (3个)
    ├── ResourceUploader ⭐ 新增
    ├── UploadFile
    └── FolderTree
```

---

## 🎯 组件依赖关系图

```
PageLayout
  └── PageHeader
      └── SearchBar
      └── ActionButton
  └── FilterBar / TabFilter
  └── DataTable
      └── EmptyState
      └── LoadingState
      └── ActionDropdown
  └── Breadcrumb
```

---

## 🌊 页面组装流程

```
1️⃣ 选择布局
   PageLayout

2️⃣ 添加头部
   PageHeader + Breadcrumb

3️⃣ 添加筛选
   FilterBar + SearchBar

4️⃣ 展示数据
   DataTable / CardGrid / InfoCard

5️⃣ 添加交互
   ActionDropdown + ConfirmDialog

6️⃣ 添加状态
   LoadingState + EmptyState
```

---

## 📱 响应式布局示例

### 桌面端 (>1024px)
```
┌─────────────────────────────────────────┐
│ Sidebar │ Header + Breadcrumb + Actions │
│ (260px) ├───────────────────────────────┤
│         │ FilterBar                      │
│ Tree    ├───────────────────────────────┤
│         │                                │
│ Nav     │ Content Area                   │
│         │ (Table / Cards / Charts)       │
│         │                                │
└─────────┴────────────────────────────────┘
```

### 平板端 (768px - 1024px)
```
┌─────────────────────────────────┐
│ Header + Actions                │
├─────────────────────────────────┤
│ Sidebar (Collapsible)           │
├─────────────────────────────────┤
│ FilterBar                        │
├─────────────────────────────────┤
│ Content Area                     │
│ (Responsive Grid)                │
└─────────────────────────────────┘
```

### 移动端 (<768px)
```
┌───────────────┐
│ Header        │
├───────────────┤
│ Nav (Drawer)  │
├───────────────┤
│ FilterBar     │
│ (Horizontal)  │
├───────────────┤
│ Content       │
│ (Single Col)  │
└───────────────┘
```

---

## 🎨 组件样式体系

### 颜色系统
```
Primary:   #00d4ff (主色调)
Success:   #67c23a (成功)
Warning:   #e6a23c (警告)
Danger:    #f56c6c (危险)
Info:      #909399 (信息)

Background:
  - Page:     #141517
  - Card:     #1a1b1e
  - Elevated: #202124
  - Hover:    #2d2e30

Border:     #35363a

Text:
  - Primary:   #e8eaed
  - Secondary: #9aa0a6
  - Tertiary:  #5f6368
```

### 尺寸系统
```
Small:   12px / 24px / 8px padding
Default: 14px / 32px / 12px padding
Large:   16px / 40px / 16px padding
```

### 圆角系统
```
Small:  4px
Normal: 6px
Medium: 8px
Large:  12px
```

### 间距系统
```
xs:  4px
sm:  8px
md:  12px
lg:  16px
xl:  24px
xxl: 32px
```

---

## 🔄 组件状态流转

### LoadingState 状态
```
Initial → Loading → Success → Done
         ↓
         Error → Retry → Loading
```

### StepModal 状态
```
Step 1 → Validate → Step 2 → ... → Finish
  ↑                   ↓
  └─────── Back ──────┘
```

### ConfirmDialog 状态
```
Closed → Open → Confirm → Loading → Success/Error → Closed
                ↓
               Cancel → Closed
```

---

## 📊 组件组合模式

### Pattern 1: 标准列表页
```vue
<PageLayout>
  <PageHeader>
    <SearchBar />
    <ActionButton />
  </PageHeader>
  
  <FilterBar />
  
  <DataTable>
    <ActionDropdown />
  </DataTable>
  
  <StepModal />
  <ConfirmDialog />
</PageLayout>
```

### Pattern 2: Dashboard
```vue
<PageLayout>
  <PageHeader />
  
  <div class="dashboard">
    <InfoCard /> x 4
    <DataTable />
  </div>
</PageLayout>
```

### Pattern 3: 详情页
```vue
<PageLayout :sidebar="true">
  <template #sidebar>
    <FolderTree />
  </template>
  
  <Breadcrumb />
  <PageHeader>
    <ActionDropdown />
  </PageHeader>
  
  <DetailPanel />
</PageLayout>
```

### Pattern 4: 上传页
```vue
<PageLayout>
  <PageHeader />
  
  <UploadArea @click="showUploader" />
  
  <ResourceUploader
    v-model="uploaderVisible"
    @upload="handleUpload"
  />
  
  <LoadingState
    v-if="uploading"
    :progress="uploadProgress"
  />
</PageLayout>
```

---

## 🎭 动画效果

### 进入动画
```
Fade In:     0.3s ease-out
Slide Up:    0.3s ease-out
Slide Down:  0.3s ease-out
Scale:       0.3s ease-out
```

### 悬停动画
```
Transform Y: -2px ~ -4px
Shadow:      0 → 8px blur
Duration:    0.3s
```

### 加载动画
```
Spinner:  1.5s linear infinite
Dots:     1.4s ease-in-out infinite
Pulse:    1.5s ease-in-out infinite
Skeleton: 1.5s linear infinite
```

---

## 🧩 组件扩展性

### 1. Slot 扩展
```vue
<Component>
  <template #header>自定义头部</template>
  <template #default>主内容</template>
  <template #footer>底部内容</template>
</Component>
```

### 2. Props 配置
```vue
<Component
  :variant="'primary'"
  :size="'large'"
  :loading="true"
/>
```

### 3. 事件监听
```vue
<Component
  @click="handleClick"
  @change="handleChange"
  @submit="handleSubmit"
/>
```

### 4. Ref 暴露
```vue
<Component ref="compRef" />

<script setup>
const compRef = ref(null)
compRef.value.someMethod()
</script>
```

---

## 🎯 性能优化要点

### 懒加载
```javascript
const HeavyComponent = defineAsyncComponent(() =>
  import('@/components/common/HeavyComponent')
)
```

### 虚拟滚动
```vue
<DataTable :virtual="true" :height="600" />
```

### 防抖节流
```javascript
// 搜索防抖
<SearchBar
  v-model="keyword"
  :debounce="300"
/>
```

### 条件渲染
```vue
<!-- 用 v-if 而不是 v-show -->
<LoadingState v-if="loading" />
<DataTable v-else />
```

---

## 📐 布局技巧

### Flex 布局
```css
.container {
  display: flex;
  gap: 12px;
  align-items: center;
}
```

### Grid 布局
```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}
```

### 固定头部
```css
.header {
  position: sticky;
  top: 0;
  z-index: 100;
}
```

### 滚动区域
```css
.scroll-area {
  overflow-y: auto;
  max-height: calc(100vh - 200px);
}
```

---

## 🎨 主题定制示例

```css
/* light-theme.css */
:root {
  --bg-page: #ffffff;
  --bg-card: #f5f5f5;
  --text-primary: #333333;
  --border: #e0e0e0;
}

/* dark-theme.css */
:root {
  --bg-page: #141517;
  --bg-card: #1a1b1e;
  --text-primary: #e8eaed;
  --border: #35363a;
}
```

---

## 📚 学习路径

```
1️⃣ 新手入门
   └── 阅读 QUICK_START.md
   └── 运行示例代码
   └── 创建第一个页面

2️⃣ 进阶使用
   └── 学习组件组合
   └── 理解状态管理
   └── 掌握响应式

3️⃣ 高级定制
   └── 主题定制
   └── 组件扩展
   └── 性能优化

4️⃣ 团队协作
   └── 编写文档
   └── Code Review
   └── 最佳实践分享
```

---

## 🎊 祝您使用愉快！

有任何问题请查阅:
- 📖 [快速上手](./QUICK_START.md)
- 🔍 [快速查询表](./COMPONENT_QUICK_REFERENCE.md)
- 💡 [使用示例](./COMPONENT_USAGE_EXAMPLE.vue)

**Happy Coding! 🚀**
