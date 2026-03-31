#!/usr/bin/env node

/**
 * 组件生成器 CLI 工具
 * 使用方法: npm run create-component <ComponentName>
 * 示例: npm run create-component MyButton
 */

const fs = require('fs')
const path = require('path')

// 获取组件名称
const componentName = process.argv[2]

if (!componentName) {
  console.error('❌ 错误: 请提供组件名称')
  console.log('📖 使用方法: npm run create-component <ComponentName>')
  console.log('📝 示例: npm run create-component MyButton')
  process.exit(1)
}

// 验证组件名称
if (!/^[A-Z][a-zA-Z0-9]*$/.test(componentName)) {
  console.error('❌ 错误: 组件名称必须以大写字母开头，只能包含字母和数字')
  console.log('✅ 正确示例: MyButton, UserCard, DataTable')
  process.exit(1)
}

const componentsDir = path.join(__dirname, '../src/components/common')
const componentDir = path.join(componentsDir, componentName)

// 检查组件是否已存在
if (fs.existsSync(componentDir)) {
  console.error(`❌ 错误: 组件 ${componentName} 已存在`)
  process.exit(1)
}

console.log(`\n🚀 开始创建组件: ${componentName}...\n`)

// 创建组件目录
fs.mkdirSync(componentDir, { recursive: true })

// 组件模板
const componentTemplate = `<template>
  <div :class="['${componentName.toLowerCase()}', \`${componentName.toLowerCase()}--\${variant}\`]">
    <slot></slot>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // 组件变体
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'primary', 'success', 'warning', 'danger'].includes(value)
  },
  // 组件尺寸
  size: {
    type: String,
    default: 'default',
    validator: (value) => ['small', 'default', 'large'].includes(value)
  },
  // 是否禁用
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click', 'change'])

// 组件方法
const handleClick = (event) => {
  if (!props.disabled) {
    emit('click', event)
  }
}

// 暴露方法给父组件
defineExpose({
  // 在这里暴露需要的方法
})
</script>

<style scoped>
.${componentName.toLowerCase()} {
  /* 基础样式 */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 20px;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.3s;
  cursor: pointer;
}

/* 变体样式 */
.${componentName.toLowerCase()}--default {
  background: var(--bg-card, #1a1b1e);
  color: var(--text-primary, #e8eaed);
}

.${componentName.toLowerCase()}--primary {
  background: var(--el-color-primary);
  color: #ffffff;
}

/* 尺寸样式 */
.${componentName.toLowerCase()}--small {
  padding: 8px 16px;
  font-size: 12px;
}

.${componentName.toLowerCase()}--large {
  padding: 16px 24px;
  font-size: 16px;
}

/* 禁用状态 */
.${componentName.toLowerCase()}[disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 响应式 */
@media (max-width: 768px) {
  .${componentName.toLowerCase()} {
    padding: 10px 16px;
    font-size: 13px;
  }
}
</style>
`

// README 模板
const readmeTemplate = `# ${componentName}

## 描述

${componentName} 组件的简要描述。

## 使用示例

### 基础用法

\`\`\`vue
<template>
  <${componentName}>内容</${componentName}>
</template>

<script setup>
import ${componentName} from '@/components/common/${componentName}'
</script>
\`\`\`

### 高级用法

\`\`\`vue
<${componentName}
  variant="primary"
  size="large"
  @click="handleClick"
>
  内容
</${componentName}>
\`\`\`

## Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| variant | String | 'default' | 组件变体 |
| size | String | 'default' | 组件尺寸 |
| disabled | Boolean | false | 是否禁用 |

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| click | event | 点击时触发 |
| change | value | 值改变时触发 |

## Slots

| 插槽名 | 说明 |
|--------|------|
| default | 默认内容 |

## 方法

| 方法名 | 参数 | 说明 |
|--------|------|------|
| - | - | - |

## 更新日志

- 2026-01-04: 创建组件
`

// 测试模板
const testTemplate = `import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ${componentName} from '../index.vue'

describe('${componentName}', () => {
  it('renders properly', () => {
    const wrapper = mount(${componentName}, {
      slots: {
        default: 'Test Content'
      }
    })
    expect(wrapper.text()).toContain('Test Content')
  })

  it('emits click event', async () => {
    const wrapper = mount(${componentName})
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })

  it('applies variant class', () => {
    const wrapper = mount(${componentName}, {
      props: { variant: 'primary' }
    })
    expect(wrapper.classes()).toContain('${componentName.toLowerCase()}--primary')
  })

  it('disables interactions when disabled', () => {
    const wrapper = mount(${componentName}, {
      props: { disabled: true }
    })
    expect(wrapper.attributes('disabled')).toBeDefined()
  })
})
`

// 写入文件
fs.writeFileSync(path.join(componentDir, 'index.vue'), componentTemplate)
fs.writeFileSync(path.join(componentDir, 'README.md'), readmeTemplate)
fs.writeFileSync(path.join(componentDir, `${componentName}.test.js`), testTemplate)

console.log('✅ 组件文件创建成功:')
console.log(`   📄 ${componentDir}/index.vue`)
console.log(`   📄 ${componentDir}/README.md`)
console.log(`   📄 ${componentDir}/${componentName}.test.js`)

// 更新 index.js
const indexPath = path.join(componentsDir, 'index.js')
let indexContent = fs.readFileSync(indexPath, 'utf-8')

// 添加导入
const importLine = `import ${componentName} from './${componentName}/index.vue'\n`
const lastImportIndex = indexContent.lastIndexOf('import ')
const insertPosition = indexContent.indexOf('\n', lastImportIndex) + 1
indexContent = indexContent.slice(0, insertPosition) + importLine + indexContent.slice(insertPosition)

// 添加导出
const exportMatch = indexContent.match(/export \{([^}]+)\}/)
if (exportMatch) {
  const exports = exportMatch[1].trim()
  const newExports = exports + `,\n  ${componentName}`
  indexContent = indexContent.replace(/export \{([^}]+)\}/, `export {\n  ${newExports}\n}`)
}

// 添加注册
const installMatch = indexContent.match(/install\(app\) \{([^}]+)\}/)
if (installMatch) {
  const installs = installMatch[1]
  const lastInstallIndex = installs.lastIndexOf('app.component')
  const insertPos = indexContent.indexOf('\n', indexContent.indexOf(installs) + lastInstallIndex) + 1
  const registerLine = `    app.component('${componentName}', ${componentName})\n`
  indexContent = indexContent.slice(0, insertPos) + registerLine + indexContent.slice(insertPos)
}

fs.writeFileSync(indexPath, indexContent)

console.log('\n✅ 已更新组件注册: src/components/common/index.js')

console.log('\n🎉 组件创建完成！')
console.log('\n📝 下一步:')
console.log(`   1. 编辑 ${componentDir}/index.vue 实现组件功能`)
console.log(`   2. 更新 ${componentDir}/README.md 完善文档`)
console.log(`   3. 运行 npm test 测试组件`)
console.log(`   4. 在页面中使用: <${componentName} />`)
console.log('\n💡 提示: 组件已自动注册，可以直接在任何页面使用\n')
