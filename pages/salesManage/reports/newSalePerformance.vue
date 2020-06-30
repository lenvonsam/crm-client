  <template lang="pug">
  .content
    breadcrumb(:breadItems="breadItems")
    //- .pt-15
    //-   button-group(:btns="btnGroups", @groupBtnClick="groupBtnClick")
    .mt-15
      search-form(:searchFormItems="searchFormItems", @search="searchForm", ref="searchFrom", :pickerDisable="pickerDisable")
    .pt-15
      basic-table(:tableValue="tableValue", :currentPage="paramsObj.currentPage + 1", :loading="loading", :pageSize="paramsObj.pageSize", 
      :total="totalCount", :sumsFun="tabSumFun", @pageChange="tableChange")
</template>

<script>
import breadcrumb from '@/components/Breadcrumb.vue'
import searchForm from '@/components/SearchForm.vue'
import basicTable from '@/components/BasicTable.vue'
import buttonGroup from '@/components/ButtonGroup.vue'
import { mapState } from 'vuex'
export default {
  layout: 'main',
  components: {
    breadcrumb,
    basicTable,
    searchForm,
    buttonGroup
  },
  data () {
    return {
      breadItems: ['销售管理', '销售绩效新增客户明细表'],
      btnGroups: [{ lbl: '导出', type: 'export' }],
      totalCount: 0,
      pickerDisable: {
        disabledDate (time) {
          return time.getTime() > Date.now() - 8.64e7;
        }
      },
      paramsObj: {
        // nyStart: this.dataMonthStr(new Date()),
        // nyEnd: this.dataMonthStr(new Date()),
        currentPage: 0,
        pageSize: 50,
        orderColumn: '销量',
        orderType: 0, // 排序方式，默认正序
        // customer: '',
        nameType: 0, // 查询方式，默认模糊查询
        // empCode: '',
        // dptName: ''
      },
      loading: true,
      tableValue: {
        tableData: [],
        hasCbx: false,
        rowClassName: false,
        numShow: true,
        summary: true,
        tableHead: [{
          lbl: '客户名称',
          prop: 'datasCustomername',
          minWidth: 150
        }, {
          lbl: '客户起始时间',
          prop: 'startdate',
          width: 150
        }, {
          lbl: '部门',
          prop: 'deptName',
          width: 170
        }, {
          lbl: '业务员',
          prop: 'employeeName',
          width: 120
        }, {
          lbl: '销量',
          prop: 'dataBweight',
          summary: true,
          width: 120
        }, {
          lbl: '新客户提成',
          prop: 'newTc',
          summary: true,
          width: 120
        }]
      },
      totalSum: {}
    }
  },
  mounted () {
    this.loadData()
  },
  computed: {
    ...mapState({
      currentUser: state => state.user.currentUser
    }),
    searchFormItems () {
      let searchFrom = [[
        { label: '开单时间起', model: 'startTime', type: 'month', placeholder: '请选择年月', val: '' },
        { label: '开单时间止', model: 'endTime', type: 'month', placeholder: '请选择年月', val: '' },
        {          label: '排序', model: 'orderColumn', type: 'select', placeholder: '请选择排序字段', list: [
            { value: '销量', label: '销量' },
            { value: '新客户提成', label: '新客户提成' }
          ], val: '销量'        },
        {          label: '方式', model: 'orderType', type: 'select', placeholder: '请选择排序方式', list: [
            { value: 0, label: '正序' },
            { value: 1, label: '倒序' }
          ], val: 0        },
      ],
      [
        { label: '客户', model: 'customer', placeholder: '请输入客户名称', val: '' },
        {          label: '查询方式', model: 'nameType', type: 'select', placeholder: '请选择查询方式', list: [
            { value: 0, label: '模糊查询' },
            { value: 1, label: '精准查询' }
          ], val: 0        },
      ]]
      if (this.currentUser.dataLevel === '公司' || this.currentUser.dataLevel === '机构') {
        searchFrom = [[
          { label: '开单时间起', model: 'startTime', type: 'month', placeholder: '请选择年月', val: '' },
          { label: '开单时间止', model: 'endTime', type: 'month', placeholder: '请选择年月', val: '' },
          {            label: '排序', model: 'orderColumn', type: 'select', placeholder: '请选择排序字段', list: [
              { value: '销量', label: '销量' },
              { value: '新客户提成', label: '新客户提成' }
            ], val: '销量'          },
          {            label: '方式', model: 'orderType', type: 'select', placeholder: '请选择排序方式', list: [
              { value: 0, label: '正序' },
              { value: 1, label: '倒序' }
            ], val: 0          },
        ],
        [
          { label: '客户', model: 'customer', placeholder: '请输入客户名称', val: '' },
          { label: '部门', model: 'dptName', type: 'selectDept', placeholder: '请选择部门', list: [], val: '' },
          { label: '业务员', model: 'empCode', type: 'selectRemote', placeholder: '请输入业务员', list: [], val: '', url: 'setting/acct/queryCombo', queryKey: 'acctName', selectValue: 'platformCode' },
          {            label: '查询', model: 'nameType', type: 'select', placeholder: '请选择查询方式', list: [
              { value: 0, label: '模糊查询' },
              { value: 1, label: '精准查询' }
            ], val: 0          },
        ]]
      } else if (this.currentUser.dataLevel === '部门') {
        searchFrom = [[
          { label: '开单时间起', model: 'startTime', type: 'month', placeholder: '请选择年月', val: '' },
          { label: '开单时间止', model: 'endTime', type: 'month', placeholder: '请选择年月', val: '' },
          {            label: '排序', model: 'orderColumn', type: 'select', placeholder: '请选择排序字段', list: [
              { value: '销量', label: '销量' },
              { value: '新客户提成', label: '新客户提成' }
            ], val: '销量'          },
          {            label: '方式', model: 'orderType', type: 'select', placeholder: '请选择排序方式', list: [
              { value: 0, label: '正序' },
              { value: 1, label: '倒序' }
            ], val: 0          },
        ],
        [
          { label: '客户', model: 'customer', placeholder: '请输入客户名称', val: '' },
          { label: '业务员', model: 'empCode', type: 'selectRemote', placeholder: '请输入业务员', list: [], val: '', url: 'setting/acct/queryCombo', queryKey: 'acctName', selectValue: 'platformCode' },
          {            label: '查询', model: 'nameType', type: 'select', placeholder: '请选择查询方式', list: [
              { value: 0, label: '模糊查询' },
              { value: 1, label: '精准查询' }
            ], val: 0          },
        ]]
      }
      return searchFrom
    },
  },
  methods: {
    searchForm (obj) {
      if (obj.startTime.trim() == '') {
        delete obj.startTime
      }
      if (obj.endTime.trim() == '') {
        delete obj.endTime
      }
      if (obj.customer.trim() == '') {
        delete obj.customer
      }
      if (obj.empCode.trim() == '') {
        delete obj.empCode
      }
      if (obj.dptName.trim() == '') {
        delete obj.dptName
      }
      this.paramsObj = Object.assign({}, obj)
      this.paramsObj.currentPage = 0
      this.paramsObj.pageSize = 50
      this.loadData()
    },
    async loadData () {
      this.loading = true
      this.paramsObj.uid = this.currentUser.id
      console.log('入参========>' + JSON.stringify(this.paramsObj))
      try {
        let { data } = await this.apiStreamPost('/proxy/common/post',
          { url: 'erpReport/salePerformanceNewCustomer', params: this.paramsObj })
        if (data.returnCode === 0) {
          this.totalCount = data.total
          this.totalSum = data.summary
          this.tableValue.tableData = data.list
        } else {
          this.msgShow(this, data.errMsg)
        }
        this.loading = false
      } catch (e) {
        console.error(e)
        this.loading = false
        this.msgShow(this)
      }
    },
    tableChange (val) {
      this.loading = true
      this.paramsObj.currentPage = val - 1
      this.loadData()
    },
    tabSumFun (sums) {
      sums[5] = this.totalSum.dataBweightSum
      sums[6] = this.totalSum.newTcSum
    }
  }
}
</script>