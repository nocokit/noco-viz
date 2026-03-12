export default {
  common: {
    home: 'Home',
    settings: 'Settings',
    search: 'Search',
    add: 'Add',
    edit: 'Edit',
    delete: 'Delete',
    cancel: 'Cancel',
    confirm: 'Confirm',
    save: 'Save',
    refresh: 'Refresh',
    actions: 'Actions',
    status: 'Status',
    createdAt: 'Created At',
    updatedAt: 'Updated At',
    description: 'Description',
    remark: 'Remark'
  },

  ipWhitelist: {
    title: 'IP Whitelist',
    breadcrumb: {
      home: 'Home',
      settings: 'Settings',
      ipWhitelist: 'IP Whitelist'
    },
    search: {
      keyword: 'IP/Remark',
      placeholder: 'Search by IP address or remark'
    },
    table: {
      ip: 'IP Address',
      description: 'Description',
      addedBy: 'Added By',
      createdAt: 'Added Time',
      actions: 'Actions'
    },
    form: {
      ip: 'IP Address or CIDR',
      ipPlaceholder: 'e.g.: 192.168.1.1 or 192.168.1.0/24',
      ipRequired: 'Please enter IP address or CIDR',
      description: 'Description',
      descriptionPlaceholder: 'e.g.: R&D Office Wi-Fi',
      descriptionMaxLength: 'Length cannot exceed 200 characters'
    },
    actions: {
      add: 'Add Whitelist',
      edit: 'Edit',
      delete: 'Delete'
    },
    modal: {
      title: 'Access Whitelist'
    }
  }
}
