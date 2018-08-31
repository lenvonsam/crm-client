<template lang="pug">
.content
  .box
    .ft-16.border-bottom-line.pb-15 物资品类销量饼图
    .mt-20
      .row.flex.flex-center
        .col
          el-tabs(tab-position="bottom", type="border-card", style="max-width: 620px", v-model="pieTab")
            el-tab-pane(label="全部", name="全部")
              pie-chart.cust-sales-pie(:data="pieVal.pieData", :options="pieVal.pieOptions", ref="pieAll")
            el-tab-pane(label="线上", name="线上")
              pie-chart.cust-sales-pie(:data="pieVal.pieData", :options="pieVal.pieOptions", ref="pieOnline")
            el-tab-pane(label="线下", name="线下")
              pie-chart.cust-sales-pie(:data="pieVal.pieData", :options="pieVal.pieOptions", ref="pieOffline")
        .col.pr-20
          .row.flex-center.text-left
            .col.text-right.pr-8.flex-50 日期：
            .col
              el-date-picker.full-width(type="daterange",range-separator="-", start-placeholder="开始日期", end-placeholder="结束日期",v-model="date" style="width: 250px;", size="small", :picker-options="datePickerOpts", value-format="yyyy-MM-dd")
            .col.ml-15
              el-button(size="small", type="primary", @click="pieSearch") 查询
              el-button(size="small", @click="date = ''") 重置
          .row.mt-20
            el-table(:data="pieTableVal.tableData")
              el-table-column(v-for="head in pieTableVal.tableHead", :key="head.prop", :prop="head.prop", :label="head.label")
                 template(slot-scope="scope") {{scope.row[head.prop] | rowData(head.prop)}}
</template>
<script>
import pieChart from '@/components/PieChart.js'
export default {
  components: {
    pieChart
  },
  props: {
    pieTableVal: {
      type: null,
      default: false
    }
  },
  data () {
    var pieVal = {
      pieData: {
        datasets: [{
          data: [],
          backgroundColor: []
        }],
        labels: []
      },
      pieOptions: {
        responsive: false,
        title:{
          display: false,
          position: 'top',
          fontSize: 14,
          text:'物资品类销量饼图'
        },
        legend: {
          position: 'bottom',
          labels: {
            boxWidth: 10
          }
        }
      }
    }
    return {
      pieTab: '全部',
      date: '',
      pieVal,
      totalPie: [],
      offlinePie: [],
      onlinePie: []
    }
  },
  watch: {
    'pieTableVal.tableData' (newVal, oldVal) {
      this.totalPie = newVal.map(s => Number(s.total))
      this.onlinePie = newVal.map(s => Number(s.online))
      this.offlinePie = newVal.map(s => Number(s.offline))
      const labels = newVal.map(s => s.type)
      const bgColors = newVal.map(s => this.getRandomColor())
      this.pieVal.pieData.labels = labels
      this.pieVal.pieData.datasets[0].backgroundColor = bgColors
      console.log(labels)
      console.log(bgColors)
      this.changePieData()
    },
    pieTab (newVal) {
      this.changePieData()
    }
  },
  mounted () {
    const end = new Date()
    const start = new Date()
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
    end.setTime(end.getTime() - 3600 * 1000 * 24)
    this.date = [new Date(start), new Date(end)]
  },
  methods: {
    pieSearch () {
      if (this.date === '' || this.date === null) {
        this.msgShow(this, '请选择日期')
      } else {
        this.$emit('search', this.date)
      }
    },
    changePieData () {
      if (this.pieTab === '全部') {
        this.pieVal.pieData.datasets[0].data = this.totalPie
        this.$refs.pieAll.update()
      } else if (this.pieTab == '线上') {
        this.pieVal.pieData.datasets[0].data = this.onlinePie
        this.$refs.pieOnline.update()
      } else {
        this.pieVal.pieData.datasets[0].data = this.offlinePie
        this.$refs.pieOffline.update()
      }
    }
  }
}
</script>
<style lang="stylus", scoped>
  .box
    width: 100%
    padding: 15px
    box-sizing: border-box
</style>