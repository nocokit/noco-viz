<!--
  图表配置面板 - 分组布局
  用于图表组件的高级配置交互
-->
<template>
  <div class="chart-config-panel">
    <!-- 空状态 -->
    <div v-if="tabs.length === 0" class="empty-state">
      <p>暂无配置项</p>
    </div>

    <!-- 所有分组展开显示 -->
    <template v-for="tab in tabs" :key="tab.key">
      <EditorFormSection
        :title="tab.label"
        :divider="true"
        :collapsible="false"
      >
        <template v-for="(field, index) in tab.fields" :key="index">
          <!-- 普通字段 -->
          <EditorFormField
            v-if="!field.isGroup"
            :label="field.label"
            inline
          >
            <component
              :is="getControlComponent(field.type)"
              :modelValue="getFieldValue(tab.key, field.key)"
              @update:modelValue="updateFieldValue(tab.key, field.key, $event)"
              v-bind="field.props"
            />
          </EditorFormField>

          <!-- 可展开分组 -->
          <div v-else class="expandable-group">
            <div
              class="group-header"
              @click="toggleGroup(tab.key, field.key)"
            >
              <svg
                class="expand-icon"
                :class="{ expanded: isGroupExpanded(tab.key, field.key) }"
                viewBox="0 0 24 24"
                width="16"
                height="16"
              >
                <path fill="currentColor" d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
              </svg>
              <span class="group-label">{{ field.label }}</span>
            </div>

            <!-- 展开的子字段 -->
            <div v-show="isGroupExpanded(tab.key, field.key)" class="group-content">
              <EditorFormField
                v-for="(subField, subIndex) in field.fields"
                :key="subIndex"
                :label="subField.label"
                inline
              >
                <component
                  :is="getControlComponent(subField.type)"
                  :modelValue="getFieldValue(tab.key, field.key, subField.key)"
                  @update:modelValue="updateFieldValue(tab.key, field.key, $event, subField.key)"
                  v-bind="subField.props"
                />
              </EditorFormField>
            </div>
          </div>
        </template>
      </EditorFormSection>
    </template>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import EditorFormSection from './EditorFormSection.vue'
import EditorFormField from './EditorFormField.vue'
import EditorSwitch from './EditorSwitch.vue'
import EditorInputNumber from './EditorInputNumber.vue'
import EditorInput from './EditorInput.vue'
import EditorColorPicker from './EditorColorPicker.vue'
import EditorSelect from './EditorSelect.vue'

