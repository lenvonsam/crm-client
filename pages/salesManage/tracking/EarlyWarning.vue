<template lang="pug">
  .content
    search-form(:searchFormItems="searchFormItems", @search="searchForm")
    .mt-15
      .text-red 本月进度 {{schedule}}%
    .pt-15
      basic-table(:tableValue="tableValue", :currentPage="currentPage", :loading="loading", :pageSize="pageSize", :total="totalCount", @chooseData="selectData", @pageChange="tableChange", :sumsFun="sumsFun", @sort="sortHandler")
</template>

<script>
  import breadcrumb from '@/components/Breadcrumb.vue'
  import basicTable from '@/components/BasicTable.vue'
  import searchForm from '@/components/SearchForm.vue'
  import { mapState } from 'vuex'
  export default {
    layout: 'main',
    components: {
      breadcrumb,
      basicTable,
      searchForm
    },
    data() {
      return {
        currentPage: 1,
        totalCount: 0,
        queryObject: {
          currentPage: this.currentPage - 1,
          pageSize: this.pageSize,
          sort: '0'
        },
        tableValue: {
          tableData: [],
          hasCbx: false,
          rowClassName: true,
          summary: true,
          tableHead: [{
            lbl: '公司名称',
            prop: 'compName',
            minWidth: '340px'        
          }, {
            lbl: '业务部门',
            prop: 'dptName',
            width: '200px'
          }, {
            lbl: '业务员',
            prop: 'acctName',
            width: '120px'
          }, {
            lbl: '上月销量',
            prop: 'lastMonthWeight',
            summary: true,
            sort: 'lastMonthWeight',
            width: '150px'
          }, {
            lbl: '本月销量',
            prop: 'thisMonthWeight',
            summary: true,
            sort: 'thisMonthWeight',
            width: '150px'
          }, {
            lbl: '本月/上月',
            prop: 'scale',
            width: '150px'
          }, {
            lbl: '预警情况',
            prop: 'state',
            width: '100px'
          }]
        },
        searchFormItems: [
          [{label: '公司名称', model: 'compName', type: 'text', placeholder: '请输入公司名称', val: ''},
            {label: '业务部门', model: 'dptName', placeholder: '请输入业务部门', val: ''},
            {label: '业务员', model: 'acctName', placeholder: '请输入业务员', val: ''}],
          [{label: '预警情况', model: 'warningType', type: 'select', placeholder: '请选择预警情况', val: '', list: []}]
        ],
        reason: '',
        rowDelObj: {},
        chooseArray: [],
        loading: false,
        schedule: 0
      }
    },
    mounted () {
      // this.schedule = (new Date().getDate() / 31 * 100).toFixed(0)
      let d = new Date()
      let monthDay = this.getDaysInOneMonth(d.getFullYear(), d.getMonth() + 1)
      this.schedule = Number(d.getDate()/monthDay*100).toFixed(0)
      this.searchFormItems[1][0].list = [{label: '全部', value: ''}, {label: '不预警', value: '0'}, {label: '预警', value: '1'}]
      this.queryObject = {
        currentPage: this.currentPage - 1,
        pageSize: this.pageSize,
        sort: '0'
      }
      this.loadData()
    },
    computed: {
      ...mapState({
        pageSize: state => state.pageSize,
        currentUser: state => state.user.currentUser,
        cstmArr: state => state.cstmArr
      })
    },
    methods: {
      async loadData () {
        this.queryObject.uid = this.currentUser.id
        try {
          let { data } = await this.apiStreamPost('/proxy/common/post', {url: 'salesManage/tracking/alert', params: this.queryObject})          
          // if (data.returnCode === 0) {
          if (data) {
            let keyArr = ['compName', 'acctName', 'dptName', 'erpCode', 'thisMonthWeight', 'lastMonthWeight', 'scale']
            let arr = []
            data.list.map((item) => {
              let obj = {}
              for(let i=0; i< keyArr.length; i++){
                obj[keyArr[i]] = item[i]
              }
              let lastMonthWeight = (obj['lastMonthWeight'] == 0) ? 1 : obj['lastMonthWeight']
              let scale = (this.accDiv(obj['thisMonthWeight'], lastMonthWeight) * 100).toFixed(3)
              obj['scale'] = Number(scale) + '%'
              // if (Number(this.schedule) > 50 && Number(scale) < Number(this.schedule)) {
              if (Number(scale) < Number(this.schedule)) {
                obj['state'] = '预警'
                obj['rowClassName'] = 'loss-cstm'
              } else {
                obj['state'] = '不预警'
              }
              arr.push(obj)
            })
            this.tableValue.tableData = arr        
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
      sumsFun (sums) {
        if (sums[4] != undefined && sums[3] != undefined) {
          let lastSums = (sums[3] == 0) ? 1 : sums[3]
          let scale = (this.accDiv(sums[4], lastSums) * 100).toFixed(3)
          sums[5] = Number(scale) + '%'
          // if (Number(this.schedule) > 50 && Number(scale) < Number(this.schedule)) {
          if (Number(scale) < Number(this.schedule)) {
            sums[6] = '预警'
          } else {
            sums[6] = '不预警'
          }
        }
        return sums
      },
      getDaysInOneMonth(year, month){
        let d = new Date(year, month, 0)
        month = parseInt(month, 10)
        return d.getDate()
      },
      searchForm (paramsObj) {
        this.loading = true
        this.currentPage = 1
        this.queryObject.currentPage = this.currentPage - 1
        Object.keys(paramsObj).map(key => {
          if (paramsObj['warningType'] == '0' || paramsObj['warningType'] == '1') {
            this.queryObject['percent'] = this.schedule / 100
            this.queryObject['warningType'] = paramsObj['warningType']
          }
          if (paramsObj[key].length > 0) {
            this.queryObject[key] = paramsObj[key].trim()
          } else {
            delete this.queryObject[key]
          }
        })
        this.loadData()
      },
      selectData (val) {
        console.log(val)
        this.chooseArray = val
      },
      tableChange (val) {
        this.loading = true
        this.currentPage = val
        this.queryObject.currentPage = this.currentPage - 1
        console.log(this.queryObject.orderType)
        this.loadData()
      },
      sortHandler (obj) {
        if (obj.property =='lastMonthWeight' || obj.property =='thisMonthWeight') {
          this.loading = true
          let lastMonthWeightAsc = (obj.order =='ascending' && obj.property =='lastMonthWeight')
          let lastMonthWeightDesc = (obj.order =='descending' && obj.property =='lastMonthWeight')
          let thisMonthWeightAsc = (obj.order =='ascending' && obj.property =='thisMonthWeight')
          let thisMonthWeightDesc = (obj.order =='descending' && obj.property =='thisMonthWeight')
          this.queryObject.sort = (lastMonthWeightAsc) ? '1' : (lastMonthWeightDesc) ? '0' : (thisMonthWeightAsc) ? '3' : (thisMonthWeightDesc)? '2' : '0'
          this.currentPage = 1
          this.queryObject.currentPage = this.currentPage - 1
          this.loadData()
        }
      }
    }
  }
</script>
<style lang="styl", scoped>
  .width-input-250
    width: 250px
</style>