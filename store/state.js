export default {
  pageSize: 6,
  // http://wechat.xingyun361.com/
  // 192.168.20.149:8080
  // fileUploadUrl: 'http://wechat.xingyun361.com/quasarserver/file/uedit/upload',
  qiniuOutlink: 'http://pav6lmvyn.bkt.clouddn.com/',
  fileUploadUrl: '/backend/fileUpload',
  globalSuccessMsg: '',
  currentPathIdx: '1-1',
  currentMenus: [{
    title: '客户管理',
    iconClass: 'iconfont icon-custom',
    subItems: [{
      title: '潜在客户',
      url: '/customManager/potentialCustom/'
    }, {
      title: '正式客户',
      url: '/customManager/formalCustom/'
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
      url: '#'
    }, {
      title: '账号管理',
      url: '#'
    }, {
      title: '权限设置',
      url: '#'
    }, {
      title: '组织架构',
      url: '#'
    }, {
      title: '分配业务员',
      url: '#'
    }, {
      title: '基础代码',
      url: '#'
    }]
  }]
}