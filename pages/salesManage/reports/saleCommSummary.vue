  <template lang="pug">
  .content
    breadcrumb(:breadItems="breadItems")
    .mt-15
      search-form(:searchFormItems="searchFormItems", @search="searchForm", className="")
    .pt-15
      basic-table(:tableValue="tableConfig", :currentPage="currentPage", :loading="loading", :pageSize="pageSize", :total="totalCount")
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
      breadItems: ['销售管理', '营销中心销售专员提成汇总表'],
      currentPage: 1,
      totalCount: 0,
      pageSize: 100,
      tableValue: {
        height: 640,
        page: true,
        spanMethod: true,
        tableData: [],
        hasCbx: false,
        rowClassName: false,
        tableHead: [{
          lbl: '年份',
          prop: 'ny',
          width: 170
        }, {
          lbl: '上年月销量',
          prop: 'upweight',
          width: 170
        }, {
          lbl: '任务量',
          prop: 'rwweight',
          width: 170
        }, {
          lbl: '实际销量',
          prop: 'dataBweight',
          width: 120
        }, {
          lbl: '直发销量',
          prop: 'zfBweight',
          width: 150
        }, {
          lbl: '新客户销量',
          prop: 'newBweight',
          width: 150
        }, {
          lbl: '新客户提成',
          prop: 'newTc',
          width: 150
        }, {
          lbl: '直发提成',
          prop: 'zfTc',
          width: 150
        }, {
          lbl: '销量提成',
          prop: 'xlTc',
          width: 200
        }, {
          lbl: '高卖提成',
          prop: 'gmTc',
          width: 150
        }, {
          lbl: '提成合计',
          prop: 'hjTc',
          width: 150
        }]
      },
      // searchFormItems: [
      //   [{ label: '年份', model: 'ny', type: 'month', placeholder: '请选择月份', val: '', width: '200px' }]
      // ],
      loading: true,
      ny: ''
    }
  },
  mounted () {
    this.$nextTick(() => {
      // this.searchFormItems[0][0].val = this.getPreMonth()
      this.ny = this.searchFormItems[0][0].val
      this.loadData()
    })
  },
  computed: {
    ...mapState({
      currentUser: state => state.user.currentUser
    }),
    searchFormItems () {
      return [
        [{ label: '年份', model: 'ny', type: 'month', placeholder: '请选择月份', val: this.getPreMonth(), width: '200px' }]
      ]
    },
    tableConfig () {
      const tableConfig = this.tableValue
      switch (this.currentUser.dataLevel) {
        case '公司':
          tableConfig.tableHead.unshift({
            lbl: '部门',
            prop: 'deptName',
            minWidth: 150
          }, {
            lbl: '业务员',
            prop: 'employeeName',
            width: 150
          })
          break
        case '部门':
          tableConfig.tableHead.unshift({
            lbl: '业务员',
            prop: 'employeeName',
            width: 150
          })
          break
      }
      return tableConfig
    }
  },
  methods: {
    async loadData () {
      try {
        const url = `erpReport/saleCommSummary?pageSize=${this.pageSize}&page=0&uid=${this.currentUser.id}&ny=${this.ny}`
        let { data } = await this.apiStreamPost('/proxy/common/get', { url: url })
        if (data.returnCode === 0) {
          const resData = data.list
          let listData = {}
          resData.map((item, index) => {
            if (!listData[item.deptName]) listData[item.deptName] = []
            listData[item.deptName].push(item)
          })
          const list = []
          Object.keys(listData).forEach(key => {
            listData[key][0].colspan = listData[key].length
            list.push(...listData[key])
          })
          this.tableValue.tableData = list
          this.totalCount = data.total
          console.log('data', data)
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
      this.loading = true
      this.ny = paramsObj.ny
      this.loadData()
    }
  }
}
</script>
<style lang="stylus", scoped>
.width-input-250
  width 250px
</style>