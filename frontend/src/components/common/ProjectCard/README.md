# ProjectCard 项目卡片组件

## 📝 组件说明

统一的项目/模板/媒体卡片组件,支持封面、悬浮操作、状态标签等功能。

## 🎯 使用场景

- ProjectList - 项目卡片展示
- TemplateLibrary - 模板卡片展示
- MediaLibrary - 媒体文件卡片
- CustomComponents - 自定义组件卡片

## 📦 基础用法

```vue
<template>
  <ProjectCard
    title="我的数据大屏"
    description="销售数据可视化展示"
    type="screen"
    status="published"
    :cover="coverImage"
    @click="handleClick"
  />
</template>

<script setup>
import { ProjectCard } from '@/components/common'

const handleClick = () => {
  console.log('卡片被点击')
}
</script>
```

## 🔧 Props

### 基础属性

| 参数 | 说明 | 类型 | 默认值 | 必填 |
|------|------|------|--------|------|
| title | 标题 | String | - | ✅ |
| description | 描述 | String | '' | ❌ |
| cover | 封面图URL | String | '' | ❌ |

### 类型和状态

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| type | 类型 | String | screen/report/template/media/default | 'default' |
| status | 状态 | String | draft/published/archived | 'draft' |

### 元信息

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| meta | 元信息对象 | Object | null |
| meta.author | 作者 | String | - |
| meta.updatedAt | 更新时间 | Date/String/Number | - |
| meta.views | 浏览次数 | Number | - |

### 角标

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| badge | 角标对象 | Object | null |
| badge.text | 角标文字 | String | - |
| badge.type | 角标类型 | String | default/new/hot |

### 操作

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| actions | 下拉菜单操作 | Array | [] |
| primaryAction | 主要操作 | Object | null |
| secondaryAction | 次要操作 | Object | null |

### 显示控制

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| showOverlay | 显示悬浮层 | Boolean | true |
| showStatus | 显示状态标签 | Boolean | true |
| hoverable | 悬浮效果 | Boolean | true |

### 图标

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| typeIcon | 类型图标 | Component | null |
| placeholderIcon | 占位图标 | Component | null |

## 📤 Events

| 事件名 | 说明 | 参数 |
|--------|------|------|
| click | 卡片点击 | - |
| action | 下拉菜单操作 | command: String |
| primary-action | 主要操作 | - |
| secondary-action | 次要操作 | - |

## 🎨 Slots

| 插槽名 | 说明 |
|--------|------|
| overlay | 自定义悬浮层内容 |
| actions | 自定义操作区域 |
| meta | 自定义元信息 |
| footer | 自定义底部内容 |

## 💡 完整示例

### 示例1: 基础卡片

```vue
<ProjectCard
  title="销售数据大屏"
  description="2024年全国销售数据实时展示"
  type="screen"
  status="published"
  cover="https://example.com/cover.jpg"
/>
```

### 示例2: 带操作的卡片

```vue
<ProjectCard
  title="销售数据大屏"
  type="screen"
  :primary-action="{
    text: '进入编辑器',
    handler: () => router.push('/editor')
  }"
  :secondary-action="{
    text: '预览',
    handler: () => handlePreview()
  }"
  :actions="[
    { label: '编辑', command: 'edit' },
    { label: '复制', command: 'duplicate' },
    { label: '删除', command: 'delete', divided: true }
  ]"
  @action="handleAction"
/>
```

### 示例3: 带元信息的卡片

```vue
<ProjectCard
  title="销售数据大屏"
  :meta="{
    author: '张三',
    updatedAt: Date.now(),
    views: 128
  }"
/>
```

### 示例4: 带角标的卡片

```vue
<ProjectCard
  title="新功能模板"
  :badge="{
    text: 'NEW',
    type: 'new'
  }"
/>
```

### 示例5: 自定义图标

