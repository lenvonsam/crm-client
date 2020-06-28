<template lang="pug">
  .content
    breadcrumb(:breadItems="breadItems")
    .mt-15  
    el-tabs(type="border-card", v-model="tabName", @tab-click="handleClick")
      el-tab-pane(label="客户评估", name="1")
        div(v-if="tabName == '1'")
          .mt-15
            search-form(:searchFormItems="searchFormItems1", @search="clientSearchForm")
          .mt-5
            basic-table(:tableValue="tableValue1", :currentPage="currentPage1", 
            :pageSize="pageSize", :total="clientTotalCount", :loading="loading", 
            @tableRowEdit="clientEvalRowEdit",@pageChange="tableChange1")    
      el-tab-pane(label="地区评估", name="2")
        div(v-if="tabName == '2'")
          .mt-15
            search-form(:searchFormItems="searchFormItems2", @search="areaSearchForm")
          .mt-5
            basic-table(:tableValue.sync="tableValue2", 
            rowEdit,
            :currentPage="currentPage2", 
            :pageSize="pageSize",
            :total="areaTotalCount",
            :loading="loading", 
            @tableRowSave="areaEvalRowSave", 
            @tableRowDefault="rowDefault",@pageChange="tableChange2", v-if="tabName == '2'")  
</template>
<script>
import breadcrumb from '@/components/Breadcrumb.vue'
import searchForm from '@/components/SearchForm.vue'
import basicTable from '@/components/BasicTable.vue'
import { mapState } from 'vuex'
export default {
  layout: 'main',
  components: {
    breadcrumb,
    searchForm,
    basicTable
  },
  data () {
    return {
      breadItems: ['客户管理', '客户评估'],
      tabName: '1',
      searchFormItems1: [
        [{ label: '公司名称', model: 'compName', type: 'text', placeholder: '请输入公司名称', val: '' },
        { label: '联系人姓名', model: 'linkerName', type: 'text', placeholder: '请输入联系人姓名', val: '' },
        { label: '业务部门', model: 'dptName', placeholder: '请输入业务部门', val: '' }],
        [{ label: '业务员', model: 'employeeName', placeholder: '请输入业务员', val: '' },
        { label: '归属性质', model: 'customerPropertyMark', type: 'select', placeholder: '请选择归属性质', val: '', list: [] },
        { label: '抬头创建日期', model: 'createAt', type: 'timeLimit', val: '' }],
        [{ label: '客户状态', model: 'mark', type: 'select', placeholder: '请选择状态类型', val: '', list: [] },
        { label: '评估状态', model: 'showUpdate', type: 'select', placeholder: '请选择评估状态', val: '1', list: [] }]
      ],
      searchFormItems2: [
        [{ label: '地区', model: 'areaName', type: 'select', placeholder: '', val: '', list: [], filter: true, clearable: true },
        { label: '业务部门', model: 'dptName', placeholder: '请输入业务部门', val: '' },
        { label: '业务员', model: 'employeeName', placeholder: '请输入业务员', val: '' }]
      ],
      tableValue1: {
        tableData: [],
        hasCbx: false,
        rowClassName: false,
        tableHead: [{
          lbl: '公司名称',
          prop: 'compName',
          // type: 'link',
          // linkUrl: '/customManager/customerEvalution/detail',
          minWidth: '340px'
        }, {
          lbl: '主联系人',
          prop: 'linkerName',
          width: '150px'
        }, {
          lbl: '业务部门',
          prop: 'dptName',
          width: '150px'
        }, {
          lbl: '业务员',
          prop: 'employeeName',
          width: '150px'
        }, {
          lbl: '归属性质',
          prop: 'customerPropertyMark',
          width: '150px'
        }, {
          lbl: '客户状态',
          prop: 'mark',
          width: '150px'
        }, {
          lbl: '评估状态',
          prop: 'showUpdate',
          width: '150px'
        }, {
          lbl: '抬头创建日期',
          prop: 'createAt',
          width: '200px'
        }, {
          type: 'action',
          fixed: 'right',
          width: '100px',
          actionBtns: [{
            lbl: '编辑',
            type: 'edit'
          }]
        }]
      },
      tableValue2: {
        tableData: [],
        hasCbx: false,
        rowClassName: false,
        tableHead: [{
          lbl: '地区',
          prop: 'areaName',
        }, {
          lbl: '部门',
          prop: 'dptName',
        }, {
          lbl: '业务员',
          prop: 'employeeName',
        }, {
          lbl: '2019销量',
          prop: 'oldWeight',
        }, {
          lbl: '2020销量',
          prop: 'newWeight',
        }, {
          lbl: '2020销量评估',
          prop: 'saleEvaluationWeight',
          type: 'edit',
          editType: 'text',
          placeholder: '单位“吨”'
        }, {
          lbl: '主要物流现状',
          prop: 'deliveryStatusInfo',
          type: 'edit',
          editType: 'select',
          selectList: []
        }, {
          lbl: '物流对销量的影响',
          prop: 'effectForSale',
          type: 'edit',
          editType: 'select',
          selectList: []
        }, {
          type: 'action',
          fixed: 'right',
          width: '100px',
          actionBtns: [{
            lbl: '编辑',
            type: 'edit'
          }]
        }]
      },
      currentPage1: 1,
      currentPage2: 1,
      //pageSize: 3,
      clientTotalCount: 0,
      areaTotalCount: 0,
      loading: true,//页面进入表格加载
      clientObject: { // 客户评估入参
        currentPage: this.currentPage1 - 1,
        pageSize: this.pageSize,
        compName: '',
        linkerName: '',
        dptName: '',
        employeeName: '',
        showUpdate: '1', // 1仅展示未评估的公司
        customerPropertyMark: '', // 归属性质
        mark: '' //客户状态
      },
      areaObject: { // 地区评估入参
        currentPage: this.currentPage2 - 1,
        pageSize: this.pageSize,
        areaName: '',
        dptName: '',
        employeeName: ''
      }
    }
  },
  computed: {
    ...mapState({
      pageSize: state => state.pageSize,
      currentUser: state => state.user.currentUser,
      propertyMark: state => state.propertyMark,
      clientStatus: state => state.clientStatus,
      showUpdateList: state => state.showUpdateList,
      logisticsStat: state => state.logisticsStat,
      logisticsInflu: state => state.logisticsInflu,
    })
  },
  created () {
  },
  beforeMount () {
    this.searchFormItems1[1][1]['list'] = this.propertyMark
    this.searchFormItems1[2][0]['list'] = this.clientStatus
    this.searchFormItems1[2][1]['list'] = this.showUpdateList
  },
  mounted () {
    // console.log('tableValue2.tableHead------>' + JSON.stringify(this.tableValue2.tableHead))
    this.searchFormItems1[1][1]['val'] = ''
    this.searchFormItems1[2][0]['val'] = ''
    this.searchFormItems1[2][1]['val'] = '1'
    this.$nextTick(() => {
      this.clientObject = {
        currentPage: this.currentPage1 - 1,
        pageSize: this.pageSize,
        compName: '',
        linkerName: '',
        dptName: '',
        employeeName: '',
        showUpdate: '1', // 1仅展示未评估的公司
        customerPropertyMark: '', // 归属性质
        mark: '' //客户状态
      }
      this.loadClientEvalData()
      this.areaObject = { // 地区评估入参
        currentPage: this.currentPage2 - 1,
        pageSize: this.pageSize,
        areaName: '',
        dptName: '',
        employeeName: ''
      }
    })
  },
  methods: {
    handleClick (tab, event) {
      this.tabName = tab.name
      if (this.tabName == '2') {
        this.tableValue2.tableHead.map(item => {
          if (item.prop == 'deliveryStatusInfo') item.selectList = this.logisticsStat
          if (item.prop == 'effectForSale') item.selectList = this.logisticsInflu
        })

        this.loadAreaEvalData()
        this.getAreaList()
      } else {
        this.searchFormItems1[1][1]['list'] = this.propertyMark
        this.searchFormItems1[2][0]['list'] = this.clientStatus
        this.searchFormItems1[2][1]['list'] = this.showUpdateList
      }
      this.$forceUpdate()
    },
    clientSearchForm (paramsObj) {
      this.loading = true
      this.currentPage1 = 1
      this.clientObject.currentPage = this.currentPage1 - 1
      Object.keys(paramsObj).map(key => {
        if (key == 'createAt') {
          if (paramsObj.createAt !== null) {
            this.clientObject.startDate = paramsObj.createAt[0]
            this.clientObject.endDate = paramsObj.createAt[1]
          } else {
            delete this.clientObject.startDate
            delete this.clientObject.endDate
          }
        } else {
          this.clientObject[key] = paramsObj[key].trim()
        }
      })
      // console.log('入参clientSearchForm_clientObject=====>' + JSON.stringify(this.clientObject))
      this.loadClientEvalData()
    },
    areaSearchForm (paramsObj) {
      this.loading = true
      this.currentPage2 = 1
      this.areaObject.currentPage = this.currentPage2 - 1
      Object.keys(paramsObj).map(key => {
        this.areaObject[key] = paramsObj[key].trim()
      })
      // console.log('入参areaObject_areaObject=====>' + JSON.stringify(this.areaObject))
      this.loadAreaEvalData()
    },
    clientEvalRowEdit (obj) {
      this.jump('/customManager/customerEvalution/form?type=edit&id=' + obj.id)
    },
    rowDefault (obj) {
      const params = {
        linkId: obj.id,
        cstmId: this.$route.query.id
      }
      this.linkerDefault(params)
    },
    areaEvalRowSave (row) {
      let numbTest = /^[0-9]+\.?[0-9]*$/
      if (numbTest.test(row.saleEvaluationWeight)) {
        if (row.saleEvaluationWeight >= 0) {
          row.saleEvaluationWeight = (row.saleEvaluationWeight.match(/^\d*(\.?\d{0,3})/g)[0]) || null
          this.loading = true
          console.log('areaEvalRowSave (row)======>' + JSON.stringify(row))
          let params = {
            id: row.id,
            areaName: row.areaName,
            saleEvaluationWeight: row.saleEvaluationWeight,
            deliveryStatusInfo: row.deliveryStatusInfo,
            effectForSale: row.effectForSale,
            acctId: row.acctId
          }
          console.log('保存==》params------->' + JSON.stringify(params) + 'row------->' + JSON.stringify(row))
          this.createOrUpdate(params, 'areaEval')
        } else {
          this.msgShow(this, '请输入正确的数量！')
        }
      } else {
        this.msgShow(this, '请输入正确的数量！')
      }
    },
    tableChange1 (val) {
      this.loading = true
      this.currentPage1 = val
      this.clientObject.currentPage = this.currentPage1 - 1
      this.loadClientEvalData()
    },
    tableChange2 (val) {
      this.loading = true
      this.currentPage2 = val
      this.areaObject.currentPage = this.currentPage2 - 1
      this.loadAreaEvalData()
    },
    // 调接口获取客户评估列表数据
    async loadClientEvalData () {
      this.clientObject.uid = this.currentUser.id
      try {
        console.log('loadClientEvalData_入参----------' + JSON.stringify(this.clientObject))
        let { data } = await this.apiStreamPost('/proxy/common/post',
          { url: 'customerManage/evaluation/list', params: this.clientObject })
        if (data.returnCode === 0) {
          data.list.map(item => {
            item.mark = (item.mark === '1' ? '潜在' : (item.mark === '2' ? '正式' : '公共'))
            item.customerPropertyMark = item.customerPropertyMark === '0' ? '长期维护' : '二次开发'
            item.showUpdate = item.cstmId === 0 ? '未评估' : '已评估'
          })
          this.tableValue1.tableData = data.list
          this.clientTotalCount = data.total
          this.loading = false
        } else {
          console.error(data.errMsg)
          this.msgShow(this, data.errMsg)
        }
        this.searchFormItems2[0][2].val = ''
      } catch (e) {
        console.error(e)
        this.msgShow(this)
        this.loading = false
      }

    },
    // 接口获取地区评估列表数据
    async loadAreaEvalData () {
      this.areaObject.uid = this.currentUser.id
      try {
        let { data } = await this.apiStreamPost('/proxy/common/post',
          { url: 'customerManage/evaluation/area/list', params: this.areaObject })
        if (data.returnCode === 0) {
          this.tableValue2.tableData = data.list
          this.areaTotalCount = data.total
          this.loading = false
        } else {
          console.error(data.errMsg)
          this.msgShow(this, data.errMsg)
          this.loading = false
        }
      } catch (e) {
        console.error(e)
        this.msgShow(this)
        this.loading = false
      }
    },
    async linkerDefault (params) {
      try {
        let { data } = await this.apiStreamPost('/proxy/common/post', { url: 'customerManage/linker/' + params.linkId + '/common', params: params })
        if (data.returnCode === 0) {
          this.loadData()
          this.$message.success('设置成功')
        } else {
          this.msgShow(this, data.errMsg)
        }
        this.loading = false
      } catch (e) {
        console.error(e)
        this.msgShow(this)
        this.loading = false
      }
    },
    async createOrUpdate (params, flag) {
      this.loading = true
      try {
        let { data } = await this.apiStreamPost('/proxy/common/post',
          { url: 'customerManage/evaluation/area', params: params })
        if (data.returnCode === 0) {
          this.msgShow(this, '保存成功', 'success')
          this.loadAreaEvalData()
        } else {
          console.error(data.errMsg)
          this.msgShow(this, data.errMsg)
          this.loading = false
        }
      } catch (e) {
        console.error(e)
        this.msgShow(this)
        this.loading = false
      }
    },
    // 取出所有地区作为下拉列表
    async getAreaList () {
      let { data } = await this.apiStreamPost('/proxy/common/get', { url: 'erpComm/area' })
      if (data.returnCode === 0) {
        let areaNameList = []
        data.list.map((item, index) => {
          areaNameList.push({
            value: item.name,
            label: item.name
          })
        })
        this.searchFormItems2[0][0]['list'] = areaNameList
      }
    }
  }
}
</script>