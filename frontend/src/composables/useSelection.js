/**
 * 列表选择逻辑 Composable
 */

import { ref, computed } from 'vue'

export function useSelection(dataSource) {
  const selectedIds = ref([])

  const isAllSelected = computed(() => {
    const source = dataSource.value || []
    return source.length > 0 && selectedIds.value.length === source.length
  })

  const toggleSelectAll = () => {
    const source = dataSource.value || []
    if (isAllSelected.value) {
      selectedIds.value = []
    } else {
      selectedIds.value = source.map(item => item.id)
    }
  }

  const toggleSelect = (id) => {
    const index = selectedIds.value.indexOf(id)
    if (index > -1) {
      selectedIds.value.splice(index, 1)
    } else {
      selectedIds.value.push(id)
    }
  }

  const clearSelection = () => {
    selectedIds.value = []
  }

  const selectedItems = computed(() => {
    const source = dataSource.value || []
    return source.filter(item => selectedIds.value.includes(item.id))
  })

  return {
    selectedIds,
    isAllSelected,
    selectedItems,
    toggleSelectAll,
    toggleSelect,
    clearSelection
  }
}
