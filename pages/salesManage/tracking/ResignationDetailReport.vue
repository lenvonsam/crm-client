<template lang="pug">
  .content
    breadcrumb(:breadItems="breadItems")
    .mt-15
      el-button(size="small", @click="back()") 返回列表
    .mt-15
      el-form(:inline="true", :model="searchForm" ref="searchForm" label-width="60px")
        el-form-item(label="日期：", prop="date")
          el-date-picker(type="daterange", range-separator="-", start-placeholder="开始日期", end-placeholder="结束日期",v-model="searchForm.date" style="width: 250px;", size="small", unlink-panels, value-format="yyyy-MM-dd")
        el-form-item
          el-button(type="primary", @click="submitForm('searchForm')", size="small") 查询
          el-button(@click="resetForm('searchForm')", size="small") 重置
    basic-table(:tableValue="tableValue", :currentPage="currentPage", :loading="loading", :pageSize="pageSize", :total="totalCount", @chooseData="selectData", @pageChange="tableChange", @sort="sortHandler")
    .mt-15(v-if="saleGoodsChartData.labels.length > 0")
      line-chart(:data="saleGoodsChartData", :options="saleGoodsChartOptions", style="width: 100%; height: 600px", ref="goodsLineChart")
</template>

<script>
  import breadcrumb from '@/components/Breadcrumb.vue'
  import basicTable from '@/components/BasicTable.vue'
  import lineChart from '@/components/LineChart.js'
  import { mapState } from 'vuex'
  export default {
    layout: 'main',
    components: {
      breadcrumb,
      basicTable,
      lineChart
    },
    data() {
      return {
        breadItems: ['销售管理', '交易跟踪', '离职人员客户销量明细表'],
        currentPage: 1,
        totalCount: 0,
        queryObject: {
          currentPage: this.currentPage - 1,
          pageSize: this.pageSize,
          sort: 0
        },
        tableValue: {
          tableData: [],
          hasCbx: false,
          summary: true,
          rowClassName: false,
          tableHead: [{
            lbl: '年月',
            prop: 'dateTime',
            width: '110px'
          }, {
            lbl: '公司名称',
            prop: 'compName'
          }, {
            lbl: '业务部门',
            prop: 'dptName'
          }, {
            lbl: '业务员',
            prop: 'acctName'
          }, {
            lbl: '实提销量（吨）',
            prop: 'dataBweight',
            sort: 'dataBweight',
            summary: true
          }, {
            lbl: '高卖量（元）',
            prop: 'gm',
            sort: 'gm',
            summary: true
          }]
        },
        searchForm: {
          date: ''
        },
        chooseArray: [],
        loading: true,
        rowObj: {},
        saleGoodsChartData: {
          labels: [],
          datasets: [{
            label: "销量",
            borderColor: '#ed7d31',
            data: []
          }, {
            label: "高卖",
            borderColor: '#5b9bd5',
            data: []
          }]
        },
        saleGoodsChartOptions: {
          maintainAspectRatio: false,
          title:{
            display:false,
            // position: 'top',
            // fontSize: 14,
            // text:'H型钢销售量折线图'
          },
          legend: {
            position: 'bottom'
          },
          elements: {
            line: {
              tension: 0,
              fill: false,
              borderWidth: 2
            }
          }
        }
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.rowObj = JSON.parse(this.$route.query.row)
        this.queryObject = {
          currentPage: this.currentPage - 1,
          pageSize: this.pageSize
        }
        this.loadData()
      })      
    },
    computed: {
      ...mapState({
        pageSize: state => state.pageSize
      })
    },
    methods: {
      async loadData () {
        try {
          this.queryObject['compName'] = this.rowObj['compName']
          this.queryObject['acctName'] = this.rowObj['acctName']
          this.queryObject['dptName'] = this.rowObj['dptName']
          let { data } = await this.apiStreamPost('/proxy/common/post', {url: 'salesManage/tracking/demission', params: this.queryObject})
          if (data.returnCode === 0) {
            let keyArr = ['dateTime', 'compName', 'acctName', 'dptName', 'dataBweight', 'gm']
            let arr = []
            data.list.map((item) => {
              let obj = {}
              for(let i=0; i< keyArr.length; i++){
                obj[keyArr[i]] = item[i]
              }
              arr.push(obj)
            })
            this.saleGoodsChartData.labels = data.dateList
            this.saleGoodsChartData.datasets[0].data = data.salesList
            this.saleGoodsChartData.datasets[1].data = data.gmList
            this.tableValue.tableData = arr
            this.totalCount = data.total
            if (this.$refs.goodsLineChart) {
              this.$refs.goodsLineChart.update()
            }
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
      submitForm(formName) {
        this.loading = false
        if (this.searchForm.date != null && this.searchForm.date != '') {
          this.queryObject.startTime = this.searchForm.date[0]
          this.queryObject.endTime = this.searchForm.date[1]
        }  else {
          delete this.queryObject.startTime
          delete this.queryObject.endTime
        }
        this.loadData()
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      selectData (val) {
        console.log(val)
        this.chooseArray = val
      },
      tableChange (val) {
        debugger
        this.loading = true
        this.currentPage = val
        this.queryObject.currentPage = this.currentPage - 1        
        // console.log(this.queryObject.orderType)
        this.loadData()
      },
      sortHandler (obj) {
        this.loading = true
        if (obj.property =='dataBweight' || obj.property =='gm') {
          let dataBweightAsc = (obj.order =='ascending' && obj.property =='dataBweight')
          let dataBweightDesc = (obj.order =='descending' && obj.property =='dataBweight')
          let gmAsc = (obj.order =='ascending' && obj.property =='gm')
          let gmDesc = (obj.order =='descending' && obj.property =='gm')
          this.queryObject.sort = (dataBweightAsc) ? '2' : (dataBweightDesc) ? '1' : (gmAsc) ? '4' : (gmDesc)? '3' : '0'
        } else {
          this.queryObject.sort = '0'
        }
        this.currentPage = 1
        this.queryObject.currentPage = this.currentPage - 1
        this.loadData()
      }
    }
  }
</script>
<style lang="styl", scoped>
  .width-input-250
    width: 250px
</style>