<template lang="pug">
.content
  breadcrumb(:breadItems="breadItems")
  .mt-15
    el-button(size="small", @click="back()") 返回列表
  detail-table.mt-15(:tableForm="formItems", :tableValue="obj", v-if="obj.id")
</template>

<script>
import breadcrumb from '@/components/Breadcrumb.vue'
import detailTable from '@/components/DetailTable.vue'
export default {
  layout: 'main',
  components: {
    breadcrumb,
    detailTable
  },
  data () {
    return {
      breadItems: ['客户管理', '潜在客户', '潜在客户详情'],
      obj: {},
      formItems: [
        [{lbl: '客户类型', key: 'customerType'}, {lbl: '状态', key: 'status'}],
        [{lbl: '公司名称', key: 'compName'}, {lbl: '简称', key: 'compNameAb'}],
        [{lbl: '助记码', key: 'memberCode'}, {lbl: '创建时间', key: 'createAt'}],
        [{lbl: '最近编辑时间', key: 'updateAt'}, {lbl: '客户来源', key: 'customerSource'}],
        [{lbl: '客户渠道', key: 'customerChannel'}, {lbl: 'ERP编号', key: 'erpCode'}],
        [{lbl: '电商会员编号', key: 'ebusiMemberCode'}, {lbl: '电商管理员账号', key: 'ebusiAdminAcctNo'}],
        [{lbl: '业务关系', key: 'busiRelation', type:'object', factValue: (row) => {return row.map(itm => itm.name).join(',')}}, {lbl: '客户性质', key: 'fkCustomProperty', type:'object', factValue: (row) => {return row.name}}],
        [{lbl: '业务部门', key: 'fkDpt', type:'object', factValue: (row) => {return row.name}}, {lbl: '业务员', key: 'fkAcct', type:'object', factValue: (row) => {return row.name}}],
        [{lbl: '工商证照编码', key: 'busiLicenseCode'}, {lbl: '注册资本', key: 'registerCapital'}],
        [{lbl: '法人代表', key: 'legalRept'}, {lbl: '公司logo', key: ''}],
        [{lbl: '公司地址', key: 'compAddr'}, {lbl: '传真号码', key: 'faxNum'}],
        [{lbl: '公司规模', key: 'compSize'}, {lbl: '公司类型', key: 'compType'}],
        [{lbl: '地区', key: 'region'}, {lbl: '成立日期', key: 'setUpDate'}],
        [{lbl: '实际控制人', key: 'factController'}, {lbl: '实际控制人身份证', key: 'factControllerIdno'}],
        [{lbl: '主联系人', key: 'linkers', type:'object', factValue: (row) => {
          let idx = row.findIndex(itm => itm.mainStatus === 1)
          return row[idx].name 
        }}, {lbl: '联系电话', key: 'linkers', type:'object', factValue: (row) => {
          let idx = row.findIndex(itm => itm.mainStatus === 1)
          return row[idx].phone 
        }}],
        [{lbl: '性别', key: 'linkers', type:'object', factValue: (row) => {
          let idx = row.findIndex(itm => itm.mainStatus === 1)
          return row[idx].sex == 1 ? '男' : '女' 
        }}, {lbl: '年龄', key: 'linkers', type:'object', factValue: (row) => {
          let idx = row.findIndex(itm => itm.mainStatus === 1)
          return row[idx].age 
        }}],
        [{lbl: '学历', key: 'linkers', type:'object', factValue: (row) => {
          let idx = row.findIndex(itm => itm.mainStatus === 1)
          return row[idx].edu 
        }}, {lbl: '籍贯', key: 'linkers', type:'object', factValue: (row) => {
          let idx = row.findIndex(itm => itm.mainStatus === 1)
          return row[idx].nativePlace 
        }}],
        [{lbl: '微信', key: 'linkers', type:'object', factValue: (row) => {
          let idx = row.findIndex(itm => itm.mainStatus === 1)
          return row[idx].wxNo 
        }}, {lbl: 'QQ', key: 'linkers', type:'object', factValue: (row) => {
          let idx = row.findIndex(itm => itm.mainStatus === 1)
          return row[idx].qqNo 
        }}],
        [{lbl: '新浪微博', key: 'linkers', type:'object', factValue: (row) => {
          let idx = row.findIndex(itm => itm.mainStatus === 1)
          return row[idx].wbName 
        }}, {lbl: '其他联系方式', key: 'linkers', type:'object', factValue: (row) => {
          let idx = row.findIndex(itm => itm.mainStatus === 1)
          return row[idx].otherLinkWay 
        }}],
        [{lbl: '税号', key: 'tfn'}, {lbl: '开户名称', key: 'openAcctName'}],
        [{lbl: '开票地址', key: 'billAddr'}, {lbl: '开户账号', key: 'openAcct'}],
        [{lbl: '开户银行', key: 'openBank'}, {lbl: '所处行业', key: 'industry'}],
        [{lbl: '经营范围', key: 'busiScope'}, {lbl: '采购周期', key: 'purchaseCycle'}],
        [{lbl: '月采吨位', key: 'weightPerMonth'}, {lbl: '高卖情况', key: 'sellHighStatus'}],
        [{lbl: '信用情况', key: 'creditStatus'}, {lbl: '年销售额', key: 'annualSales'}],
        [{lbl: '纳税额', key: 'taxPay'}, {lbl: '采购物资品类', key: 'procurementGoods', type:'object', factValue: (row) => {return row.map(itm => itm.name).join(',')}}],
        [{lbl: '希望我们增加提供采购的物资品类（可详细填写）', key: 'hopeAddGoods', type:'object', factValue: (row) => {return row.map(itm => itm.name).join(',')}}, {lbl: '采购用途', key: 'procurementPurpose', type:'object', factValue: (row) => {return row.map(itm => itm.name).join(',')}}],
        [{lbl: '经营物资品类', key: 'dealGoods', type:'object', factValue: (row) => {return row.map(itm => itm.name).join(',')}}, {lbl: '经营用途', key: 'dealPurpose', type:'object', factValue: (row) => {return row.map(itm => itm.name).join(',')}}],
        [{lbl: '订金需求', key: 'depositRequirement'}, {lbl: '订金金额', key: 'depositRateOpts'}],
        [{lbl: '常用开平尺寸', key: 'depositCycle'},{lbl: '订金周期', key: 'depositCycle'}],
        [{lbl: '加工需求', key: 'processRequirement', type:'object', factValue: (row) => {return row.map(itm => itm.name).join(',')}}, 
        {lbl: '与其他公司的合作模式（提供服务、交易规则、物资品类）', key: 'otherCooperateModel'}],
        [{lbl: '备注信息', key: 'remark'}]
      ]
    }
  },
  beforeMount () {
      this.loadData()
    },
  methods: {
    async loadData () {
      try {
        let { data } = await this.apiStreamPost('/proxy/common/get', {url: 'customerManage/customer/' + this.$route.query.id})
        if (data.returnCode === 0) {
          this.obj = data.obj
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
</style>