```vue
<script setup>
import { Monitor, Picture } from '@element-plus/icons-vue'
</script>

<template>
  <ProjectCard
    title="数据大屏"
    type="screen"
    :type-icon="Monitor"
    :placeholder-icon="Picture"
  />
</template>
```

### 示例6: 自定义插槽

```vue
<ProjectCard title="项目名称">
  <!-- 自定义悬浮层 -->
  <template #overlay>
    <div class="custom-overlay">
      <button>自定义按钮1</button>
      <button>自定义按钮2</button>
    </div>
  </template>

  <!-- 自定义元信息 -->
  <template #meta>
    <div>自定义元信息内容</div>
  </template>

  <!-- 自定义底部 -->
  <template #footer>
    <div class="tags">
      <span class="tag">标签1</span>
      <span class="tag">标签2</span>
    </div>
  </template>
</ProjectCard>
```

## 🎨 类型和样式

### 类型颜色

- `screen`: 紫色渐变 (#667eea → #764ba2)
- `report`: 粉色渐变 (#f093fb → #f5576c)
- `template`: 蓝色渐变 (#4facfe → #00f2fe)
- `media`: 绿色渐变 (#43e97b → #38f9d7)

### 状态颜色

- `draft`: 黄色 (草稿)
- `published`: 绿色 (已发布)
- `archived`: 灰色 (已归档)

## 📐 尺寸规范

- 封面比例: 16:9
- 内容padding: 16px
- 圆角: 8px
- 悬浮提升: 4px

## ⚙️ 最佳实践

### 1. 配合CardGrid使用

```vue
<CardGrid :items="projects" :columns="{ lg: 4, md: 3, sm: 2 }">
  <template #card="{ item }">
    <ProjectCard
      :title="item.title"
      :cover="item.cover"
      :type="item.type"
      @click="handleClick(item)"
    />
  </template>
</CardGrid>
```

### 2. 统一操作处理

```vue
<script setup>
const handleAction = (command, project) => {
  const actionMap = {
    edit: () => router.push(`/editor/${project.id}`),
    duplicate: () => duplicateProject(project),
    delete: () => deleteProject(project)
  }
  actionMap[command]?.()
}
</script>

<template>
  <ProjectCard
    v-for="project in projects"
    :key="project.id"
    :title="project.title"
    :actions="standardActions"
    @action="(cmd) => handleAction(cmd, project)"
  />
</template>
```

### 3. 响应式布局

```css
/* 移动端 */
@media (max-width: 768px) {
  .project-card {
    /* 单列布局 */
  }
}

/* 平板 */
@media (min-width: 768px) and (max-width: 1024px) {
  .project-card {
    /* 2-3列布局 */
  }
}

/* 桌面 */
@media (min-width: 1024px) {
  .project-card {
    /* 3-4列布局 */
  }
}
```

## 🔍 注意事项

1. **封面图优化**: 建议封面图尺寸 800x450px (16:9),格式webp
2. **描述文本**: 自动截断为2行,超出显示省略号
3. **操作菜单**: 建议操作不超过5个
4. **性能优化**: 大量卡片时配合虚拟滚动使用
5. **无障碍**: 确保所有操作都有键盘访问

## 🐛 常见问题

### Q: 如何自定义封面比例?
A: 修改 `.project-card__cover` 的 `padding-top` 值
- 16:9 = 56.25%
- 4:3 = 75%
- 1:1 = 100%

### Q: 如何禁用悬浮效果?
A: 设置 `hoverable="false"`

### Q: 如何隐藏悬浮层?
A: 设置 `show-overlay="false"`

### Q: 操作菜单如何分组?
A: 在actions数组中使用 `divided: true`

```javascript
actions: [
  { label: '编辑', command: 'edit' },
  { label: '复制', command: 'duplicate' },
  { label: '删除', command: 'delete', divided: true } // 分隔线
]
```

---

**组件版本**: v1.0.0
**最后更新**: 2026-01-03
**维护者**: 前端开发团队
