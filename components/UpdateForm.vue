<template lang="pug">
.update-form-box(v-loading="loading")
  breadcrumb(:breadItems="breadItemList[0]")
  .pt-20
    el-form(ref="form", show-message, :model="form", :rules="rules", label-width="145px", label-position="right")
      el-row.pr-10(type="flex")
        el-col(:span="8")
          el-form-item(label="业务部门：", prop="dptName")
            el-input(v-model="form.dptName", :disabled="formDisabled")
        el-col(:span="8")
          el-form-item(label="业务员：", prop="employeeName")
            el-input(v-model="form.employeeName", :disabled="formDisabled")
        el-col(:span="8")
          el-form-item(label="归属性质：", prop="customerPropertyMark")
            el-input(v-model="form.customerPropertyMark", :disabled="formDisabled")
      el-row.pr-10(type="flex")
        el-col(:span="8")
          el-form-item(label="抬头创建日期：", prop="createAt")
            el-input(v-model="form.createAt", :disabled="formDisabled")
        el-col(:span="8")
          el-form-item(label="首张有效提单日期：", prop="firstBillTime")
            el-input(v-model="form.firstBillTime", :disabled="formDisabled")
        el-col(:span="8")
          el-form-item(label="首张有效实提日期：", prop="firstLadTime")
            el-input(v-model="form.firstLadTime", :disabled="formDisabled")
      el-row.pr-10(type="flex")
        el-col(:span="8")
          el-form-item(label="客户状态：", prop="mark")
            el-input(v-model="form.mark", :disabled="formDisabled")
            //- el-select.full-width(v-model="form.mark" filterable placeholder="" @change="getMarkValue")
            //-   el-option(v-for="item,index in clientStatus", :key="index", :label="item.label", :value="item.value")
        el-col(:span="16" :hidden="!showLossReason")
          el-form-item.is-required(label="流失原因：", prop="lossReason")
            el-select.full-width(v-model="form.lossReason" filterable placeholder="" @change="getReasonValue")
              el-option(v-for="item,index in lossReasonList", :key="index", :label="item.label", :value="item.value")
      el-row.pr-10(type="flex")
        el-col(:span="24" :hidden="!showReason")
          el-form-item.is-required(label="原因描述：", prop="reason")
            el-input(v-model="form.reason" maxlength="50")
      el-row.pr-10(type="flex")
        el-col(:span="8")
          el-form-item.is-required(label="客户性质：", prop="cstmPropertyIds")
            el-select.full-width(v-model="selectCstmPropertyIdsList" multiple :multiple-limit="2" placeholder="" @change="getHasStorageValue")
              el-option(v-for="item in cstmPropertyIdsList" :label="item.label" :value="item.value" :key="item.label")                     
        el-col(:span="8")
          el-form-item.is-required(label="所在地区：", prop="areaName")
            el-select.full-width(v-model="form.areaName" filterable placeholder="" @change="getAreaNameValue")
              el-option(v-for="item in areaNamesList", :key="item.id", :label="item.name", :value="item.name")
        el-col(:span="8" :hidden="!showHasStorage")
          el-form-item.is-required(label="有无库存：", prop="hasStorage")
            el-select.full-width(v-model="form.hasStorage" filterable placeholder="" @change="getStorageCapacity")
              el-option(v-for="item,index in hasStorageList", :key="index", :label="item.label", :value="item.value")
      el-row.pr-10(type="flex")
        el-col(:span="8" :hidden="!showStorageCapacity")
          el-form-item.is-required(label="库存规模：", prop="storageCapacity")
            el-input(v-model="form.storageCapacity" type="number")
        el-col(:span="16")
          el-form-item.is-required(label="主营业务：", prop="mainBusi")
            el-input(v-model="form.mainBusi" maxlength="50")
      el-row.pr-10(type="flex", justify="space-between")
        el-col(:span="24")
          el-form-item.is-required(label="经营区域覆盖：", prop="busiScope")
            el-input(v-model="form.busiScope" maxlength="50")
  el-row(type="flex", justify="space-between")
    el-col.mt-10(:span="22")
      breadcrumb(:breadItems="breadItemList[1]")
    el-col(:span="2")
      el-button(type="primary", :icon="showAllBtnIsEdit ? 'el-icon-arrow-up' : 'el-icon-arrow-down'", @click="showAll") {{showAllBtnIsEdit ? '收起' : '展示全部'}}
  .pt-20
    el-form(ref="form", show-message, :model="form", label-width="145px", label-position="right")
      div(v-for="ys,index in yearSaleList" :key="index")
        el-row.pr-10(type="flex", justify="space-between")
          el-col(:span="7")
            el-form-item(:label="ys.yearStr+'提单量：'", prop="billWeight")
              el-input(v-model="ys.billWeight", :disabled="formDisabled")
          el-col(:span="7")
            el-form-item(:label="ys.yearStr+'实提量：'", prop="ladWeight")
              el-input(v-model="ys.ladWeight", :disabled="formDisabled")
          el-col(:span="7")
            el-form-item(label="年度高卖金额：", prop="highSale")
              el-input(v-model="ys.highSale", :disabled="formDisabled")
        el-row.pr-10(type="flex", justify="space-between")
          el-col(:span="7")
            el-form-item(label="成交物资NO.1品名：", prop="goods1")
              el-input(v-model="ys.goods1", :disabled="formDisabled")
          el-col(:span="7")
            el-form-item(label="成交物资NO.2品名：", prop="goods2")
              el-input(v-model="ys.goods2", :disabled="formDisabled")
          el-col(:span="7")
            el-form-item(label="成交物资NO.3品名：", prop="goods3")
              el-input(v-model="ys.goods3", :disabled="formDisabled")
  breadcrumb(:breadItems="breadItemList[2]")
  .pt-20
    el-form(ref="form", show-message, :model="form", :rules="rules", label-width="160px", label-position="right")
      el-row.pr-10(type="flex", justify="space-between")
        el-col(:span="7")
          el-form-item.is-required(label="全年需求数量评估：", prop="yearSaleWeight", placeholder="单位‘吨’")
            el-input(v-model="form.yearSaleWeight")
        el-col(:span="16")
          el-form-item.is-required(label="主要需求物资品名：", prop="goodsNames")
            el-select.full-width(v-model="selectGoodsNamesList" placeholder="" multiple @change="getGoodsNameValue")
              el-option(v-for="item in goodsNamesList", :key="item.id", :label="item.name", :value="item.name")
      el-row.pr-10(:gutter="30")
        el-col(:span="7")
          el-form-item.is-required(label="我司供应占比：", prop="yearPercent")
            el-slider(v-model="form.yearPercent" :step="10" @change="getOtherProvider")
        el-col.pt-8(:span="7")
          label 占比（{{form.yearPercent}}%）
      div(v-for="item,index in form.dataStr" :key="index" :hidden="!showOtherProvider")
         el-row.pr-10(type="flex")
          el-col(:span="8")
            el-form-item.is-required(:label='"其他主要供应商"+(index+1)+"："', prop="supplyName")
              el-input(v-model="item.supplyName")
          el-col(:span="16")
            el-form-item.is-required(label="其他供应商优势：", prop="supplyPrefer")
              el-input(v-model="item.supplyPrefer")
      el-row.pr-10(type="flex" justify="end")
        el-button(type="primary", plain, @click="addMore") 新增
  breadcrumb(:breadItems="breadItemList[3]")
  .pt-20
    el-form(ref="form", show-message, :model="form", :rules="rules", label-width="160px", label-position="right")
      el-row.pr-10(type="flex")
        el-col(:span="8")
          el-form-item.is-required(label="主要运力实现方式：", prop="mainDeliveryWay")
            el-select.full-width(v-model="form.mainDeliveryWay" filterable placeholder="" @change="getDeliveryPrefer")
              el-option(v-for="item in mainDeliveryWayList", :key="item.label", :label="item.label", :value="item.value")
        el-col(:span="8")
          el-form-item.is-required(label="三方物流单位名称或组织者，司机姓名：", prop="deliveryName")
            el-input(v-model="form.deliveryName") 
        el-col(:span="8" :hidden="!showDeliveryPrefer")
          el-form-item.is-required(label="主要物流偏好：", prop="deliveryPrefer")
            el-select.full-width(v-model="form.deliveryPrefer" filterable placeholder="")
              el-option(v-for="item in deliveryPreferList", :key="item.label", :label="item.label", :value="item.value")
    el-row.mt-25.text-center
      el-button(type="primary", @click="onSubmit('form')") 更新
      el-button(@click="onSubmit('cancel')") 取消
