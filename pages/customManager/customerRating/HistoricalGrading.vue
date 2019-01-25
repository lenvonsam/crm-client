<template lang="pug">
  .content
    breadcrumb(:breadItems="breadItems")
    .mt-15
      el-button(size="small", @click="jump({path: '/customManager/customerRating'})") 返回列表
    .mt-15.bg-f9.p-15.row
        .col
          span 客户： {{headData.compName}}
          el-tag.ml-5(size="mini", v-if="headData.mark !== ''") {{headData.mark}}
          span.pl-25 业务部门： {{headData.dptName}}
          span.pl-15 业务员： {{headData.acctName}}
        .col.text-right
          el-button(size="mini", type="primary", @click="chartHandler") 生成折线图
    .mt-15
      el-tabs(type="border-card", v-model="tabName")
        el-tab-pane(v-for="itm in tabPane", :label="itm.lbl", :name="itm.name", :key="itm.name")
          .content
            .box(v-if="dealTableValue")
              el-form.pt-15(:inline="true", :model="searchForm" ref="searchForm" label-width="60px")
                el-form-item(label="日期：", prop="date")
                  el-date-picker(type="week", placeholder="选择周", format="yyyy 第 WW 周", v-model="searchForm.date", v-if="tabName == '1'", size="small")
                  el-date-picker(type="daterange", range-separator="-", start-placeholder="开始日期", end-placeholder="结束日期", v-model="searchForm.date", style="width: 250px;", size="small", :picker-options="datePickerOpts", value-format="yyyy-MM-dd", v-else="tabName == '0'")
                el-form-item
                  el-button(type="primary", @click="submitForm('searchForm')", size="small") 查询
                  el-button(@click="resetForm('searchForm')", size="small") 重置
              basic-table(:tableValue="dealTableValue", :loading="loading", :currentPage="currentPage", :pageSize="pageSize", :total="totalCount", @pageChange="tableChange")
    el-dialog(title="最近七天折线图", :visible.sync="dialShow", center)
      .barChartBox
        line-chart(:data="chartData", :options="chartOptions", style="width: 100%")
</template>
<script>
import basicTable from '@/components/BasicTable.vue'
import breadcrumb from '@/components/Breadcrumb.vue'
import searchForm from '@/components/SearchForm.vue'
import customChartTable from '@/components/CustomChartTable.vue'
import lineChart from '@/components/LineChart.js'
import { mapState } from 'vuex'
export default {
  layout: 'main',
  components: {
    breadcrumb,
    searchForm,
    customChartTable,
    lineChart,
    basicTable
  },
  data () {
    return {
      breadItems: ['客户管理', '客户分级', '历史分级信息'],
      tabPane: [{lbl: '按日查看', name: '0'}
      // {lbl: '按周查看', name: '1'}, 
      // {lbl: '按月查看', name: '2'}, 
      // {lbl: '按年查看', name: '3'}
      ],
      tabName: '0',
      dealTableValue: {
        tableHead: [{lbl: '日期', prop: 'summaryDate'},
          {lbl: '得分', prop: 'summary'},
          {lbl: '等级', align: 'center', prop: 'summaryLevel'}],
        tableData: []
      },
      dialShow: false,
      chartData: {
        xLabels: [],
        yLabels: ['', 'A', 'B', 'C', 'D', 'E'],
        datasets: [{
          label: "七天",
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
      },
      searchForm: {
        date: []
      },
      currentPage: 1,
      totalCount: 0,
      pageSize: 7,
      queryObject: {
        currentPage: this.currentPage - 1,
        pageSize: 7,
        compName: this.$route.query.compName
      },
      headData: {
        compName: '',
        acctName: '',
        dptName: '',
        mark: ''
      },
      loading: false
    }
  },
  computed: {
    ...mapState({
      currentUser: state => state.user.currentUser
    })
  },
  mounted () {
    this.queryObject = {
      currentPage: this.currentPage - 1,
      pageSize: 7,
      compName: this.$route.query.compName
    }
    this.cstmRatingDetail()    
  },
  methods: {
    tableChange (val) {
      this.loading = true
      this.currentPage = val
      this.queryObject.currentPage = this.currentPage - 1
      this.queryObject.compName = this.$route.query.compName
      this.cstmRatingDetail()
    },
    chartHandler () {
      this.getLevelCombo()
    },
    submitForm(formName) {
      let dateArr = this.searchForm.date
      if (dateArr!== null && dateArr !== undefined && dateArr !== '') {
        this.queryObject.startTime = this.searchForm.date[0]
        this.queryObject.endTime = this.searchForm.date[1]
      } else {
        delete this.queryObject.startTime
        delete this.queryObject.endTime
      } 
      this.cstmRatingDetail()
    },
    resetForm(formName) {
      // this.$refs[formName].resetFields();
      this.searchForm.date = []
    },
    // chartPlugins () {
    //   Chart.plugins.register({
    //     id: 'customerRating',
    //     afterDatasetsDraw: function(chart) {
    //       var ctx = chart.ctx;
    //       chart.data.datasets.forEach(function(dataset, i) {
    //         var meta = chart.getDatasetMeta(i);
    //         if (!meta.hidden) {
    //           meta.data.forEach(function(element, index) {
    //             // Draw the text in black, with the specified font
    //             ctx.fillStyle = 'rgb(0, 0, 0)'

    //             var fontSize = 16
    //             var fontStyle = 'normal'
    //             var fontFamily = 'Helvetica Neue'
    //             ctx.font = Chart.helpers.fontString(fontSize, fontStyle, fontFamily)

    //             // Just naively convert to string for now
    //             // var dataString = dataset.data[index].toString();
    //             var data = dataset.data[index]
    //             // Make sure alignment settings are correct
    //             ctx.textAlign = 'center'
    //             ctx.textBaseline = 'middle'

    //             var padding = 5
    //             var position = element.tooltipPosition()
    //             ctx.fillText(data.level, position.x, position.y - (fontSize / 2) - padding)
    //           })
    //         }
    //       })
    //     }
    //   })
    // },
    async cstmRatingDetail () {
      try {
        this.chartData.datasets[0].data = []
        this.chartData.xLabels = []
        let { data } = await this.apiStreamPost('/proxy/common/post', {url: 'customerManage/cstmRating/detail', params: this.queryObject})
          if (data.returnCode === 0) {
            let arr = []
            data.list.map(itm => {      
              this.chartData.xLabels.push(this.date2Str(new Date(itm.summaryDate)))
              let obj = {
                x: this.date2Str(new Date(itm.summaryDate)), 
                y: itm.summaryLevel,
                level: itm.summaryLevel,
                summary: itm.summary
              }
              this.chartData.datasets[0].data.push(obj)
              itm.summaryDate = this.date2Str(new Date(itm.summaryDate))
              itm.summary = itm.summary.toFixed(2)
              arr.push(itm)
            })
            if(arr.length > 0){
              this.headData = {
                compName: arr[0].compName,
                acctName: arr[0].acctName,
                dptName: arr[0].dptName,
                mark: (data.mark == 2) ? '正式客户' : (data.mark == 3) ? '潜在客户' : ''
              }
            }
            // this.chartPlugins()
            this.dealTableValue.tableData = arr
            this.totalCount = data.total
            this.loading = false
          } else {
            this.msgShow(this, data.errMsg)
            this.loading = false
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
            this.chartData.yLabels = data.list
            this.chartData.yLabels.unshift('等级')
            this.dialShow = true
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