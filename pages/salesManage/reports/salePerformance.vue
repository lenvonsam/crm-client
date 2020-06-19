  <template lang="pug">
  .content
    breadcrumb(:breadItems="breadItems")
    .pt-15
      button-group(:btns="btnGroups", @groupBtnClick="groupBtnClick")
    .mt-15
      search-form(:searchFormItems="searchFormItems", @search="searchForm", ref="searchFrom", :pickerDisable="pickerDisable")
    .pt-15
      basic-table(:tableValue="tableValue", :currentPage="currentPage", :loading="loading", :pageSize="pageSize", :total="totalCount")
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
      breadItems: ['销售管理', '销售绩效提成表'],
      btnGroups: [{ lbl: '导出', type: 'export' }],
      currentPage: 1,
      totalCount: 0,
      pageSize: 100,
      ny: '',
      loading: true,
      pickerDisable: {
        disabledDate (time) {
          return time.getTime() > Date.now() - 8.64e7;
        }
      },
      tableValue: {
        height: 640,
        page: true,
        spanMethod: true,
        tableData: [],
        hasCbx: false,
        rowClassName: false,
        tableHead: [{
          lbl: '部门',
          prop: 'deptName',
          colspan: true
        }, {
          lbl: '业务员',
          prop: 'employeeName'
        }, {
          lbl: '年份',
          prop: 'ny'
        }, {
          lbl: '实际销量',
          prop: 'dataBweight'
        }, {
          lbl: '新客户数',
          prop: 'newCount'
        }, {
          lbl: '新客户单价',
          prop: 'newPrice'
        }, {
          lbl: '新客户销量',
          prop: 'newWeight'
        },{
          lbl: '新客户提成',
          prop: 'newTc'
        }, {
          lbl: '直发单价',
          prop: 'zfPrice'
        }, {
          lbl: '直发销量',
          prop: 'zfBweight'
        },{
          lbl: '直发提成',
          prop: 'zfTc'
        }, {
          lbl: '调货单价',
          prop: 'dhPrice'
        }, {
          lbl: '调货销量',
          prop: 'dhBweight'
        },{
          lbl: '调货提成',
          prop: 'dhTc'
        }, {
          lbl: '老客户单价',
          prop: 'oldPrice'
        }, {
          lbl: '老客户销量',
          prop: 'oldWeight'
        }, {
          lbl: '老客户提成',
          prop: 'oldTc'
        }, {
          lbl: '提成合计',
          prop: 'tcje'
        }]
      },
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
      let searchFrom = [[
        { label: '年份', model: 'ny', type: 'month', placeholder: '请选择月份', val: this.dataMonthStr(new Date()) },
        { label: '部门', model: 'dptName', type: 'selectDept', list: [], val: '' },
        { label: '业务员', model: 'platformCode', type: 'selectRemote', list: [], val: '', url: 'setting/acct/queryCombo', queryKey: 'acctName' }
      ]]
      return searchFrom
    },
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
        let url = `erpReport/export/salePerformanceComm?ny=${this.ny}&uid=${this.currentUser.id}`
        if (searchFrom.dptName) url += `&dptName=${searchFrom.dptName}`
        if (searchFrom.platformCode) url += `&empCode=${searchFrom.platformCode}`
        const { data } = await this.apiStreamPost('/proxy/common/get', { url: encodeURI(url) })
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
    searchForm (paramsObj) {
      this.loading = true
      this.ny = paramsObj.ny
      this.deptName = paramsObj.dptName
      this.empCode = paramsObj.platformCode
      this.loadData()
    },
    async loadData () {
      try {
        let url = `erpReport/salePerformanceComm?pageSize=${this.pageSize}&currentPage=0&uid=${this.currentUser.id}`
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
          console.log('data', data)
          this.loading = false
        } else {
          this.msgShow(this, data.errMsg)
          this.loading = false
        }
      } catch (e) {
        console.error(e)
        this.msgShow(this)
        this.loading = false
      }
    }
  }
}
</script>