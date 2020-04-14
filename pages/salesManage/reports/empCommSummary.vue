  <template lang="pug">
  .content
    breadcrumb(:breadItems="breadItems")
    .pt-15
      button-group(:btns="btnGroups", @groupBtnClick="groupBtnClick")
    .mt-15
      search-form(:searchFormItems="searchFormItems", @search="searchForm", ref="searchFrom")
    .pt-15
      basic-table(:tableValue="tableConfig", :currentPage="currentPage", :loading="loading", :pageSize="pageSize", :total="totalCount")
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
      breadItems: ['销售管理', '业务员提成汇总表'],
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
          width: 100
        }, {
          lbl: '任务量',
          prop: 'rwweight',
          width: 100
        }, {
          lbl: '实际销量',
          prop: 'dataBweight',
          width: 120
        }, {
          lbl: '新客户数',
          prop: 'newCount',
          width: 80
        }, {
          lbl: '提成单价',
          prop: 'tcPrice',
          width: 150
        }, {
          lbl: '直发销量',
          prop: 'zfBweight',
          width: 150
        }, {
          lbl: '调货销量',
          prop: 'dhBweight',
          width: 150
        }, {
          lbl: '新客户销售(高卖为正)',
          prop: 'newBweight',
          width: 200
        }, {
          lbl: '新客户总销售',
          prop: 'newSumbweight',
          width: 150
        }, {
          lbl: '低卖销量',
          prop: 'dmBweight',
          width: 150
        }, {
          lbl: '实际提成单价',
          prop: 'sjPrice',
          width: 150
        }, {
          lbl: '基本提成',
          prop: 'jbTc',
          width: 150
        }, {
          lbl: '新客户提成',
          prop: 'newTc',
          width: 150
        }, {
          lbl: '低卖提成',
          prop: 'dmTc',
          width: 150
        }, {
          lbl: '高卖提成',
          prop: 'gmTc',
          width: 150
        }, {
          lbl: '直发提成',
          prop: 'zfTc',
          width: 150
        }, {
          lbl: '提成合计',
          prop: 'hjTc',
          width: 150
        }]
      },
      loading: true,
      ny: ''
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.ny = this.searchFormItems[0][0].val
      this.loadData()
    })
  },
  computed: {
    ...mapState({
      currentUser: state => state.user.currentUser
    }),
    searchFormItems () {
      let searchFrom = [
        [{ label: '年份', model: 'ny', type: 'month', placeholder: '请选择月份', val: this.dataMonthStr(new Date()) }]
      ]
      if (this.currentUser.dataLevel === '公司' || this.currentUser.dataLevel === '机构') {
        searchFrom = [[
          { label: '年份', model: 'ny', type: 'month', placeholder: '请选择月份', val: this.dataMonthStr(new Date()) },
          { label: '部门', model: 'dptName', type: 'selectDept', list: [], val: '' },
          { label: '业务员', model: 'platformCode', type: 'selectRemote', list: [], val: '', url: 'setting/acct/queryCombo', queryKey: 'acctName' }
        ]]
      } else if (this.currentUser.dataLevel === '部门') {
        searchFrom = [[
          { label: '年份', model: 'ny', type: 'month', placeholder: '请选择月份', val: this.dataMonthStr(new Date()) },
          { label: '业务员', model: 'platformCode', type: 'selectRemote', list: [], val: '', url: 'setting/acct/queryCombo', queryKey: 'acctName' }
        ]]
      }
      return searchFrom
    },
    tableConfig () {
      const tableConfig = this.tableValue
      if (this.currentUser.dataLevel === '公司' || this.currentUser.dataLevel === '机构') {
        tableConfig.tableHead.unshift({
          lbl: '部门',
          prop: 'deptName',
          minWidth: 150,
          colspan: true
        }, {
          lbl: '业务员',
          prop: 'employeeName',
          width: 150
        })
      } else if (this.currentUser.dataLevel === '部门') {
        tableConfig.tableHead.unshift({
          lbl: '业务员',
          prop: 'employeeName',
          width: 150
        })
      }
      return tableConfig
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
        const tempProp = []
        this.tableValue.tableHead.map(item => {
          tempHead.push(item.lbl)
          const prop = item.prop === 'deptName' ? 'dptName' : item.prop
          tempProp.push(prop)
        })
        const searchFrom = this.$refs.searchFrom.getSearchParm('submit')
        const params = {
          ny: searchFrom.ny,
          dptName: searchFrom.dptName,
          empCode: searchFrom.platformCode,
          uid: this.currentUser.id
        }
        const { data } = await this.apiStreamPost('/proxy/common/post', { url: 'erpReport/export/empCommSummary', params: params })
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
        let url = `erpReport/empCommSummary?pageSize=${this.pageSize}&currentPage=0&uid=${this.currentUser.id}`
        if (this.ny) url += `&ny=${this.ny}`
        if (this.deptName) url += `&dptName=${this.deptName}`
        if (this.empCode) url += `&empCode=${this.empCode}`
        let { data } = await this.apiStreamPost('/proxy/common/get', { url: encodeURI(url) })
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
      this.deptName = paramsObj.dptName
      this.empCode = paramsObj.platformCode
      this.loadData()
    }
  }
}
</script>
<style lang="stylus", scoped>
.width-input-250
  width 250px
</style>