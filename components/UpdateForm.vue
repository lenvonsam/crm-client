<template lang="pug">
.update-form-box(v-loading="loading")
  breadcrumb(:breadItems="breadItemList[0]")
  .pt-20
    el-form(ref="form", show-message, :model="form", :rules="rules", label-width="145px", label-position="right")
      el-row.pr-10(type="flex")
        el-col(:span="16")
          el-form-item(label="公司名称：", prop="compName")
            el-input(v-model="form.compName", :disabled="formDisabled")
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
              el-option(v-for="item in cstmPropertyIdsList" :label="item.label" :value="item.label" :key="item.value")                     
        el-col(:span="8")
          el-form-item.is-required(label="所在地区：", prop="areaName")
            el-select.full-width(v-model="form.areaName" filterable placeholder="" @change="getAreaNameValue")
              el-option(v-for="item in areaNamesList", :key="item.id", :label="item.name", :value="item.name")
        el-col(:span="8" :hidden="!showHasStorage")
          el-form-item.is-required(label="有无库存：", prop="hasStorageShow")
            el-select.full-width(v-model="form.hasStorageShow" filterable placeholder="" @change="getStorageCapacity")
              el-option(v-for="item,index in hasStorageList", :key="index", :label="item.label", :value="item.value")
      el-row.pr-10(type="flex")
        el-col(:span="8" :hidden="!showStorageCapacity")
          el-form-item.is-required(label="库存规模：", prop="storageCapacity")
            el-input(v-model="form.storageCapacity" type="number" @change="storageCapacityInput" placeholder="单位‘吨’")
        el-col(:span="16")
          el-form-item.is-required(label="主营业务：", prop="mainBusi")
            el-cascader.full-width(v-model="form.mainBusi", :show-all-levels="false", placeholder="请选择主营业务", :props="propsRule", :options="mainBusiList", @change="getMainBusi")
            //- el-select.full-width(v-model="form.mainBusi" filterable placeholder="" @change="getMainBusi"){ multiple: true, expandTrigger: 'hover' }
            //-   el-option(v-for="item,index in busiScopeList", :key="index", :label="item.label", :value="item.value")
            //-   el-option(v-if="busiScopeSonList" v-for="item,index in busiScopeSonList", :key="index", :label="item.label", :value="item.value")
      el-row.pr-10(type="flex", justify="space-between")
        el-col(:span="24")
          el-form-item.is-required(label="经营区域覆盖：", prop="busiScope")
            el-select.full-width(v-model="form.busiScope", filterable, remote, :remote-method="selectRemote", placeholder="请输入经营区域", multiple, @change="getBusiScope")
              el-option(v-for="item in busiScopeList", :key="item.id", :label="item.name", :value="item.name")       
            //- el-input(v-model="form.busiScope" maxlength="50", placeholder="请按地级市或县级市进行填写，填写内容用空格隔开")
  el-row(type="flex", justify="space-between")
    el-col.mt-10(:span="22")
      breadcrumb(:breadItems="breadItemList[1]")
    el-col(:span="2")
      el-button(type="primary", :icon="showAllBtnIsEdit ? 'el-icon-arrow-up' : 'el-icon-arrow-down'", @click="showAll") {{showAllBtnIsEdit ? '收起' : '展示全部'}}
  .pt-20
    el-form(ref="form", show-message, :model="form", label-width="145px", label-position="right")
      div(v-if="yearSaleList.length != 0")
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
      div(v-else) 
         el-row(style="color: #c0c0c0;text-align: center;") 暂无数据
  breadcrumb(:breadItems="breadItemList[2]")
  .pt-20
    el-form(ref="form", show-message, :model="form", :rules="rules", label-width="160px", label-position="right")
      el-row.pr-10(type="flex", justify="space-between")
        el-col(:span="7")
          el-form-item.is-required(label="全年需求重量评估：", prop="yearSaleWeight")
            el-input(v-model="form.yearSaleWeight" type="number" @change="yearSaleWeightInput" placeholder="单位‘吨’")
      el-row.pr-10(:gutter="30")
        el-col(:span="7")
          el-form-item.is-required(label="我司供应占比：", prop="yearPercent")
            el-slider(v-model="form.yearPercent" :step="10" @change="getOtherProvider")
        el-col.pt-8(:span="7")
          label 占比（{{form.yearPercent}}%）
      div(v-for="item,index in form.dataStr" :key="index" :hidden="!showOtherProvider")
        el-row.pr-10(type="flex" justify="space-between")
          el-col(:span="8")
            el-form-item.is-required(:label='"其他主要供应商"+(index+1)+"："', prop="supplyName")
              el-input(v-model="item.supplyName" maxlength="50")
          el-col(:span="14")
            el-form-item.is-required(label="其他供应商优势：", prop="supplyPrefer")
              el-input(v-model="item.supplyPrefer" maxlength="50")
                //- el-button(slot="append" icon="el-icon-delete" @click="deleteBtn(index)")              
          el-col(:span="1")
            el-button(@click.prevent="deleteBtn(index)") 删除
      el-row.pr-10(type="flex" justify="end" v-if="showAddMoreBtn")
        el-button(type="primary", plain, @click="addMore") 新增
      el-row.pr-10(type="flex", justify="space-between")
        el-col(:span="16")
          el-form-item.is-required(label="主要购买物资：")
            el-input(v-model="purchaseGoods", :disabled="formDisabled")
      el-row.pr-10(type="flex", justify="space-between")
        el-col(:span="12")
          el-form-item.is-required(label="主要需求物资品名：", prop="goodsNames")
            el-select.full-width(v-model="selectGoodsNamesList" placeholder="该企业有需求且未在我司采购的物资" multiple @change="getGoodsNameValue")
              el-option(v-for="item in goodsNamesList", :key="item.id", :label="item.name", :value="item.name")
        el-col(:span="12")
          el-form-item.is-required(label="主要需求物资品名：", prop="extraGoodsRequirement")
            el-input(v-model="form.extraGoodsRequirement", placeholder="该企业有需求且我司没有的物资(空格隔开)")
            //- el-select.full-width(v-model="mianNeeds" placeholder="" multiple @change="getGoodsNameValue")
            //-   el-option(v-for="item in goodsNamesList", :key="item.id", :label="item.name", :value="item.name")
  breadcrumb(:breadItems="breadItemList[3]")
  .pt-20
    el-form(ref="form", show-message, :model="form", :rules="rules", label-width="160px", label-position="right")
      el-row.pr-10(type="flex")
        el-col(:span="8")
          el-form-item.is-required(label="主要运力实现方式：", prop="mainDeliveryWay")
            el-select.full-width(v-model="form.mainDeliveryWay" filterable placeholder="" @change="getDeliveryPrefer")
              el-option(v-for="item in mainDeliveryWayList", :key="item.label", :label="item.label", :value="item.value")
        el-col(:span="8" :hidden="!showDeliveryName")
          el-form-item.is-required(label="三方物流单位名称或组织者，司机姓名：", prop="deliveryName")
            el-input(v-model="form.deliveryName" maxlength="50") 
        el-col(:span="8" :hidden="!showDeliveryPrefer")
          el-form-item.is-required(label="主要物流偏好：", prop="deliveryPrefer")
            el-select.full-width(v-model="form.deliveryPrefer" filterable placeholder="")
              el-option(v-for="item in deliveryPreferList", :key="item.label", :label="item.label", :value="item.value")
    el-row.mt-25.text-center
      el-button(type="primary", @click="onSubmit('form')") 更新
      el-button(@click="onSubmit('cancel')") 取消
