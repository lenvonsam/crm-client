<template lang="pug">
div
  .mb-5.bg-f9.head-title.pl-15(v-if="$route.query.type !== 'formalAdd'")
    span.text-red.ft-14 *
    span.ml-5 标记为客户必填项
    span.ml-10.text-blue.ft-14 *
    span.ml-5 标记为型云客户必填项    
  el-form(ref="form", :rules="rules", show-message, :model="form", label-width="145px", label-position="right", :disabled="disabled")
    el-row.pr-10
      el-col(:span="7")
        el-form-item(label="客户类型：")
          el-radio-group(v-model="form.cstmType")
            el-radio(label= 0) 新客户
            el-radio(label= 1) 老客户
      el-col(:span="5")
          el-form-item(label="状态：", label-width="100px")
            el-radio-group(v-model="form.status", :disabled="customerSourceDisabled")
              el-radio(label= 1) 启用
              el-radio(label= 0) 停用
      el-col(:span="12")
        el-form-item(label="起始日期")          
          el-date-picker.full-width(v-model="form.startTime", placeholder="请选择起始日期")
    el-row.pr-10
      el-col(:span="12")
        el-form-item(label="公司名称：", prop="compName")
          el-input(v-model="form.compName", placeholder="请输入公司名称", clearable, :disabled="compNameEditDisable")
      el-col(:span="12")
        el-form-item(label="简称：")
          el-input(v-model="form.compNameAb", placeholder="请输入简称", clearable)
    el-row.pr-10
      el-col(:span="12")
        el-form-item(label="主联系人：", prop="name")
          el-input(v-model="form.name", placeholder="请输入主联系人", clearable)
      el-col(:span="12")
        el-form-item(label="联系电话：", prop="phone")
          el-input(v-model="form.phone", placeholder="请输入联系电话", clearable, :disabled="(originObj && originObj.ebusiAdminAcctNo != null)")
    el-row.pr-10
      el-col(:span="12")
        el-form-item(label="业务关系：", prop="fkRelation")
          el-select.full-width(v-model="form.fkRelation",  multiple, filterable, default-first-option, placeholder="请选择业务关系")
            el-option(v-for="item in form.fkRelationVal", :key="item.id", :label="item.name", :value="item.id", :disabled="(currentUser.id !== 1 && item.name === '内部单位')")
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
        el-form-item(label="业务员：", prop="fkAcctName")
          el-select.full-width(v-model="form.fkAcctName",  value-key, filterable, remote, placeholder="请输入业务员", :remote-method="fkAccCreate", clearable)
            el-option(v-for="item in form.fkAcctIdVal", :key="item.id", :label="item.name", :value="item.id")
    el-row.pr-10
      el-col(:span="12")
        //- el-form-item(label="所处行业：", prop="industry")
        //-   el-input(v-model="form.industry", placeholder="请输入所处行业", clearable)
        el-form-item(label="所处行业：", prop="fkIndustry")
          el-select.full-width(v-model="form.fkIndustry",  multiple, filterable, default-first-option, placeholder="请选择所处行业")
            el-option(v-for="item in form.fkIndustryVal", :key="item.id", :label="item.name", :value="item.name")
      el-col(:span="12")
        el-form-item(label="地区：", prop="region")
          el-select.full-width(v-model="form.region", filterable, placeholder="请选择地区")
            el-option-group(v-for="group in cityAreaArr", :key="group.label", :label="group.label")
              el-option(v-for="item in group.options", :key="item.name", :label="item.name", :value="item.name")
    el-row.pr-10
      el-col(:span="12")
        el-form-item(label="公司地址：", prop="compAddrArr")
          .row
            .col
              el-cascader.full-width(v-model="form.compAddrArr", clearable, placeholder="请选择公司地址", separator=" ", :options="addr", filterable, change-on-select, @change="compAddrArrChange")
            .col
              el-input(v-model="form.compAddr", placeholder="请输入公司详细地址", clearable)
      el-col(:span="12")
        el-form-item(label="工作组：")
          el-select.full-width(v-model="form.workgroupName", placeholder="请选择工作组", clearable, @change="$forceUpdate()")
            el-option(v-for="item in workGroupList", :key="item.label", :label="item.label", :value="item.label")
    div(v-if="$route.query.type !== 'formalAdd'")
      el-row.pr-10        
        el-col(:span="12")
          el-form-item.validFormal(label="开户银行：")
            el-input(v-model="form.openBank", placeholder="请输入开户银行", clearable)
        el-col(:span="12")
          el-form-item.validFormal(label="税号：", prop="tfn")
            el-input(v-model="form.tfn", placeholder="请输入税号", clearable, minlength="15")
      el-row.pr-10
        el-col(:span="12")
          el-form-item(label="开票地址：")           
            el-input(v-model="form.billAddr", placeholder="请输入开票详细地址", clearable)
            //- .row
              .col
                el-cascader.full-width(v-model="form.billAddrArr", clearable, placeholder="请输入开票地址", separator=" ", :options="addr", filterable, change-on-select)
              .col
                el-input(v-model="form.billAddr", placeholder="请输入开票详细地址", clearable)    
        el-col(:span="12")
          el-form-item(label="是否后结算：")
            el-radio(v-model="form.settleDelay",label="0") 否
            el-radio(v-model="form.settleDelay", label="1") 是
      el-row.pr-10
        el-col(:span="24")
          el-form-item(label="客户单位性质:")
            el-row
              el-col(:span="6") 全款支付
              el-col(:span="12")
                el-row
                  el-col(:span="8")
                    el-checkbox(v-model="chooseDeposit") 定金支付（{{localDepositeRate}}%）
                  el-col(:span="12")
                    el-slider(v-model="localDepositeRate", :disabled="!chooseDeposit", :min="1")
              el-col(:span="6")
                el-checkbox(v-model="chooseIous", @change="iousChange") 白条支付
      el-row.pr-10
        el-col(:span="12")
          el-form-item(label="关联主体抬头：")
            el-select.full-width(v-model="form.mainCstmId", value-key, filterable, remote, placeholder="请输入关键词", :remote-method="customerGet", clearable, @change="$forceUpdate()")
              el-option(v-for="item in cstmIdList", :key="item.id", :label="item.compName", :value="item.id")

        el-col(:span="12")
      el-row.pr-10
        el-col(:span="12")
          el-form-item.validFormal(label="工商证照编码：", prop="busiLicenseCode")
            el-input(v-model="form.busiLicenseCode", placeholder="请输入工商证照编码", clearable, minlength="15")
        el-col(:span="12")
          el-form-item.validFormal(label="公司规模：")
            el-select.full-width(v-model="form.compSize", placeholder="请选择公司规模", @change="$forceUpdate()")
              el-option(v-for="item in compSizeOpts", :key="item.value", :label="item.label", :value="item.value")        
      el-row.pr-10
        el-col(:span="12")
          el-form-item.validFormal(label="公司类型：")
            el-select.full-width(v-model="form.compType", placeholder="请选择公司类型", @change="$forceUpdate()")
              el-option(v-for="item in compTypeOpts", :key="item.value", :label="item.label", :value="item.value")
        el-col(:span="12")
          el-form-item.validFormal(label="开户名称：", prop="openAcctName")
            //- el-input(v-model="form.openAcctName", placeholder="请输入开户名称", clearable, @blur="isValid('openAcctName')")
            el-input(v-model="form.openAcctName", placeholder="请输入开户名称", clearable)              
      el-row.pr-10
        el-col(:span="12")
          el-form-item.validFormal(label="开户账号：", prop="openAcct")
            el-input(v-model="form.openAcct", placeholder="请输入开户账号", clearable)
        el-col(:span="12")
          el-form-item(label="助记码：")
            el-input(v-model="form.memberCode", :disabled="true")        
      el-row.pr-10        
        el-col(:span="24")
          el-form-item(label="最近编辑时间：", v-if="disabled")
            el-input(v-model="form.updateAt", :disabled="true", clearable)
      el-row.pr-10
        el-col(:span="12")
          el-form-item(label="创建时间：")
            el-date-picker.full-width(v-model="form.createAt", :disabled="true")
        el-col(:span="12")
          el-form-item(label="客户来源：")
            el-input(v-model="form.customerSource", :disabled="true", clearable)        
      el-row.pr-10
        el-col(:span="12")
          el-form-item(label="客户渠道：")
            el-select.full-width(v-model="form.customerChannel", placeholder="请选择客户渠道", @change="$forceUpdate()")
              el-option(v-for="item in customerChannelOpts", :key="item.value", :label="item.label", :value="item.value")
        el-col(:span="12")
          el-form-item(label="ERP编号：")
            el-input(v-model="form.erpCode", :disabled="true", clearable)
      el-row.pr-10
        el-col(:span="12")
          el-form-item(label="电商会员编号：")
            el-input(v-model="form.ebusiMemberCode", :disabled="true", clearable)
        el-col(:span="12")
          el-form-item(label="电商管理员账号：")
            el-input(v-model="form.ebusiAdminAcctNo", :disabled="true", clearable)    
      el-row.pr-10
        el-col(:span="12")
          el-form-item(label="法人代表：")
            el-input(v-model="form.legalRept", placeholder="请输入法人代表", clearable)
        el-col(:span="12")
          el-form-item(label="公司logo：")
            simple-upload.float-left(v-model="form.compLogoUrl", @fileObj="fileLogo", :disabled="customerSourceDisabled")
              el-button(type="primary", size="small", :disabled="customerSourceDisabled") 上传logo
              span.pl-10(v-if="fileObj.name") {{fileObj.name}}
                i.pl-5.el-icon-circle-check
      el-row.pr-10
        el-col(:span="12")
          .row
            .col
              el-form-item(label="注册资本：")
                el-input-number.full-width(v-model="form.registerCapital", :precision="1", :controls="false")
            .col.flex-10.mb-25.ml-5 万
        el-col(:span="12")
          el-form-item(label="传真号码：", prop="faxNum")
            el-input(v-model="form.faxNum", placeholder="请输入传真号码", clearable)
      el-row.pr-10
        el-col(:span="12")
          el-form-item(label="经营范围：")
            el-input(v-model="form.busiScope", placeholder="请输入经营范围", clearable)
        //- el-col(:span="12")
        //-   el-form-item(label="地区：", prop="region")
        //-     el-select.full-width(v-model="form.region", filterable, placeholder="请选择地区")
        //-       el-option-group(v-for="group in cityAreaArr", :key="group.label", :label="group.label")
        //-         el-option(v-for="item in group.options", :key="item.name", :label="item.name", :value="item.name")
        el-col(:span="12")
          el-form-item(label="成立日期：")
            el-date-picker.full-width(v-model="form.fkSetUpDate", type="date", placeholder="选择日期", value-format="yyyy-MM-dd", format="yyyy-MM-dd")
      el-row.pr-10
        el-col(:span="12")
          el-form-item(label="实际控制人：")
            el-input(v-model="form.factController", placeholder="请输入实际控制人", clearable)
        el-col(:span="12")
          el-form-item(label="实际控制人身份证：")
            el-input(v-model="form.factControllerIdno", placeholder="请输入实际控制人身份证", clearable)
      el-row.pr-10
        el-col(:span="6")
          el-form-item(label="性别：")
            el-select.full-width(v-model="form.sex", placeholder="请选择性别", @change="$forceUpdate()")
              el-option(v-for="item in sexOpts", :key="item.value", :label="item.label", :value="item.value")
        el-col(:span="6")
          el-form-item(label="年龄：")
            el-input-number.full-width(v-model="form.age", placeholder="请输入年龄", clearable, :controls="false")
        el-col(:span="6")
          el-form-item(label="学历：")
            el-select.full-width(v-model="form.edu", placeholder="请选择学历", @change="$forceUpdate()")
              el-option(v-for="item in eduOpts", :key="item.value", :label="item.label", :value="item.value")
        el-col(:span="6")
          el-form-item(label="籍贯：")
            el-input(v-model="form.nativePlace", placeholder="请输入籍贯", clearable)
      el-row.pr-10
        el-col(:span="12")
          el-form-item(label="微信：")
            el-input(v-model="form.wxNo", placeholder="请输入微信号", clearable)
        el-col(:span="12")
          el-form-item(label="QQ：")
            el-input(v-model="form.qqNo", placeholder="请输入QQ", clearable)
      el-row.pr-10
        el-col(:span="12")
          el-form-item(label="新浪微博：")
            el-input(v-model="form.wbName", placeholder="请输入新浪微博昵称", clearable)
        el-col(:span="12")
          el-form-item(label="其他联系方式：")
            el-input(v-model="form.otherLinkWay", placeholder="请输入其他联系方式", clearable)      
      el-row.pr-10
        el-col(:span="6")
          el-form-item(label="采购周期：")
            el-select.full-width(v-model="form.purchaseCycle", placeholder="请选择采购周期", @change="$forceUpdate()")
              el-option(v-for="item in purchaseCycleOpts", :key="item.value", :label="item.label", :value="item.value")
        el-col(:span="5")
          .row
            .col
              el-form-item(label="月采吨位：")
                el-input-number.full-width(v-model="form.weightPerMonth", :precision="1", :controls="false")
            .col.flex-10.mb-25.ml-5 吨
        el-col(:span="6")
          el-form-item(label="高卖情况：")
            el-select.full-width(v-model="form.sellHighStatus", placeholder="请选择高卖情况", @change="$forceUpdate()")
              el-option(v-for="item in isSellHighOpts", :key="item.value", :label="item.label", :value="item.value")
        el-col(:span="6")
          el-form-item(label="信用情况：")
            el-select.full-width(v-model="form.creditStatus", placeholder="请选择信用情况", @change="$forceUpdate()")
              el-option(v-for="item in creditStatusOpts", :key="item.value", :label="item.label", :value="item.value")
      el-row.pr-10
        el-col(:span="11")
          .row
            .col
              el-form-item(label="年销售额：")
                el-input-number.full-width(v-model="form.annualSales", :precision="1", placeholder="请输入所处行业", clearable, :controls="false")
            .col.flex-10.mb-25.ml-5 万
        el-col(:span="11")
          .row
            .col
              el-form-item(label="纳税额：")
                el-input-number.full-width(v-model="form.taxPay", :precision="1", placeholder="请输入经营范围", clearable, :controls="false")
            .col.flex-10.mb-25.ml-5 万
      el-row.pr-10
        el-col(:span="12")
          el-form-item(label="采购物资品类：")
            el-select.full-width(v-model="form.fkPurchaseGoods", multiple, filterable, default-first-option, placeholder="请选择采购周期", @change="$forceUpdate()")
              el-option(v-for="item in form.fkPurchaseGoodsVal", :key="item.id", :label="item.name", :value="item.name")
        el-col(:span="12")
          el-form-item(label="采购用途：")
            el-select.full-width(v-model="form.fkPurchaseUse", multiple, filterable, default-first-option, placeholder="请输入采购用途", @change="$forceUpdate()")
              el-option(v-for="item in form.fkPurchaseUseVal", :key="item.id", :label="item.name", :value="item.name")
      el-row.pr-10
        el-col(:span="24")
          el-form-item(label="希望我们增加提供采购的物资品类（可详细填写）:",  label-width="350px")
            el-select.full-width(v-model="form.fkHopeAddGoods", multiple, filterable, default-first-option, placeholder="请输入采购用途", @change="$forceUpdate()")
              el-option(v-for="item in form.fkHopeAddGoodsVal", :key="item.id", :label="item.name", :value="item.name")
      el-row.pr-10
        el-col(:span="12")
          el-form-item(label="经营物资品类：")
            el-select.full-width(v-model="form.fkDealGoods", multiple, filterable, default-first-option, placeholder="请选择经营物资品类", @change="$forceUpdate()")
              el-option(v-for="item in form.fkDealGoodsVal", :key="item.id", :label="item.name", :value="item.name")
        el-col(:span="12")
          el-form-item(label="经营用途：")
            el-select.full-width(v-model="form.fkDealPurposeUse", multiple, filterable, default-first-option, placeholder="请选择经营用途", @change="$forceUpdate()")
              el-option(v-for="item in form.fkDealPurposeUseVal", :key="item.id", :label="item.name", :value="item.name")
      //- 订金金额、需求、周期暂时隐藏，2019/10/14
      //- el-row.pr-10
        el-col(:span="8")
          el-form-item(label="订金需求：")
            el-select.full-width(v-model="form.depositRequirement", placeholder="请选择订金需求", @change="$forceUpdate()")
              el-option(v-for="item in depositRequirementOpts", :key="item.value", :label="item.label", :value="item.value", @change="$forceUpdate()")
        el-col(:span="8")
          .row
            .col
              el-form-item(label="订金金额：")
                el-select.full-width(v-model="form.depositRate", filterable, allow-create, default-first-option, placeholder="请选择订金金额", @change="$forceUpdate()")
                  el-option(v-for="item in depositRateOpts", :key="item.value", :label="item.label", :value="item.value")
            .col.flex-10.mb-25.ml-5 %
        el-col(:span="8")
          .row
            .col
              el-form-item(label="订金周期：")
                el-select.full-width(v-model="form.depositCycle", filterable, allow-create, default-first-option, placeholder="请选择订金金额", @change="$forceUpdate()")
                  el-option(v-for="item in depositCycleOpts", :key="item.value", :label="item.label", :value="item.value")
            .col.flex-10.mb-25.ml-5 天
      el-row.pr-10
        el-col(:span="24")
          el-form-item(label="加工需求：")
            el-select.full-width(v-model="form.fkProcessingRequirements", multiple, filterable, default-first-option, placeholder="请选择加工需求", @change="$forceUpdate()")
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
            sup.text-blue *
          //- .simple-upload-img
          //-   zoom-img.zoomImg(:url="form.busiLicenseUrl == undefined ? '' : form.busiLicenseUrl", :width='200', :height='200')
          //-   simple-upload.simple-upload(v-model="form.busiLicenseUrl")
          //-     i.el-icon-plus(v-if="form.busiLicenseUrl == undefined")
          //-     el-button(type="primary", size="mini") 选择图片
          zoom-img.zoomImg(:url="form.busiLicenseUrl == undefined ? defaultAvatar : form.busiLicenseUrl", :width='200', :height='200')
          simple-upload(v-model="form.busiLicenseUrl", :disabled="customerSourceDisabled")
            el-button(type="primary", size="mini", :disabled="customerSourceDisabled") 选择图片
        el-col(:span="6")
          .ft-18.mb-15 税务登记证
          zoom-img.zoomImg(:url="form.taxRegisterUrl == undefined ? defaultAvatar : form.taxRegisterUrl", :width='200', :height='200')
          simple-upload(v-model="form.taxRegisterUrl", :disabled="customerSourceDisabled")
            el-button(type="primary", size="mini", :disabled="customerSourceDisabled") 选择图片
        el-col(:span="6")
          .ft-18.mb-15 组织结构代码证
          zoom-img.zoomImg(:url="form.orgCertificateUrl == undefined ? defaultAvatar : form.orgCertificateUrl", :width='200', :height='200')
          simple-upload(v-model="form.orgCertificateUrl", :disabled="customerSourceDisabled")
            el-button(type="primary", size="mini", :disabled="customerSourceDisabled") 选择图片
        el-col(:span="6")
          .ft-18.mb-15 开票资料
            sup.text-blue *
          zoom-img.zoomImg(:url="form.invoiceInfoUrl == undefined ? defaultAvatar : form.invoiceInfoUrl", :width='200', :height='200')
          simple-upload(v-model="form.invoiceInfoUrl", :disabled="customerSourceDisabled")
            el-button(type="primary", size="mini", :disabled="customerSourceDisabled") 选择图片
    el-row.mt-25.text-center
      el-button(type="primary", @click="onSubmit('form')") {{$route.query.type == 'new' || $route.query.type == 'formalAdd' ? '保存' : '更新'}}
      el-button(@click="onSubmit('cancel')") 取消
