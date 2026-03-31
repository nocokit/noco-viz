import { showMessage } from './useMessage'
import { getChartByType } from '@/config/chartComponents'
import { getComponentDefaults } from '@/config/componentDefaults'
import { getComponentSchema, getDefaultConfig } from '@/config/componentSchema'
import { mockBarData } from '@/components/charts/configs/barConfig'
import { mockLineData } from '@/components/charts/configs/lineConfig'
import { mockAreaData } from '@/components/charts/configs/areaConfig'
import { mockPieData } from '@/components/charts/configs/pieConfig'
import { mockFunnelData } from '@/components/charts/configs/funnelConfig'
import { mockGaugeData } from '@/components/charts/configs/gaugeConfig'
import { mockHeatmapData } from '@/components/charts/configs/heatmapConfig'
import { mockLiquidData } from '@/components/charts/configs/liquidConfig'
import { mockRadarData } from '@/components/charts/configs/radarConfig'
import { mockScatterData } from '@/components/charts/configs/scatterConfig'
import { mockSankeyData } from '@/components/charts/configs/sankeyConfig'
import { mockSunburstData } from '@/components/charts/configs/sunburstConfig'
import { mockTreemapData } from '@/components/charts/configs/treemapConfig'
import { mockWordCloudData } from '@/components/charts/configs/wordCloudConfig'
import { mockChinaMapData } from '@/components/charts/configs/chinaMapConfig'
import { mockMap3DData } from '@/config/charts/map3DConfig'

/** 各图表类型的默认初始数据（拖入画布时使用） */
const MOCK_DATA_MAP = {
  bar:        mockBarData,
  line:       mockLineData,
  area:       mockAreaData,
  pie:        mockPieData,
  doughnut:   mockPieData,
  funnel:     mockFunnelData,
  gauge:      mockGaugeData,
  heatmap:    mockHeatmapData,
  liquid:     mockLiquidData,
  radar:      mockRadarData,
  scatter:    mockScatterData,
  sankey:     mockSankeyData,
  sunburst:   mockSunburstData,
  treemap:    mockTreemapData,
  'word-cloud': mockWordCloudData,
  'map-china': mockChinaMapData,
  'map-3d':    mockMap3DData,
}

/**
 * 组件操作 Composable
 * 提供组件添加、删除、拖拽、调整大小等功能
 */
