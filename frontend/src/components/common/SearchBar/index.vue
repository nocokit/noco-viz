<template>
  <div class="search-bar">
    <div class="search-bar__left">
      <!-- 搜索框 -->
      <a-input
        v-model="searchModel"
        :placeholder="placeholder"
        clearable
        @input="handleInput"
        @clear="handleClear"
        class="search-bar__input"
      >
        <template #prefix>
          <Search />
        </template>
      </a-input>

      <!-- 筛选器 -->
      <div v-if="filters.length > 0" class="search-bar__filters">
        <template v-for="filter in filters" :key="filter.key">
          <a-select
            v-if="filter.type === 'select' || !filter.type"
            v-model="filterValues[filter.key]"
            :placeholder="filter.label"
            clearable
            @change="handleFilterChange"
            class="search-bar__filter-item"
          >
            <a-select-option
              v-for="option in filter.options"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </a-select>

          <a-date-picker
            v-else-if="filter.type === 'date'"
            v-model="filterValues[filter.key]"
            type="date"
            :placeholder="filter.label"
            clearable
            @change="handleFilterChange"
            class="search-bar__filter-item"
          />

          <a-date-picker
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
import { SearchOutlined } from '@ant-design/icons-vue'
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

