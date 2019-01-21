<template lang="pug">
.content
  breadcrumb(:breadItems="breadItems")
  .mt-15      
    search-form(:searchFormItems="searchFormItems", @search="searchForm", v-if="searchShow")
  .mt-15
    basic-table(:tableValue="tableValue", :loading="loading", :currentPage="currentPage", :pageSize="pageSize", :total="totalCount", @pageChange="tableChange", @tableRowGrading = "gradingHandler")
  el-dialog(title="最近七天折线图", :visible.sync="dialShow", center, @close="dialogClose")
    .barChartBox
      el-button(size="small", type="primary", @click="historcalHandler") 查看更多历史
      .mt-15
        line-chart(:data="chartData", :options="chartOptions", style="width: 100%" v-if="chartData.datasets[0].data.length > 0")
</template>
<script>
import breadcrumb from '@/components/Breadcrumb.vue'
import searchForm from '@/components/SearchForm.vue'
import basicTable from '@/components/BasicTable.vue'
import lineChart from '@/components/LineChart.js'
import { mapState } from 'vuex'
export default {
  layout: 'main',
  components: {
    basicTable,
    searchForm,
    lineChart,
    breadcrumb
  },
  data () {
    return {
      breadItems: ['客户管理', '客户分级'],
      searchFormItems: [
        [{label: '公司名称', model: 'compName', type: 'text', placeholder: '请输入公司名称', val: ''},
            {label: '转化日期', model: 'transformDate', type: 'timeLimit', placeholder: '请选择转化日期', val: ''},
          {label: '业务部门', model: 'dptName', type: 'text', placeholder: '请输入业务部门', val: ''}],
          [{label: '业务员', model: 'acctName', type: 'text', placeholder: '请输入业务员', val: ''},
          {label: '客户得分', model: 'cstmScore', type: 'range', minPlaceholder: '最小值', maxPlaceholder: '最大值', min: '', max: ''},
          {label: '客户等级', model: 'level', type: 'select', placeholder: '请选择客户等级', val: '', list: [{label:'A', value:'A'}, {label:'B', value:'B'},{label:'C', value:'C'}]}]
        ],
      searchShow: false,
      tableValue: {
        tableData: [],
        hasCbx: false,
        rowClassName: false,
        edit: false,
        tableHead: [{
          lbl: '统计抬头',
          prop: 'compName',
          minWidth: '340px'
        }, 
        {
          lbl: '转化时间',
          prop: 'transformDate',
          width: '150px'
        }, {
          lbl: '业务部门',
          prop: 'dptName',
          width: '120px'
        }, {
          lbl: '业务员',
          prop: 'acctName',
          width: '120px'
        }, {
          lbl: '客户得分',
          prop: 'summary',
          width: '200px'
        }, {
          lbl: '客户等级',
          prop: 'summaryLevel',
          width: '120px',
          align: 'center'
        }, {
            type: 'action',
            fixed: 'right',
            width: '100px',
            actionBtns: [{
              lbl: '历史分级',
              type: 'grading'
            }]
          }]
      },
      currentPage: 1,
      totalCount: 0,
      queryObject: {
        currentPage: this.currentPage - 1,
        pageSize: this.pageSize
      },
      detailQueryObject: {
        currentPage: 0,
        pageSize: 7
      },
      loading: false,
      dialShow: false,
      chartData: {
        xLabels: [],
        yLabels: ['', 'A', 'B', 'C', 'D', 'E'],
        datasets: [{
          label: "最近七天",
          borderColor: '#5b9bd5',
          data: []
        }]
      },
      chartOptions: {
        maintainAspectRatio: false,
        title:{
          display:false,
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
        },
        tooltips: {
          enable: true,
          mode: 'label',
          callbacks: {
            label: function(tooltipItem, data) {
              let idx = tooltipItem.index
              let dataArr = data.datasets[0].data
              return '等级：' + dataArr[idx].y + '\n分数：' + dataArr[idx].summary
            }
          }
        },
        scales: {
          yAxes: [{
            type: 'category',
            position: 'left',
            display: true,
            scaleLabel: {
              display: true
            },
            ticks: {
              reverse: true
            }
          }]
        }
      }
    }
  },
  computed: {
    ...mapState({
      pageSize: state => state.pageSize,
      currentUser: state => state.user.currentUser
    })
  },
  mounted () {
    this.$nextTick(function () {
      this.getLevelCombo()
      this.queryObject = {
        currentPage: this.currentPage - 1,
        pageSize: this.pageSize
      }
      this.loadData()
    })
  },
  methods: {
    searchForm (paramsObj) {
      this.currentPage = 1
      this.queryObject.currentPage = this.currentPage - 1
      Object.keys(paramsObj).map(key => {
        if(key == 'transformDate'){
          if (paramsObj.transformDate !== null && paramsObj.transformDate !== undefined && paramsObj.transformDate !== '') {
            this.queryObject.startTime = paramsObj.transformDate[0]
            this.queryObject.endTime = paramsObj.transformDate[1]
          } else {
            delete this.queryObject.startTime
            delete this.queryObject.endTime
          }
        } else if (key == 'cstmScore') {
          if (paramsObj.cstmScore.length == 2) {
            this.queryObject.min = paramsObj.cstmScore[0]
            this.queryObject.max = paramsObj.cstmScore[1]
          } else {
            delete this.queryObject.min
            delete this.queryObject.max
          }
        } else if (paramsObj[key].length > 0) {
          this.queryObject[key] = paramsObj[key].trim()
        } else {
          delete this.queryObject[key]
        }
      })
      this.loadData()
    },
    gradingHandler (row) {
      this.detailQueryObject.compName = row.compName
      this.dialShow = true
      this.cstmRatingDetail()
    },
    historcalHandler () {
      this.jump('/customManager/customerRating/HistoricalGrading?compName=' + this.detailQueryObject.compName)
    },
    tableChange (val) {
      this.loading = true
      this.currentPage = val
      this.queryObject.currentPage = this.currentPage - 1
      this.loadData()
    },
    dialogClose () {
      this.dialShow = false
    },
    chartPlugins () {
      Chart.plugins.register({
        afterDatasetsDraw: function(chart) {
          var ctx = chart.ctx;
          chart.data.datasets.forEach(function(dataset, i) {
            var meta = chart.getDatasetMeta(i);
            if (!meta.hidden) {
              meta.data.forEach(function(element, index) {
                // Draw the text in black, with the specified font
                ctx.fillStyle = 'rgb(0, 0, 0)'

                var fontSize = 16
                var fontStyle = 'normal'
                var fontFamily = 'Helvetica Neue'
                ctx.font = Chart.helpers.fontString(fontSize, fontStyle, fontFamily)

                // Just naively convert to string for now
                // var dataString = dataset.data[index].toString();
                var data = dataset.data[index]
                // Make sure alignment settings are correct
                ctx.textAlign = 'center'
                ctx.textBaseline = 'middle'

                var padding = 5
                var position = element.tooltipPosition()
                if (data.level) {
                  ctx.fillText(data.level, position.x, position.y - (fontSize / 2) - padding)
                }                
              })
            }
          })
        }
      })
    },
    async loadData (params) {
      this.loading = true
      try {
        let { data } = await this.apiStreamPost('/proxy/common/post', {url: 'customerManage/cstmRating', params: this.queryObject})
          if (data.returnCode === 0) {
            let arr = []
            data.list.map(itm => {
              itm.transformDate = this.date2Str(new Date(itm.transformDate))
              itm.summary = itm.summary.toFixed(2)
              arr.push(itm)
            })
            this.tableValue.tableData = data.list
            this.totalCount = data.total            
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
    async cstmRatingDetail (params) {
      try {
        this.chartData.datasets[0].data = []
        this.chartData.xLabels = []
        let { data } = await this.apiStreamPost('/proxy/common/post', {url: 'customerManage/cstmRating/detail', params: this.detailQueryObject})
          if (data.returnCode === 0) {
            data.list.map(itm => {              
              this.chartData.xLabels.push(this.date2Str(new Date(itm.summaryDate)))
              let obj = {
                x: this.date2Str(new Date(itm.summaryDate)), 
                y: itm.summaryLevel,
                level: itm.summaryLevel,
                summary: itm.summary
              }
              this.chartData.datasets[0].data.push(obj)
            })
            console.log(this.chartData.datasets[0].data)
            this.dialShow = true
            this.chartPlugins()
          } else {
            this.msgShow(this, data.errMsg)
          }
      } catch (e) {
        console.error(e)
        this.msgShow(this)
      }
    },
    async getLevelCombo () {
      try {
        let { data } = await this.apiStreamPost('/proxy/common/get', {url: 'customerManage/cstmRating/levelCombo'})
          if (data.returnCode === 0) {
            console.log(data)
            let arr = []
            data.list.map(itm => {
              let obj={
                label: itm,
                value: itm
              }
              arr.push(obj)
            })
            this.searchFormItems[1][2].list = arr
            this.searchShow = true
            this.chartData.yLabels = data.list
            this.chartData.yLabels.unshift('等级')
          } else {
            this.msgShow(this, data.errMsg)
            this.loading = false
          }
      } catch (e) {
        console.error(e)
        this.msgShow(this)
      }
    }
  }
}
</script>