</template>
<script>
import areaJson from '@/components/AreaJson.js'
import breadcrumb from '@/components/Breadcrumb.vue'
import { mapState } from 'vuex'
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
      propsRule: { multiple: true, expandTrigger: 'hover' },
      busiScopeList: [],
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
        mainBusi: [],
        busiScope: [],
        yearSaleWeight: '',
        yearPercent: 0,
        extraGoodsRequirement: '',
        goodsNames: '',
        mainDeliveryWay: '',
        deliveryName: '',
        deliveryPrefer: '',
        dataStr: []
      },
      form: {
        compName: '',
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
        hasStorageShow: '',
        hasStorage: '',
        storageCapacity: '',
        mainBusi: [],
        busiScope: [],
        yearSaleWeight: 0,
        yearPercent: 0,
        extraGoodsRequirement: '',
        goodsNames: '',
        mainDeliveryWay: '',
        deliveryName: '',
        deliveryPrefer: '',
        dataStr: []
      },
      localDepositeRate: 70, // 我司占比
      showAllBtnIsEdit: false,
      showLossReason: false, // 流失原因显示与否
      showHasStorage: false, // 有无库存显示与否
      showReason: false, //显示原因描述与否
      showStorageCapacity: false, // 库存规模显示与否
      goodsNamesList: [],
      selectGoodsNamesList: [],
      areaNamesList: [],
      showDeliveryName: false,
      deliveryPreferList: [], // 主要物流偏好
      showDeliveryPrefer: false, // 主要物流偏好显示与否
      showOtherProvider: false, // 其他供应商1显示与否
      moreProvider: [], // 新增其他供应商，优势
      yearSaleList: [], //历史交易数据
      selectCstmPropertyIdsList: [],
      i: 0,
      showAddMoreBtn: false,
      rules: {
        reason: [
          { required: true, message: '请输入内容', trigger: 'blur' },
        ],
        busiScope: [
          { required: true, message: '请输入内容', trigger: 'blur' },
        ],
        areaName: [
          { required: true, message: '请输入内容', trigger: 'blur' },
        ],
        hasStorageShow: [
          { required: true, message: '请选择', trigger: 'blur' },
        ],
        storageCapacity: [
          { required: true, message: '请输入内容', trigger: 'blur' },
        ],
        yearSaleWeight: [
          { required: true, message: '请输入内容', trigger: 'blur' },
        ],
        mainDeliveryWay: [
          { required: true, message: '请输入内容', trigger: 'blur' },
        ],
        deliveryName: [
          { required: true, message: '请输入内容', trigger: 'blur' },
        ],
        deliveryPrefer: [
          { required: true, message: '请输入内容', trigger: 'blur' },
        ]
      },
      busiScopeSonList: [],
      purchaseGoods: '',
    }
  },
  computed: {
    ...mapState({
      cstmPropertyIdsList: state => state.cstmPropertyIds, // 客户性质
      lossReasonList: state => state.lossReasonList, // 流失原因
      hasStorageList: state => state.hasStorageList, // 有无库存
      mainDeliveryWayList: state => state.mainDeliveryWayList, // 主要运力方式
      deliveryPreferList1: state => state.deliveryPreferList1, // 物流偏好
      deliveryPreferList2: state => state.deliveryPreferList2, // 物流偏好
      mainBusiList: state => state.mainBusiList, // 主营业务
    })
  },
  created () { },
  mounted () {
    this.initform(this.originObj)
    this.getGoodsNames()
    this.getAreaNames()
    // this.getCustomProperty()
  },
  watch: {
  },
  methods: {
    initform (newVal) {
      // 数据格式化处理
      if (newVal.obj) {
        this.form = Object.assign(this.form, newVal.obj)
        if (newVal.firstBillTime) {
          this.form.firstBillTime = newVal.firstBillTime.split(' ')[0]
        } else {
          this.form.firstBillTime = '--'
        }
        if (newVal.firstLadTime) {
          this.form.firstLadTime = newVal.firstLadTime.split(' ')[0]
        } else {
          this.form.firstLadTime = '--'
        }
        if (newVal.purchaseGoods == "undefined" || newVal.purchaseGoods == null || newVal.purchaseGoods.trim() == "") {
          this.purchaseGoods = '--'
        } else {
          this.purchaseGoods = newVal.purchaseGoods
        }
        if (newVal.dataList) {
          this.form.dataStr = newVal.dataList
          this.i = newVal.dataList.length
        }
        if (newVal.yearSaleList) {
          newVal.yearSaleList.map(item => {
            if (item.billWeight == "undefined" || item.billWeight == null || item.billWeight.trim() == "") {
              item.billWeight = '--'
            }
            if (item.ladWeight == "undefined" || item.ladWeight == null || item.ladWeight.trim() == "") {
              item.ladWeight = '--'
            }
            if (item.highSale == "undefined" || item.highSale == null || item.highSale == "") {
              item.highSale = '--'
            }
            if (item.goods1 == "undefined" || item.goods1 == null || item.goods1.trim() == "") {
              item.goods1 = '--'
            }
            if (item.goods2 == "undefined" || item.goods2 == null || item.goods2.trim() == "") {
              item.goods2 = '--'
            }
            if (item.goods3 == "undefined" || item.goods3 == null || item.goods3.trim() == "") {
              item.goods3 = '--'
            }
          })
          this.yearSaleList = newVal.yearSaleList
        }
        if (newVal.obj.yearPercent) {
          this.form.yearPercent = parseInt(newVal.obj.yearPercent)
          if (this.form.yearPercent !== 100) {
            this.showAddMoreBtn = true
          }
        }
        if (newVal.obj.mainBusi) {
          if (newVal.obj.mainBusi.trim() != '') {
            this.form.mainBusi = JSON.parse(newVal.obj.mainBusi)
          }
        }
        if (newVal.obj.busiScope) {
          if (newVal.obj.busiScope.trim() != '') {
            this.form.busiScope = JSON.parse(newVal.obj.busiScope)
          } else {
            this.form.busiScope = null
          }
        }
        this.form.extraGoodsRequirement = newVal.obj.extraGoodsRequirement
        this.form.customerPropertyMark = this.form.customerPropertyMark === '0' ? '长期维护' : '二次开发'
        if (newVal.obj.cstmPropertyIds) { //客户性质转为数组类型
          this.selectCstmPropertyIdsList = newVal.obj.cstmPropertyIds.split(',')
        }
        if (newVal.obj.goodsNames) { //品名转为数组类型
          this.selectGoodsNamesList = newVal.obj.goodsNames.split(',')
        }
        if (newVal.obj.areaName) {
          this.form.areaName = newVal.obj.areaName
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
        if (this.form.cstmPropertyIds) {
          this.getHasStorageValue(this.form.cstmPropertyIds)
        }
        // 判断库存规模显示与否
        this.showStorageCapacity = this.form.storageCapacity ? true : false
        this.showStorageCapacity = this.form.hasStorage === '1' ? true : false
        this.form.hasStorageShow = this.form.hasStorage === '1' ? '有' : '无'
        // 判断其他供应商显示
        this.showOtherProvider = this.form.dataStr ? true : false
        // 判断司机名显示
        this.showDeliveryName = this.form.deliveryName ? true : false
        if (this.form.mainDeliveryWay) {
          if (this.form.mainDeliveryWay.toString().trim() === '固定三方物流') {
            this.showDeliveryName = true
          } else {
            this.showDeliveryName = false
          }
        } else {
          this.showDeliveryName = false
        }
        // 判断物流偏好显示
        this.showDeliveryPrefer = this.form.deliveryPrefer ? true : false
        // 判断物流偏好选框是否显示，显示哪个option
        if (this.form.mainDeliveryWay) {
          if (this.form.mainDeliveryWay.toString().indexOf('我司配送') !== -1 || this.form.mainDeliveryWay.toString().indexOf('非固定三方物流') !== -1) {
            this.showDeliveryPrefer = true
            this.deliveryPreferList = this.deliveryPreferList1
          } else if (this.form.mainDeliveryWay.toString().trim() === '固定三方物流') {
            this.showDeliveryPrefer = true
            this.deliveryPreferList = this.deliveryPreferList2
          } else {
            this.showDeliveryPrefer = false
          }
        } else {
          this.showDeliveryPrefer = false
        }

        this.showOtherProvider = this.form.yearPercent === '100' ? false : true
        console.log('initform_this.form========>' + JSON.stringify(this.form))
        this.postForm.cstmId = newVal.obj.id
        this.postForm.lossReason = newVal.obj.lossReason
        this.postForm.reason = newVal.obj.reason
        this.postForm.areaName = newVal.obj.areaName
        this.postForm.yearPercent = parseInt(newVal.obj.yearPercent)
        this.postForm.hasStorage = newVal.obj.hasStorage
        this.postForm.mainDeliveryWay = newVal.obj.mainDeliveryWay
        this.postForm.deliveryPrefer = newVal.obj.deliveryPrefer
        this.postForm.goodsNames = newVal.obj.goodsNames
        this.postForm.cstmPropertyIds = newVal.obj.cstmPropertyIds
        // console.log('initform_this.postForm========>' + JSON.stringify(this.postForm))
        this.loading = false
      }
    },
    // 根据select流失原因判断原因描述显示与否
    getReasonValue (label) {
      if (label) {
        this.showReason = this.form.lossReason.toString().trim() === '其他原因' ? true : false
        this.form.lossReason = this.form.lossReason.toString().trim()
        this.postForm.lossReason = this.form.lossReason.toString().trim()
      }
    },
    // 根据select客户性质判断有无库存显示与否：客户性质含有“贸易商、终端客户、加工单位”时显示
    getHasStorageValue (label) {
      this.form.cstmPropertyIds = label
      this.postForm.cstmPropertyIds = label.toString()
      if (label.toString().indexOf('贸易商') !== -1 || label.toString().indexOf('终端客户') !== -1 || label.toString().indexOf('加工单位') !== -1) {
        this.showHasStorage = true
        this.showStorageCapacity = false
        if (this.form.hasStorage) {
          this.form.hasStorageShow = this.form.hasStorage.toString() === '1' ? '有' : '无'
          this.showStorageCapacity = this.form.hasStorage.toString() === '1' ? true : false
        } else {
          this.form.hasStorageShow = '无'
        }
      } else {
        this.showHasStorage = false
        this.showStorageCapacity = false
      }
      this.postForm.hasStorage = this.form.hasStorage
    },
    // 限制输入数字不可为负，最多两位小数
    storageCapacityInput (val) {
      let numbTest = /^[0-9]+\.?[0-9]*$/
      if (numbTest.test(val)) {
        if (val > 0) {
          // 通过正则过滤小数点后两位
          val = (val.match(/^\d*(\.?\d{0,3})/g)[0]) || null
          console.log('storageCapacityInput(val)======>', val)
          this.form.storageCapacity = val
          this.postForm.storageCapacity = val
        } else {
          this.msgShow(this, '请输入正确的数量！')
          this.form.storageCapacity = 0
          this.postForm.storageCapacity = 0
        }
      } else {
        this.form.storageCapacity = ''
        this.postForm.storageCapacity = ''
        this.msgShow(this, '请输入正确的数量！')
      }
    },
    yearSaleWeightInput (val) {
      let numbTest = /^[0-9]+\.?[0-9]*$/
      if (numbTest.test(val)) {
        if (val >= 0) {
          // 通过正则过滤小数点后两位
          val = (val.match(/^\d*(\.?\d{0,3})/g)[0]) || null
          this.form.yearSaleWeight = val
          this.postForm.yearSaleWeight = val
        } else {
          this.msgShow(this, '请输入正确的数量！')
          this.form.yearSaleWeight = 0
          this.postForm.yearSaleWeight = 0
        }
      } else {
        this.form.yearSaleWeight = ''
        this.postForm.yearSaleWeight = ''
        this.msgShow(this, '请输入正确的数量！')
      }
    },
    getGoodsNameValue (label) {
      this.form.goodsNames = label.toString()
      this.postForm.goodsNames = label.toString()
    },
    getAreaNameValue (label) {
      this.form.areaName = label
      this.postForm.areaName = label
    },
    // 根据select有无库存判断库存容量显示与否
    getStorageCapacity (label) {
      if (label.toString().trim() === '有') {
        this.showStorageCapacity = true
        this.form.hasStorage = 1
        this.postForm.hasStorage = 1
      } else {
        this.showStorageCapacity = false
        this.form.hasStorage = 0
        this.postForm.hasStorage = 0
      }
    },
    // 获取主营业务
    getMainBusi (val) {
      this.form.mainBusi = []
      if (val.length > 5) {
        this.msgShow(this, '主营业务最多选择五项')
        this.form.mainBusi = val.slice(0,5)
      } else {
        // console.log(JSON.stringify(val))
        this.form.mainBusi = val
      }
    },
    getBusiScope (val) {
      this.form.busiScope = []
      // console.log(JSON.stringify(val))
      this.form.busiScope = val
    },
    // 根据我司占比数量判断是否显示其他供应商
    getOtherProvider (label) {
      let dl = 0
      let da = []
      this.form.dataStr.map(item => {
        // if(item.supplyName  != "undefined" && item.supplyName != null && item.supplyName.trim() != ""){
        //   dl ++
        //   da.push(item)
        // } 
        dl++
        da.push(item)
      })
      if (dl === 0) {
        this.i = 0
        this.form.dataStr = []
        if (label !== 100) {
          this.showAddMoreBtn = true
          this.showOtherProvider = true
          this.addMore()
        } else {
          this.showOtherProvider = false
          this.showAddMoreBtn = false
        }
      } else {
        this.i = dl
        this.form.dataStr = da
        if (label === 100) {
          this.i = 0
          this.form.dataStr = []
          this.showOtherProvider = false
          this.showAddMoreBtn = false
        }
      }

    },
    deleteBtn (index) {
      if (this.i > 1) {
        this.form.dataStr.splice(index, 1)
        this.i = this.i - 1
        // console.log('this.form.dataStr========>' + JSON.stringify(this.form.dataStr))
        this.postForm.dataStr = JSON.stringify(this.form.dataStr)
      } else {
        this.msgShow(this, '我司占比不足100%时，最少填写一个供应商！')
      }
    },
    removeDomain (domain) {
      // console.log('removeDomain(domain)=====>' + JSON.stringify(domain))
    },
    // 主要运力实现方式选择“我司配送，固定三方物流，非固定物流三方”展示物流偏好
    // 主要运力实现方式选择“固定三方物流”，展示司机名字段
    getDeliveryPrefer (label) {
      // console.log('getDeliveryPrefer(label)========>' + label)
      this.form.deliveryPrefer = ''
      if (label.toString().indexOf('我司配送') !== -1 || label.toString().indexOf('非固定三方物流') !== -1) {
        this.showDeliveryName = false
        this.form.deliveryName = ''
        this.showDeliveryPrefer = true
        this.deliveryPreferList = this.deliveryPreferList1
      } else if (label.toString().trim() === '固定三方物流') {
        this.showDeliveryName = true
        this.showDeliveryPrefer = true
        this.deliveryPreferList = this.deliveryPreferList2
      } else {
        this.showDeliveryName = false
        this.form.deliveryName = ''
        this.showDeliveryPrefer = false
      }
      if (label.length != 0) {
        this.postForm.mainDeliveryWay = label
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
    beforeSubmit () {
      if (this.form.mark === '公共') {
        if (this.form.lossReason) {
          this.postForm.lossReason = this.form.lossReason
          if (this.form.lossReason === '其他原因') {
            if (this.form.reason != 'undefined' && this.form.reason != null && this.form.reason.trim() != '') {
              this.postForm.reason = this.form.reason
            } else {
              this.msgShow(this, '请输入原因！')
              return false
            }
          } else {
            delete this.postForm.reason
          }
        } else {
          this.msgShow(this, '请选择流失原因！')
          return false
        }
      } else {
        delete this.postForm.lossReason
        delete this.postForm.reason
      }
      if (this.form.hasStorage) {
        this.postForm.hasStorage = this.form.hasStorage
      } else {
        delete this.postForm.hasStorage
      }
      if (this.form.storageCapacity) {
        this.postForm.storageCapacity = this.form.storageCapacity
      } else {
        this.msgShow(this, '请输入正确的数量！')
        return false
        delete this.postForm.storageCapacity
      }
      if (this.form.areaName) {
        this.postForm.areaName = this.form.areaName
      } else {
        delete this.postForm.areaName
      }
      if (this.form.mainBusi && this.form.mainBusi.length > 0) {
        this.postForm.mainBusi = JSON.stringify(this.form.mainBusi)
      } else {
        this.msgShow(this, '请选择主营业务！')
        return false
      }
      if (this.form.busiScope && this.form.busiScope.length > 0) {
        this.postForm.busiScope = JSON.stringify(this.form.busiScope)
      } else {
        this.msgShow(this, '请选择经营区域！')
        return false
      }
      if (this.form.yearSaleWeight) {
        this.postForm.yearSaleWeight = parseInt(this.form.yearSaleWeight)
      } else {
        this.msgShow(this, '请输入正确的数量！')
        return false
        delete this.postForm.yearSaleWeight
      }
      if (this.form.yearPercent) {
        this.postForm.yearPercent = this.form.yearPercent
        if (this.form.yearPercent !== 100) {
          for (let i = 0; i < this.form.dataStr.length; i++) {
            if (typeof this.form.dataStr[i].supplyName == "undefined" || this.form.dataStr[i].supplyName == null || this.form.dataStr[i].supplyName.trim() == "") {
              this.msgShow(this, '请输入其他供应商信息！')
              return false
            }
            if (typeof this.form.dataStr[i].supplyPrefer == "undefined" || this.form.dataStr[i].supplyPrefer == null || this.form.dataStr[i].supplyPrefer.trim() == "") {
              this.msgShow(this, '请输入其他供应商优势！')
              return false
            }
          }
        }
      } else {
        delete this.postForm.yearPercent
      }
      if (this.form.extraGoodsRequirement != 'undefined' && this.form.extraGoodsRequirement != null && this.form.extraGoodsRequirement.trim() != '') {
        this.postForm.extraGoodsRequirement = this.form.extraGoodsRequirement
      } else {
        this.msgShow(this, '请输入主要需求物资品名！')
        return false
      }
      if (this.form.mainDeliveryWay) {
        this.postForm.mainDeliveryWay = this.form.mainDeliveryWay
        if (this.form.mainDeliveryWay.toString().trim() === '固定三方物流') {
          if (this.form.deliveryName != 'undefined' && this.form.deliveryName != null && this.form.deliveryName.trim() != '') {
            this.postForm.deliveryName = this.form.deliveryName
          } else {
            this.msgShow(this, '请输入三方物流单位名称或组织者，司机姓名！')
            return false
          }
          if (this.form.deliveryPrefer) {
            this.postForm.deliveryPrefer = this.form.deliveryPrefer
          } else {
            this.msgShow(this, '请选择主要物流偏好！')
            return false
          }
        }
        if (this.form.mainDeliveryWay.toString().indexOf('我司配送') !== -1 || this.form.mainDeliveryWay.toString().indexOf('非固定三方物流') !== -1) {
          if (this.form.deliveryPrefer) {
            this.postForm.deliveryPrefer = this.form.deliveryPrefer
          } else {
            this.msgShow(this, '请选择主要物流偏好！')
            return false
          }
        }
      } else {
        this.msgShow(this, '请输入主要运力实现方式！')
        return false
      }

      if (this.form.deliveryName) {
        this.postForm.deliveryName = this.form.deliveryName
      } else {
        delete this.postForm.deliveryName
      }
      if (this.form.deliveryPrefer) {
        this.postForm.deliveryPrefer = this.form.deliveryPrefer
      } else {
        delete this.postForm.deliveryPrefer
      }
      this.postForm.dataStr = JSON.stringify(this.form.dataStr)
      if (this.selectCstmPropertyIdsList.length === 0) {
        this.msgShow(this, '请选择客户性质！');
        return false
      }
      if (this.selectGoodsNamesList.length === 0) {
        this.msgShow(this, '请选择主要需求物资品名！');
        return false
      }
      return true
    },
    async onSubmit (flag) {
      if (flag === 'form') {
        let resoult = this.beforeSubmit()
        if (resoult) {
          this.loading = true
          console.log('入参_Submit_this.postForm------------', this.postForm)
          let { data } = await this.apiStreamPost('/proxy/common/post',
            { url: 'customerManage/evaluation/', params: this.postForm })
          if (data.returnCode === 0) {
            // console.log('data' + JSON.stringify(data))
            this.loading = false
            this.$message({
              message: '更新成功',
              type: 'success'
            });
          } else {
            this.loading = false
            this.msgShow(this, data.errMsg)
            //this.$message.error('更新失败，请确认数据是否填写准确！');
          }
        }

      } else if (flag === 'cancel') {
        this.back()
      }
    },
    async showAll () {
      this.loading = true
      let url = 'customerManage/evaluation/year/goodsName?erpCode=' + this.erpCode + '&startYear=2017&endYear=2020'
      this.showAllBtnIsEdit = !this.showAllBtnIsEdit
      // console.log('this.showAllBtnIsEdit======>' + JSON.stringify(this.showAllBtnIsEdit))
      let { data } = await this.apiStreamPost('/proxy/common/get',
        { url: url })
      if (data.returnCode === 0) {
        if (data.list.length != 0) {
          // console.log('data' + JSON.stringify(data.list))
          this.yearSaleList = data.list
          this.loading = false
        } else {
          this.$message('暂无数据');
          this.loading = false
        }
      }
    },
    addMore (val) {
      if (this.i > 4) {
        this.$message({
          message: '最多增加五项',
          type: 'warning'
        })
      } else {
        ++this.i
        // console.log(this.i)
        this.form.dataStr.push({
          supplyName: '',
          supplyPrefer: ''
        })
      }
    },
    async getCustomProperty () {
      let params = {
        currentPage: 0,
        pageSize: 50,
      }
      let { data } = await this.apiStreamPost('/proxy/common/post',
        { url: 'basicData/customProperty', params: params })
      if (data.returnCode === 0) {
        this.cstmPropertyIdsList = data.list
      }
    },
    async getCity (name) {
      let params = {
        currentPage: 0,
        pageSize: 20,
        name: name
      }
      let { data } = await this.apiStreamPost('/proxy/common/post',
        { url: 'setting/address/city/list', params: params })
      if (data.returnCode === 0) {
        this.busiScopeList = data.list
      }
    },
    selectRemote (query) {
      this.getCity(query)
    }
  }
}
</script>
<style lang="stylus" scoped>
.mt-10
  margin-top 10px
.pt-8
  padding-top 8px
</style>