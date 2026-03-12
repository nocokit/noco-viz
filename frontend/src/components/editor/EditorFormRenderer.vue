<!--
  编辑器表单渲染器
  基于 JSON 配置动态渲染表单，使用 Ant Design Vue 组件

  用途：用于渲染扁平数组结构的表单配置，支持高级功能
  Schema 格式：[{ title, fields: [{ key, type, label, props }] }]

  特性：
  - 支持分段控制（segmented）
  - 支持网格布局（grid）
  - 支持自定义标签后缀
  - 使用自定义 Editor 控件组件

  如果只需要简单的嵌套对象配置，可以使用 ConfigFormRenderer.vue
-->
<template>
  <div class="editor-form-renderer">
    <template v-for="(section, sectionIndex) in schema" :key="sectionIndex">
      <EditorFormSection
        :title="section.title"
        :collapsible="section.collapsible"
        :defaultCollapsed="section.defaultCollapsed"
        :divider="section.divider"
      >
        <!-- 分段控制 (按钮组) -->
        <template v-if="section.segmented && section.segments">
          <div class="segment-control">
            <a-radio-group
              v-model:value="segmentValues[sectionIndex]"
              button-style="solid"
            >
              <a-radio-button
                v-for="segment in section.segments"
                :key="segment.value"
                :value="segment.value"
              >
                {{ segment.label }}
              </a-radio-button>
            </a-radio-group>
          </div>

          <!-- 渲染当前选中的分段内容 -->
          <template v-for="(segment, segmentIndex) in section.segments" :key="segmentIndex">
            <template v-if="segmentValues[sectionIndex] === segment.value">
              <template v-for="(field, fieldIndex) in segment.fields" :key="fieldIndex">
                <EditorFormField :label="field.label" :inline="field.inline">
                  <component
                    :is="getControlComponent(field.type)"
                    v-model="modelValue[field.key]"
                    v-bind="field.props"
                    @update:modelValue="handleUpdate(field.key, $event)"
                  />
                </EditorFormField>
              </template>
            </template>
          </template>
        </template>

        <!-- 网格布局 -->
        <template v-else-if="section.grid">
          <EditorFormGrid :columns="section.grid.columns || 2">
            <template v-for="(field, fieldIndex) in section.fields" :key="fieldIndex">
              <EditorFormField :label="field.label" grid>
                <component
                  :is="getControlComponent(field.type)"
                  v-model="modelValue[field.key]"
                  v-bind="field.props"
                  @update:modelValue="handleUpdate(field.key, $event)"
                />
              </EditorFormField>
            </template>
          </EditorFormGrid>
        </template>

        <!-- 普通布局 -->
        <template v-else>
          <template v-for="(field, fieldIndex) in section.fields" :key="fieldIndex">
            <EditorFormField :label="field.label" :inline="field.inline">
              <!-- 标签后缀插槽 -->
              <template v-if="field.labelSuffix" #label-suffix>
                <component :is="field.labelSuffix.component" v-bind="field.labelSuffix.props" />
              </template>

              <!-- 控件 -->
              <component
                :is="getControlComponent(field.type)"
                v-model="modelValue[field.key]"
                v-bind="field.props"
                @update:modelValue="handleUpdate(field.key, $event)"
              />
            </EditorFormField>
          </template>
        </template>
      </EditorFormSection>
    </template>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import EditorFormSection from './EditorFormSection.vue'
import EditorFormField from './EditorFormField.vue'
import EditorFormGrid from './EditorFormGrid.vue'
import EditorInput from './EditorInput.vue'
import EditorInputNumber from './EditorInputNumber.vue'
import EditorColorPicker from './EditorColorPicker.vue'
import EditorSlider from './EditorSlider.vue'
import EditorSelect from './EditorSelect.vue'
import EditorSwitch from './EditorSwitch.vue'

const props = defineProps({
  schema: {
    type: Array,
    required: true
  },
  modelValue: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

// 分段控制的当前值
const segmentValues = ref({})

// 初始化分段值
watch(() => props.schema, (newSchema) => {
  newSchema.forEach((section, index) => {
    if (section.segmented && section.segments && section.segments.length > 0) {
      if (!segmentValues.value[index]) {
        segmentValues.value[index] = section.segments[0].value
      }
    }
  })
}, { immediate: true })

// 控件类型映射
const controlComponents = {
  input: EditorInput,
  number: EditorInputNumber,
  color: EditorColorPicker,
  slider: EditorSlider,
  select: EditorSelect,
  switch: EditorSwitch
}

const getControlComponent = (type) => {
  return controlComponents[type] || EditorInput
}

const handleUpdate = (key, value) => {
  emit('update:modelValue', {
    ...props.modelValue,
    [key]: value
  })
}
</script>

<style scoped>
.editor-form-renderer {
  /* 移除 padding,由父容器控制 */
}

.segment-control {
  margin-bottom: 16px;
}

.segment-control :deep(.ant-radio-group) {
  display: flex;
  width: 100%;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 4px;
  padding: 2px;
}

.segment-control :deep(.ant-radio-button-wrapper) {
  flex: 1;
  text-align: center;
  font-size: 12px;
  height: 28px;
  line-height: 26px;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.55);
  transition: all 0.2s ease;
  border-radius: 3px;
}

.segment-control :deep(.ant-radio-button-wrapper:hover) {
  color: rgba(255, 255, 255, 0.75);
  background: rgba(255, 255, 255, 0.03);
}

.segment-control :deep(.ant-radio-button-wrapper-checked) {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.95);
  font-weight: 500;
}

.segment-control :deep(.ant-radio-button-wrapper-checked:hover) {
  color: rgba(255, 255, 255, 1);
  background: rgba(255, 255, 255, 0.12);
}

.segment-control :deep(.ant-radio-button-wrapper::before) {
  display: none;
}

.segment-control :deep(.ant-radio-button-wrapper:not(:first-child)::before) {
  display: none;
}

.segment-control :deep(.ant-radio-button-wrapper:first-child) {
  border-radius: 3px 0 0 3px;
}

.segment-control :deep(.ant-radio-button-wrapper:last-child) {
  border-radius: 0 3px 3px 0;
}
</style>
