<template lang="pug">
  div
    p 潜在客户详情
    .mt-15
      el-form(ref="form", :rules="rules", :model="form", label-width="145px", label-position="right")
        el-row.pr-10
          el-col(:span="12")
            el-form-item(label="客户类型：")
              el-radio-group(v-model="form.customerType")
                el-radio(label="公司客户")
                el-radio(label="个人客户")
          el-col(:span="12") 
            el-form-item(label="状态：")
              el-radio-group(v-model="form.customerType")
                el-radio(label="启用")
                el-radio(label="停用")
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
              el-input(v-model="form.memberCode", placeholder="请输入助记码", clearable)
          el-col(:span="12")
            el-form-item(label="创建时间：")
              el-input(v-model="form.createAt", placeholder="创建时间", :disabled="true")
        el-row.pr-10
          el-col(:span="24")
            el-form-item(label="最近编辑时间：")
              el-input(v-model="form.updateAt", :disabled="true", clearable)
        el-row.pr-10
          el-col(:span="12")
            el-form-item(label="客户来源：")
              el-input(v-model="form.customerSource", :disabled="true", clearable)
          el-col(:span="12")
            el-form-item(label="客户渠道：")
              el-input(v-model="form.customerChannel", :disabled="true", clearable)
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
            el-form-item(label="业务关系：")
              el-checkbox-group(v-model="form.fkRelationVal")
                el-checkbox(v-for="item in form.fkRelation", :name="item.value", :key="item.value", :value="item.value", :label="item.label")
          el-col(:span="12")
            el-form-item(label="客户性质：")
              el-select.full-width(v-model="form.fkCustomPropertyIdVal", placeholder="请选择客户性质")
                el-option(v-for="item in form.fkCustomPropertyId", :key="item.value", :label="item.label", :value="item.value")
        el-row.pr-10
          el-col(:span="12")
            el-form-item(label="业务部门：")
              el-autocomplete.full-width(v-model="form.fkDptIdVal", :fetch-suggestions="fkDptSearchAsync", placeholder="请输入业务部门", @select="handleSelect")
          el-col(:span="12")
            el-form-item(label="业务员：", prop="fkAcctId")
              el-autocomplete.full-width(v-model="form.fkAcctIdVal", :fetch-suggestions="fkAcctSearchAsync", placeholder="请输入业务员", @select="handleSelect")
        el-row.pr-10
          el-col(:span="12")
            el-form-item(label="工商证照编码：", prop="busiLicenseCode")
              el-input(v-model="form.busiLicenseCode", placeholder="请输入工商证照编码", clearable)
          el-col(:span="10")
            el-form-item(label="注册资本：", prop="registerCapital")
              el-input(v-model="form.registerCapital", placeholder="请输入注册资本", clearable)
                template(slot="append") 万
        el-row.pr-10
          el-col(:span="12")
            el-form-item(label="法人代表：", prop="legalRept")
              el-input(v-model="form.legalRept", placeholder="请输入法人代表", clearable)
          el-col(:span="12")
            el-form-item(label="公司logo：")
              el-upload(action="", multiple)
                el-button(size="small", type="success") 点击上传
                span.pl-10(slot="tip") 只能上传jpg/png文件，且不超过500kb
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
              el-select.full-width(v-model="form.compSizeVaL", placeholder="请选择公司规模")
                el-option(v-for="item in form.compSize", :key="item.value", :label="item.label", :value="item.value")
          el-col(:span="12")
            el-form-item(label="公司类型：")
              el-select.full-width(v-model="form.compTypeVal", placeholder="请选择公司类型")
                el-option(v-for="item in form.compType", :key="item.value", :label="item.label", :value="item.value")
        el-row.pr-10
          el-col(:span="12")
            el-form-item(label="地区：")
              el-input(v-model="form.region", placeholder="请输入地区", clearable)
          el-col(:span="12")
            el-form-item(label="成立日期：")
              el-date-picker.full-width-import(v-model="form.setUpDate", type="date", placeholder="选择日期")
        el-row.pr-10
          el-col(:span="12")
            el-form-item(label="实际控制人：", prop="compAddr")
              el-input(v-model="form.factController", placeholder="请输入实际控制人", clearable)
          el-col(:span="12")
            el-form-item(label="实际控制人身份证：", prop="factControllerIdno")
              el-input(v-model="form.factControllerIdno", placeholder="请输入实际控制人身份证", clearable)
        el-row.pr-10
          el-col(:span="12")
            el-form-item(label="主联系人：", prop="compName")
              el-input(v-model="form.compName", placeholder="请输入主联系人", clearable)
          el-col(:span="12")
            el-form-item(label="联系电话：")
              el-input(v-model="form.compNameAb", placeholder="请输入联系电话", clearable)
        el-row.pr-10
          el-col(:span="6")
            el-form-item(label="性别：", prop="")
              el-select.full-width(v-model="form.sexVal", placeholder="请选择性别")
                el-option(v-for="item in form.sex", :key="item.value", :label="item.label", :value="item.value")
          el-col(:span="6")
            el-form-item(label="年龄：")
              el-input(v-model="form.age", placeholder="请输入年龄", clearable)
          el-col(:span="6")
            el-form-item(label="学历：")
              el-select.full-width(v-model="form.educationVal", placeholder="请选择学历")
                el-option(v-for="item in form.education", :key="item.value", :label="item.label", :value="item.value")
          el-col(:span="6")
            el-form-item(label="籍贯：")
              el-input(v-model="form.origin", placeholder="请输入籍贯", clearable)
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
              el-input(v-model="form.ortherLinkWay", placeholder="请输入其他联系方式", clearable)
        el-row.pr-10
          el-col(:span="12")
            el-form-item(label="税号：", prop="tfn")
              el-input(v-model="form.tfn", placeholder="请输入新浪微博昵称", clearable)
          el-col(:span="12")
            el-form-item(label="开户名称：")
              el-input(v-model="form.openAcctName", placeholder="请输入开户名称", clearable)
        el-row.pr-10
          el-col(:span="12")
            el-form-item(label="开户银行：", prop="openBank")
              el-input(v-model="form.openBank", placeholder="请输入开户银行", clearable)
          el-col(:span="12")
            el-form-item(label="开户账号：")
              el-input(v-model="form.openAccount", placeholder="请输入开户账号", clearable)
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
              el-select.full-width(v-model="form.purchaseCycleVal", placeholder="请选择采购周期")
                el-option(v-for="item in form.purchaseCycle", :key="item.value", :label="item.label", :value="item.value")
          el-col(:span="5")
            el-form-item(label="月采吨位：")
              el-input(v-model="form.age")
                template(slot="append") 吨
          el-col(:span="6")
            el-form-item(label="高卖情况：")
              el-select.full-width(v-model="form.isSellHeightVal", placeholder="请选择高卖情况")
                el-option(v-for="item in form.isSellHeight", :key="item.value", :label="item.label", :value="item.value")
          el-col(:span="6")
            el-form-item(label="信用情况：")
              el-select.full-width(v-model="form.creditStatusVal", placeholder="请选择信用情况")
                el-option(v-for="item in form.creditStatus", :key="item.value", :label="item.label", :value="item.value")
        el-row.pr-10
          el-col(:span="11")
            el-form-item(label="年销售额：", prop="annualSales")
              el-input(v-model="form.annualSales", placeholder="请输入所处行业", clearable)
                template(slot="append") 万
          el-col(:span="11")
            el-form-item(label="纳税额：")
              el-input(v-model="form.taxPay", placeholder="请输入经营范围", clearable)
                template(slot="append") 万
        el-row.pr-10
          el-col(:span="12")
            el-form-item(label="采购物资品类：")
              el-select.full-width(v-model="form.purchaseGoodsCateVal", multiple, filterable, allow-create, default-first-option, placeholder="请选择采购周期，号隔开")
                el-option(v-for="item in form.purchaseGoodsCate", :key="item.value", :label="item.label", :value="item.value")
          el-col(:span="12")
            el-form-item(label="采购用途：")
              el-select.full-width(v-model="form.purchaseUseVal", multiple, filterable, allow-create, default-first-option, placeholder="请输入采购用途，号隔开") 
                el-option(v-for="item in form.purchaseUse", :key="item.value", :label="item.label", :value="item.value")
        el-row.pr-10
          el-col(:span="24") 
            el-form-item(label="希望我们增加提供采购的物资品类（可详细填写）:",  label-width="350px")
              el-select.full-width(v-model="form.materialCategoryVal", multiple, filterable, allow-create, default-first-option, placeholder="请输入采购用途，号隔开") 
                el-option(v-for="item in form.materialCategory", :key="item.value", :label="item.label", :value="item.value")
        el-row.pr-10
          el-col(:span="12")
            el-form-item(label="经营物资品类：")
              el-select.full-width(v-model="form.purchaseGoodsCateVal", multiple, filterable, allow-create, default-first-option, placeholder="请选择经营物资品类，号隔开")
                el-option(v-for="item in form.purchaseGoodsCate", :key="item.value", :label="item.label", :value="item.value")
          el-col(:span="12")
            el-form-item(label="经营用途：")
              el-select.full-width(v-model="form.purchaseUseVal", multiple, filterable, allow-create, default-first-option, placeholder="请输入经营用途，号隔开") 
                el-option(v-for="item in form.purchaseUse", :key="item.value", :label="item.label", :value="item.value")
        el-row.pr-10
          el-col(:span="8")
            el-form-item(label="订金需求：")
              el-select.full-width(v-model="form.depositRequirementVal", placeholder="请选择订金需求")
                el-option(v-for="item in form.depositRequirement", :key="item.value", :label="item.label", :value="item.value")
          el-col(:span="8")
            el-form-item(label="订金金额：")
              el-radio-group(v-model="form.depositAmountVal")
                el-radio(v-for="item in form.depositAmount", :name="item.value", :key="item.value", :value="item.value", :label="item.label")
                //- el-input(v-model="form.annualSales")
                el-input.ml-10(v-model="form.depositAmountOtherVal", style="width:100px;")
                  template(slot="append") %
          el-col(:span="8")
            el-form-item(label="订金周期：")
              el-radio-group.full-width(v-model="form.depositCycleVal") 
                el-radio(v-for="item in form.depositCycle", :name="item.value", :key="item.value", :value="item.value", :label="item.label")
                el-input.ml-10(v-model="form.depositCycleOtherVal", style="width:100px;")
                  template(slot="append") 天
        el-row.pr-10
          el-col(:span="24")
            el-form-item(label="加工需求：")
              el-checkbox-group.full-width(v-model="form.processingRequirementsVal")
                el-checkbox(v-for="item in form.processingRequirements", :name="item.value", :key="item.value", :value="item.value", :label="item.label")
                el-input.ml-5(v-model="form.processingRequirementsOtherVal", style="width:100px;")
        el-row.pr-10
          el-col(:span="24")
            el-form-item(label="常用开平尺寸：")
              el-input(v-model="form.kaiping_size", placeholder="请输入开平尺寸", clearable)
        el-row.pr-10
          el-col(:span="24") 
            el-form-item(label="希望我们增加提供采购的物资品类（可详细填写）:",  label-width="350px")
              el-input(v-model="form.kaiping_size", placeholder="请输入合作模式", clearable)
        el-row.pr-10
          el-col(:span="24")
            el-form-item(label="备注信息：")
              el-input(v-model="form.remark", placeholder="请输入备注信息", clearable)
        el-row.pr-10
          el-col.text-center.ft-16.bg-gray.text-white.pt-15.pb-15.mb-20(:span="24") 附件信息
        el-row.text-center
          el-col(:span="6")
            .ft-18.mb-15 营业执照(三证合一)
            el-upload(class="upload-demo", drag,  action="https://jsonplaceholder.typicode.com/posts/",  multiple)
              i.el-icon-upload
              .el-upload__text 将文件拖到此处，或
                em 点击上传
              .el-upload__tip(slot="tip") 只能上传jpg/png文件，且不超过500kb
          el-col(:span="6")
            .ft-18.mb-15 税务登记证
            el-upload(class="upload-demo", drag,  action="https://jsonplaceholder.typicode.com/posts/",  multiple)
              i.el-icon-upload
              .el-upload__text 将文件拖到此处，或
                em 点击上传
              .el-upload__tip(slot="tip") 只能上传jpg/png文件，且不超过500kb
          el-col(:span="6")
            .ft-18.mb-15 组织结构代码证
            el-upload(class="upload-demo", drag,  action="https://jsonplaceholder.typicode.com/posts/",  multiple)
              i.el-icon-upload
              .el-upload__text 将文件拖到此处，或
                em 点击上传
              .el-upload__tip(slot="tip") 只能上传jpg/png文件，且不超过500kb
          el-col(:span="6")
            .ft-18.mb-15 开票资料
            el-upload(class="upload-demo", drag,  action="https://jsonplaceholder.typicode.com/posts/",  multiple)
              i.el-icon-upload
              .el-upload__text 将文件拖到此处，或
                em 点击上传
              .el-upload__tip(slot="tip") 只能上传jpg/png文件，且不超过500kb
        el-row.mt-45.text-center
          el-form-item
            el-button(type="primary", @click="onSubmit('save')") 保存
            el-button(type="info", @click="onSubmit('cancel')") 取消
