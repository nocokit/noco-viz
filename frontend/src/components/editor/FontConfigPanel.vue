<!--
  字体配置面板 - 带左侧垂直标签页
  用于组件的字体配置交互
-->
<template>
  <div class="font-config-panel">
    <!-- 左侧垂直标签页 -->
    <div class="vertical-tabs">
      <div
        v-for="tab in tabs"
        :key="tab.key"
        :class="['tab-item', { active: activeTab === tab.key }]"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
      </div>
    </div>

    <!-- 右侧配置内容 -->
    <div class="tab-content">
      <template v-for="tab in tabs" :key="tab.key">
        <div v-show="activeTab === tab.key" class="content-section">
          <EditorFormField
            v-for="(field, index) in tab.fields"
            :key="index"
            :label="field.label"
            inline
          >
            <component
              :is="getControlComponent(field.type)"
              :modelValue="modelValue[field.key]"
              @update:modelValue="updateFieldValue(field.key, $event)"
              v-bind="field.props"
            />
          </EditorFormField>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import EditorFormField from './EditorFormField.vue'
import EditorInputNumber from './EditorInputNumber.vue'
import EditorColorPicker from './EditorColorPicker.vue'
import EditorSelect from './EditorSelect.vue'
import EditorTextAlign from './EditorTextAlign.vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:modelValue'])

// 当前激活的标签页
const activeTab = ref('title')

// 辅助函数：获取控件组件
const getControlComponent = (type) => {
  const components = {
    number: EditorInputNumber,
    color: EditorColorPicker,
    select: EditorSelect,
    textAlign: EditorTextAlign
  }
  return components[type] || EditorInputNumber
}

// 标签页配置
const tabs = [
  {
    key: 'title',
    label: '标题',
    fields: [
      { label: '字号', key: 'titleFontSize', type: 'number', props: { min: 10, max: 72, step: 1, suffix: 'px' } },
      { label: '颜色', key: 'titleColor', type: 'color', props: { placeholder: '#000000' } },
      { label: '粗细', key: 'titleFontWeight', type: 'select', props: {
        options: [
          { label: '正常', value: 'normal' }, { label: '粗体', value: 'bold' },
          { label: '100', value: '100' }, { label: '200', value: '200' }, { label: '300', value: '300' },
          { label: '400', value: '400' }, { label: '500', value: '500' }, { label: '600', value: '600' },
          { label: '700', value: '700' }, { label: '800', value: '800' }, { label: '900', value: '900' }
        ]
      }},
      { label: '对齐', key: 'titleTextAlign', type: 'textAlign' }
    ]
  },
  {
    key: 'body',
    label: '正文',
    fields: [
      { label: '字号', key: 'bodyFontSize', type: 'number', props: { min: 10, max: 48, step: 1, suffix: 'px' } },
      { label: '颜色', key: 'bodyColor', type: 'color', props: { placeholder: '#333333' } },
      { label: '粗细', key: 'bodyFontWeight', type: 'select', props: {
        options: [
          { label: '正常', value: 'normal' }, { label: '粗体', value: 'bold' },
          { label: '400', value: '400' }, { label: '500', value: '500' }, { label: '600', value: '600' }
        ]
      }}
    ]
  },
  {
    key: 'menu',
    label: '菜单',
    fields: [
      { label: '字号', key: 'menuFontSize', type: 'number', props: { min: 10, max: 24, step: 1, suffix: 'px' } },
      { label: '颜色', key: 'menuColor', type: 'color', props: { placeholder: '#333333' } }
    ]
  },
  {
    key: 'button',
    label: '按钮',
    fields: [
      { label: '字号', key: 'buttonFontSize', type: 'number', props: { min: 10, max: 24, step: 1, suffix: 'px' } },
      { label: '颜色', key: 'buttonColor', type: 'color', props: { placeholder: '#ffffff' } }
    ]
  },
  {
    key: 'hint',
    label: '提示',
    fields: [
      { label: '字号', key: 'hintFontSize', type: 'number', props: { min: 10, max: 18, step: 1, suffix: 'px' } },
      { label: '颜色', key: 'hintColor', type: 'color', props: { placeholder: '#999999' } }
    ]
  },
  {
    key: 'tag',
    label: 'Tag',
    fields: [
      { label: '字号', key: 'tagFontSize', type: 'number', props: { min: 10, max: 18, step: 1, suffix: 'px' } },
      { label: '颜色', key: 'tagColor', type: 'color', props: { placeholder: '#666666' } }
    ]
  },
  {
    key: 'tableHeader',
    label: 'Table标题',
    fields: [
      { label: '字号', key: 'tableHeaderFontSize', type: 'number', props: { min: 10, max: 24, step: 1, suffix: 'px' } },
      { label: '颜色', key: 'tableHeaderColor', type: 'color', props: { placeholder: '#000000' } },
      { label: '粗细', key: 'tableHeaderFontWeight', type: 'select', props: {
        options: [{ label: '正常', value: 'normal' }, { label: '粗体', value: 'bold' }, { label: '600', value: '600' }]
      }}
    ]
  },
  {
    key: 'tableBody',
    label: 'Table文本',
    fields: [
      { label: '字号', key: 'tableBodyFontSize', type: 'number', props: { min: 10, max: 24, step: 1, suffix: 'px' } },
      { label: '颜色', key: 'tableBodyColor', type: 'color', props: { placeholder: '#333333' } }
    ]
  }
]

const updateFieldValue = (key, value) => {
  emit('update:modelValue', {
    ...props.modelValue,
    [key]: value
  })
}
</script>

<style scoped>
.font-config-panel {
  display: flex;
  min-height: 300px;
  max-height: 500px;
  background: #1a1d24;
  border-radius: 4px;
  overflow: hidden;
  margin-top: 16px;
}

.vertical-tabs {
  width: 80px;
  background: rgba(0, 0, 0, 0.2);
  border-right: 1px solid rgba(255, 255, 255, 0.06);
  flex-shrink: 0;
}

.vertical-tabs .tab-item {
  padding: 16px 8px;
  text-align: center;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.55);
  cursor: pointer;
  transition: all 0.2s;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  user-select: none;
}

.vertical-tabs .tab-item:hover {
  background: rgba(255, 255, 255, 0.03);
  color: rgba(255, 255, 255, 0.75);
}

.vertical-tabs .tab-item.active {
  background: rgba(22, 119, 255, 0.15);
  color: #1677ff;
  border-left: 3px solid #1677ff;
  font-weight: 500;
}

.tab-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.content-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
