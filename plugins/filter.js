import Vue from 'vue'

const rowData = (value, key) => {
  switch (key) {
    case 'status':
      return value === 1 ? '启用' : '停用'
    case 'sex':
      return value === 1 ? '男' : '女'
    default:
      return value
  }
}

Vue.filter('rowData', rowData)