</template>

<script>
  export default {
    layout: 'main',
    data () {
      return {
        form: {
          remark: '',
          processingRequirements: [{value:'001', label:'分条'}, {value:'002', label:'剪折'}, {value:'003', label:'折弯'}, {value:'004', label:'切割'}, {value:'005', label:'激光切割'}, {value:'006', label:'水刀切割'}, {value:'007', label:'等离子切割'}, {value:'008', label:'数控火焰切割'}, {value:'009', label:'焊接'}, {value:'010', label:'铆接'}, {value:'011', label:'锯床'}, {value:'012', label:'锻造'}, {value:'013', label:'定尺锯'}, {value:'014', label:'冲压'}, {value:'015', label:'机加工'}, {value:'016', label:'铣/刨/镗'}, {value:'017', label:'"车/钻/磨'}, {value:'018', label:'其他'}],
          processingRequirementsVal: [],
          processingRequirementsOtherVal: '',
          depositCycle: [{value:'001', label:'1天'}, {value:'002', label:'3天'}, {value:'003', label:'5天'}, {value:'004', label:'其他'}],
          depositCycleVal: '',
          depositCycleOtherVal: '',
          depositAmount: [{value:'001', label:'30%'}, {value:'002', label:'50%'}, {value:'003', label:'70%'}, {value:'004', label:'其他'}],
          depositAmountVal: '',
          depositAmountOtherVal: '',
          depositRequirement: [{value:'001', label:'1周'}, {value:'002', label:'2周'}],
          depositRequirementVal: '',
          materialCategory: [],
          materialCategoryVal: '',
          purchaseGoodsCate: [{value:'001', label:'良好'}, {value:'002', label:'一般'}],
          purchaseGoodsCateVal: '',
          purchaseUse: [{value:'001', label:'有'}, {value:'002', label:'无'}],
          purchaseUseVal: '',
          taxPay: '',
          annualSales: '',
          creditStatus: [{value:'001', label:'良好'}, {value:'002', label:'一般'}],
          creditStatusVal: '',
          isSellHeight: [{value:'001', label:'有'}, {value:'002', label:'无'}],
          isSellHeightVal: '',
          purchaseCycle: [{value:'001', label:'1周'}, {value:'002', label:'2周'}, {value:'003', label:'3周'}],
          purchaseCycleVal: '',
          industry: '',
          busiScope: '',
          billAddr: '',
          openBank: '',
          openAccount: '',
          tfn: '',
          openAcctName: '',
          compName: '',
          compNameAb: '',
          memberCode: '',
          customerType: '',
          createAt: '2018-05-25  16:35:35',
          customerSource: '型云移动端注册',
          customerChannel: '网络搜索',
          erpCode: '',
          ebusiMemberCode: '0003254',
          ebusiAdminAcctNo: 'C0003254',
          fkRelation: [{value:'001', label:'客戶'}, {value:'002', label:'供应商'}, {value:'003', label:'费用单位'}],// 业务关系
          fkRelationVal: [],
          fkCustomPropertyId: [{value:'001', label:'经销商'}, {value:'002', label:'终端客户'}, {value:'003', label:'生产商'}],
          fkCustomPropertyIdVal: '',
          fkAcctId: [],
          fkAcctIdVal: '',
          fkDptId: [],
          fkDptIdVal: '',
          busiLicenseCode: '',
          registerCapital: '',
          legalRept: '',
          compAddr: '',
          faxNum: '',
          compType: [{value:'001', label:'国有企业'}, {value:'002', label:'私营企业'}, {value:'003', label:'股份制企业'}, {value:'004', label:'外资企业'}, {value:'005', label:'其他'}],
          compTypeVal: '',
          compSize: [{value:'001', label:'10人以下'}, {value:'002', label:'10-50人'}, {value:'003', label:'50-100人'}, {value:'004', label:'100人以上'}],
          compSizeVal: '',
          region: '',
          setUpDate: '',
          factController: '',
          factControllerIdno: '',
          sex: [{value:'001', label:'男'}, {value:'002', label:'女'}],
          sexVal: '',
          age: '',
          education: [{value:'001', label:'本科'}, {value:'002', label:'大专'}, {value:'003', label:'中专'}, {value:'004', label:'高中'}],
          educationVal: '',
          origin: '',
          wxNo: '',
          QQNo: '',
          wbName: '',
          ortherLinkWay: '',
          timeout: null
        },
        rules: {
          comp_name: [
            { required: true, message: '请输入公司名称', trigger: 'blur' },
            { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
          ],
          date1: [
            { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
          ],
          date2: [
            { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
          ],
          type: [
            { type: 'array', required: true, message: '', trigger: 'change' }
          ],
          resource: [
            { required: true, message: '', trigger: 'change' }
          ],
          desc: [
            { required: true, message: '', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      onSubmit (str) {
        (str == 'save') ? console.log('保存') : console.log('取消')
      },
      fkDptLoadAll() {
        return [
          {'id':'001', 'value':'财务'},
          {'id':'002', 'value':'销售'},
          {'id':'003', 'value':'电商'}
        ];
      },
      fkAcctLoadAll() {
        return [
          {'id':'001', 'value':'ZHJM'},
          {'id':'002', 'value':'CZK'},
          {'id':'003', 'value':'CTH'}
        ];
      },
      fkDptSearchAsync(queryString, cb) {
        var restaurants = this.fkDptId;
        this.querySearch(queryString, cb, restaurants)
      },
      fkAcctSearchAsync(queryString, cb) {
        var restaurants = this.fkAcctId;
        this.querySearch(queryString, cb, restaurants)
      },
      querySearch(queryString, cb, restaurants) {
        // var restaurants = this.fkDptId;
        var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          cb(results);
        }, 3000 * Math.random());
      },
      createStateFilter(queryString) {
        return (state) => {
          return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      handleSelect (item) {
        console.log(item)
      }
    },
    mounted() {
      this.fkDptId = this.fkDptLoadAll();
      this.fkAcctId = this.fkAcctLoadAll();
    }
  }
</script>
<style lang="styl", scoped>
  .label-style
    label
      width: 100%!important
</style>