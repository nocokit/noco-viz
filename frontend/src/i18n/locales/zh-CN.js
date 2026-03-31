export default {
  common: {
    home: '首页',
    settings: '系统设置',
    search: '搜索',
    add: '新增',
    edit: '编辑',
    delete: '删除',
    cancel: '取消',
    confirm: '确定',
    save: '保存',
    refresh: '刷新',
    actions: '操作',
    status: '状态',
    createdAt: '创建时间',
    updatedAt: '更新时间',
    description: '描述',
    remark: '备注'
  },

  ipWhitelist: {
    title: 'IP白名单',
    breadcrumb: {
      home: '首页',
      settings: '系统设置',
      ipWhitelist: 'IP白名单'
    },
    search: {
      keyword: 'IP/备注',
      placeholder: '按 IP 地址或备注搜索'
    },
    table: {
      ip: 'IP 地址',
      description: '备注说明',
      addedBy: '添加人',
      createdAt: '添加时间',
      actions: '操作'
    },
    form: {
      ip: 'IP 地址或网段',
      ipPlaceholder: '例如：192.168.1.1 或 192.168.1.0/24',
      ipRequired: '请输入 IP 地址或网段',
      description: '备注说明',
      descriptionPlaceholder: '例如：研发部办公室 Wi-Fi',
      descriptionMaxLength: '长度不能超过 200 个字符'
    },
    actions: {
      add: '新增白名单',
      edit: '编辑',
      delete: '删除'
    },
    modal: {
      title: '访问白名单'
    }
  }
}
