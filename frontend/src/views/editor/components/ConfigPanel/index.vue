<template>
  <aside class="config-panel">
    <!-- 顶部 Tabs -->
    <div class="panel-tabs">
      <div
        :class="['tab-item', { active: configTab === 'style', disabled: !selectedComponent }]"
        @click="selectedComponent && (configTab = 'style')"
      >样式</div>
      <div
        :class="['tab-item', { active: configTab === 'data', disabled: !selectedComponent }]"
        @click="selectedComponent && (configTab = 'data')"
      >数据</div>
      <div
        :class="['tab-item', { active: configTab === 'event', disabled: !selectedComponent }]"
        @click="selectedComponent && (configTab = 'event')"
      >事件</div>
      <div
        :class="['tab-item', { active: configTab === 'animation', disabled: !selectedComponent }]"
        @click="selectedComponent && (configTab = 'animation')"
      >动画</div>
      <div
        :class="['tab-item', { active: configTab === 'page' }]"
        @click="configTab = 'page'"
      >页面</div>
    </div>

    <div class="panel-content">
      <!-- Tab 1: 样式配置 -->
      <div v-show="configTab === 'style'" v-if="selectedComponent">
        <StyleTab v-model="componentData" />
      </div>

      <!-- Tab 2: 数据 -->
      <div v-show="configTab === 'data'" v-if="selectedComponent">
        <DataTab v-model="componentData" />
      </div>

      <!-- Tab 3: 交互事件 -->
      <div v-show="configTab === 'event'" v-if="selectedComponent">
        <EventTab v-model="componentData" />
      </div>

      <!-- Tab 4: 动画效果 -->
      <div v-show="configTab === 'animation'" v-if="selectedComponent">
        <AnimationTab v-model="componentData" />
      </div>

      <!-- Tab 5: 页面配置 -->
      <div v-show="configTab === 'page'">
        <PageTab v-model="pageConfigData" />
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import StyleTab from './StyleTab.vue'
import DataTab from './DataTab.vue'
import EventTab from './EventTab.vue'
import AnimationTab from './AnimationTab.vue'
import PageTab from './PageTab.vue'

const props = defineProps({
  selectedComponent: {
    type: Object,
    default: null
  },
  pageConfig: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:selectedComponent', 'update:pageConfig'])

// 当前激活的配置标签
const configTab = ref('page')

// 监听组件选中状态，自动切换配置面板
watch(() => props.selectedComponent, (newVal) => {
  if (newVal) {
    // 选中组件时，切换到样式配置
    configTab.value = 'style'
  } else {
    // 取消选中时，切换到页面配置
    configTab.value = 'page'
  }
})

// 组件数据的双向绑定
const componentData = computed({
  get: () => props.selectedComponent,
  set: (value) => {
    emit('update:selectedComponent', value)
  }
})

// 页面配置的双向绑定
const pageConfigData = computed({
  get: () => props.pageConfig,
  set: (value) => {
    emit('update:pageConfig', value)
  }
})
</script>

