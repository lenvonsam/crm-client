export default {
  pageSize: 8,
  // http://wechat.xingyun361.com/
  // 192.168.20.149:8080
  // fileUploadUrl: 'http://wechat.xingyun361.com/quasarserver/file/uedit/upload',
  qiniuOutlink: 'http://pav6lmvyn.bkt.clouddn.com/',
  bdMapAk: 'IAGOe19VLRpolXruX6o6WGNoSFEP9Gwq',
  fileUploadUrl: '/proxy/fileUpload',
  globalSuccessMsg: '',
  globalErrorMsg: '',
  currentPathIdx: '1-1',
  // 默认头像
  defaultAvatar: require('../static/defaultAvatar.png'),
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
  // 性别
  sexOpts: [{
    value: 1,
    label: '男'
  }, {
    value: 2,
    label: '女'
  }],
  // 公司规模
  compSizeOpts: [{
    value: '10人以下',
    label: '10人以下'
  },{
    value: '10-50人',
    label: '10-50人'
  },{
    value: '50-100人',
    label: '50-100人'
  },{
    value: '100人以上',
    label: '100人以上'
  }],
  // 公司类型
  compTypeOpts: [{
    value: '国有企业',
    label: '国有企业'
  }, {
    value: '私营企业',
    label: '私营企业'
  }, {
    value: '股份制企业',
    label: '股份制企业'
  }, {
    value: '外资企业',
    label: '外资企业'
  }, {
    value: '其他',
    label: '其他'
  }],
  // 采购周期
  purchaseCycleOpts: [{
    value: '1周',
    label: '1周'
  }, {
    value: '2周',
    label: '2周'
  }, {
    value: '3周',
    label: '3周'
  }, {
    value: '1个月',
    label: '1个月'
  }, {
    value: '2个月',
    label: '2个月'
  }, {
    value: '3个月',
    label: '3个月'
  }, {
    value: '半年',
    label: '半年'
  }, {
    value: '1年',
    label: '1年'
  }, {
    value: '其他',
    label: '其他'
  }],
  // 高卖情况
  isSellHighOpts: [{
    value: 0,
    label: '无'
  }, {
    value: 1,
    label: '有'
  }],
  // 信用情况
  creditStatusOpts: [{
    value: '良好',
    label: '良好'
  }, {
    value: '一般',
    label: '一般'
  }, {
    value: '较差',
    label: '较差'
  }, {
    value: '极差',
    label: '极差'
  }],
  // 订金需求
  depositRequirementOpts: [{
    value: '1周',
    label: '1周'
  }, {
    value: '2周',
    label: '2周'
  }, {
    value: '3周',
    label: '3周'
  }, {
    value: '1个月',
    label: '1个月'
  }, {
    value: '2个月',
    label: '2个月'
  }, {
    value: '3个月',
    label: '3个月'
  }, {
    value: '半年',
    label: '半年'
  }, {
    value: '1年',
    label: '1年'
  }, {
    value: '其他',
    label: '其他'
  }],
  //客户渠道
  customerChannelOpts: [{
    value: '网络搜索',
    label: '网络搜索'
  }, {
    value: '销售推荐',
    label: '销售推荐'
  }, {
    value: '朋友介绍',
    label: '朋友介绍'
  }, {
    value: '上门拜访',
    label: '上门拜访'
  }, {
    value: '电话推广',
    label: '电话推广'
  }],
  depositRateOpts: [{
    value: '10',
    label: '10'
  }, {
    value: '30',
    label: '30'
  }, {
    value: '70',
    label: '70'
  }],
  depositCycleOpts: [{
    value: '1',
    label: '1'
  }, {
    value: '3',
    label: '3'
  }, {
    value: '5',
    label: '5'
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
  }, {
    value: '保密',
    label: '保密'
  }],
  //沟通类型
  contactTypeOpts: [{
    value: '电话',
    label: '电话'
  }, {
    value: '短信',
    label: '短信'
  }, {
    value: '见面拜访',
    label: '见面拜访'
  }, {
    value: '其他',
    label: '其他'
  }],
  //是否是主联系人
  mainStatusOpts: [{
    value: 0,
    label: '否'
  },{
    value: 1,
    label: '是'
  }],
  currentMenus: [],
  allMenus: [{
    title: '首页',
    iconClass: 'el-icon-menu',
    subItems: [{
      title: '基本情况',
      url: '/dashboard'
    }]
  },{
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
      url: '/customManager/publicCustom'
    }, {
      title: '联系人管理',
      url: '/customManager/contactManager'
    }, {
      title: '客户拜访',
      url: '/customManager/customerVisit'
    }, {
      title: '客户画像',
      url: '/customManager/customerPortrait'
    }
    , {
      title: '客户分级',
      url: '/customManager/customerRating'
    }
    ]
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
      url: '/setting/authManager'
    }, {
      title: '组织架构',
      url: '/setting/orgStructure'
    }, {
      title: '分级系数',
      url: '/setting/gradingFactor'
    }, {
      title: '任务设置',
      url: '/setting/taskSetting'
    }, {
      title: '异常管理',
      url: '/setting/errLog'
    }]
  }, {
    title: '基础数据',
    iconClass: 'iconfont icon-basic-data',
    subItems: [{
      title: '业务关系',
      url: '/basicData/busiRelation'
    }, {
      title: '客户性质',
      url: '/basicData/customProperty'
    }, {
      title: '物资品类',
      url: '/basicData/supplyCatalog'
    }, {
      title: '物资用途',
      url: '/basicData/purpose'
    }, {
      title: '加工需求',
      url: '/basicData/processReq'
    }]
  }]
}