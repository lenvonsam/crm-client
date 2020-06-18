export default {
  pageSize: 10,
  // http://wechat.xingyun361.com/
  // 192.168.20.149:8080
  // fileUploadUrl: 'http://wechat.xingyun361.com/quasarserver/file/uedit/upload',
  qiniuOutlink: 'http://crm-cdn.xingyun361.com/',
  bdMapAk: 'IAGOe19VLRpolXruX6o6WGNoSFEP9Gwq',
  fileUploadUrl: '/proxy/fileUpload',
  searchParams: {},
  globalSuccessMsg: '',
  globalErrorMsg: '',
  currentPathIdx: '1-1',
  // 客户查询返回数据字段
  cstmArr: [
    'id',
    'compName',
    'linkName',
    'linkPhone',
    'createAt',
    'billDate',
    'dptName',
    'acctName',
    'creatorName',
    'mark',
    'orgId',
    'dptId',
    'acctId',
    'empCode',
    'visitCount',
    'lockStatus',
    'updateAt',
    'convertDate',
    'status',
    'erpCode',
    'xyCode'
  ],
  // 默认头像
  defaultAvatar: require('../static/defaultAvatar.png'),
  // 数据权限等级
  dataAuthOpts: [
    {
      value: '业务员',
      label: '业务员'
    },
    {
      value: '部门',
      label: '部门'
    },
    {
      value: '机构',
      label: '机构'
    },
    {
      value: '公司',
      label: '公司'
    }
  ],
  // 学历选项
  eduOpts: [
    {
      value: '博士',
      label: '博士'
    },
    {
      value: '硕士',
      label: '硕士'
    },
    {
      value: '本科',
      label: '本科'
    },
    {
      value: '专科',
      label: '专科'
    },
    {
      value: '高中',
      label: '高中'
    },
    {
      value: '初中',
      label: '初中'
    },
    {
      value: '小学',
      label: '小学'
    },
    {
      value: '其他',
      label: '其他'
    }
  ],
  // 性别
  sexOpts: [
    {
      value: 1,
      label: '男'
    },
    {
      value: 2,
      label: '女'
    }
  ],
  // 公司规模
  compSizeOpts: [
    {
      value: '10人以下',
      label: '10人以下'
    },
    {
      value: '10-50人',
      label: '10-50人'
    },
    {
      value: '50-100人',
      label: '50-100人'
    },
    {
      value: '100人以上',
      label: '100人以上'
    }
  ],
  // 公司类型
  compTypeOpts: [
    {
      value: '私营企业',
      label: '私营企业'
    },
    {
      value: '国有企业',
      label: '国有企业'
    },
    {
      value: '外资企业',
      label: '外资企业'
    },
    {
      value: '其他',
      label: '其他'
    }
  ],
  // 采购周期
  purchaseCycleOpts: [
    {
      value: '1周',
      label: '1周'
    },
    {
      value: '2周',
      label: '2周'
    },
    {
      value: '3周',
      label: '3周'
    },
    {
      value: '1个月',
      label: '1个月'
    },
    {
      value: '2个月',
      label: '2个月'
    },
    {
      value: '3个月',
      label: '3个月'
    },
    {
      value: '半年',
      label: '半年'
    },
    {
      value: '1年',
      label: '1年'
    },
    {
      value: '其他',
      label: '其他'
    }
  ],
  // 高卖情况
  isSellHighOpts: [
    {
      value: 0,
      label: '无'
    },
    {
      value: 1,
      label: '有'
    }
  ],
  // 信用情况
  creditStatusOpts: [
    {
      value: '良好',
      label: '良好'
    },
    {
      value: '一般',
      label: '一般'
    },
    {
      value: '较差',
      label: '较差'
    },
    {
      value: '极差',
      label: '极差'
    }
  ],
  // 订金需求
  depositRequirementOpts: [
    {
      value: '1周',
      label: '1周'
    },
    {
      value: '2周',
      label: '2周'
    },
    {
      value: '3周',
      label: '3周'
    },
    {
      value: '1个月',
      label: '1个月'
    },
    {
      value: '2个月',
      label: '2个月'
    },
    {
      value: '3个月',
      label: '3个月'
    },
    {
      value: '半年',
      label: '半年'
    },
    {
      value: '1年',
      label: '1年'
    },
    {
      value: '其他',
      label: '其他'
    }
  ],
  //客户渠道
  customerChannelOpts: [
    {
      value: '网络搜索',
      label: '网络搜索'
    },
    {
      value: '销售推荐',
      label: '销售推荐'
    },
    {
      value: '朋友介绍',
      label: '朋友介绍'
    },
    {
      value: '上门拜访',
      label: '上门拜访'
    },
    {
      value: '电话推广',
      label: '电话推广'
    }
  ],
  // 客户类型
  customerMarkOpts: [
    {
      value: '',
      label: '全部'
    },
    {
      value: '1',
      label: '潜在客户'
    },
    {
      value: '2',
      label: '正式客户'
    },
    {
      value: '3',
      label: '公共客户'
    }
  ],
  // 业务关系
  busiRelationOpts: [
    {
      value: '',
      label: '全部'
    },
    {
      value: '客户',
      label: '客户'
    },
    {
      value: '供应商',
      label: '供应商'
    },
    {
      value: '费用单位',
      label: '费用单位'
    }
  ],
  // 客户性质
  customPropertyOpts: [
    {
      value: '',
      label: '全部'
    },
    {
      value: '经销商',
      label: '经销商'
    },
    {
      value: '终端客户',
      label: '终端客户'
    },
    {
      value: '供应商',
      label: '供应商'
    }
  ],
  // 启用状态
  enableStatus: [
    {
      value: '',
      label: '全部'
    },
    {
      value: '1',
      label: '启用'
    },
    {
      value: '0',
      label: '停用'
    }
  ],
  // 客户等级
  levelOpts: [
    {
      value: '',
      label: '全部'
    },
    {
      value: 'A',
      label: 'A'
    },
    {
      value: 'B',
      label: 'B'
    },
    {
      value: 'C',
      label: 'C'
    },
    {
      value: 'D',
      label: 'D'
    },
    {
      value: 'E',
      label: 'E'
    }
  ],
  // 未开单天数
  billDateOpts: [
    {
      value: '',
      label: '全部'
    },
    {
      value: '0',
      label: '30天内未开单'
    },
    {
      value: '1',
      label: '30-60天未开单'
    },
    {
      value: '2',
      label: '61-90天未开单'
    },
    {
      value: '3',
      label: '90天以上未开单'
    }
  ],
  // 联系人类型
  mainStatusTypeOpts: [
    {
      value: '',
      label: '全部'
    },
    {
      value: '1',
      label: '主联系人'
    },
    {
      value: '0',
      label: '子联系人'
    }
  ],
  // 客户登记
  depositRateOpts: [
    {
      value: '10',
      label: '10'
    },
    {
      value: '30',
      label: '30'
    },
    {
      value: '70',
      label: '70'
    }
  ],
  depositCycleOpts: [
    {
      value: '1',
      label: '1'
    },
    {
      value: '3',
      label: '3'
    },
    {
      value: '5',
      label: '5'
    }
  ],
  // 政治面貌
  politicalOpts: [
    {
      value: '民主党派',
      label: '民主党派'
    },
    {
      value: '党员',
      label: '党员'
    },
    {
      value: '团员',
      label: '团员'
    },
    {
      value: '群众',
      label: '群众'
    },
    {
      value: '其他',
      label: '其他'
    }
  ],
  // 婚姻情况
  maritalOpts: [
    {
      value: '未婚',
      label: '未婚'
    },
    {
      value: '已婚',
      label: '已婚'
    },
    {
      value: '离婚',
      label: '离婚'
    },
    {
      value: '丧偶',
      label: '丧偶'
    },
    {
      value: '保密',
      label: '保密'
    }
  ],
  //沟通类型
  contactTypeOpts: [
    {
      value: '电话',
      label: '电话'
    },
    {
      value: '短信',
      label: '短信'
    },
    {
      value: '见面拜访',
      label: '见面拜访'
    },
    {
      value: '其他',
      label: '其他'
    }
  ],
  // 发送短信状态
  smsStatus: [
    {
      value: '',
      label: '全部'
    },
    {
      value: '1',
      label: '发送中'
    },
    {
      value: '2',
      label: '全部成功'
    },
    {
      value: '3',
      label: '发送失败'
    },
    {
      value: '4',
      label: '定时发送'
    },
    {
      value: '5',
      label: '已取消'
    }
  ],
  //是否是主联系人
  mainStatusOpts: [
    {
      value: 0,
      label: '否'
    },
    {
      value: 1,
      label: '是'
    }
  ],
  // 任务状态
  taskStatus: [
    {
      value: 0,
      label: '待处理'
    },
    {
      value: 1,
      label: '暂不处理'
    },
    {
      value: 2,
      label: '进行中'
    },
    {
      value: 3,
      label: '开发完成'
    },
    {
      value: 4,
      label: '待验证'
    },
    {
      value: 5,
      label: '测试中'
    },
    {
      value: 6,
      label: '已完成'
    },
    {
      value: 7,
      label: '退回'
    },
    {
      value: 8,
      label: '关闭'
    }
  ],
  // 任务优先级
  priority: [
    {
      value: 0,
      label: '次要'
    },
    {
      value: 1,
      label: '一般'
    },
    {
      value: 2,
      label: '严重'
    },
    {
      value: 3,
      label: '紧急'
    },
    {
      value: 4,
      label: '致命'
    }
  ],
  // 上线情况
  xyMarkList: [
    {
      value: '',
      label: '全部'
    },
    {
      value: '1',
      label: '已上型云'
    },
    {
      value: '2',
      label: '未上型云'
    }
  ],
  // 工作组
  workGroupList: [
    {
      value: '1',
      label: '板材组'
    },
    {
      value: '2',
      label: '国标组'
    },
    {
      value: '3',
      label: '协标组'
    }
  ],
  // 归属性质
  propertyMark: [
    {
      value: '',
      label: '全部'
    },
    {
      value: '0',
      label: '长期维护'
    },
    {
      value: '1',
      label: '二次开发'
    }
  ],
  // 客户状态
  clientStatus: [
    {
      value: '',
      label: '全部'
    },
    {
      value: '1',
      label: '潜在客户'
    },
    {
      value: '2',
      label: '正式客户'
    },
    {
      value: '3',
      label: '公共客户'
    }
  ],
  // 评估状态
  showUpdateList: [
    {
      value: '0',
      label: '全部'
    },
    {
      value: '1',
      label: '未评估'
    },
    {
      value: '2',
      label: '已评估'
    }
  ],
  // 客户性质
  cstmPropertyIds: [
    {
      value: '',
      label: '贸易商'
    },
    {
      value: '1',
      label: '终端客户'
    },
    {
      value: '2',
      label: '加工单位'
    },
    {
      value: '3',
      label: '物流单位'
    },
    {
      value: '4',
      label: '其他'
    }
  ],
  // 流失原因
  lossReasonList: [
    { label: '维护/沟通问题', value: '维护/沟通问题' },
    { label: '我司经营管控', value: '我司经营管控' },
    { label: '我司禁止合作', value: '我司禁止合作' },
    { label: '公司关停/注销', value: '公司关停/注销' },
    { label: '其他原因', value: '其他原因' }
  ],
  // 有无库存
  hasStorageList: [{ label: '无', value: '无' }, { label: '有', value: '有' }],
  // 主要运力方式
  mainDeliveryWayList: [
    { label: '自有运力', value: '自有运力' },
    { label: '我司配送', value: '我司配送' },
    { label: '固定三方物流', value: '固定三方物流' },
    { label: '非固定三方物流', value: '非固定三方物流' }
  ],
  // 物流偏好
  deliveryPreferList1: [
    { label: '拼车/顺风车', value: '拼车/顺风车' },
    { label: '等返程车', value: '等返程车' },
    { label: '保运输时效，不计较运费', value: '保运输时效，不计较运费' },
    { label: '低运费，保运输时效', value: '低运费，保运输时效' },
    { label: '看重运费，运输可延缓', value: '看重运费，运输可延缓' }
  ],
  deliveryPreferList2: [
    { label: '有单即派车', value: '有单即派车' },
    { label: '固定车次按期配送', value: '固定车次按期配送' }
  ],
  // 主要物流现状
  logisticsStat: [
    {
      value: '本地物流发达',
      label: '本地物流发达'
    },
    {
      value: '有专线物流商',
      label: '有专线物流商'
    },
    {
      value: '客户自有运力居多',
      label: '客户自有运力居多'
    }
  ],
  // 物流对销量的影响
  logisticsInflu: [
    {
      value: '物流与销量无关系',
      label: '物流与销量无关系'
    },
    {
      value: '提升物流服务可增加销量',
      label: '提升物流服务可增加销量'
    },
    {
      value: '降低运费可增加销量',
      label: '降低运费可增加销量'
    }
  ],
  // 主营业务
  mainBusiList: [
    {
      value: '结构性金属制品制造',
      label: '结构性金属制品制造',
      children: [
        {
          value: '金属结构制造',
          label: '金属结构制造'
        }
      ]
    },
    {
      value: '金属工具制造',
      label: '金属工具制造',
      children: [
        {
          value: '切削工具制造',
          label: '切削工具制造'
        },
        {
          value: '其他金属工具制造',
          label: '其他金属工具制造'
        }
      ]
    },
    {
      value: '集装箱及金属包装容器制造',
      label: '集装箱及金属包装容器制造',
      children: [
        {
          value: '集装箱制造',
          label: '集装箱制造'
        },
        {
          value: '金属压力容器制造',
          label: '金属压力容器制造'
        },
        {
          value: '金属包装容器及材料制造',
          label: '金属包装容器及材料制造'
        }
      ]
    },
    {
      value: '锅炉及设备制造',
      label: '锅炉及设备制造',
      children: [
        {
          value: '发动机及配件制造',
          label: '发动机及配件制造'
        },
        {
          value: '动力和发电设备制造',
          label: '动力和发电设备制造'
        }
      ]
    },
    {
      value: '金属加工机械制造',
      label: '金属加工机械制造',
      children: [
        {
          value: '加工机床及附件制造',
          label: '加工机床及附件制造'
        },
        {
          value: '其他金属加工机械制造',
          label: '其他金属加工机械制造'
        }
      ]
    },
    {
      value: '物料搬运设备制造',
      label: '物料搬运设备制造',
      children: [
        {
          value: '起重机制造',
          label: '起重机制造'
        },
        {
          value: '叉车等搬运设备及机械式停车设备制造',
          label: '叉车等搬运设备及机械式停车设备制造'
        },
        {
          value: '电梯、自动扶梯及升降机制造',
          label: '电梯、自动扶梯及升降机制造'
        },
        {
          value: '客运索道制造',
          label: '客运索道制造'
        }
      ]
    },
    {
      value: '烘炉、风机、包装等设备制造',
      label: '烘炉、风机、包装等设备制造',
      children: [
        {
          value: '风机、风扇制造',
          label: '风机、风扇制造'
        },
        {
          value: '制冷、空调设备制造',
          label: '制冷、空调设备制造'
        },
        {
          value: '包装专用设备制造',
          label: '包装专用设备制造'
        }
      ]
    },
    {
      value: '通用零部件制造',
      label: '通用零部件制造',
      children: [
        {
          value: '紧固件制造',
          label: '紧固件制造'
        },
        {
          value: '机械零部件加工',
          label: '机械零部件加工'
        }
      ]
    },
    {
      value: '汽车制造',
      label: '汽车制造',
      children: [
        {
          value: '汽车车身、挂车制造',
          label: '汽车车身、挂车制造'
        },
        {
          value: '汽车零部件及配件制造',
          label: '汽车零部件及配件制造'
        }
      ]
    },
    {
      value: '铁路运输设备制造',
      label: '铁路运输设备制造',
      children: [
        {
          value: '高铁车组制造',
          label: '高铁车组制造'
        },
        {
          value: '轨道机车车辆制造',
          label: '轨道机车车辆制造'
        },
        {
          value: '铁路设备、配件制造',
          label: '铁路设备、配件制造'
        }
      ]
    },
    {
      value: '船舶及相关装置制造',
      label: '船舶及相关装置制造',
      children: [
        {
          value: '金属船舶制造',
          label: '金属船舶制造'
        },
        {
          value: '船用配套设备制造',
          label: '船用配套设备制造'
        },
        {
          value: '海洋工程装备制造',
          label: '海洋工程装备制造'
        }
      ]
    },
    {
      value: '航空、航天器及设备制造',
      label: '航空、航天器及设备制造',
      children: [
        {
          value: '飞机制造',
          label: '飞机制造'
        }
      ]
    },
    {
      value: '其他',
      label: '其他'
    },
    {
      value: '钢材贸易',
      label: '钢材贸易'
    }
  ],
  currentMenus: [],
  allMenus: [
    {
      title: '首页',
      iconClass: 'el-icon-menu',
      subItems: [
        {
          title: '基本情况',
          url: '/dashboard'
        }
      ]
    },
    {
      title: '销售管理',
      iconClass: 'iconfont icon-sales',
      subItems: [
        {
          title: '销售报表',
          url: '/salesManage/salesReport'
        },
        {
          title: '交易跟踪',
          url: '/salesManage/tracking'
        },
        {
          title: '产品资源',
          url: '/salesManage/resources'
        },
        {
          title: '期货管理',
          url: '/salesManage/futures'
        },
        {
          title: '业务员提成汇总表',
          url: '/salesManage/reports/empCommSummary'
        },
        {
          title: '销售专员提成汇总表',
          url: '/salesManage/reports/saleCommSummary'
        },
        {
          title: '销售绩效提成表',
          url: '/salesManage/reports/salePerformance'
        },
        {
          title: '直发调货明细表',
          url: '/salesManage/reports/deliveryDetail'
        },
        {
          title: '高卖明细表',
          url: '/salesManage/reports/highSellDetail'
        },
        {
          title: '新客户业务明细表',
          url: '/salesManage/reports/newCustomer'
        },
        {
          title: '销售专员新增客户明细表',
          url: '/salesManage/reports/saleNewCustomer'
        },
        {
          title: '业务员新增客户明细表',
          url: '/salesManage/reports/empNewCustomer'
        },
        {
          title: '销售其他销量',
          url: '/salesManage/reports/saleOtherWeight'
        },
        {
          title: '超期未提仓储费',
          url: '/salesManage/reports/overdueFee'
        },
        {
          title: '超期客户',
          url: '/salesManage/reports/purchaseFrequency'
        }
      ]
    },
    {
      title: '客服中心',
      iconClass: 'iconfont icon-call-center',
      subItems: [
        /*{
      title: '在线客服',
      url: '/callCenter/onlineService'
    }, {
      title: '消息中心',
      url: '/callCenter/messageCenter'
    }, */ {
          title: '短信中心',
          url: '/callCenter/sms'
        } /*, {
      title: '客户回访',
      url: '/callCenter/customerReturnVisit'
    }, {
      title: '客户反馈',
      url: '/callCenter/customerFeedback'
    }, {
      title: '投诉处理',
      url: '/callCenter/complaint'
    }*/
      ]
    },
    {
      title: '客户管理',
      iconClass: 'iconfont icon-custom',
      subItems: [
        {
          title: '潜在客户',
          url: '/customManager/potentialCustom'
        },
        {
          title: '正式客户',
          url: '/customManager/formalCustom'
        },
        {
          title: '公共客户',
          url: '/customManager/publicCustom'
        },
        {
          title: '联系人管理',
          url: '/customManager/contactManager'
        },
        {
          title: '客户拜访',
          url: '/customManager/customerVisit'
        },
        {
          title: '客户画像',
          url: '/customManager/customerPortrait'
        },
        {
          title: '客户分级',
          url: '/customManager/customerRating'
        },
        {
          title: '商机管理',
          url: '/customManager/busiOppty'
        },
        {
          title: '客户合并',
          url: '/customManager/customerCombine'
        },
        {
          title: '采购供应商',
          url: '/customManager/supplier'
        },
        {
          title: '客户评估',
          url: '/customManager/customerEvalution'
        }
      ]
    },
    {
      title: '行政人资',
      iconClass: 'iconfont icon-hr',
      subItems: [
        {
          title: '短信收发',
          url: '/hrManager/sms'
        }
      ]
    },
    {
      title: '系统设置',
      iconClass: 'iconfont icon-setting',
      subItems: [
        {
          title: '个人信息',
          url: '/setting/profile'
        },
        {
          title: '账号管理',
          url: '/setting/acctManager'
        },
        {
          title: '权限设置',
          url: '/setting/authManager'
        },
        {
          title: '组织架构',
          url: '/setting/orgStructure'
        },
        {
          title: '分级系数',
          url: '/setting/gradingFactor'
        },
        {
          title: '任务设置',
          url: '/setting/taskSetting'
        },
        {
          title: '异常管理',
          url: '/setting/errLog'
        },
        {
          title: '消息管理',
          url: '/setting/mqMsg'
        },
        {
          title: '登录记录',
          url: '/setting/loginMsg'
        }
      ]
    },
    {
      title: '基础数据',
      iconClass: 'iconfont icon-basic-data',
      subItems: [
        {
          title: '业务关系',
          url: '/basicData/busiRelation'
        },
        {
          title: '客户性质',
          url: '/basicData/customProperty'
        },
        {
          title: '物资品类',
          url: '/basicData/supplyCatalog'
        },
        {
          title: '物资用途',
          url: '/basicData/purpose'
        },
        {
          title: '加工需求',
          url: '/basicData/processReq'
        },
        {
          title: '所处行业',
          url: '/basicData/industry'
        }
      ]
    },
    {
      title: '任务管理',
      iconClass: 'iconfont icon-task-line',
      subItems: [
        {
          title: '任务信息',
          url: '/taskManage/taskInfo'
        },
        {
          title: '项目设置',
          url: '/taskManage/projectSetting'
        },
        {
          title: '类型设置',
          url: '/taskManage/typeSetting'
        }
      ]
    }
  ]
}