const props = defineProps({
  schema: {
    type: Object,
    required: true
  },
  modelValue: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:modelValue'])

// 展开状态管理 { 'xAxis.axisLine': true }
const expandedGroups = ref({})

// 辅助函数：获取控件组件
const getControlComponent = (type) => {
  const components = {
    boolean: EditorSwitch,
    number: EditorInputNumber,
    string: EditorInput,
    color: EditorColorPicker,
    select: EditorSelect
  }
  return components[type] || EditorInput
}

// 辅助函数：获取控件属性
const getControlProps = (schema) => {
  const { label, type, ...props } = schema
  return props
}

// 将 schema 转换为标签页结构
const tabs = computed(() => {
  const tabList = []
  const tabLabels = {
    series: '图形',
    xAxis: 'X轴',
    yAxis: 'Y轴',
    legend: '图例',
    title: '标题',
    tooltip: '提示框',
    grid: '内边距'
  }

  Object.keys(props.schema).forEach(key => {
    const sectionSchema = props.schema[key]
    if (!sectionSchema.properties) return

    const fields = []

    // 遍历属性，构建字段列表
    Object.keys(sectionSchema.properties).forEach(propKey => {
      const propSchema = sectionSchema.properties[propKey]

      if (propSchema.type === 'object' && propSchema.properties) {
        // 嵌套对象 -> 可展开分组
        const subFields = []
        Object.keys(propSchema.properties).forEach(subKey => {
          const subSchema = propSchema.properties[subKey]
          if (subSchema.type === 'object' && subSchema.properties) {
            // 三层嵌套（如 axisLine.lineStyle）
            Object.keys(subSchema.properties).forEach(deepKey => {
              const deepSchema = subSchema.properties[deepKey]
              subFields.push({
                key: `${subKey}.${deepKey}`,
                label: deepSchema.label || deepKey,
                type: deepSchema.type,
                props: getControlProps(deepSchema)
              })
            })
          } else {
            subFields.push({
              key: subKey,
              label: subSchema.label || subKey,
              type: subSchema.type,
              props: getControlProps(subSchema)
            })
          }
        })

        fields.push({
          key: propKey,
          label: propSchema.label || propKey,
          isGroup: true,
          fields: subFields
        })
      } else {
        // 普通字段
        fields.push({
          key: propKey,
          label: propSchema.label || propKey,
          type: propSchema.type,
          isGroup: false,
          props: getControlProps(propSchema)
        })
      }
    })

    tabList.push({
      key,
      label: tabLabels[key] || key,
      fields
    })
  })

  return tabList
})

const getFieldValue = (tabKey, fieldKey, subKey) => {
  const tabValue = props.modelValue[tabKey] || {}
  if (subKey) {
    // 处理嵌套路径 (如 lineStyle.color)
    const keys = subKey.split('.')
    let value = tabValue[fieldKey]
    for (const key of keys) {
      value = value?.[key]
    }
    return value
  }
  return tabValue[fieldKey]
}

const updateFieldValue = (tabKey, fieldKey, value, subKey) => {
  const newValue = { ...props.modelValue }
  if (!newValue[tabKey]) {
    newValue[tabKey] = {}
  }

  if (subKey) {
    // 处理嵌套路径
    if (!newValue[tabKey][fieldKey]) {
      newValue[tabKey][fieldKey] = {}
    }
    const keys = subKey.split('.')
    let target = newValue[tabKey][fieldKey]
    for (let i = 0; i < keys.length - 1; i++) {
      if (!target[keys[i]]) {
        target[keys[i]] = {}
      }
      target = target[keys[i]]
    }
    target[keys[keys.length - 1]] = value
  } else {
    newValue[tabKey][fieldKey] = value
  }

  emit('update:modelValue', newValue)
}

const toggleGroup = (tabKey, groupKey) => {
  const key = `${tabKey}.${groupKey}`
  expandedGroups.value[key] = !expandedGroups.value[key]
}

const isGroupExpanded = (tabKey, groupKey) => {
  const key = `${tabKey}.${groupKey}`
  return expandedGroups.value[key] || false
}
</script>

<style scoped>
.chart-config-panel {
  display: flex;
  flex-direction: column;
  background: #1a1d24;
  border-radius: 4px;
  overflow: hidden;
  margin-top: 8px;
}

.vertical-tabs {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 2px;
  padding: 8px 8px 0;
  background: transparent;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.vertical-tabs .tab-item {
  padding: 4px 10px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.45);
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 3px;
  user-select: none;
  margin-bottom: 6px;
}

.vertical-tabs .tab-item:hover {
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.75);
}

.vertical-tabs .tab-item.active {
  background: rgba(22, 119, 255, 0.15);
  color: #1677ff;
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
  gap: 8px;
}

.expandable-group {
  margin-bottom: 6px;
}

.group-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  user-select: none;
}

.group-header:hover {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.12);
}

.expand-icon {
  flex-shrink: 0;
  color: rgba(255, 255, 255, 0.45);
  transition: transform 0.2s;
}

.expand-icon.expanded {
  transform: rotate(90deg);
}

.group-label {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.75);
  font-weight: 500;
}

.group-content {
  margin-top: 6px;
  padding-left: 24px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.empty-state {
  padding: 40px 20px;
  text-align: center;
  color: rgba(255, 255, 255, 0.35);
  font-size: 13px;
}
</style>
