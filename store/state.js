export default {
  pageSize: 6,
  // http://wechat.xingyun361.com/
  // 192.168.20.149:8080
  // fileUploadUrl: 'http://wechat.xingyun361.com/quasarserver/file/uedit/upload',
  qiniuOutlink: 'http://pav6lmvyn.bkt.clouddn.com/',
  fileUploadUrl: '/backend/fileUpload',
  globalSuccessMsg: '',
  currentPathIdx: '1-1',
  // 数据权限等级
  dataAuthOpts: [{
    value: '业务员',
    label: '业务员'
  }, {
    value: '部门',
    label: '部门'
  }, {
    value: '机构',
    label: '机构'
  }, {
    value: '公司',
    label: '公司'
  }],
  // 学历选项
  eduOpts: [{
    value: '博士',
    label: '博士'
  }, {
    value: '硕士',
    label: '硕士'
  }, {
    value: '本科',
    label: '本科'
  }, {
    value: '专科',
    label: '专科'
  }, {
    value: '高中',
    label: '高中'
  }, {
    value: '初中',
    label: '初中'
  }, {
    value: '小学',
    label: '小学'
  }, {
    value: '其他',
    label: '其他'
  }],
  // 政治面貌
  politicalOpts: [{
    value: '民主党派',
    label: '民主党派'
  }, {
    value: '党员',
    label: '党员'
  }, {
    value: '团员',
    label: '团员'
  }, {
    value: '群众',
    label: '群众'
  }, {
    value: '其他',
    label: '其他'
  }],
  // 婚姻情况
  maritalOpts: [{
    value: '未婚',
    label: '未婚'
  }, {
    value: '已婚',
    label: '已婚'
  }, {
    value: '离婚',
    label: '离婚'
  }, {
    value: '丧偶',
    label: '丧偶'
  }],
  currentMenus: [{
    title: '客户管理',
    iconClass: 'iconfont icon-custom',
    subItems: [{
      title: '潜在客户',
      url: '/customManager/potentialCustom'
    }, {
      title: '正式客户',
      url: '/customManager/formalCustom'
    }, {
      title: '公共客户',
      url: '#'
    }, {
      title: '联系人管理',
      url: '#'
    }, {
      title: '客户拜访',
      url: '#'
    }, {
      title: '客户画像',
      url: '#'
    }, {
      title: '客户分级',
      url: '#'
    }]
  }, {
    title: '系统设置',
    iconClass: 'iconfont icon-setting',
    subItems: [{
      title: '个人信息',
      url: '/setting/profile'
    }, {
      title: '账号管理',
      url: '/setting/acctManager'
    }, {
      title: '权限设置',
      url: '#'
    }, {
      title: '组织架构',
      url: '#'
    }]
  }, {
    title: '基础数据',
    iconClass: 'iconfont icon-basic-data',
    subItems: [{
      title: '业务关系',
      url: '#'
    }, {
      title: '客户性质',
      url: '#'
    }, {
      title: '物资品类',
      url: '#'
    }, {
      title: '物资用途',
      url: '#'
    }, {
      title: '加工需求',
      url: '#'
    }]
  }]
}