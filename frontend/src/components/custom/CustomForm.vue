<template>
  <div class="custom-form">
    <a-form
      ref="formRef"
      :model="formData"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      :layout="config?.layout || 'vertical'"
    >
      <a-row :gutter="config?.gutter || 16">
        <a-col
          v-for="field in (config?.fields || [])"
          :key="field.name || field.key"
          :span="field.span || config?.defaultSpan || 24"
          :xs="field.xs || 24"
          :sm="field.sm"
          :md="field.md"
          :lg="field.lg"
        >
          <a-form-item
            :label="field.label"
            :name="fieldKey(field)"
            :rules="getFieldRules(field)"
            :extra="field.extra"
            :help="field.help"
          >
            <!-- Input Field -->
            <a-input
              v-if="field.type === 'input' || field.type === 'text' || !field.type"
              v-model:value="formData[fieldKey(field)]"
              :placeholder="field.placeholder"
              :maxlength="field.maxlength"
              :disabled="field.disabled"
              :allow-clear="field.clearable !== false"
              :prefix="field.prefix"
              :suffix="field.suffix"
              :addon-before="field.addonBefore"
              :addon-after="field.addonAfter"
            />

            <!-- Password Field -->
            <a-input-password
              v-else-if="field.type === 'password'"
              v-model:value="formData[fieldKey(field)]"
