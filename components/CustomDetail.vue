<template lang="pug">
div
  el-form(ref="customform", :rules="rules", :model="form", label-width="145px", label-position="right", :disabled="disabled")
    el-row.pr-10
      el-col(:span="12")
        el-form-item(label="客户类型：")
          el-radio-group(v-model="form.customerType")
            el-radio(label= 1) 公司客户
            el-radio(label= 2) 个人客户
      el-col(:span="12")
        el-form-item(label="状态：")
          el-radio-group(v-model="form.status")
            el-radio(label= 1) 启用
            el-radio(label= 0) 停用
    el-row.pr-10
      el-col(:span="12")
        el-form-item(label="公司名称：", prop="compName")
          el-input(v-model="form.compName", placeholder="请输入公司名称", clearable)
      el-col(:span="12")
        el-form-item(label="简称：")
          el-input(v-model="form.compNameAb", placeholder="请输入简称", clearable)
    el-row.pr-10
      el-col(:span="12")
        el-form-item(label="助记码：")
          el-input(v-model="form.memberCode", placeholder="请输入助记码", :disabled="true")
      el-col(:span="12")
        el-form-item(label="创建时间：")
          el-date-picker.full-width(v-model="form.createAt", placeholder="创建时间", :disabled="true")
    el-row.pr-10
      el-col(:span="24")
        el-form-item(label="最近编辑时间：", v-if="disabled")
          el-input(v-model="form.updateAt", :disabled="true", clearable)
    el-row.pr-10
      el-col(:span="12")
        el-form-item(label="客户来源：")
          el-input(v-model="form.customerSource", :disabled="true", clearable)
      el-col(:span="12")
        el-form-item(label="客户渠道：")
          el-select.full-width(v-model="form.customerChannel", placeholder="请选择客户渠道")
            el-option(v-for="item in customerChannelOpts", :key="item.value", :label="item.label", :value="item.value")
    el-row.pr-10
      el-col(:span="8")
        el-form-item(label="ERP编号：")
          el-input(v-model="form.erpCode", :disabled="true", clearable)
      el-col(:span="8")
        el-form-item(label="电商会员编号：")
          el-input(v-model="form.ebusiMemberCode", :disabled="true", clearable)
      el-col(:span="8")
        el-form-item(label="电商管理员账号：")
          el-input(v-model="form.ebusiAdminAcctNo", :disabled="true", clearable)
    el-row.pr-10
      el-col(:span="12")
        el-form-item(label="业务关系：", prop="fkRelation")
          el-select.full-width(v-model="form.fkRelation",  multiple, filterable, allow-create, default-first-option, placeholder="请选择业务关系")
            el-option(v-for="item in form.fkRelationVal", :key="item.id", :label="item.name", :value="item.id")
      el-col(:span="12")
        el-form-item(label="客户性质：", prop="fkCustomPropertyId")
          el-select.full-width(v-model="form.fkCustomPropertyId", placeholder="请选择客户性质")
            el-option(v-for="item in form.fkCustomPropertyIdVal", :key="item.id", :label="item.name", :value="item.id")
    el-row.pr-10
      el-col(:span="12")
        el-form-item(label="业务部门：", prop="fkDptId")
          el-select.full-width(v-model="form.fkDptId" filterable placeholder="请选择业务部门")
            el-option(v-for="item in form.fkDptIdVal", :key="item.id", :label="item.name", :value="item.id")

      el-col(:span="12")
        el-form-item(label="业务员：", prop="fkAcctId")
          el-select.full-width(v-model="form.fkAcctId" filterable placeholder="请选择业务员")
            el-option(v-for="item in form.fkAcctIdVal",:key="item.id", :label="item.name", :value="item.id")
    el-row.pr-10
      el-col(:span="12")
        el-form-item(label="工商证照编码：", prop="busiLicenseCode")
          el-input(v-model="form.busiLicenseCode", placeholder="请输入工商证照编码", clearable)
      el-col(:span="10")
        .row
          .col
            el-form-item(label="注册资本：", prop="registerCapital")
              //- el-input(v-model="form.registerCapital", placeholder="请输入注册资本", clearable)
              el-input-number.full-width(v-model="form.registerCapital", :precision="1", :controls="false")
          .col.flex-10.mt-10.ml-5 万
    el-row.pr-10
      el-col(:span="12")
        el-form-item(label="法人代表：", prop="legalRept")
          el-input(v-model="form.legalRept", placeholder="请输入法人代表", clearable)
      el-col(:span="12")
        el-form-item(label="公司logo：")
          //- el-upload(action="", multiple)
          //-   el-button(size="small", type="success") 点击上传
          //-   span.pl-10(slot="tip") 只能上传jpg/png文件，且不超过500kb
          //- single-pic-upload(action="customer", v-model="formVal.image")
    el-row.pr-10
      el-col(:span="12")
        el-form-item(label="公司地址：", prop="compAddr")
          el-input(v-model="form.compAddr", placeholder="请输入公司地址", clearable)
      el-col(:span="12")
        el-form-item(label="传真号码：", prop="faxNum")
          el-input(v-model="form.faxNum", placeholder="请输入传真号码", clearable)
    el-row.pr-10
      el-col(:span="12")
        el-form-item(label="公司规模：")
          el-select.full-width(v-model="form.compSize", placeholder="请选择公司规模")
            el-option(v-for="item in compSizeOpts", :key="item.value", :label="item.label", :value="item.value")
      el-col(:span="12")
        el-form-item(label="公司类型：")
          el-select.full-width(v-model="form.compType", placeholder="请选择公司类型")
            el-option(v-for="item in compTypeOpts", :key="item.value", :label="item.label", :value="item.value")
    el-row.pr-10
      el-col(:span="12")
        el-form-item(label="地区：")
          el-input(v-model="form.region", placeholder="请输入地区", clearable)
      el-col(:span="12")
        el-form-item(label="成立日期：")
          el-date-picker.full-width(v-model="form.fkSetUpDate", type="date", placeholder="选择日期", value-format="yyyy-MM-dd", format="yyyy-MM-dd")
    el-row.pr-10
      el-col(:span="12")
        el-form-item(label="实际控制人：", prop="compAddr")
          el-input(v-model="form.factController", placeholder="请输入实际控制人", clearable)
      el-col(:span="12")
        el-form-item(label="实际控制人身份证：", prop="factControllerIdno")
          el-input(v-model="form.factControllerIdno", placeholder="请输入实际控制人身份证", clearable)
    el-row.pr-10
      el-col(:span="12")
        el-form-item(label="主联系人：", prop="name")
          el-input(v-model="form.name", placeholder="请输入主联系人", clearable)
      el-col(:span="12")
        el-form-item(label="联系电话：", prop="phone")
          el-input(v-model="form.phone", placeholder="请输入联系电话", clearable)
    el-row.pr-10
      el-col(:span="6")
        el-form-item(label="性别：", prop="")
          el-select.full-width(v-model="form.sex", placeholder="请选择性别")
            el-option(v-for="item in sexOpts", :key="item.value", :label="item.label", :value="item.value")
      el-col(:span="6")
        el-form-item(label="年龄：")
          //- el-input(v-model="form.age", placeholder="请输入年龄", clearable)
          el-input-number.full-width(v-model="form.age", placeholder="请输入年龄", clearable, :controls="false")
      el-col(:span="6")
        el-form-item(label="学历：")
          el-select.full-width(v-model="form.edu", placeholder="请选择学历")
            el-option(v-for="item in eduOpts", :key="item.value", :label="item.label", :value="item.value")
      el-col(:span="6")
        el-form-item(label="籍贯：")
          el-input(v-model="form.nativePlace", placeholder="请输入籍贯", clearable)
    el-row.pr-10
      el-col(:span="12")
        el-form-item(label="微信：", prop="wxNo")
          el-input(v-model="form.wxNo", placeholder="请输入微信号", clearable)
      el-col(:span="12")
        el-form-item(label="QQ：")
          el-input(v-model="form.qqNo", placeholder="请输入QQ", clearable)
    el-row.pr-10
      el-col(:span="12")
        el-form-item(label="新浪微博：", prop="wbName")
          el-input(v-model="form.wbName", placeholder="请输入新浪微博昵称", clearable)
      el-col(:span="12")
        el-form-item(label="其他联系方式：")
          el-input(v-model="form.otherLinkWay", placeholder="请输入其他联系方式", clearable)
    el-row.pr-10
      el-col(:span="12")
        el-form-item(label="税号：", prop="tfn")
          el-input(v-model="form.tfn", placeholder="请输入税号", clearable)
      el-col(:span="12")
        el-form-item(label="开户名称：")
          el-input(v-model="form.openAcctName", placeholder="请输入开户名称", clearable)
    el-row.pr-10
      el-col(:span="12")
        el-form-item(label="开户银行：", prop="openBank")
          el-input(v-model="form.openBank", placeholder="请输入开户银行", clearable)
      el-col(:span="12")
        el-form-item(label="开户账号：")
          el-input(v-model="form.openAcct", placeholder="请输入开户账号", clearable)
    el-row.pr-10
      el-col(:span="24")
        el-form-item(label="开票地址：", prop="billAddr")
          el-input(v-model="form.billAddr", placeholder="请输入开票地址", clearable)
    el-row.pr-10
      el-col(:span="12")
        el-form-item(label="所处行业：", prop="industry")
          el-input(v-model="form.industry", placeholder="请输入所处行业", clearable)
      el-col(:span="12")
        el-form-item(label="经营范围：")
          el-input(v-model="form.busiScope", placeholder="请输入经营范围", clearable)
    el-row.pr-10
      el-col(:span="6")
        el-form-item(label="采购周期：", prop="")
          el-select.full-width(v-model="form.purchaseCycle", placeholder="请选择采购周期")
            el-option(v-for="item in purchaseCycleOpts", :key="item.value", :label="item.label", :value="item.value")
      el-col(:span="5")
        .row
          .col
            el-form-item(label="月采吨位：")
              //- el-input(v-model="form.weightPerMonth")
              el-input-number.full-width(v-model="form.weightPerMonth", :precision="1", :controls="false")
          .col.flex-10.mt-10.ml-5 吨
      el-col(:span="6")
        el-form-item(label="高卖情况：")
          el-select.full-width(v-model="form.sellHighStatus", placeholder="请选择高卖情况")
            el-option(v-for="item in isSellHighOpts", :key="item.value", :label="item.label", :value="item.value")
      el-col(:span="6")
        el-form-item(label="信用情况：")
          el-select.full-width(v-model="form.creditStatus", placeholder="请选择信用情况")
            el-option(v-for="item in creditStatusOpts", :key="item.value", :label="item.label", :value="item.value")
    el-row.pr-10
      el-col(:span="11")
        .row
          .col
            el-form-item(label="年销售额：", prop="annualSales")
              //- el-input(v-model="form.annualSales", placeholder="请输入所处行业", clearable)
              el-input-number.full-width(v-model="form.annualSales", :precision="1", placeholder="请输入所处行业", clearable, :controls="false")
          .col.flex-10.mt-10.ml-5 万
      el-col(:span="11")
        .row
          .col
            el-form-item(label="纳税额：")
              //- el-input(v-model="form.taxPay", placeholder="请输入经营范围", clearable)
              el-input-number.full-width(v-model="form.taxPay", :precision="1", placeholder="请输入经营范围", clearable, :controls="false")
          .col.flex-10.mt-10.ml-5 万
    el-row.pr-10
      el-col(:span="12")
        el-form-item(label="采购物资品类：")
          el-select.full-width(v-model="form.fkPurchaseGoods", multiple, filterable, allow-create, default-first-option, placeholder="请选择采购周期")
            el-option(v-for="item in form.fkPurchaseGoodsVal", :key="item.id", :label="item.name", :value="item.name")
      el-col(:span="12")
        el-form-item(label="采购用途：")
          el-select.full-width(v-model="form.fkPurchaseUse", multiple, filterable, allow-create, default-first-option, placeholder="请输入采购用途")
            el-option(v-for="item in form.fkPurchaseUseVal", :key="item.id", :label="item.name", :value="item.name")
    el-row.pr-10
      el-col(:span="24")
        el-form-item(label="希望我们增加提供采购的物资品类（可详细填写）:",  label-width="350px")
          el-select.full-width(v-model="form.fkHopeAddGoods", multiple, filterable, allow-create, default-first-option, placeholder="请输入采购用途")
            el-option(v-for="item in form.fkHopeAddGoodsVal", :key="item.id", :label="item.name", :value="item.name")
    el-row.pr-10
      el-col(:span="12")
        el-form-item(label="经营物资品类：")
          el-select.full-width(v-model="form.fkDealGoods", multiple, filterable, allow-create, default-first-option, placeholder="请选择经营物资品类")
            el-option(v-for="item in form.fkDealGoodsVal", :key="item.id", :label="item.name", :value="item.name")
      el-col(:span="12")
        el-form-item(label="经营用途：")
          el-select.full-width(v-model="form.fkDealPurposeUse", multiple, filterable, allow-create, default-first-option, placeholder="请选择经营用途")
            el-option(v-for="item in form.fkDealPurposeUseVal", :key="item.id", :label="item.name", :value="item.name")
    el-row.pr-10
      el-col(:span="8")
        el-form-item(label="订金需求：")
          el-select.full-width(v-model="form.depositRequirement", placeholder="请选择订金需求")
            el-option(v-for="item in depositRequirementOpts", :key="item.value", :label="item.label", :value="item.value")
      el-col(:span="8")
        .row
          .col
            el-form-item(label="订金金额：")
              el-select.full-width(v-model="form.depositRate", filterable, allow-create, default-first-option, placeholder="请选择订金金额")
                el-option(v-for="item in depositRateOpts", :key="item.value", :label="item.label", :value="item.value")
          .col.flex-10.mt-10.ml-5 %
      el-col(:span="8")
        .row
          .col
            el-form-item(label="订金周期：")
              el-select.full-width(v-model="form.depositCycle", filterable, allow-create, default-first-option, placeholder="请选择订金金额")
                el-option(v-for="item in depositCycleOpts", :key="item.value", :label="item.label", :value="item.value")
          .col.flex-10.mt-10.ml-5 天
    el-row.pr-10
      el-col(:span="24")
        el-form-item(label="加工需求：")
          el-select.full-width(v-model="form.fkProcessingRequirements", multiple, filterable, allow-create, default-first-option, placeholder="请选择加工需求")
            el-option(v-for="item in form.fkProcessingRequirementsVal", :key="item.id", :label="item.name", :value="item.name")
    el-row.pr-10
      el-col(:span="24")
        el-form-item(label="常用开平尺寸：")
          el-input(v-model="form.kaipingSize", placeholder="请输入开平尺寸", clearable)
    el-row.pr-10
      el-col(:span="24")
        el-form-item(label="与其他公司的合作模式（提供服务、交易规则、物资品类）:",  label-width="400px")
          el-input(v-model="form.otherCooperateModel", placeholder="请输入合作模式", clearable)
    el-row.pr-10
      el-col(:span="24")
        el-form-item(label="备注信息：")
          el-input(v-model="form.remark", placeholder="请输入备注信息", clearable)
    el-row.pr-10
      el-col.text-center.ft-16.bg-gray.text-white.pt-15.pb-15.mb-20(:span="24") 附件信息
    el-row.text-center
      el-col(:span="6")
        .ft-18.mb-15 营业执照(三证合一)
        single-pic-upload(action="customer", v-model="form.busiLicenseUrl")
      el-col(:span="6")
        .ft-18.mb-15 税务登记证
        single-pic-upload(action="customer", v-model="form.taxRegisterUrl")
      el-col(:span="6")
        .ft-18.mb-15 组织结构代码证
        single-pic-upload(action="customer", v-model="form.orgCertificateUrl")
      el-col(:span="6")
        .ft-18.mb-15 开票资料
        single-pic-upload(action="customer", v-model="form.invoiceInfoUrl")
    el-row.mt-25.text-center
      el-button(type="primary", @click="onSubmit('save')") {{$route.query.type == 'new' ? '保存' : '更新'}}
      el-button(@click="onSubmit('cancel')") 取消
