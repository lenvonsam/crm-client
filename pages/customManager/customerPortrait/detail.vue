<template lang="pug">
.content
  breadcrumb(:breadItems="breadItems")
  .mt-15
    button-group(:btns="btnGroups", @groupBtnClick="backPage")
  .mt-15
    el-tabs(type="border-card")
      el-tab-pane(label="基础信息")
        custom-detail(:disabled="true")
      el-tab-pane(label="用户图表")
        .bg-f9
          custom-chart-table(:tableValue="dealTableValue", :search="dealSearch")
        .mt-15.bg-f9
          custom-chart-table(:tableValue="orderTableValue", :search="orderSearch")
        .mt-15.bg-f9
          custom-chart-table(:tableValue="addCartNoTableValue", :search="addCartNoSearch")
        .mt-15.bg-f9
          custom-chart-table(:tableValue="successRateTableValue", :search="successRateSearch")
        .row.mt-15.bg-f9.pt-20.pb-10
          .col
            .text-center.ml-10.mb-10(style="width:700px; background: #fff; padding: 10px")
              line-chart(:data="saleGoodsChartData", :options="saleGoodsChartOptions")
            .row.flex-center
              .col
                .row.mt-10.flex-center
                  .col.flex-100.text-right.pr-8 物资品类：
                  .col.flex-280
                    el-select.full-width(v-model="goodsTypeSearchForm.goodsTypeVal", size="small")
                      el-option(v-for="item in goodsTypeSearchForm.goodsType", :key="item.value", :label="item.label", :value="item.value")
                .row.mt-10.flex-center
                  .col.flex-100.text-right.pr-8 快速查看：
                  .col.flex-280
                    el-radio-group.full-width(v-model="goodsTypeSearchForm.dateListVal", size="small")
                      el-radio-button(:label="item.label", v-for="item in goodsTypeSearchForm.dateList", :key="item.value")
                .row.mt-10.flex-center
                  .col.flex-100.text-right.pr-8 日期：
                  .col.flex-280
                    el-date-picker.full-width(v-model="goodsTypeSearchForm.date", size="small")
              .col.mt-10.ml-10
                el-button(type="primary", size="small") 查询
                .mt-10
                  el-button(size="small") 重置
          .col
            .text-center.ml-10.mb-10(style="width:700px; background: #fff; padding: 10px")
              line-chart(:data="weightChartData", :options="weightChartOptions")
            .row.flex-center
              .col
                .row.mt-10.flex-center
                  .col.flex-100.text-right.pr-8 快速查看：
                  .col.flex-280
                    el-radio-group.full-width(v-model="goodsTypeSearchForm.dateListVal", size="small")
                      el-radio-button(:label="item.label", v-for="item in goodsTypeSearchForm.dateList", :key="item.value")
                .row.mt-10.flex-center
                  .col.flex-100.text-right.pr-8 日期：
                  .col.flex-280
                    el-date-picker.full-width(v-model="goodsTypeSearchForm.date", size="small")
              .col.mt-10.ml-10
                el-button(type="primary", size="small") 查询
                .mt-10
                  el-button(size="small") 重置
        .mt-15.bg-f9
          goods-sales-pie(:pieVal="pieVal", :pieTableVal="pieTableVal")
      el-tab-pane(label="行为记录")
        behavior-rec
</template>

