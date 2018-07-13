<template lang="pug">
.content
  .box(v-if="pieVal")
    .ft-16.border-bottom-line.pb-10 {{pieVal.title}}
    .mt-15
      .row
        .col.flex-150
          .row.mt-10.flex-center.text-left
            .col.text-right.pr-8.flex-50 日期：
            .col
              el-date-picker.full-width(v-model="date", size="small")
            .col.ml-15
              el-button(size="small", type="primary") 查询
              el-button(size="small") 重置
          .row.mt-10
            el-table(:data="pieTableVal.tableData")
              el-table-column(v-for="head in pieTableVal.tableHead", :key="head.prop", :prop="head.prop", :label="head.label")
                 template(slot-scope="scope") {{scope.row[head.prop] | rowData(head.prop)}}
        .col.ml-30.mt-60
          el-tabs(tab-position="right", style="width: 450px;")
            el-tab-pane(label="全部")
              pie-chart.border(:data="pieVal.pieData", :options="pieVal.pieOptions")
            el-tab-pane(label="线上")
              pie-chart.border(:data="pieVal.pieData", :options="pieVal.pieOptions")
            el-tab-pane(label="线下")
              pie-chart.border(:data="pieVal.pieData", :options="pieVal.pieOptions")
</template>
<script>
import pieChart from '@/components/PieChart.js'
export default {
  layout: 'main',
  components: {
    pieChart
  },
  props: {
    pieVal: {
      type: null,
      default: false
    },
    pieTableVal: {
      type: null,
      default: false
    }
  },
  data () {
    return {
      date: new Date(),
      pieData: {
        datasets: [{
          data: [10, 20, 30],
          backgroundColor: ['#5b9bd5', '#ed7d31', '#a5a5a5']
        }],
        labels: [
          'Red',
          'Yellow',
          'Blue'
        ]
      }
    }
  }
}
</script>
<style lang="stylus", scoped>
  .box
    width: 100%
    padding: 10px
    box-sizing: border-box
</style>