<template>
  <div class="search-bar">
    <div class="search-bar__left">
      <!-- 搜索框 -->
      <el-input
        v-model="searchModel"
        :placeholder="placeholder"
        clearable
        @input="handleInput"
        @clear="handleClear"
        class="search-bar__input"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>

      <!-- 筛选器 -->
      <div v-if="filters.length > 0" class="search-bar__filters">
        <template v-for="filter in filters" :key="filter.key">
          <el-select
            v-if="filter.type === 'select' || !filter.type"
            v-model="filterValues[filter.key]"
            :placeholder="filter.label"
            clearable
            @change="handleFilterChange"
            class="search-bar__filter-item"
          >
            <el-option
              v-for="option in filter.options"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>

          <el-date-picker
            v-else-if="filter.type === 'date'"
            v-model="filterValues[filter.key]"
            type="date"
            :placeholder="filter.label"
            clearable
            @change="handleFilterChange"
            class="search-bar__filter-item"
          />

          <el-date-picker
            v-else-if="filter.type === 'daterange'"
            v-model="filterValues[filter.key]"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            clearable
            @change="handleFilterChange"
            class="search-bar__filter-item"
          />
        </template>
      </div>

      <!-- 统计信息 -->
      <div v-if="stats" class="search-bar__stats">
        <span v-for="(value, key) in stats" :key="key" class="stat-item">
          {{ key }}: <strong>{{ value }}</strong>
        </span>
      </div>
    </div>

    <div class="search-bar__right">
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { debounce } from '@/utils/debounce'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: '搜索...'
  },
  filters: {
    type: Array,
    default: () => []
  },
  stats: {
    type: Object,
    default: null
  },
  debounceTime: {
    type: Number,
    default: 300
  }
})

const emit = defineEmits(['update:modelValue', 'search', 'filter-change', 'clear'])

const searchModel = ref(props.modelValue)
const filterValues = reactive({})

// 初始化筛选器默认值
props.filters.forEach(filter => {
  filterValues[filter.key] = filter.defaultValue || ''
})

watch(() => props.modelValue, (val) => {
  searchModel.value = val
})

const handleInput = debounce((value) => {
  emit('update:modelValue', searchModel.value)
  emit('search', searchModel.value, filterValues)
}, props.debounceTime)

const handleFilterChange = () => {
  emit('filter-change', filterValues)
  emit('search', searchModel.value, filterValues)
}

const handleClear = () => {
  emit('update:modelValue', '')
  emit('clear')
  emit('search', '', filterValues)
}

defineExpose({
  filterValues,
  reset: () => {
    searchModel.value = ''
    Object.keys(filterValues).forEach(key => {
      filterValues[key] = ''
    })
  }
})
</script>

<style scoped>
.search-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: var(--bg-card, #1a1b1e);
  border-radius: 8px;
  margin-bottom: 16px;
}

.search-bar__left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  flex-wrap: wrap;
}

.search-bar__input {
  width: 300px;
}

.search-bar__filters {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.search-bar__filter-item {
  width: 200px;
}

.search-bar__stats {
  display: flex;
  gap: 16px;
  font-size: 14px;
  color: var(--text-secondary, #9aa0a6);
}

.stat-item strong {
  color: var(--text-primary, #e8eaed);
  font-weight: 600;
}

.search-bar__right {
  display: flex;
  gap: 12px;
}

@media (max-width: 768px) {
  .search-bar {
    flex-direction: column;
    align-items: stretch;
  }

  .search-bar__left {
    flex-direction: column;
    align-items: stretch;
  }

  .search-bar__input,
  .search-bar__filter-item {
    width: 100%;
  }
}
</style>