</template>
<script>
import breadcrumb from '@/components/Breadcrumb.vue'
export default {
  name: 'updateForm',
  components: {
    breadcrumb
  },
  props: {
    originObj: {
      type: null,
      default: false
    }
  },
  data () {
    return {
      breadItemList: [['基本信息'], ['历史交易数据'], ['2020需求评估数据'], ['物流评估数据']],
      formDisabled: true,
      chooseDisabled: false,
      loading: true,
      erpCode: '006686',
      postForm: {
        cstmId: '',
        lossReason: '',
        reason: '',
        areaName: '',
        cstmPropertyIds: '',
        hasStorage: 0,
        storageCapacity: '',
        mainBusi: '',
        busiScope: '',
        yearSaleWeight: '',
        yearPercent: 0,
        goodsNames: '',
        mainDeliveryWay: '',
        deliveryName: '',
        deliveryPrefer: '',
        dataStr: []
      },
      form: {
        dptName: '',
        employeeName: '',
        mark: '',
        createAt: '',
        firstBillTime: '',
        firstLadTime: '',
        customerPropertyMark: '',
        lossReason: '',
        reason: '',
        cstmPropertyIds: [],
        areaName: '',
        hasStorage: '',
        storageCapacity: 0,
        mainBusi: '',
        busiScope: '',
        yearSaleWeight: 0,
        yearPercent: 0,
        goodsNames: '',
        mainDeliveryWay: '',
        deliveryName: '',
        deliveryPrefer: '',
        dataStr: []
      },
      localDepositeRate: 70, // 我司占比
      showAllBtnIsEdit: false,
      showLossReason: false, // 流失原因显示与否
      cstmPropertyIdsList: [
        { label: '贸易商', value: '贸易商' },
        { label: '终端客户', value: '终端客户' },
        { label: '加工单位', value: '加工单位' },
        { label: '物流单位', value: '物流单位' }
      ],
      showHasStorage: false, // 有无库存显示与否
      showReason: false, //显示原因描述与否
      lossReasonList: [
        { label: '维护/沟通问题', value: '维护/沟通问题' },
        { label: '我司经营管控', value: '我司经营管控' },
        { label: '我司禁止合作', value: '我司禁止合作' },
        { label: '公司关停/注销', value: '公司关停/注销' },
        { label: '其他原因', value: '其他原因' }
      ],
      showStorageCapacity: false, // 库存规模显示与否
      hasStorageList: [
        { label: '无', value: '无' },
        { label: '有', value: '有' }
      ],
      goodsNamesList: [],
      selectGoodsNamesList: [],
      areaNamesList: [],
      mainDeliveryWayList: [ // 主要运力方式
        { label: '自有运力', value: '自有运力' },
        { label: '我司配送', value: '我司配送' },
        { label: '固定三方物流', value: '固定三方物流' },
        { label: '非固定三方物流', value: '非固定三方物流' },
      ],
      deliveryPreferList: [], // 主要物流偏好
      showDeliveryPrefer: false, // 主要物流偏好显示与否
      showOtherProvider: false, // 其他供应商1显示与否
      moreProvider: [], // 新增其他供应商，优势
      yearSaleList: [], //历史交易数据
      selectCstmPropertyIdsList: [],
      i: 0,
      rules: {
        busiScope:[
          { required: true, message: '请输入内容', trigger: 'blur' },
        ],
        areaName:[
          { required: true, message: '请输入内容', trigger: 'blur' },
        ],
        hasStorage:[
          { required: true, message: '请输入内容', trigger: 'blur' },
        ],
        storageCapacity:[
          { required: true, message: '请输入内容', trigger: 'blur' },
        ],
        mainBusi:[
          { required: true, message: '请输入内容', trigger: 'blur' },
        ],
        yearSaleWeight:[
          { required: true, message: '请输入内容', trigger: 'blur' },
        ],
        mainDeliveryWay:[
          { required: true, message: '请输入内容', trigger: 'blur' },
        ],
        deliveryName:[
          { required: true, message: '请输入内容', trigger: 'blur' },
        ],
        deliveryPrefer:[
          { required: true, message: '请输入内容', trigger: 'blur' },
        ]
      }
    }
  },
  computed: {
  },
  mounted () {
    this.getGoodsNames()
    this.getAreaNames()
  },
  watch: {
    originObj (newVal, oldVal) {
      this.initform(newVal)
    },
    selectCstmPropertyIdsList: function (val, oldval) {
      console.log('selectCstmPropertyIdsList_val=====' + val)
      if (val.length > 2) {
        this.msgShow(this, '最多可选择两项主要客户性质')
      }
      this.postForm.cstmPropertyIds = val.toString()
    },
    selectGoodsNamesList: function (val, oldval) {
      console.log('selectGoodsNamesList_val=====' + val)
      this.postForm.goodsNames = val.toString()
    },
    // selectAreaNamesList: function (val, oldval) {
    //   console.log('selectAreaNamesList_val=====' + val)
    //   this.postForm.areaName = val
    // },
  },
  methods: {
    initform (newVal) {
      console.log('initform(newVal)========>' + JSON.stringify(newVal))
      // 数据格式化处理
      this.form = Object.assign(this.form, newVal.obj)
      this.form.firstLadTime = newVal.firstLadTime
      this.form.firstBillTime = newVal.firstBillTime
      if(newVal.dataList){
        this.form.dataStr = newVal.dataList
      }
      if(newVal.yearSaleList){
        this.yearSaleList = newVal.yearSaleList
      }
      
      if(newVal.obj.yearPercent){
        this.form.yearPercent = parseInt(newVal.obj.yearPercent)
      }
      this.form.customerPropertyMark = this.form.customerPropertyMark === '0' ? '长期维护' : '二次开发'
      if(newVal.obj.cstmPropertyIds){ //客户性质转为数组类型
        this.selectCstmPropertyIdsList = newVal.obj.cstmPropertyIds.split(',')
      }
      if(newVal.obj.goodsNames){ //品名转为数组类型
        this.selectGoodsNamesList = newVal.obj.goodsNames.split(',')
      }
      this.erpCode = this.form.erpCode
      // 判断流失原因显示与否
      this.showLossReason = this.form.lossReason ? true : false
      this.showLossReason = this.form.mark.toString() === '3' ? true : false
      this.form.mark = (this.form.mark === '1' ? '潜在' : (this.form.mark === '2' ? '正式' : '公共'))
      // 判断原因描述显示
      this.showReason = this.form.reason ? true : false
      // 判断有无库存显示
      this.showHasStorage = this.form.hasStorage ? true : false
      // 判断库存规模显示与否
      this.showStorageCapacity = this.form.storageCapacity ? true : false
      this.showStorageCapacity = this.form.hasStorage === '1' ? true : false 
      this.form.hasStorage = this.form.hasStorage === '1' ? '有' : '无'
      // 判断其他供应商显示
      this.showOtherProvider = this.form.dataStr ? true : false
      // 判断物流偏好显示
      this.showDeliveryPrefer = this.form.deliveryPrefer ? true : false
      // 判断物流偏好选框是否显示，显示哪个option
      if(this.form.mainDeliveryWay){
        if (this.form.mainDeliveryWay.toString().indexOf('我司配送') !== -1 || this.form.mainDeliveryWay.toString().indexOf('非固定三方物流') !== -1) {
          this.showDeliveryPrefer = true
          this.deliveryPreferList = [
            { label: '拼车/顺风车', value: '拼车/顺风车' },
            { label: '等返程车', value: '等返程车' },
            { label: '保运输时效，不计较运费', value: '保运输时效，不计较运费' },
            { label: '低运费，保运输时效', value: '低运费，保运输时效' },
            { label: '看重运费，运输可延缓', value: '看重运费，运输可延缓' }
          ]
        } else if (this.form.mainDeliveryWay.toString().trim() === '固定三方物流') {
          this.showDeliveryPrefer = true
          this.deliveryPreferList = [
            { label: '有单即派车', value: '有单即派车' },
            { label: '固定车次按期配送', value: '固定车次按期配送' }
          ]
        }else{
          this.showDeliveryPrefer = false
        }
      }else{
        this.showDeliveryPrefer = false
      }

      
      this.showOtherProvider = this.form.yearPercent === '100' ? false: true
      console.log('initform_this.form========>' + JSON.stringify(this.form))
      this.postForm.cstmId = newVal.obj.id
      this.postForm.lossReason = newVal.obj.lossReason
      this.postForm.reason = newVal.obj.reason
      this.postForm.yearPercent = this.form.yearPercent
      this.postForm.hasStorage = newVal.obj.hasStorage
      this.postForm.mainDeliveryWay = newVal.obj.mainDeliveryWay
      this.postForm.deliveryPrefer = newVal.obj.deliveryPrefer
      
      this.loading = false
    },
    // 根据select流失原因判断原因描述显示与否
    getReasonValue (label) {
      if(label){
        console.log('getReasonValue(label)========>' + label)
        this.showReason = this.form.lossReason.toString().trim() === '其他原因' ? true : false
        this.form.lossReason = this.form.lossReason.toString().trim()
        this.postForm.lossReason = this.form.lossReason.toString().trim()
      }    
    },
    // 根据select客户性质判断有无库存显示与否：客户性质含有“贸易商、终端客户、加工单位”时显示
    getHasStorageValue (label) {
      console.log('getHasStorageValue(label)========>' + label)
      this.form.cstmPropertyIds = label
      this.postForm.cstmPropertyIds = label
      if (label.toString().indexOf('贸易商') !== -1 || label.toString().indexOf('终端客户') !== -1 || label.toString().indexOf('加工单位') !== -1) {
        this.showHasStorage = true
        this.showStorageCapacity = this.form.hasStorage.toString() === '1' ? true : false
      } else {
        this.showHasStorage = false
      }
      debugger
      this.postForm.hasStorage = this.form.hasStorage
    },
    getGoodsNameValue(label){
      console.log('getGoodsNameValue(label)=====' + label)
      this.form.goodsNames = label.toString()
      this.postForm.goodsNames = label.toString()
    },
    getAreaNameValue(label){
      console.log('getAreaNameValue(label)=====' + label)
      this.form.areaName = label
      this.postForm.areaName = label
    },
    // 根据select有无库存判断库存容量显示与否
    getStorageCapacity (label) {
      console.log('getStorageCapacity(label)========>' + label)
      if (label.toString().trim() === '有') {
        this.showStorageCapacity = true
        this.postForm.hasStorage = 1
      } else {
        this.showStorageCapacity = false
        this.postForm.hasStorage = 0
      }
    },
    // 根据我司占比数量判断是否显示其他供应商
    getOtherProvider(label){
      console.log('getOtherProvider(label)========>' + label)
      if(label !== 100){
        this.showOtherProvider = true
        this.addMore()
      }else{
        this.showOtherProvider = false
      }
    },
    // 主要运力实现方式选择“我司配送，固定三方物流，非固定物流三方”展示该字段
    getDeliveryPrefer (label) {
      console.log('getDeliveryPrefer(label)========>' + label)
      this.form.deliveryPrefer = ''
      if (label.toString().indexOf('我司配送') !== -1 || label.toString().indexOf('非固定三方物流') !== -1) {
        this.showDeliveryPrefer = true
        this.deliveryPreferList = [
          { label: '拼车/顺风车', value: '拼车/顺风车' },
          { label: '等返程车', value: '等返程车' },
          { label: '保运输时效，不计较运费', value: '保运输时效，不计较运费' },
          { label: '低运费，保运输时效', value: '低运费，保运输时效' },
          { label: '看重运费，运输可延缓', value: '看重运费，运输可延缓' }
        ]
      } else if (label.toString().trim() === '固定三方物流') {
        this.showDeliveryPrefer = true
        this.deliveryPreferList = [
          { label: '有单即派车', value: '有单即派车' },
          { label: '固定车次按期配送', value: '固定车次按期配送' }
        ]
      } else {
        this.showDeliveryPrefer = false
      }
      if(label.length != 0){
        this.postForm.mainDeliveryWay = label
      }else{
        delete this.postForm.mainDeliveryWay
      }     
    },
    // 接口获取需求物资品名列表
    async getGoodsNames () {
      let { data } = await this.apiStreamPost('/proxy/common/get', { url: 'erpComm/partsname' })
      if (data.returnCode === 0) {
        this.goodsNamesList = data.list
      }
    },
    async getAreaNames () {
      let { data } = await this.apiStreamPost('/proxy/common/get', { url: 'erpComm/area' })
      if (data.returnCode === 0) {
        this.areaNamesList = data.list
      }
    },
    beforeSubmit(){
      if(this.form.lossReason){
        this.postForm.lossReason = this.form.lossReason
      }else{
        delete this.postForm.lossReason
      }
      if(this.form.reason){
        this.postForm.reason = this.form.reason
      }else{
        delete this.postForm.reason
      }
      if(this.form.storageCapacity){
        this.postForm.storageCapacity = this.form.storageCapacity
      }else{
        delete this.postForm.storageCapacity
      }  
      if(this.form.areaName){
        this.postForm.areaName = this.form.areaName
      }else{
        delete this.postForm.areaName
      }  
      if(this.form.mainBusi){
        this.postForm.mainBusi = this.form.mainBusi
      }else{
        delete this.postForm.mainBusi
      }   
      if(this.form.busiScope){
        this.postForm.busiScope = this.form.busiScope
      }else{
        delete this.postForm.busiScope
      }   
      if(this.form.yearSaleWeight){
        this.postForm.yearSaleWeight = parseInt(this.form.yearSaleWeight)
      }else{
        delete this.postForm.yearSaleWeight
      } 
      if(this.form.yearPercent){
        this.postForm.yearPercent = this.form.yearPercent
      }else{
        delete this.postForm.yearPercent
      }
      if(this.form.deliveryName){
        this.postForm.deliveryName = this.form.deliveryName
      }else{
        delete this.postForm.deliveryName
      }
      if(this.form.deliveryPrefer){
        this.postForm.deliveryPrefer = this.form.deliveryPrefer
      }else{
        delete this.postForm.deliveryPrefer
      }
      if(this.form.dataStr.length != 0){
        this.postForm.dataStr = JSON.stringify(this.form.dataStr)
      }else{
        delete this.postForm.dataStr
      }       
    },
    async onSubmit (flag) {
      this.loading = true
      if(flag === 'form'){
        let resoult = this.beforeSubmit()
        console.log('入参_Submit_this.postForm------------' +JSON.stringify(this.postForm))
        let {data} = await this.apiStreamPost('/proxy/common/post',
          { url: 'customerManage/evaluation/', params: this.postForm })
        if(data.returnCode === 0){
          console.log('data' + JSON.stringify(data))
          this.loading = false
          this.$message({
            message: '更新成功',
            type: 'success'
          });
        }else{
          this.loading = false
          this.$message.error('更新失败，请重试！');
        }      
      } else if(flag === 'cancel'){
        this.back()
      }    
    },
    async showAll () {
      this.loading = true
      let url = 'customerManage/evaluation/year/goodsName?erpCode='+this.erpCode+'&startYear=2017&endYear=2020'
      this.showAllBtnIsEdit = !this.showAllBtnIsEdit
      console.log('this.showAllBtnIsEdit======>' + JSON.stringify(this.showAllBtnIsEdit))
      let {data} = await this.apiStreamPost('/proxy/common/get',
          { url: url})
      if(data.returnCode === 0){
        if(data.list.length != 0){
          console.log('data' + JSON.stringify(data.list))
          this.yearSaleList = data.list
          this.loading = false
        }else{
          this.$message('暂无数据');
          this.loading = false
        }
        
      }
    },
    addMore (val) {
      if(this.i > 4){
        this.$message({
          message: '最多增加五项',
          type: 'warning'
        })
      }else{
        ++ this.i
        console.log(this.i)
        this.form.dataStr.push({
        supplyName: '',
        supplyPrefer: ''
      })
      }
      
    },
  }
}
</script>
<style lang="stylus" scoped>
.mt-10
  margin-top 10px
.pt-8
  padding-top 8px
</style>