</template>

<script>
import breadcrumb from '@/components/Breadcrumb.vue'
import singlePicUpload from '@/components/SinglePicUpload.vue'
import simpleUpload from '@/components/SimpleUpload.vue'
import zoomImg from '@/components/ZoomImg.vue'
import areaJson from '@/components/AreaJson.js'
import cityArea from '@/components/city.js'
import { mapState } from 'vuex'
export default {
  layout: 'main',
  components: {
    breadcrumb,
    singlePicUpload,
    simpleUpload,
    zoomImg
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
    var openAcctNameValid = (rule, value, callback) => {
      if (this.chineseReg(value.trim()) || value.trim() == '') {
        callback()
      }
      //  else {
      //   callback(new Error('开户名称只能为中文'))
      // }
    }
    var faxNumValid = (rule, value, callback) => {
      if (this.faxNumReg(value) || (value && value.trim() == '')) {
        callback()
      } else {
        callback(new Error('传真号码格式：888-1234567 / 8888-12345678'))
      }
    }
    var openAcctValid = (rule, value, callback) => {
      let reg = /[\u4E00-\u9FA5]/
      if (!reg.test(value) || value.trim() == '') {
        callback()
      } else {
        callback(new Error('开户账号不能有中文'))
      }
    }
    var phoneValid = (rule, value, callback) => {
      let reg = this.phoneReg
      // console.log('phoneReg:>>' + reg + ';val:>>' + value)
      if (!value || value.trim().length === 0) {
        callback(new Error('手机号不能为空'))
      } else if (value.trim().length != 11) {
        callback(new Error('手机号位数要是11位'))
      } else if (!reg.test(value.trim())) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }
    var compNameValid = (rule, value, callback) => {
      let reg = /^[^\x00-\xff]+$/
      if (!value || value.trim().length === 0) {
        callback(new Error('公司名称不能为空'))
      } else {
        callback()
      }
      // else if (!reg.test(value.trim())) {
      //   callback(new Error('公司名中有非法字符或数字'))
      // }
    }
    var compAddrValid = (rule, value, callback) => {
      if (!value || !value[2]) {
        callback(new Error('请完善公司地址'))
      } else {
        callback()
      }
    }
    return {
      form: {
        compAddr: '', compName: '', compNameAb: null, memberCode: null, customerSource: '', customerChannel: null, erpCode: null, ebusiMemberCode: null, ebusiAdminAcctNo: null, customerType: '1', busiLicenseCode: null, registerCapital: null, legalRept: null, compLogoUrl: null, compAddrArr: [], faxNum: null, compSize: null, compType: null, region: null, fkSetUpDate: '', factController: null, factControllerIdno: null, tfn: null, compProv: '', compCity: '', compArea: '', openAcctName: null, openBank: null, openAcct: null, billAddr: '', billAddrArr: [], billProv: '', billCity: '', billArea: '', fkIndustry: [], fkIndustryVal: [], busiScope: null, purchaseCycle: null, weightPerMonth: '0.0', sellHighStatus: 0, creditStatus: null, annualSales: '0.0', taxPay: '0.0', depositRequirement: null, depositRate: '', depositCycle: '', kaipingSize: null, otherCooperateModel: null, remark: null, busiLicenseUrl: null, taxRegisterUrl: null, orgCertificateUrl: null, invoiceInfoUrl: null, status: '1', fkRelation: [], fkCustomPropertyId: '', fkDptId: '', fkAcctId: '', fkAcctName: '', fkPurchaseGoods: [], fkPurchaseUse: [], fkHopeAddGoods: [], fkDealGoods: [], fkDealPurposeUse: [], fkProcessingRequirements: [], name: '', phone: '', sex: 1, age: null, edu: null, nativePlace: null, wxNo: null, qqNo: null, wbName: null, otherLinkWay: null, fkRelationVal: [], fkCustomPropertyIdVal: null, fkDptIdVal: [], fkAcctIdVal: [], fkPurchaseGoodsVal: [], fkDealGoodsVal: [], fkPurchaseUseVal: [], fkDealPurposeUseVal: [], fkProcessingRequirementsVal: [], fkHopeAddGoodsVal: [], depositRateVal: [], depositCycleVal: [], createAt: new Date(), convertDate: '', startTime: new Date(), cstmType: '0',
        workgroupName: '',
        settleDelay: '0'
      },
      rules: {
        compName: [
          { required: true, validator: compNameValid, trigger: 'blur' },
          { min: 1, message: '不能为空', trigger: 'blur' }
        ],
        compAddrArr: [{ validator: compAddrValid, required: true, trigger: 'change' }],
        fkRelation: [{ required: true, message: '不能为空', trigger: 'change' }],
        fkCustomPropertyId: [{ required: true, message: '不能为空', trigger: 'change' }],
        fkDptId: [{ required: true, message: '不能为空', trigger: 'change' }],
        fkAcctName: [{ required: true, message: '不能为空', trigger: 'change' }],
        name: [{ required: true, message: '不能为空', trigger: 'blur' }],
        phone: [{ validator: phoneValid, trigger: 'blur', required: true }],
        // openAcctName: [{validator: openAcctNameValid, trigger: 'blur'}],
        openAcctName: [{ validator: openAcctNameValid, trigger: 'blur' }],
        faxNum: [{ validator: faxNumValid, trigger: 'blur' }],
        busiLicenseCode: [{ min: 15, max: 20, message: '公司证照编号必须大于15位小于20位', trigger: 'blur' }],
        tfn: [{ min: 15, max: 20, message: '税号必须大于15位小于20位', trigger: 'blur' }],
        openAcct: [{ validator: openAcctValid, trigger: 'blur' }],
        fkIndustry: [{ required: true, message: '不能为空', trigger: 'change' }],
        region: [{ required: true, message: '不能为空', trigger: 'change' }]
      },
      timeout: null,
      fileObj: {},
      addr: areaJson,
      customerSourceDisabled: false,
      cloneObj: {},
      cityAreaArr: cityArea,
      localDepositeRate: 20,
      // 选择定金
      chooseDeposit: true,
      // 选择白条
      chooseIous: false,
      // 客户名称是否可以修改
      compNameEditDisable: true,
      // 主体客户ids
      cstmIdList: []
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
      depositCycleOpts: state => state.depositCycleOpts,
      currentUser: state => state.user.currentUser,
      defaultAvatar: state => state.defaultAvatar,
      workGroupList: state => state.workGroupList
    })
  },
  methods: {
    onSubmit (formStr) {
      if (formStr == 'form') {
        let valiArr = ['compName', 'fkRelation', 'fkCustomPropertyId', 'fkDptId', 'fkAcctName', 'name', 'phone', 'fkIndustry', 'region', 'compAddrArr']
        let formalArr = ['openAcctName', 'faxNum', 'busiLicenseCode', 'tfn', 'openAcct']
        let that = this
        formalArr.map(itm => {
          if (that.form[itm] !== '' && that.form[itm] !== null) {
            valiArr.push(itm)
          }
        })
        let isValid = true
        valiArr.map(itm => {
          this.$refs[formStr].validateField(itm, function (msg) {
            if (msg !== '') {
              isValid = false
            }
          })
        })
        if (isValid) {
          try {
            let fkDptName = this.form.fkDptIdVal.filter((item) => { return this.form.fkDptId == item.id })[0].name
            if (this.form.fkRelation.indexOf(2) !== -1 && !this.form.workgroupName && (fkDptName.indexOf('供应') !== -1 || fkDptName.indexOf('采购') !== -1)) {
              this.msgShow(this, '请选择工作组')
              return
            }
            this.customDetailCreate()
          } catch (e) {
            this.msgShow(this, '业务部门不存在')
          }
        } else {
          document.body.scrollTop = 150
          this.msgShow(this, '请规范输入必填项')
        }
      } else {
        this.back()
      }
    },
    async customDetailCreate () {
      try {
        this.pageShow(this, `${this.$route.query.type == 'edit' ? '更新' : '保存'}中，请耐心等待`)
        this.cloneObj = Object.assign({}, this.form)
        if (this.form.compAddrArr[2] !== null) {
          this.form.compProv = this.form.compAddrArr[0]
          this.form.compCity = this.form.compAddrArr[1]
          this.form.compArea = this.form.compAddrArr[2]
        } else {
          this.msgShow(this, '请完善公司地址')
          return
        }
        if (this.form.billAddrArr) {
          this.form.billProv = this.form.billAddrArr[0]
          this.form.billCity = this.form.billAddrArr[1]
          this.form.billArea = this.form.billAddrArr[2]
        }
        this.form.settleDelay = Number(this.form.settleDelay)
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
          delete this.form.industry
          this.form.cstmId = this.$route.query.id
          if (this.form.mainCstmId) this.form.mainCstm = this.form.mainCstmId
          else this.form.mainCstm = this.originObj.id
        }
        if (this.$route.query.type === 'formalAdd') {
          this.form.specialMark = 0
        }
        delete this.form.compAddrArr
        delete this.form.billAddrArr
        delete this.form.billAddrDetail
        delete this.form.createAt
        delete this.form.fkRelationVal
        delete this.form.fkCustomPropertyIdVal
        delete this.form.fkDptIdVal
        delete this.form.fkAcctIdVal
        delete this.form.fkPurchaseGoodsVal
        delete this.form.fkIndustryVal
        delete this.form.fkDealGoodsVal
        delete this.form.fkPurchaseUseVal
        delete this.form.fkDealPurposeUseVal
        delete this.form.fkProcessingRequirementsVal
        delete this.form.fkHopeAddGoodsVal
        delete this.form.depositRateVal
        delete this.form.depositCycleVal
        delete this.form.billDate
        delete this.form.convertDate
        if (this.form.phone !== ' ') this.form.phone = this.form.phone.trim()
        if (typeof (this.form.fkAcctName) == 'number') {
          this.form.fkAcctId = this.form.fkAcctName
        }
        // delete this.form.fkAcctName
        if (this.form.startTime) {
          this.form['fkStartTime'] = this.date2Str(new Date(this.form.startTime))
        }
        delete this.form.mainCustomer
        delete this.form.mainCstmId
        delete this.form.startTime
        this.form.cstmType = Number(this.form.cstmType)
        this.form.uid = this.currentUser.id
        this.form.sex = Number(this.form.sex)
        // this.form.status = 1
        this.form.fkDptId = Number(this.form.fkDptId)
        this.form.fkAcctId = Number(this.form.fkAcctId)
        for (let key in this.form) {
          if (this.form[key] === null || this.form[key] === '') {
            delete this.form[key]
          }
        }
        if (this.localDepositeRate > 0 && this.chooseDeposit) this.form.depositRate = this.localDepositeRate.toString()
        const unitPropertyArr = []
        if (this.chooseDeposit) unitPropertyArr.push('2')
        if (this.chooseIous) unitPropertyArr.push('3')
        this.form.unitProperty = unitPropertyArr.join(',')
        let { data } = await this.apiStreamPost('/proxy/common/post', { url: url, params: this.form })
        this.pageHide(this)
        if (data.returnCode === 0) {
          this.msgShow(this, this.$route.query.type === 'new' ? '保存成功' : '更新成功', 'success')
          this.back()
        } else {
          this.msgShow(this, data.errMsg)
          this.initform(this.cloneObj, false)
          // this.$forceUpdate()
        }
      } catch (e) {
        this.pageHide(this)
        console.error(e)
        this.msgShow(this)
        this.initform(this.cloneObj, false)
      }
    },
    iousChange (val) {
      // 白条选择
      if (!val) {
        const me = this
        this.apiStreamPost('/proxy/xy/get', { url: '/crm/getDepositVirtual.shtml?cust_no=' + this.originObj.ebusiMemberCode }).then(res => {
          console.log(res)
          if (res.status === 200) {
            // 保证金 depositMomeny
            if (res.data.depositMoney > 0) {
              me.msgShow(me, '该单位有锁定的保证金，不能取消！')
              me.chooseIous = true
            }
            if (res.data.virtualMoney > 0) {
              me.msgShow(me, '该单位有欠款未还，不能取消！')
              me.chooseIous = true
            }
          } else {
            me.chooseIous = true
            me.msgShow(me, '获取型云数据失败，暂无法取消')
          }
        }).catch(err => {
          console.log(err)
          me.msgShow(me, '获取型云数据失败，暂无法取消')
        })
      }
    },
    async customerGet (query) {
      let params = {
        uid: this.currentUser.id,
        pageSize: 10,
        compName: query ? query : ''
      }
      if (query !== '') {
        try {
          let { data } = await this.apiStreamPost('/proxy/common/post', { url: 'customerManage/customer/queryCombo', params: params })
          if (data.returnCode === 0) {
            this.cstmIdList = data.list
            if (this.originObj && this.originObj.mainCustomer) {
              const idx = this.cstmIdList.findIndex(itm => itm.id === this.originObj.mainCustomer.id)
              console.log('customer get idx:>>', idx)
              if (idx < 0) {
                this.cstmIdList.push(this.originObj.mainCustomer)
                this.$forceUpdate()
              }
            }
          } else {
            this.msgShow(this, data.errMsg)
          }
          // this.loading = false
        } catch (e) {
          console.error(e)
          // this.msgShow(this)
          // this.loading = false
        }
      }
    },
    async fkRelationCreate () {
      try {
        let { data } = await this.apiStreamPost('/proxy/common/get', { url: 'basicData/busiRelation/queryCombo' })
        if (data.returnCode === 0) {
          let arr = []
          data.list.map((item) => {
            if (item.status == 1) {
              arr.push(item)
            }
          })
          this.form.fkRelationVal = arr
        } else {
          this.msgShow(this, data.errMsg)
        }
      } catch (e) {
        console.error(e)
        this.msgShow(this)
      }
    },
    async fkIndustryValCreate () {
      try {
        let { data } = await this.apiStreamPost('/proxy/common/get', { url: 'basicData/industry/queryCombo' })
        if (data.returnCode === 0) {
          let arr = []
          data.list.map((item) => {
            if (item.status == 1) {
              arr.push(item)
            }
          })
          this.form.fkIndustryVal = arr
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
        let { data } = await this.apiStreamPost('/proxy/common/get', { url: 'basicData/customProperty/queryCombo' })
        if (data.returnCode === 0) {
          let arr = []
          data.list.map((item) => {
            if (item.status == 1) {
              arr.push(item)
            }
          })
          this.form.fkCustomPropertyIdVal = arr
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
        let { data } = await this.apiStreamPost('/proxy/common/get', { url: 'basicData/supplyCatalog/queryCombo' })
        if (data.returnCode === 0) {
          let arr = []
          data.list.map((item) => {
            if (item.status == 1) {
              arr.push(item)
            }
          })
          this.form.fkDealGoodsVal = arr
          this.form.fkPurchaseGoodsVal = arr
          this.form.fkHopeAddGoodsVal = arr
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
        let { data } = await this.apiStreamPost('/proxy/common/get', { url: 'basicData/purpose/queryCombo' })
        if (data.returnCode === 0) {
          let arr = []
          data.list.map((item) => {
            if (item.status == 1) {
              arr.push(item)
            }
          })
          this.form.fkPurchaseUseVal = arr
          this.form.fkDealPurposeUseVal = arr
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
        let { data } = await this.apiStreamPost('/proxy/common/get', { url: 'basicData/processReq/queryCombo' })
        if (data.returnCode === 0) {
          let arr = []
          data.list.map((item) => {
            if (item.status == 1) {
              arr.push(item)
            }
          })
          this.form.fkProcessingRequirementsVal = arr
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
        let { data } = await this.apiStreamPost('/proxy/common/get', { url: 'setting/dpt/queryCombo' })
        if (data.returnCode === 0) {
          let arr = []
          data.list.map((item) => {
            if (item.status == 1) {
              arr.push(item)
            }
          })
          me.form.fkDptIdVal = arr
        } else {
          this.msgShow(this, data.errMsg)
        }
      } catch (e) {
        console.error(e)
        this.msgShow(this)
      }
    },
    async fkAccCreate (query) {
      let params = {
        pageSize: 10,
        acctName: query
      }
      let me = this
      try {
        let { data } = await this.apiStreamPost('/proxy/common/post', { url: 'setting/acct/queryCombo', params: params })
        if (data.returnCode === 0) {
          let arr = []
          data.list.map((item) => {
            if (item.status == 1) {
              arr.push(item)
            }
          })
          me.form.fkAcctIdVal = arr
        } else {
          this.msgShow(this, data.errMsg)
        }
      } catch (e) {
        console.error(e)
        this.msgShow(this)
      }
    },
    fileLogo (file) {
      this.fileObj = file
    },
    compAddrArrChange () {
      if (this.form.compAddrArr.length >= 2) {
        this.form.region = this.form.compAddrArr[1].replace(/市|区/, '')
      }
    },
    initform (newVal, firstTime = true) {
      console.log('init form', 'first time:>>', firstTime)
      console.log(newVal)
      this.form = Object.assign(this.form, newVal)
      if (this.form.mainCustomer) this.form.mainCstmId = this.form.mainCustomer.id
      this.form.customerType = newVal.customerType.toString()
      this.form.cstmType = newVal.cstmType.toString()
      this.form.status = newVal.status.toString()
      this.form.fkDptId = newVal.fkDpt !== undefined ? newVal.fkDpt.id : this.form.fkDptId
      this.form.fkAcctId = newVal.fkAcct !== undefined ? newVal.fkAcct.id : this.form.fkAcctId
      this.form.fkAcctName = newVal.fkAcct !== undefined ? newVal.fkAcct.name : this.form.fkAcctName
      this.form.fkCustomPropertyId = newVal.fkCustomProperty !== undefined ? newVal.fkCustomProperty.id : this.form.fkCustomPropertyId
      this.form.settleDelay = newVal.settleDelay.toString()
      if (newVal.busiRelation) this.form.fkRelation = newVal.busiRelation.map(itm => itm.id)
      if (firstTime) {
        newVal.linkers.map((item) => {
          if (item.mainStatus == 1) {
            this.form.phone = item.phone
            this.form.name = item.name
            this.form.sex = item.sex
            this.form.age = item.age
            this.form.edu = item.edu
            this.form.nativePlace = item.nativePlace
            this.form.wxNo = item.wxNo
            this.form.qqNo = item.qqNo
            this.form.wbName = item.wbName
            this.form.otherLinkWay = item.otherLinkWay
            this.form.linkId = item.id
          }
        })
        // this.form.phone = newVal.linkers[0].phone
        // this.form.name = newVal.linkers[0].name
        // this.form.sex = newVal.linkers[0].sex
        // this.form.age = newVal.linkers[0].age
        // this.form.edu = newVal.linkers[0].edu
        // this.form.nativePlace = newVal.linkers[0].nativePlace
        // this.form.wxNo = newVal.linkers[0].wxNo
        // this.form.qqNo = newVal.linkers[0].qqNo
        // this.form.wbName = newVal.linkers[0].wbName
        // this.form.otherLinkWay = newVal.linkers[0].otherLinkWay
        // this.form.linkId = newVal.linkers[0].id
        if (newVal.procurementGoods) this.form.fkPurchaseGoods = newVal.procurementGoods.map(item => item.name)
        if (newVal.procurementPurpose) this.form.fkPurchaseUse = newVal.procurementPurpose.map(item => item.name)
        if (newVal.hopeAddGoods) this.form.fkHopeAddGoods = newVal.hopeAddGoods.map(item => item.name)
        if (newVal.processRequirement) this.form.fkProcessingRequirements = newVal.processRequirement.map(itm => itm.name)
        if (newVal.dealGoods) this.form.fkDealGoods = newVal.dealGoods.map(itm => itm.name)
        if (newVal.dealPurpose) this.form.fkDealPurposeUse = newVal.dealPurpose.map(itm => itm.name)
        if (newVal.industry) this.form.fkIndustry = newVal.industry.map(item => item.name)
        if (newVal.depositRate) {
          this.localDepositeRate = Number(newVal.depositRate)
        } else {
          this.localDepositeRate = 20
        }
        // FIXME 空值判断暂时保留 
        // if (newVal.unitProperty) {
        // 客户单位性质 2 订金 3 白条
        const idxDeposit = newVal.unitProperty.indexOf('2')
        if (idxDeposit < 0) this.chooseDeposit = false
        else this.chooseDeposit = true
        const idxIous = newVal.unitProperty.indexOf('3')
        if (idxIous < 0) this.chooseIous = false
        else this.chooseIous = true
        // } else {
        // this.chooseDeposit = true
        // this.chooseIous = false
        // }
      }
      // if (newVal.procurementGoods) this.form.fkPurchaseGoods = newVal.procurementGoods.map(item => item.name)
      // if (newVal.procurementPurpose) this.form.fkPurchaseUse = newVal.procurementPurpose.map(item => item.name)
      // if (newVal.hopeAddGoods) this.form.fkHopeAddGoods = newVal.hopeAddGoods.map(item => item.name)
      // if (newVal.processRequirement) this.form.fkProcessingRequirements = newVal.processRequirement.map(itm => itm.name)
      // if (newVal.dealGoods) this.form.fkDealGoods = newVal.dealGoods.map(itm => itm.name)
      // if (newVal.dealPurpose) this.form.fkDealPurposeUse = newVal.dealPurpose.map(itm => itm.name)
      // if (newVal.industry) this.form.fkIndustry = newVal.industry.map(item => item.name)
      this.form.sellHighStatus = newVal.sellHighStatus
      this.form.createAt = this.date2Str(new Date(newVal.createAt))
      this.form.startTime = (newVal.startTime) ? this.date2Str(new Date(newVal.startTime)) : null

      this.form.compAddrArr.push(newVal.compProv)
      this.form.compAddrArr.push(newVal.compCity)
      this.form.compAddrArr.push(newVal.compArea)
      this.form.compAddr = newVal.compAddr
      this.form.billAddrArr.push(newVal.billProv)
      this.form.billAddrArr.push(newVal.billCity)
      this.form.billAddrArr.push(newVal.billArea)
      this.form.billAddr = newVal.billAddr
      if (newVal.setUpDate !== null && newVal.setUpDate !== undefined) this.form.fkSetUpDate = this.date2Str(new Date(newVal.setUpDate))
      // if (this.form.customerSource === '型云') {
      //   this.customerSourceDisabled = true
      // }
      if (this.form.ebusiAdminAcctNo) {
        this.customerSourceDisabled = true
      }
      /**
       * ERP 有历史记录的客户不能修改抬头
       */
      if (this.$route.query.type === 'edit') {
        const me = this
        if (this.form.erpCode) {
          this.apiStreamPost('/proxy/erp/get', { url: 'querySbillByCust2CRM.htm?body=' + this.form.erpCode, params: {}, method: 'get' }).then(res => {
            const result = JSON.parse(unescape(res.data.replace(/\\u/gi, '%u')))
            console.log(result)
            if (!(result.success === '0' && result.body !== '0')) {
              me.compNameEditDisable = false
            }
          })
        } else {
          me.compNameEditDisable = false
        }
      } else {
        this.compNameEditDisable = false
      }
      if (this.currentUser.id === 1) {
        this.compNameEditDisable = false
      }
    }
  },
  mounted () {
    this.fkRelationCreate()
    this.fkCustomPropertyCreate()
    this.fkDptCreate()
    this.fkAccCreate()
    this.supplyCatalogCreate()
    this.purposeCreate()
    this.processReqCreate()
    this.fkIndustryValCreate()
    this.customerGet()
    // if (this.originObj) this.form = this.originObj
    if (this.$route.query.type == 'new' || this.$route.query.type == 'formalAdd') {
      this.form.fkDptId = this.currentUser.fkDpt.id
      this.form.fkAcctId = this.currentUser.id
      this.form.fkAcctName = this.currentUser.name
      this.form.fkRelation = [1]
      this.compNameEditDisable = false
      if (this.$route.query.type == 'formalAdd') {
        this.form.fkRelation = [2]
        this.form.fkCustomPropertyId = 5
        this.form.fkIndustry = ['生产/供应']
      }
    }
  },
  watch: {
    originObj (newVal, oldVal) {
      this.initform(newVal)
      // this.loadingS().close()
      this.pageHide(this)
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
    border 1px dashed #d9d9d9
    border-radius 6px
    cursor pointer
    position relative
    overflow hidden
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
  .zoomImg
    img
      width 200px
      height 200px
      border-radius 50% !important
      border 1px solid #ddd
    &:hover
      cursor pointer
  .simple-upload-img{
    position: relative;
  }
  .simple-upload{
    width: 200px;
    height: 200px;
    position: absolute;
    top: 0;
    left: 50%;
    margin-left: -100px;
    text-align: center;
    line-height: 200px;
    color: #999;
    font-size: 30px;
    border: 1px #ccc solid;
  }
  .simple-upload .el-button.el-button--primary.el-button--mini{
    width: 200px;
    height: 200px;
    opacity: 0;
    position: absolute;
    top: 0;
    left: 50%;
    margin-left: -100px;
    z-index: 5;
  }
  .simple-upload .el-upload.el-upload--text{
    text-align: center;
  }
  .el-icon-circle-check{
    color: #67c23a;
  }
  .head-title{
    line-height: 30px;
  }
</style>