export function useComponents(canvasComponents, selectedComponentIds, canvasScale, isSpacePressed, selectedComponents) {
  /**
   * 添加组件到画布
   */
  const handleDrop = (event) => {
    const chartType = event.dataTransfer.getData('chartType')
    if (!chartType) return

    const chartConfig = getChartByType(chartType)
    if (!chartConfig) return

    // 计算相对于画布容器的位置
    let dropX, dropY
    if (event.target.classList.contains('screen-container')) {
      dropX = event.offsetX - chartConfig.defaultSize.w / 2
      dropY = event.offsetY - chartConfig.defaultSize.h / 2
    } else {
      // 如果拖放到画布区域外，默认居中
      dropX = 380
      dropY = 200
    }

    // 创建新组件，所有位置和尺寸取整
    // 获取组件类型的默认属性配置
    const defaults = getComponentDefaults(chartType)

    // 从 schema 生成初始 config（含动画等所有字段的默认值）
    const schema = getComponentSchema(chartType)
    const initialConfig = {}
    Object.keys(schema).forEach(key => {
      initialConfig[key] = getDefaultConfig(schema[key])
    })

    const newComp = {
      id: Date.now(),
      type: chartType,
      name: chartConfig.name,
      x: Math.round(Math.max(0, dropX)),
      y: Math.round(Math.max(0, dropY)),
      w: Math.round(chartConfig.defaultSize.w),
      h: Math.round(chartConfig.defaultSize.h),
      rotation: 0, // 旋转角度

      // 视觉样式 - 使用默认配置
      bgColor: defaults.bgColor,
      opacity: defaults.opacity,
      showBorder: chartConfig.defaultBorder?.width > 0,
      borderWidth: chartConfig.defaultBorder?.width ?? defaults.borderWidth,
      borderColor: chartConfig.defaultBorder?.color ?? 'rgba(64, 158, 255, 0.4)',
      borderRadius: chartConfig.defaultBorder?.radius ?? defaults.borderRadius,

      // 内边距 - 使用默认配置
      paddingVertical: defaults.paddingVertical,
      paddingHorizontal: defaults.paddingHorizontal,

      color: chartConfig.color,
      config: initialConfig, // 图表配置项（由 schema 默认值初始化）
      data: MOCK_DATA_MAP[chartType] ?? null,
      dataSource: MOCK_DATA_MAP[chartType]
        ? { mode: 'static', jsonDataType: 'echarts', json: JSON.stringify(MOCK_DATA_MAP[chartType], null, 2) }
        : undefined,
      refreshConfig: { enabled: false, interval: 30 }
    }

    canvasComponents.value.push(newComp)
    showMessage.success(`已添加 ${newComp.name}`)

    return newComp
  }

  /**
   * 更新组件尺寸
   */
  const updateComponentSize = (comp, prop, value) => {
    const numValue = Number(value)
    if (!isNaN(numValue) && comp) {
      comp[prop] = Math.round(Math.max(50, numValue))
    }
  }

  /**
   * 更新组件位置
   */
  const updateComponentPosition = (comp, prop, value) => {
    const numValue = Number(value)
    if (!isNaN(numValue) && comp) {
      const maxX = 1920 - (comp.w || 100)
      const maxY = 1080 - (comp.h || 100)

      if (prop === 'x') {
        comp.x = Math.round(Math.max(0, Math.min(maxX, numValue)))
      } else if (prop === 'y') {
        comp.y = Math.round(Math.max(0, Math.min(maxY, numValue)))
      }
    }
  }

  /**
   * 组件拖拽
   */
  const startDrag = (event, comp, callbacks = {}) => {
    const { selectComponent, calculateAlignmentLines, clearAlignmentLines, updateMultiSelectBox } = callbacks

    // 阻止空格键拖动画布
    if (isSpacePressed.value) {
      return
    }

    // 如果组件被锁定,禁止拖动
    if (comp.locked) {
      showMessage.warning('组件已锁定,无法拖动')
      return
    }

    event.stopPropagation()

    // 如果点击的组件不在选中列表中，单独选中它
    if (!selectedComponentIds.value.includes(comp.id)) {
      if (selectComponent) selectComponent(comp.id, event)
    }

    // 检查选中的组件中是否有锁定的
    const hasLockedComponent = selectedComponents.value.some(c => c.locked)
    if (hasLockedComponent) {
      showMessage.warning('选中的组件中包含已锁定的组件')
      return
    }

    const startX = event.clientX
    const startY = event.clientY

    // 记录所有选中组件的起始位置
    const startPositions = selectedComponents.value.map(c => ({
      id: c.id,
      x: c.x,
      y: c.y
    }))

    const onMouseMove = (e) => {
      // 考虑画布缩放比例，并立即取整
      const dx = Math.round((e.clientX - startX) / canvasScale.value)
      const dy = Math.round((e.clientY - startY) / canvasScale.value)

      // 批量移动所有选中的组件（先不应用吸附）
      startPositions.forEach(pos => {
        const component = canvasComponents.value.find(c => c.id === pos.id)
        if (component) {
          component.x = Math.round(pos.x + dx)
          component.y = Math.round(pos.y + dy)
        }
      })

      // 计算对齐辅助线和吸附（以第一个组件为参考）
      if (calculateAlignmentLines) {
        const { snapX, snapY } = calculateAlignmentLines(selectedComponents.value)

        // 应用吸附
        if (snapX !== null || snapY !== null) {
          const firstComp = selectedComponents.value[0]
          const offsetX = snapX !== null ? Math.round(snapX - firstComp.x) : 0
          const offsetY = snapY !== null ? Math.round(snapY - firstComp.y) : 0

          // 应用偏移到所有选中的组件
          selectedComponents.value.forEach(c => {
            if (snapX !== null) c.x = Math.round(c.x + offsetX)
            if (snapY !== null) c.y = Math.round(c.y + offsetY)
          })
        }
      }

      // 更新多选包围盒
      if (updateMultiSelectBox) updateMultiSelectBox()
    }

    const onMouseUp = () => {
      // 拖动结束后取整
      selectedComponents.value.forEach(c => {
        c.x = Math.round(c.x)
        c.y = Math.round(c.y)
      })

      // 清除对齐辅助线
      if (clearAlignmentLines) clearAlignmentLines()

      // 更新多选包围盒
      if (updateMultiSelectBox) updateMultiSelectBox()

      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }

  /**
   * 调整组件大小
   */
  const startResize = (event, comp, direction) => {
    event.preventDefault()
    event.stopPropagation()

    // 如果组件被锁定,禁止调整大小
    if (comp.locked) {
      showMessage.warning('组件已锁定,无法调整大小')
      return
    }

    const startX = event.clientX
    const startY = event.clientY
    const startWidth = comp.w
    const startHeight = comp.h
    const startLeft = comp.x
    const startTop = comp.y

    const onMouseMove = (e) => {
      // 考虑画布缩放比例，并立即取整
      const dx = Math.round((e.clientX - startX) / canvasScale.value)
      const dy = Math.round((e.clientY - startY) / canvasScale.value)

      // 根据方向调整组件的位置和大小，立即取整
      switch (direction) {
        case 'n': // 上
          comp.y = Math.round(startTop + dy)
          comp.h = Math.round(Math.max(50, startHeight - dy))
          break
        case 'ne': // 右上
          comp.y = Math.round(startTop + dy)
          comp.w = Math.round(Math.max(50, startWidth + dx))
          comp.h = Math.round(Math.max(50, startHeight - dy))
          break
        case 'e': // 右
          comp.w = Math.round(Math.max(50, startWidth + dx))
          break
        case 'se': // 右下
          comp.w = Math.round(Math.max(50, startWidth + dx))
          comp.h = Math.round(Math.max(50, startHeight + dy))
          break
        case 's': // 下
          comp.h = Math.round(Math.max(50, startHeight + dy))
          break
        case 'sw': // 左下
          comp.x = Math.round(startLeft + dx)
          comp.w = Math.round(Math.max(50, startWidth - dx))
          comp.h = Math.round(Math.max(50, startHeight + dy))
          break
        case 'w': // 左
          comp.x = Math.round(startLeft + dx)
          comp.w = Math.round(Math.max(50, startWidth - dx))
          break
        case 'nw': // 左上
          comp.x = Math.round(startLeft + dx)
          comp.y = Math.round(startTop + dy)
          comp.w = Math.round(Math.max(50, startWidth - dx))
          comp.h = Math.round(Math.max(50, startHeight - dy))
          break
      }
    }

    const onMouseUp = () => {
      // 拖动结束后取整
      comp.x = Math.round(comp.x)
      comp.y = Math.round(comp.y)
      comp.w = Math.round(comp.w)
      comp.h = Math.round(comp.h)

      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }

  return {
    handleDrop,
    updateComponentSize,
    updateComponentPosition,
    startDrag,
    startResize
  }
}
