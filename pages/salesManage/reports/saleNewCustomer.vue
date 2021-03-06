  <template lang="pug">
  .content
    breadcrumb(:breadItems="breadItems")
    .pt-15(v-if="currentUser.loginAcct === 'zq' || currentUser.loginAcct === 'admin'")
      button-group(:btns="btnGroups", @groupBtnClick="groupBtnClick")
    .mt-15
      search-form(:searchFormItems="searchFormItems", @search="searchForm", ref="searchFrom")
    .pt-15
      basic-table(:tableValue="tableValue", :sumsFun="tabSumFun", :currentPage="currentPage", :loading="loading", :pageSize="pageSize", :total="totalCount", @pageChange="tableChange")
</template>

<script>
import breadcrumb from '@/components/Breadcrumb.vue'
import basicTable from '@/components/BasicTable.vue'
import searchForm from '@/components/SearchForm.vue'
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
      btnGroups: [{ lbl: '导出', type: 'export' }],
      breadItems: ['销售管理', '销售专员新增客户明细表'],
      currentPage: 1,
      totalCount: 0,
      tableValue: {
        tableData: [],
        hasCbx: false,
        numShow: true,
        rowClassName: false,
        summary: true,
        tableHead: [{
          lbl: '客户名称',
          prop: 'datasCustomername',
          minWidth: 150
        }, {
          lbl: '开始日期',
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
          lbl: '平价、高卖重量',
          prop: 'weightGm',
          summary: true,
          width: 120
        }, {
          lbl: '平价、高卖提成',
          prop: 'tcGm',
          summary: true,
          width: 120
        }, {
          lbl: '低卖重量',
          prop: 'weightDm',
          summary: true,
          width: 120
        }, {
          lbl: '低卖提成',
          prop: 'tcDm',
          summary: true,
          width: 120
        }, {
          lbl: '新客户直发重量',
          prop: 'zfBweight',
          summary: true,
          width: 120
        }, {
          lbl: '销量合计',
          prop: 'weightSum',
          summary: true,
          width: 120
        }, {
          lbl: '提成合计',
          prop: 'tcSum',
          summary: true,
          width: 120
        }]
      },
      searchRule: {
        nyStart: '请输入起始日期',
        nyEnd: '请输入结束日期',
        orderColumn: '请选择排序',
        orderType: '请选择排序方式'
      },
      searchValStr: '',
      loading: true,
      totalSum: {}
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.searchValStr = `nyStart=${this.dataMonthStr(new Date())}&nyEnd=${this.dataMonthStr(new Date())}&orderType=1&orderColumn=销量合计&nameType=0`
      this.loadData()
    })
  },
  computed: {
    ...mapState({
      pageSize: state => state.pageSize,
      currentUser: state => state.user.currentUser
    }),
    searchFormItems () {
      const searchForm = [
        [{ label: '起始年月', model: 'nyStart', type: 'month', placeholder: '请选择年月', val: this.dataMonthStr(new Date()) },
        { label: '结束年月', model: 'nyEnd', type: 'month', placeholder: '请选择年月', val: this.dataMonthStr(new Date()) },
        { label: '客户', model: 'customer', placeholder: '请输入客户名称', val: '' }
        ],
        [{
          label: '排序', model: 'orderColumn', type: 'select',
          list: [
            { label: '销量合计', value: '销量合计' },
            { label: '高卖量', value: '高卖量' },
            { label: '高卖', value: '高卖' },
            { label: '高卖提成', value: '高卖提成' },
            { label: '低卖量', value: '低卖量' },
            { label: '低卖', value: '低卖' },
            { label: '低卖提成', value: '低卖提成' },
          ], val: '销量合计'
        },
        {
          label: '方式', model: 'orderType', type: 'select',
          list: [
            { label: '降序', value: 1 },
            { label: '升序', value: 0 }
          ], val: 1
        }]
      ]
      if (this.currentUser.dataLevel === '公司' || this.currentUser.dataLevel === '机构') {
        searchForm[1].push({
          label: '部门', model: 'dptName', type: 'selectDept',
          list: [], val: ''
        })
        searchForm[2] = [{
          label: '业务员', model: 'empCode', type: 'selectRemote',
          list: [], val: '', url: 'setting/acct/queryCombo', queryKey: 'acctName', selectValue: 'platformCode'
        }]
      } else if (this.currentUser.dataLevel === '部门') {
        searchForm[1].push({
          label: '业务员', model: 'empCode', type: 'selectRemote',
          list: [], val: '', url: 'setting/acct/queryCombo', queryKey: 'acctName', selectValue: 'platformCode'
        })
      }
      return searchForm
    }
  },
  methods: {
    groupBtnClick () {
      this.pageShow(this)
      this.exportExcel()
    },
    async exportExcel () {
      try {
        const tempHead = []
        this.tableValue.tableHead.map(item => {
          tempHead.push(item.lbl)
        })
        const searchFrom = this.$refs.searchFrom.getSearchParm('submit')
        const params = {
          nyStart: searchFrom.nyStart,
          nyEnd: searchFrom.nyEnd,
          customer: searchFrom.customer,
          dptName: searchFrom.dptName,
          empCode: searchFrom.empCode,
          nameType: 0,
          uid: this.currentUser.id
        }
        const { data } = await this.apiStreamPost('/proxy/common/post', { url: 'erpReport/export/saleNewCustomer', params: params })
        if (!data.list) {
          this.msgShow('导出失败')
          return false
        }
        this.excelExport(tempHead, data.list, this.breadItems[1])
        this.pageHide(this)
      } catch (e) {
        this.pageHide(this)
        console.error(e)
      }
    },
    async loadData () {
      try {
        let url = `erpReport/saleNewCustomer?pageSize=${this.pageSize}&currentPage=${this.currentPage - 1}&uid=${this.currentUser.id}&nameType=0`
        url += `&${this.searchValStr}`
        let { data } = await this.apiStreamPost('/proxy/common/get', { url: encodeURI(url) })
        if (data.returnCode === 0) {
          this.tableValue.tableData = data.list
          this.totalCount = data.total
          this.totalSum = data.summary
          this.loading = false
        } else {
          this.msgShow(this, data.errMsg)
        }
      } catch (e) {
        console.error(e)
        this.msgShow(this)
        this.loading = false
      }
    },
    searchForm (paramsObj) {
      try {
        console.log('paramsObj', paramsObj)
        this.loading = true
        const searchValList = []
        Object.keys(paramsObj).forEach(key => {
          if (paramsObj[key]) {
            searchValList.push(`${key}=${paramsObj[key]}`)
          }
        })
        this.currentPage = 1
        this.searchValStr = searchValList.toString().replace(/,/g, '&')
        this.loadData()
      } catch (e) {
        this.loading = false
        this.msgShow(this, e.message)
      }
    },
    tableChange (val) {
      this.loading = true
      this.currentPage = val
      this.loadData()
    },
    tabSumFun (sums) {
      sums[5] = this.totalSum.weightGmSum
      // sums[6] = this.totalSum.moneyGmSum
      sums[6] = this.totalSum.tcGmSum
      sums[7] = this.totalSum.weightDmSum
      // sums[8] = this.totalSum.moneyDmSum
      sums[8] = this.totalSum.tcDmSum
      sums[9] = this.totalSum.zfBweightSum
      sums[10] = this.totalSum.weightSumSum
      sums[11] = this.totalSum.tcSumSum
    }
  }
}
</script>
<style lang="stylus", scoped>
.width-input-250
  width 250px
</style>