</template>

<script>
import breadcrumb from '@/components/Breadcrumb.vue'
import singlePicUpload from '@/components/SinglePicUpload.vue'
import { mapState } from 'vuex'
export default {
  layout: 'main',
  components: {
    breadcrumb,
    singlePicUpload
  },
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    originObj: {
      type: null,
      default: false
    }
  },
  data () {
    return {
      uploadAction: 'https://jsonplaceholder.typicode.com/posts/',
      form: {
        compName: '', compNameAb: null,  memberCode: null, customerSource: '型云移动端注册', customerChannel: null, erpCode: null, ebusiMemberCode: null, ebusiAdminAcctNo: null, customerType: '1', busiLicenseCode: null, registerCapital: null, legalRept: null, compLogoUrl: null, compAddr: null, faxNum: null, compSize: null, compType: null, region: null, fkSetUpDate: '', factController: null, factControllerIdno: null, tfn: null, openAcctName: null, openBank: null, openAcct: null, billAddr: null, industry: null, busiScope: null, purchaseCycle: null, weightPerMonth: '0.0', sellHighStatus: null, creditStatus: null, annualSales: '0.0', taxPay: '0.0',depositRequirement: null, depositRate: '', depositCycle: '', kaipingSize: null, otherCooperateModel: null, remark: null, busiLicenseUrl: null, taxRegisterUrl: null, orgCertificateUrl: null, invoiceInfoUrl: null, status: '1', fkRelation: [], fkCustomPropertyId: '', fkDptId: '', fkAcctId: '', fkPurchaseGoods: [], fkPurchaseUse: [], fkHopeAddGoods: [], fkDealGoods: [], fkDealPurposeUse: [], fkProcessingRequirements: [], name: '', phone: '', sex: null, age: null, edu: null, nativePlace: null, wxNo: null, qqNo: null, wbName: null, otherLinkWay: null,fkRelationVal: [], fkCustomPropertyIdVal: null, fkDptIdVal: [], fkAcctIdVal: [], fkPurchaseGoodsVal: [], fkDealGoodsVal: [], fkPurchaseUseVal: [], fkDealPurposeUseVal: [], fkProcessingRequirementsVal: [], fkHopeAddGoodsVal: [], depositRateVal: [], depositCycleVal: [], createAt: new Date(),
      },
      formVal: {
        createAt: new Date(),
        fkRelationVal: [],
        fkCustomPropertyIdVal: '',
        fkDptIdVal: '',
        fkDptName: '',
        fkAcctIdVal: '',
        fkAcctName: '',
        fkPurchaseGoodsVal: [],
        fkDealGoodsVal: [],
        fkPurchaseUseVal: [],
        fkDealPurposeUseVal: [],
        fkProcessingRequirementsVal: [],
        fkHopeAddGoodsVal: [],
        depositRateVal: '',
        depositCycleVal: ''
      },
      rules: {
        compName: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
        fkRelation: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        fkCustomPropertyId: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        fkDptId: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        fkAcctId: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        name: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        phone: [
          { required: true, message: '不能为空', trigger: 'change' }
        ]
      },
      timeout: null
    }
  },
  computed: {
    ...mapState({
      eduOpts: state => state.eduOpts,
      sexOpts: state => state.sexOpts,
      compSizeOpts: state => state.compSizeOpts,
      compTypeOpts: state => state.compTypeOpts,
      customerChannelOpts: state => state.customerChannelOpts,
      purchaseCycleOpts: state => state.purchaseCycleOpts,
      isSellHighOpts: state => state.isSellHighOpts,
      creditStatusOpts: state => state.creditStatusOpts,
      depositRequirementOpts: state => state.depositRequirementOpts,
      depositRateOpts: state => state.depositRateOpts,
      depositCycleOpts: state => state.depositCycleOpts
    })
  },
  methods: {
    onSubmit (str) {
      this.$refs.customform.validate((valid) => {
        if (valid) {
          if(str == 'save') {
            this.customDetailCreate()
          } else {
            this.back()
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      })
    },
    async customDetailCreate () {
      try {
        console.log(this.form)
        let url = 'customerManage/customer/create'
        if (this.$route.query.type === 'edit') {
          url = 'customerManage/customer/update'
          delete this.form.updateAt
          delete this.form.fkDpt
          delete this.form.fkCustomProperty
          delete this.form.fkAcct
          delete this.form.linkers
          delete this.form.busiRelation
          delete this.form.setUpDate
          delete this.form.createAcct
          delete this.form.processRequirement
          delete this.form.procurementGoods
          delete this.form.procurementPurpose
          delete this.form.hopeAddGoods
          delete this.form.dealGoods
          delete this.form.dealPurpose
          // this.form.
        }
        delete this.form.createAt
        this.form.sex = Number(this.form.sex)
        this.form.status = Number(this.form.status)
        this.form.fkDptId = Number(this.form.fkDptId)
        this.form.fkAcctId = Number(this.form.fkAcctId)
        if (this.form.sellHighStatus == undefined || this.form.sellHighStatus === '') this.form.sellHighStatus = 0
        let { data } = await this.apiStreamPost('/proxy/common/post', {url: url, params: this.form})
        if (data.returnCode === 0) {
          console.log(data)
          this.msgShow(this, this.$route.query.type === 'new' ? '保存成功' : '更新成功', 'success')
          this.back()
        } else {
          this.msgShow(this, data.errMsg)
        }
      } catch (e) {
        console.error(e)
        this.msgShow(this)
      }
    },
    remoteMethod (query) {},
    async fkRelationCreate () {
      try {
        let { data } = await this.apiStreamPost('/proxy/common/get', {url: 'basicData/busiRelation/queryCombo'})
          if (data.returnCode === 0) {
            this.form.fkRelationVal = data.list
          } else {
            this.msgShow(this, data.errMsg)
          }
      } catch (e) {
        console.error(e)
        this.msgShow(this)
      }
    },
    async fkCustomPropertyCreate () {
      try {
        let { data } = await this.apiStreamPost('/proxy/common/get', {url: 'basicData/customProperty/queryCombo'})
          if (data.returnCode === 0) {
            this.form.fkCustomPropertyIdVal = data.list
          } else {
            this.msgShow(this, data.errMsg)
          }
      } catch (e) {
        console.error(e)
        this.msgShow(this)
      }
    },
    async supplyCatalogCreate () {
      try {
        let { data } = await this.apiStreamPost('/proxy/common/get', {url: 'basicData/supplyCatalog/queryCombo'})
        if (data.returnCode === 0) {
          this.form.fkDealGoodsVal = data.list
          this.form.fkPurchaseGoodsVal = data.list
          this.form.fkHopeAddGoodsVal = data.list
        } else {
          this.msgShow(this, data.errMsg)
        }
      } catch (e) {
        console.error(e)
        this.msgShow(this)
      }
    },
    async purposeCreate () {
      try {
        let { data } = await this.apiStreamPost('/proxy/common/get', {url: 'basicData/purpose/queryCombo'})
        if (data.returnCode === 0) {
          this.form.fkPurchaseUseVal = data.list
          this.form.fkDealPurposeUseVal = data.list
        } else {
          this.msgShow(this, data.errMsg)
        }
      } catch (e) {
        console.error(e)
        this.msgShow(this)
      }
    },
    async processReqCreate () {
      try {
        let { data } = await this.apiStreamPost('/proxy/common/get', {url: 'basicData/processReq/queryCombo'})
        if (data.returnCode === 0) {
          this.form.fkProcessingRequirementsVal = data.list
        } else {
          this.msgShow(this, data.errMsg)
        }
      } catch (e) {
        console.error(e)
        this.msgShow(this)
      }
    },
    async fkDptCreate () {
      let me = this
      try {
        let { data } = await this.apiStreamPost('/proxy/common/get', {url: 'setting/dpt/queryCombo'})
          if (data.returnCode === 0) {
            me.form.fkDptIdVal = data.list
          } else {
            this.msgShow(this, data.errMsg)
          }
      } catch (e) {
        console.error(e)
        this.msgShow(this)
      }
    },
    async fkAccCreate () {
      let me = this
      try {
        let { data } = await this.apiStreamPost('/proxy/common/get', {url: 'setting/acct/queryCombo'})
          if (data.returnCode === 0) {
            me.form.fkAcctIdVal = data.list
            console.log(me.form.fkAcctId)
          } else {
            this.msgShow(this, data.errMsg)
          }
      } catch (e) {
        console.error(e)
        this.msgShow(this)
      }
    }
  },
  mounted() {
    this.fkRelationCreate()
    this.fkCustomPropertyCreate()
    this.fkDptCreate()
    this.fkAccCreate()
    this.supplyCatalogCreate()
    this.purposeCreate()
    this.processReqCreate()
    if (this.originObj) this.form = this.originObj
  },
  watch: {
    originObj (newVal, oldVal) {
      console.log('xxx----')
      console.log(newVal)
      this.form = Object.assign(this.form, newVal)
      this.form.customerType = newVal.customerType.toString()
      this.form.status = newVal.status.toString()
      this.form.fkDptId = newVal.fkDpt.id
      this.form.fkAcctId = newVal.fkAcct.id
      this.form.fkCustomPropertyId = newVal.fkCustomProperty.id
      this.form.fkRelation = newVal.busiRelation.map(itm => itm.id)
      this.form.name = newVal.linkers[0].name
      this.form.phone = newVal.linkers[0].phone
      this.form.sex = newVal.linkers[0].sex
      this.form.age = newVal.linkers[0].age
      this.form.edu = newVal.linkers[0].edu
      this.form.nativePlace = newVal.linkers[0].nativePlace
      this.form.wxNo = newVal.linkers[0].wxNo
      this.form.qqNo = newVal.linkers[0].qqNo
      this.form.wbName = newVal.linkers[0].wbName
      this.form.otherLinkWay = newVal.linkers[0].otherLinkWay
      this.form.linkId = newVal.linkers[0].id
      this.form.fkPurchaseGoods = newVal.procurementGoods.map(item => item.name)
      this.form.fkPurchaseUse = newVal.procurementPurpose.map(item => item.name)
      this.form.fkHopeAddGoods = newVal.hopeAddGoods.map(item => item.name)
      this.form.fkProcessingRequirements = newVal.processRequirement.map(itm => itm.name)
      this.form.fkDealGoods = newVal.dealGoods.map(itm => itm.name)
      this.form.fkDealPurposeUse = newVal.dealPurpose.map(itm => itm.name)
      this.form.sellHighStatus = newVal.sellHighStatus
      this.form.fkSetUpDate = this.date2Str(new Date(newVal.setUpDate))
      console.log(this.form.fkSetUpDate)
      this.$forceUpdate()
    }
  }
}
</script>
<style lang="styl", scoped>
  .label-style
    label
      width: 100%!important
  .avatar-uploader
    width: 200px
    margin: 0 auto
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>