<script>
import breadcrumb from '@/components/Breadcrumb.vue'
import buttonGroup from '@/components/ButtonGroup.vue'
import customDetail from '@/components/CustomDetail.vue'
import customChartTable from '@/components/CustomChartTable.vue'
import lineChart from '@/components/LineChart.js'
import goodsSalesPie from '@/components/GoodsSalesPie.vue'
import behaviorRec from '@/components/BehaviorRec.vue'
export default {
  layout: 'main',
  components: {
    breadcrumb,
    buttonGroup,
    customDetail,
    customChartTable,
    lineChart,
    goodsSalesPie,
    behaviorRec
  },
  data () {
    return {
      breadItems: ['客户管理', '客户画像'],
      btnGroups: [{lbl: '返回', type: 'back'}],
      dealTableValue: {
        title: '用户成交情况',
        tableHead: [{label: '总重量(吨)', prop: 'totalWeight'}, 
          {label: '总金额（元）', prop: 'totalAmount'}, 
          {label: '线上重量(吨)', prop: 'onlineWeight'}, 
          {label: '线上金额（元）', prop: 'onlineAmount'},
          {label: '线下重量(吨)', prop: 'offlineWeight'}, 
          {label: '线下金额（元）', prop: 'offlineAmount'}],
        tableData: []
      },
      orderTableValue: {
        title: '用户订单情况',
        tableHead: [{label: '订单总数', prop: 'orderTotal'}, 
        {label: '进行中的订单', prop: 'processing'}, 
        {label: '已完成', prop: 'completed'}, 
        {label: '取消', prop: 'cancel'}, 
        {label: '违约', prop: 'default'}],
        tableData: []
      },
      addCartNoTableValue: {
        title: '加入购物车品类次数',
        tableHead: [{label: 'H型钢', prop: 'hBeam'}, 
        {label: '槽钢', prop: 'channelSteel'}, 
        {label: '工字钢', prop: 'iBeam'}, 
        {label: '角钢', prop: 'angleSteel'}, 
        {label: '扁钢', prop: 'flatSteel'}],
        tableData: []
      },
      successRateTableValue: {
        title: '加入购物车/生成订单百分比',
        tableHead: [{label: '加入购物车', prop: 'addCart'},
        {label: '生成订单', prop: 'ceartOrder'},
        {label: '百分比（%）', prop: 'rate'}],
        tableData: []
      },
      saleGoodsChartData: {
        labels: ["5月20日", "5月21日", "5月22日", "5月23日", "5月24日", "5月25日", "5月26日"],
        datasets: [{
          label: "总计",
          borderColor: '#5b9bd5',
          data: [0, 10, 5, 2, 20, 30, 45]
        }, {
          label: "线上",
          borderColor: '#ed7d31',
          data: [1, 20, 3, 5, 1, 20, 35]
        }, {
          label: "线下",
          borderColor: '#a5a5a5',
          data: [2, 5, 3, 3, 0, 10, 20]
        }]
      },
      saleGoodsChartOptions: {
        title:{
          display:true,
          position: 'top',
          fontSize: 14,
          text:'H型钢销售量折线图'
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
      },
      goodsTypeSearchForm: {
        goodsType: [{label: 'H型钢', value: '001'}, {label: '槽钢', value: '002'}, {label: '角钢', value: '003'}],
        goodsTypeVal: '',
        dateList: [{label: '最近一周', value: '001'}, {label: '最近一月', value: '002'}, {label: '最近一年', value: '003'}],
        dateListVal: '',
        date: new Date()
      },
      weightChartData: {
        labels: ["5月20日", "5月21日", "5月22日", "5月23日", "5月24日", "5月25日", "5月26日"],
        datasets: [{
          label: "总计",
          borderColor: '#5b9bd5',
          data: [0, 30, 2, 12, 10, 23, 35]
        }, {
          label: "线上",
          borderColor: '#ed7d31',
          data: [1, 20, 3, 5, 1, 20, 35]
        }, {
          label: "线下",
          borderColor: '#a5a5a5',
          data: [2, 5, 3, 3, 0, 10, 20]
        }]
      },
      weightChartOptions: {
        title:{
          display:true,
          position: 'top',
          fontSize: 14,
          text:'成交重量折线图'
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
      },
      pieVal: {
        title: '物资品类销量饼图',
        pieData: {
          datasets: [{
            data: [70, 60, 50, 40, 30, 20, 10],
            backgroundColor: ['#5b9bd5', '#ed7d31', '#a5a5a5', '#ffc000', '#3b64ad', '#62993e', '#97b9e0']
          }],
          labels: ['H型钢','槽钢','角钢','圆钢','扁钢','开平板','其他']
        },
        pieOptions: {
          title:{
            display:true,
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
      },
      pieTableVal: {
        tableHead: [
          {label: '', prop: 'name'},
          {label: '总计', prop: 'total'},
          {label: '线上', prop: 'onLine'},
          {label: '线下', prop: 'offline'}
        ],
        tableData: []
      }
    }
  },
  mounted () {
    this.dealTableValue.tableData = [{totalWeight: '1000', totalAmount: '4,500,000', onlineWeight: '500', onlineAmount: '2,250,000', offlineWeight: '500', offlineAmount: '2,250,000'}]
    this.orderTableValue.tableData = [{orderTotal: '150', processing: '20', completed: '11', cancel: '30', default: '10'}]
    this.addCartNoTableValue.tableData = [{hBeam: '150', channelSteel: '100', iBeam: '50', angleSteel: '65', flatSteel: '63'}]
    this.successRateTableValue.tableData = [{addCart: '150', ceartOrder: '100', rate: '50'}]
    this.pieTableVal.tableData = [
          {name: 'H型钢', total: '150', onLine: '100', offline: '50'},
          {name: '槽钢', total: '150', onLine: '100', offline: '50'},
          {name: '角钢', total: '150', onLine: '100', offline: '50'},
          {name: '圆钢', total: '150', onLine: '100', offline: '50'},
          {name: '扁钢', total: '150', onLine: '100', offline: '50'},
          {name: '开平板', total: '150', onLine: '100', offline: '50'},
          {name: '其他', total: '150', onLine: '100', offline: '50'}
        ]
  },
  methods: {
    backPage(type){},
    dealSearch (parms) {
      console.log(parms)
    },
    orderSearch (parms) {
      console.log(parms)
    },
    addCartNoSearch (parms) {
      console.log(parms)
    },
    successRateSearch (parms) {
      console.log(parms)
    }
  }
}
</script>
<style lang="stylus", scoped>
  .bg-f9
    background: #f9f9f9
</style>