<template lang="pug">
div
  button-group(:btns="btns", @groupBtnClick="editForm", v-if="isEdit")
  detail-table.mt-15(:tableForm="formItems", :tableValue="obj", v-if="obj.id")
  el-row.mt-15(v-if="obj.compLogoUrl || obj.busiLicenseUrl || obj.taxRegisterUrl || obj.orgCertificateUrl || obj.invoiceInfoUrl")
    el-col.text-center.ft-16.bg-gray.text-white.pt-15.pb-15.mb-20(:span="24") 附件信息
  .row.mt-15.text-center
    .col(v-if="obj.compLogoUrl")
      .ft-18.mb-15 公司logo
      zoom-img.zoomImg(:url="obj.compLogoUrl", :width='180', :height='180')
    .col(v-if="obj.busiLicenseUrl")
      .ft-18.mb-15 营业执照(三证合一)
      zoom-img.zoomImg(:url="obj.busiLicenseUrl", :width='180', :height='180')
    .col(v-if="obj.taxRegisterUrl")
      .ft-18.mb-15 税务登记证
      zoom-img.zoomImg(:url="obj.taxRegisterUrl", :width='180', :height='180')
    .col(v-if="obj.orgCertificateUrl")
      .ft-18.mb-15 组织结构代码证
      zoom-img.zoomImg(:url="obj.orgCertificateUrl", :width='180', :height='180')
    .col(v-if="obj.invoiceInfoUrl")
      .ft-18.mb-15 开票资料
      zoom-img.zoomImg(:url="obj.invoiceInfoUrl", :width='180', :height='180')
</template>

