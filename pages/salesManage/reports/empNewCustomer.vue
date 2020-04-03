  <template lang="pug">
  .content
    breadcrumb(:breadItems="breadItems")
    .mt-15
      search-form(:searchFormItems="searchFormItems", @search="searchForm")
    .pt-15
      basic-table(:tableValue="tableValue", :sumsFun="tabSumFun", :currentPage="currentPage", :loading="loading", :pageSize="pageSize", :total="totalCount", @pageChange="tableChange")
</template>

<script>
import breadcrumb from '@/components/Breadcrumb.vue'
import basicTable from '@/components/BasicTable.vue'
import searchForm from '@/components/SearchForm.vue'
// import buttonGroup from '@/components/ButtonGroup.vue'
import { mapState } from 'vuex'
export default {
  layout: 'main',
  components: {
    breadcrumb,
    basicTable,
    searchForm
  },
  data () {
    return {
      breadItems: ['销售管理', '业务员新增客户明细表'],
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
          lbl: '销量',
          prop: 'dataBweight',
          summary: true,
          width: 120
        }, {
          lbl: '高卖',
          prop: 'gm',
          summary: true,
          width: 120
        }, {
          lbl: '高卖提成',
          prop: 'gmTc',
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
      this.searchValStr = `nyStart=${this.dataMonthStr(new Date())}&nyEnd=${this.dataMonthStr(new Date())}&orderType=1&orderColumn=销量&nameType=0`
      this.loadData()
    })
  },
  computed: {
    ...mapState({
      pageSize: state => state.pageSize,
      currentUser: state => state.user.currentUser
    }),
    searchFormItems () {
      return [
        [{ label: '起始年月', model: 'nyStart', type: 'month', placeholder: '请选择年月', val: this.dataMonthStr(new Date()) },
        { label: '结束年月', model: 'nyEnd', type: 'month', placeholder: '请选择年月', val: this.dataMonthStr(new Date()) },
        { label: '客户', model: 'customer', placeholder: '请输入客户名称', val: '' }
        ],
        [{
          label: '排序', model: 'orderColumn', type: 'select',
          list: [
            { label: '销量', value: '销量' },
            { label: '高卖', value: '高卖' },
            { label: '高卖提成', value: '高卖提成' }
          ], val: '销量'
        },
        {
          label: '方式', model: 'orderType', type: 'select',
          list: [
            { label: '降序', value: 1 },
            { label: '升序', value: 0 }
          ], val: 1
        }]
      ]
    }
  },
  methods: {
    async loadData () {
      try {
        let url = `erpReport/empNewCustomer?pageSize=${this.pageSize}&page=${this.currentPage - 1}&uid=${this.currentUser.id}&nameType=0`
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
        this.loading = true
        const searchValList = []
        Object.keys(paramsObj).forEach(key => {
          if (paramsObj[key].toString().trim() != '') {
            searchValList.push(`${key}=${paramsObj[key]}`)
          } else if (this.searchRule[key]) {
            throw new Error(this.searchRule[key])
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
      sums[5] = this.totalSum.dataBweightSum
      sums[6] = this.totalSum.gmSum
      sums[7] = this.totalSum.gmTcSum
    }
  }
}
</script>
<style lang="stylus", scoped>
.width-input-250
  width 250px
</style>