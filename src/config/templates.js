/**
 * 企业模板库数据配置
 * 包含官方模板和部门共享模板
 */

// 官方推荐模板
export const officialTemplates = [
  {
    id: 'tpl-official-001',
    name: '集团经营驾驶舱 V2.0',
    description: '集团标准财务与经营指标展示，包含总分公司地图下钻与实时流水。',
    type: 'official',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop',
    resolution: '1920 x 1080',
    usageCount: 2400,
    category: 'business',
    tags: ['财务', '经营指标', '地图'],
    author: '集团IT部',
    createdAt: '2024-01-15',
    updatedAt: '2024-11-20'
  },
  {
    id: 'tpl-official-002',
    name: '数字化工厂监控',
    description: '集成 IoT 设备数据，实时展示产线良率、设备运行状态及报警信息。',
    type: 'official',
    thumbnail: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=450&fit=crop',
    resolution: '3840 x 2160',
    usageCount: 850,
    category: 'iot',
    tags: ['IoT', '产线监控', '设备状态'],
    author: '集团IT部',
    createdAt: '2024-02-20',
    updatedAt: '2024-12-01'
  },
  {
    id: 'tpl-official-003',
    name: '网络安全态势感知',
    description: '展示全网流量攻击、防火墙拦截记录及服务器健康状态，适合 SOC 中心。',
    type: 'official',
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=450&fit=crop',
    resolution: '1920 x 1080',
    usageCount: 1200,
    category: 'security',
    tags: ['安全', 'SOC', '态势感知'],
    author: '集团IT部',
    createdAt: '2024-03-10',
    updatedAt: '2024-11-15'
  },
  {
    id: 'tpl-official-004',
    name: '供应链全景监控',
    description: '实时追踪物流、库存、订单状态，支持多仓库、多供应商数据汇总。',
    type: 'official',
    thumbnail: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=450&fit=crop',
    resolution: '1920 x 1080',
    usageCount: 680,
    category: 'logistics',
    tags: ['供应链', '物流', '库存'],
    author: '集团IT部',
    createdAt: '2024-04-05',
    updatedAt: '2024-11-28'
  },
  {
    id: 'tpl-official-005',
    name: '人力资源数据看板',
    description: '展示员工数量、离职率、招聘进度、培训完成率等核心 HR 指标。',
    type: 'official',
    thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=450&fit=crop',
    resolution: '1920 x 1080',
    usageCount: 920,
    category: 'hr',
    tags: ['人力资源', 'HR', '招聘'],
    author: '集团IT部',
    createdAt: '2024-05-12',
    updatedAt: '2024-12-03'
  },
  {
    id: 'tpl-official-006',
    name: '客户服务质量分析',
    description: '客服工单处理时效、满意度评分、热点问题统计，支持多渠道汇总。',
    type: 'official',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop',
    resolution: '1920 x 1080',
    usageCount: 540,
    category: 'service',
    tags: ['客服', '工单', '满意度'],
    author: '集团IT部',
    createdAt: '2024-06-08',
    updatedAt: '2024-11-25'
  }
]

// 部门共享模板
export const sharedTemplates = [
  {
    id: 'tpl-shared-001',
    name: '华东区销售周报',
    description: '销售部张三上传。用于周会汇报，包含团队排名和 KPI 完成率。',
    type: 'shared',
    department: '销售部',
    thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=450&fit=crop',
    resolution: '1920 x 1080',
    usageCount: 120,
    category: 'sales',
    tags: ['销售', '周报', 'KPI'],
    author: '张三',
    createdAt: '2024-09-15',
    updatedAt: '2024-11-18'
  },
  {
    id: 'tpl-shared-002',
    name: '极简风数据图表',
    description: '一套黑白风格的基础图表组件组合，适合嵌入到深色 CRM 系统中。',
    type: 'shared',
    department: 'UI设计部',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop&sat=-100',
    resolution: '自适应',
    usageCount: 560,
    category: 'design',
    tags: ['UI', '图表', '极简'],
    author: '李四',
    createdAt: '2024-08-20',
    updatedAt: '2024-12-02'
  },
  {
    id: 'tpl-shared-003',
    name: '研发效能看板',
    description: '技术部内部使用，展示代码提交量、Bug 修复率、项目交付进度。',
    type: 'shared',
    department: '技术部',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=450&fit=crop',
    resolution: '1920 x 1080',
    usageCount: 340,
    category: 'development',
    tags: ['研发', '效能', 'Git'],
    author: '王五',
    createdAt: '2024-10-05',
    updatedAt: '2024-11-30'
  },
  {
    id: 'tpl-shared-004',
    name: '营销活动实时监控',
    description: '市场部专用，跟踪活动 PV/UV、转化率、ROI，支持多平台数据接入。',
    type: 'shared',
    department: '市场部',
    thumbnail: 'https://images.unsplash.com/photo-1533750516457-a7f992034fec?w=800&h=450&fit=crop',
    resolution: '1920 x 1080',
    usageCount: 280,
    category: 'marketing',
    tags: ['营销', 'ROI', '转化率'],
    author: '赵六',
    createdAt: '2024-09-28',
    updatedAt: '2024-11-22'
  },
  {
    id: 'tpl-shared-005',
    name: '财务月度汇总',
    description: '财务部常用，收入、支出、利润分析，支持同比环比对比。',
    type: 'shared',
    department: '财务部',
    thumbnail: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&h=450&fit=crop',
    resolution: '1920 x 1080',
    usageCount: 195,
    category: 'finance',
    tags: ['财务', '月报', '利润'],
    author: '孙七',
    createdAt: '2024-11-01',
    updatedAt: '2024-12-04'
  }
]

// 按分类获取模板
export const getTemplatesByCategory = (category) => {
  const allTemplates = [...officialTemplates, ...sharedTemplates]
  if (!category || category === 'all') {
    return allTemplates
  }
  return allTemplates.filter(tpl => tpl.category === category)
}

// 按类型获取模板
export const getTemplatesByType = (type) => {
  if (type === 'official') {
    return officialTemplates
  }
  if (type === 'shared') {
    return sharedTemplates
  }
  return [...officialTemplates, ...sharedTemplates]
}

// 搜索模板
export const searchTemplates = (keyword) => {
  const allTemplates = [...officialTemplates, ...sharedTemplates]
  const lowerKeyword = keyword.toLowerCase()
  return allTemplates.filter(tpl =>
    tpl.name.toLowerCase().includes(lowerKeyword) ||
    tpl.description.toLowerCase().includes(lowerKeyword) ||
    tpl.tags.some(tag => tag.toLowerCase().includes(lowerKeyword))
  )
}
