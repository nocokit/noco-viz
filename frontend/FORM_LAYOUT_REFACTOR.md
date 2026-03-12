# 表单布局重构 - Inline 布局

## 修改内容

将右侧配置面板的表单字段从**垂直布局**（label 在上，control 在下）改为**水平布局**（label 和 control 在同一行）。

## 修改文件

### 1. `EditorFormField.vue` - 优化样式
- **inline 布局**：调整 label 宽度 `60px` → `70px`，添加 `max-width` 限制
- **grid 布局**：改为 flex 布局，label 和 input 在同一行，label 宽度 `24px`

### 2. `formSchemas.js` - 添加 inline 配置

#### ✅ basicComponentSchema
- 组件ID
- 组件名称

#### ✅ componentFormSchemaFlat
- 组件ID
- 组件名称
- 背景色
- 边框颜色

#### ✅ fullComponentSchema
**基础信息：**
- 组件ID
- 组件名称

**颜色和背景：**
- 背景色
- 边框颜色
- 边框宽度
- 圆角

**字体配置（所有分段）：**
- 标题字体：字号、颜色、粗细
- Label字体：字号、颜色
- 显示字体：字号、颜色、粗细

## 效果对比

### 修改前（垂直布局）
```
组件ID
[1773210516464]

组件名称
[漏斗图]

W          H
[350]      [350]

背景色
[transparent]
```

### 修改后（水平布局）
```
组件ID      [1773210516464]
组件名称    [漏斗图]

W [350]    H [350]
X [23]     Y [26]

背景色      [transparent]
边框颜色    [#3b82f6]
边框宽度    [0]
圆角        [4]

字号        [16]
颜色        [#000000]
粗细        [normal]
```

## 布局规则

### ✅ 适合使用 inline 布局的字段：
- 文本输入框（input）
- 数字输入框（number）- 单独使用时
- 颜色选择器（color）
- 下拉选择（select）
- 开关（switch）

### ❌ 不适合使用 inline 布局的字段：
- 滑块（slider）- 需要更多水平空间
- 多行文本（textarea）
- 复杂组件

### 🔲 Grid 布局字段（W/H/X/Y）：
- 使用 `grid` 属性，自动应用 inline 样式
- Label 宽度更小（24px），适合单字母标签

## 使用方法

### 单行 inline 布局
```javascript
{
  label: '组件名称',
  key: 'name',
  type: 'input',
  inline: true,  // 👈 添加这个属性
  props: {
    placeholder: '请输入组件名称'
  }
}
```

### Grid 布局（自动 inline）
```javascript
{
  title: '布局与变换',
  grid: { columns: 2 },  // 👈 使用 grid 布局
  fields: [
    {
      label: 'W',
      key: 'w',
      type: 'number',
      // 不需要添加 inline，grid 字段自动应用
      props: { min: 1, step: 1 }
    }
  ]
}
```

## 样式变量

### Inline 布局
```css
.field-inline {
  display: flex;
  align-items: center;
  gap: 12px;
}

.field-inline .field-label {
  min-width: 70px;
  max-width: 70px;
  flex-shrink: 0;
}

.field-inline .field-control {
  flex: 1;
  min-width: 0;
}
```

### Grid 布局
```css
.field-grid {
  display: flex;
  align-items: center;
  gap: 8px;
}

.field-grid .field-label {
  min-width: 24px;  /* 更小的 label 宽度 */
  font-size: 11px;
}

.field-grid .field-control {
  flex: 1;
  min-width: 0;
}
```

## 注意事项

1. **Label 宽度**：
   - 普通 inline：70px（适合中文标签）
   - Grid inline：24px（适合单字母标签如 W/H/X/Y）

2. **不要对 slider 使用 inline**，会导致滑块空间不足

3. **Grid 布局字段自动应用 inline 样式**，无需手动添加 `inline: true`

4. **数字输入框**：
   - 单独使用时：添加 `inline: true`
   - 在 grid 中：不需要添加

---

修改完成后，刷新页面即可看到效果。所有配置项现在都使用统一的 inline 布局！✅

