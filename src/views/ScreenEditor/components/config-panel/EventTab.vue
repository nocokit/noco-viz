<!--
  事件配置Tab组件
  配置组件的交互事件
-->
<template>
  <div class="event-tab">
    <!-- 事件列表 -->
    <div class="config-section">
      <div class="section-title">
        <span>事件列表</span>
        <el-button size="small" text @click="addEvent">+ 添加事件</el-button>
      </div>

      <div v-if="events.length === 0" class="empty-state">
        暂无事件，点击上方按钮添加
      </div>

      <div v-for="(event, index) in events" :key="index" class="event-item">
        <div class="event-header">
          <div class="event-info">
            <span class="event-index">{{ index + 1 }}</span>
            <span class="event-type">{{ getEventTypeName(event.type) }}</span>
          </div>
          <div class="event-actions">
            <el-button size="small" text @click="editEvent(index)">编辑</el-button>
            <el-button size="small" text type="danger" @click="removeEvent(index)">删除</el-button>
          </div>
        </div>

        <div class="event-content">
          <div class="config-row">
            <div class="config-item full-width">
              <label>触发事件</label>
              <el-select v-model="event.type" @change="handleChange">
                <el-option label="点击" value="click" />
                <el-option label="双击" value="dblclick" />
                <el-option label="鼠标悬停" value="mouseenter" />
                <el-option label="鼠标离开" value="mouseleave" />
                <el-option label="数据更新" value="dataUpdate" />
              </el-select>
            </div>
          </div>

          <div class="config-row">
            <div class="config-item full-width">
              <label>动作类型</label>
              <el-select v-model="event.action" @change="handleChange">
                <el-option label="跳转链接" value="navigate" />
                <el-option label="显示/隐藏组件" value="toggleVisibility" />
                <el-option label="刷新数据" value="refreshData" />
                <el-option label="执行脚本" value="runScript" />
                <el-option label="打开弹窗" value="openDialog" />
                <el-option label="发送请求" value="sendRequest" />
              </el-select>
            </div>
          </div>

          <!-- 跳转链接配置 -->
          <div v-if="event.action === 'navigate'" class="config-row">
            <div class="config-item full-width">
              <label>目标链接</label>
              <el-input
                v-model="event.url"
                placeholder="https://example.com"
                @change="handleChange"
              />
            </div>
          </div>

          <!-- 显示/隐藏组件配置 -->
          <div v-if="event.action === 'toggleVisibility'" class="config-row">
            <div class="config-item full-width">
              <label>目标组件ID</label>
              <el-input
                v-model="event.targetId"
                placeholder="组件ID"
                @change="handleChange"
              />
            </div>
          </div>

          <!-- 执行脚本配置 -->
          <div v-if="event.action === 'runScript'" class="config-row">
            <div class="config-item full-width">
              <label>脚本代码</label>
              <el-input
                v-model="event.script"
                type="textarea"
                :rows="5"
                placeholder="function(component, event) { console.log('执行脚本') }"
                @change="handleChange"
              />
            </div>
          </div>

          <!-- 打开弹窗配置 -->
          <div v-if="event.action === 'openDialog'" class="config-row">
            <div class="config-item full-width">
              <label>弹窗内容</label>
              <el-input
                v-model="event.dialogContent"
                type="textarea"
                :rows="3"
                placeholder="弹窗内容"
                @change="handleChange"
              />
            </div>
          </div>

          <!-- 发送请求配置 -->
          <div v-if="event.action === 'sendRequest'">
            <div class="config-row">
              <div class="config-item full-width">
                <label>请求地址</label>
                <el-input
                  v-model="event.requestUrl"
                  placeholder="https://api.example.com"
                  @change="handleChange"
                />
              </div>
            </div>
            <div class="config-row">
              <div class="config-item full-width">
                <label>请求方法</label>
                <el-select v-model="event.requestMethod" @change="handleChange">
                  <el-option label="GET" value="GET" />
                  <el-option label="POST" value="POST" />
                  <el-option label="PUT" value="PUT" />
                  <el-option label="DELETE" value="DELETE" />
                </el-select>
              </div>
            </div>
          </div>

          <!-- 延迟执行 -->
          <div class="config-row">
            <div class="config-item">
              <label>延迟执行(毫秒)</label>
              <el-input-number
                v-model="event.delay"
                :min="0"
                :max="10000"
                @change="handleChange"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 全局事件设置 -->
    <div class="config-section">
      <div class="section-title">全局设置</div>

      <div class="config-row">
        <el-checkbox v-model="globalSettings.stopPropagation" @change="handleChange">
          阻止事件冒泡
        </el-checkbox>
      </div>

      <div class="config-row">
        <el-checkbox v-model="globalSettings.preventDefault" @change="handleChange">
          阻止默认行为
        </el-checkbox>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  component: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update'])

const events = ref([])
const globalSettings = ref({
  stopPropagation: false,
  preventDefault: false
})

// 监听组件变化
watch(
  () => props.component,
  (newComponent) => {
    if (newComponent?.events) {
      events.value = [...newComponent.events]
    }
    if (newComponent?.eventSettings) {
      Object.assign(globalSettings.value, newComponent.eventSettings)
    }
  },
  { immediate: true, deep: true }
)

const getEventTypeName = (type) => {
  const names = {
    click: '点击',
    dblclick: '双击',
    mouseenter: '鼠标悬停',
    mouseleave: '鼠标离开',
    dataUpdate: '数据更新'
  }
  return names[type] || type
}

const addEvent = () => {
  events.value.push({
    type: 'click',
    action: 'navigate',
    url: '',
    delay: 0
  })
  handleChange()
}

const editEvent = (index) => {
  // 编辑事件（当前已经是实时编辑）
  ElMessage.info(`编辑事件 ${index + 1}`)
}

const removeEvent = (index) => {
  events.value.splice(index, 1)
  handleChange()
  ElMessage.success('事件已删除')
}

const handleChange = () => {
  emit('update', {
    events: [...events.value],
    eventSettings: { ...globalSettings.value }
  })
}
</script>

<style scoped>
.event-tab {
  padding: 16px;
}

.config-section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 13px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.empty-state {
  padding: 40px 20px;
  text-align: center;
  color: rgba(255, 255, 255, 0.5);
  font-size: 13px;
}

.event-item {
  margin-bottom: 16px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
}

.event-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.event-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.event-index {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #409eff;
  color: #fff;
  border-radius: 50%;
  font-size: 12px;
  font-weight: 500;
}

.event-type {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
}

.event-actions {
  display: flex;
  gap: 8px;
}

.event-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.config-row {
  display: flex;
  gap: 12px;
}

.config-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.config-item.full-width {
  flex: 1 1 100%;
}

.config-item label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
}

:deep(.el-select),
:deep(.el-input-number) {
  width: 100%;
}

:deep(.el-textarea__inner),
:deep(.el-input__inner) {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
  color: #fff;
}

:deep(.el-checkbox) {
  color: rgba(255, 255, 255, 0.8);
}
</style>