<script>
import detailTable from '@/components/DetailTable.vue'
import buttonGroup from '@/components/ButtonGroup.vue'
import zoomImg from '@/components/ZoomImg.vue'
import { mapState } from 'vuex'
export default {
  layout: 'main',
  components: {
    detailTable,
    buttonGroup,
    zoomImg
  },
  computed: {
    ...mapState({
      currentUser: state => state.user.currentUser
    })
  },
  data () {
    return {
      btns: [{lbl: '编辑', type: 'edit'}],
      obj: {},
      formItems: [
        // [{lbl: '客户类型', key: 'customerType'}, {lbl: '状态', key: 'status'}],
        [{lbl: '客户类型', key: 'cstmType'}, {lbl: '起始日期', key: 'startTime'}],
        [{lbl: '公司名称', key: 'compName'}, {lbl: '简称', key: 'compNameAb'}],
        [{lbl: '助记码', key: 'memberCode'}, {lbl: '状态', key: 'status'}],
        [{lbl: '最近编辑时间', key: 'updateAt'}, {lbl: '创建时间', key: 'createAt'}],
        [{lbl: '客户来源', key: 'customerSource'}, {lbl: '客户渠道', key: 'customerChannel'}],
        [{lbl: 'ERP编号', key: 'erpCode'}, {lbl: '电商会员编号', key: 'ebusiMemberCode'}],
        [{lbl: '电商管理员账号', key: 'ebusiAdminAcctNo'}, {lbl: '业务关系', key: 'busiRelation', type:'object', factValue: (row) => {return row.map(itm => itm.name).join(',')}}],
        [{lbl: '客户性质', key: 'fkCustomProperty', type:'object', factValue: (row) => {return row.name}}, {lbl: '业务部门', key: 'fkDpt', type:'object', factValue: (row) => {return row.name}}],
        [{lbl: '业务员', key: 'fkAcct', type:'object', factValue: (row) => {return row.name}}, {lbl: '工商证照编码', key: 'busiLicenseCode'}],
        [{lbl: '注册资本', key: 'registerCapital'}, {lbl: '法人代表', key: 'legalRept'}],
        [{lbl: '公司地址', type: 'self', factValue: (row) => {
          return `${row.compProv == null ? '' : row.compProv} ${row.compCity == null ? '' : row.compCity} ${row.compArea == null ? '' : row.compArea} ${row.compAddr == null ? '' : row.compAddr}`
        }}, {lbl: '工作组', key: 'workgroupName'}],
        [{lbl: '传真号码', key: 'faxNum'}, {lbl: '公司规模', key: 'compSize'}],
        [{lbl: '地区', key: 'region'}, {lbl: '公司类型', key: 'compType'}],
        [{lbl: '成立日期', key: 'setUpDateStr'}, {lbl: '实际控制人', key: 'factController'}],
        [{lbl: '实际控制人身份证', key: 'factControllerIdno'}, {lbl: '主联系人', key: 'linkers', type:'object', factValue: (row) => {
          let idx = row.findIndex(itm => itm.mainStatus === 1)
          return row[idx].name
        }}],
        [{lbl: '联系电话', key: 'linkers', type:'object', factValue: (row) => {
          let idx = row.findIndex(itm => itm.mainStatus === 1)
          return row[idx].phone
        }}, {lbl: '性别', key: 'linkers', type:'object', factValue: (row) => {
          let idx = row.findIndex(itm => itm.mainStatus === 1)
          return row[idx].sex == 1 ? '男' : '女'
        }}],
        [{lbl: '年龄', key: 'linkers', type:'object', factValue: (row) => {
          let idx = row.findIndex(itm => itm.mainStatus === 1)
          return row[idx].age
        }}, {lbl: '学历', key: 'linkers', type:'object', factValue: (row) => {
          let idx = row.findIndex(itm => itm.mainStatus === 1)
          return row[idx].edu
        }}],
        [{lbl: '籍贯', key: 'linkers', type:'object', factValue: (row) => {
          let idx = row.findIndex(itm => itm.mainStatus === 1)
          return row[idx].nativePlace
        }}, {lbl: '微信', key: 'linkers', type:'object', factValue: (row) => {
          let idx = row.findIndex(itm => itm.mainStatus === 1)
          return row[idx].wxNo
        }}],
        [{lbl: 'QQ', key: 'linkers', type:'object', factValue: (row) => {
          let idx = row.findIndex(itm => itm.mainStatus === 1)
          return row[idx].qqNo
        }}, {lbl: '新浪微博', key: 'linkers', type:'object', factValue: (row) => {
          let idx = row.findIndex(itm => itm.mainStatus === 1)
          return row[idx].wbName
        }}],
        [{lbl: '其他联系方式', key: 'linkers', type:'object', factValue: (row) => {
          let idx = row.findIndex(itm => itm.mainStatus === 1)
          return row[idx].otherLinkWay
        }}, {lbl: '税号', key: 'tfn'}],
        [{lbl: '开户名称', key: 'openAcctName'}, {lbl: '开票地址', type: 'self', factValue: (row) => {
          return row.billAddr
          // return `${row.billProv == null ? '' : row.billProv} ${row.billCity == null ? '' : row.billCity} ${row.billArea == null ? '' : row.billArea} ${row.billAddr == null ? '' : row.billAddr}`
        }}],
        [{lbl: '开户账号', key: 'openAcct'}, {lbl: '开户银行', key: 'openBank'}],
        [{lbl: '所处行业', key: 'industry', type: 'object', factValue: (row) => {
          let industryNameArr = []
          if (row.length > 0) {
            row.map((item) => {
              industryNameArr.push(item['name'])
            })            
          }
          return industryNameArr.join('，')
        }}, {lbl: '经营范围', key: 'busiScope'}],
        [{lbl: '采购周期', key: 'purchaseCycle'}, {lbl: '月采吨位', key: 'weightPerMonth', type: 'object', factValue: (row) => { return (row)? row + '吨' : ''}}],
        [{lbl: '高卖情况', key: 'sellHighStatus'}, {lbl: '信用情况', key: 'creditStatus'}],
        [{lbl: '年销售额', key: 'annualSales', type: 'object', factValue: (row) => { return (row)? row + '万' : ''}}, {lbl: '纳税额', key: 'taxPay', type: 'object', factValue: (row) => { return (row)? row + '万' : ''}}],
        [{lbl: '采购物资品类', key: 'procurementGoods', type:'object', factValue: (row) => {return row.map(itm => itm.name).join(',')}}, {lbl: '希望我们增加提供采购的物资品类（可详细填写）', key: 'hopeAddGoods', type:'object', factValue: (row) => {return row.map(itm => itm.name).join(',')}}],
        [{lbl: '与其他公司的合作模式（提供服务、交易规则、物资品类）', key: 'otherCooperateModel'}, {lbl: '经营物资品类', key: 'dealGoods', type:'object', factValue: (row) => {return row.map(itm => itm.name).join(',')}}],
        [{lbl: '采购用途', key: 'procurementPurpose', type:'object', factValue: (row) => {return row.map(itm => itm.name).join(',')}}, {lbl: '订金需求', key: 'depositRequirement'}],
        [{lbl: '经营用途', key: 'dealPurpose', type:'object', factValue: (row) => {return row.map(itm => itm.name).join(',')}}, {lbl: '常用开平尺寸', key: 'depositCycle'}],
        [{lbl: '订金金额', key: 'depositRate', type: 'object', factValue: (row) => {return row ? row + '%' : ''}}, {lbl: '加工需求', key: 'processRequirement', type:'object', factValue: (row) => {return row.map(itm => itm.name).join(',')}}],
        [{lbl: '订金周期', key: 'depositCycle', type: 'object', factValue: (row) => {return row ? row + '天' : ''}}, {lbl: '备注信息', key: 'remark'}]
      ],
      isEdit: true
    }
  },
  beforeMount () {
    if (this.currentUser.id !== 1) {
      let idx = this.currentUser.auths.findIndex(itm => this.$route.path.startsWith(itm.fkMenu.pageUrl))
      const currentAuth = this.currentUser.auths[idx]
      if (currentAuth.hasUpdate === 0) this.isEdit = false
    }
    this.loadData()
  },
  props: {
    url: {
      type: String,
      default: ''
    }
    // isEdit: {
    //   type: Boolean,
    //   default: true
    // }
  },
  methods: {
    editForm () {
      this.jump({ path: this.url + 'form/?type=edit&id=' + this.$route.query.id})
    },
    async loadData () {
      try {
        let { data } = await this.apiStreamPost('/proxy/common/get', {url:'customerManage/customer/' + this.$route.query.id})
        if (data.returnCode === 0) {
          this.obj = data.obj
          this.obj.setUpDateStr = (data.obj.setUpDate) ? this.date2Str(new Date(data.obj.setUpDate)) : ''
          this.obj.startTime = (data.obj.startTime) ? this.date2Str(new Date(data.obj.startTime)) : ''          
          this.obj.cstmType = (data.obj.cstmType == 1) ? '老客户' : '新客户'
          this.$emit('cb', this.obj)
        } else {
          this.msgShow(this, data.errMsg)
        }
      } catch (e) {
        console.error(e)
        this.msgShow(this)
      }
    }
  }
}
</script>
<style lang="styl", scoped>
  .label-style
    label
      width: 100%!important
  .zoomImg
    img
      width 200px
      height 200px
      border-radius 50% !important
      border 1px solid #ddd
    &:hover
      cursor pointer
</style>