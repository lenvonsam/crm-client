<template lang="pug">
.content
  breadcrumb(:breadItems="breadItems")
  .mt-15
    el-button(size="small", @click="jump({path: '/customManager/customerPortrait'})") 返回列表
  .mt-15
    el-tabs(type="border-card", v-model="tabName", @tab-click="elTabsHandler")
      el-tab-pane(label="基础信息", name="1")
        custom-detail(:isEdit="false", v-if="tabName == '1'", @cb="cstmDetail")
      el-tab-pane(label="客户图表", name="2")
        template(v-if="tabName == '2'")
          .bg-f9
            custom-chart-table(:tableValue="dealTableValue", :search="dealSearch")
          .mt-15.bg-f9
            custom-chart-table(:tableValue="orderTableValue", :search="orderSearch", v-if="isOnLine")
          .mt-15.bg-f9
            custom-chart-table(:tableValue="addCartNoTableValue", :search="addCartNoSearch", v-if="isOnLine")
          .mt-15.bg-f9
            custom-chart-table(:tableValue="successRateTableValue", :search="successRateSearch", v-if="isOnLine")
          .row.mt-15.bg-f9.padding
            .col
              el-card(shadow="hover")
                .clearfix(slot="header") 物资品类销售折线图
                div
                  el-form.pt-15(:inline="true", :model="goodsForm" ref="goodsForm" label-width="90px")
                    el-form-item(label="物资品类：", prop="goodsType")
                      el-select(v-model="goodsForm.goodsType", size="small")
                        el-option(v-for="(gtype, idx) in goodsTypeOpts", :key="idx", :value="gtype", :label="gtype")
                    el-form-item(label="日期：", prop="date")
                      el-date-picker(type="daterange", range-separator="-", start-placeholder="开始日期", end-placeholder="结束日期",v-model="goodsForm.date" style="width: 250px;", size="small", :picker-options="datePickerOpts", value-format="yyyy-MM-dd")
                    el-form-item
                      el-button(type="primary", @click="queryGoods", size="small") 查询
                      el-button(@click="$refs['goodsForm'].resetFields()", size="small") 重置
                  line-chart(:data="saleGoodsChartData", :options="saleGoodsChartOptions", style="width: 100%; height: 600px", ref="goodsLineChart")
          .mt-15.bg-f9
            goods-sales-pie(:pieTableVal="pieTableVal", @search="pieSearch")
      el-tab-pane(label="行为记录", name="3")
        template(v-if="tabName == '3'")
          behavior-rec(:behaviorData="behaviorTableData", :currentPage="currentPage", :pageSize="pageSize", :total="totalCount",@pgChange="tablePgChange", @search="behaviorSearch")
</template>

<script>
import breadcrumb from '@/components/Breadcrumb.vue'
import buttonGroup from '@/components/ButtonGroup.vue'
import customDetail from '@/components/CustomDetail.vue'
import customChartTable from '@/components/CustomChartTable.vue'
import lineChart from '@/components/LineChart.js'
import goodsSalesPie from '@/components/GoodsSalesPie.vue'
import behaviorRec from '@/components/BehaviorRec.vue'
import { mapState } from 'vuex'
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
  computed: {
    ...mapState({
      pageSize: state => state.pageSize
    })
  },
  watch: {
    tabName (newVal, oldVal) {
      if (newVal === '3') {
        // 用户行为
        this.currentPage = 1
        this.loadBehaviorData()
      }
    }
  },
  data () {
    return {
      goodsTypeOpts: [],
      breadItems: ['客户管理', '客户画像', '详情'],
      tabName: '1',
      btnGroups: [{lbl: '返回', type: 'back'}],
      goodsForm: {
        goodsType: '全部',
        date: ''
      },
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
        title: '生成订单/加入购物车百分比',
        tableHead: [{label: '加入购物车', prop: 'addCart'},
        {label: '生成订单', prop: 'ceartOrder'},
        {label: '百分比（%）', prop: 'rate'}],
        tableData: []
      },
      saleGoodsChartData: {
        labels: [],
        datasets: [{
          label: "总计",
          borderColor: '#5b9bd5',
          data: []
        }, {
          label: "线上",
          borderColor: '#ed7d31',
          data: []
        }, {
          label: "线下",
          borderColor: '#a5a5a5',
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
      },
      pieTableVal: {
        tableHead: [
          {label: '品名', prop: 'type'},
          {label: '总计', prop: 'total'},
          {label: '线上', prop: 'online'},
          {label: '线下', prop: 'offline'}
        ],
        tableData: []
      },
      behaviorTableData: [],
      currentPage: 1,
      totalCount: 0,
      behaviorQuery: {},
      isOnLine: true
    }
  },
  beforeMount () {
    this.loadGoodsType()
  },
  methods: {
    cstmDetail (obj) {
      console.log('------------')
      console.log(obj.ebusiMemberCode)
      this.isOnLine = (obj.ebusiMemberCode == null) ? false : true
    },
    elTabsHandler (tab) {
      this.tabName = tab.name
      if (this.tabName == '2') {
        this.initSearchData()
      }
    },
    initSearchData () {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      end.setTime(end.getTime() - 3600 * 1000 * 24)
      this.goodsForm.date = [new Date(start), new Date(end)]
      let recentWeek = [this.date2Str(start), this.date2Str(end)]
      this.queryGoodsSalesList(recentWeek, 'dealSearch')
      this.queryGoodsSalesList(recentWeek, 'queryGoods')
      this.queryGoodsSalesList(recentWeek, 'pieSearch')
      let params = {
        date: recentWeek
      }
      this.orderSearch(params)
      this.addCartNoSearch(params)
      this.successRateSearch(params)
    },
    async loadGoodsType () {
      try {
        let { data } = await this.apiStreamPost('/proxy/common/get', {url: 'customerManage/cstmPortrait/salesType/' + this.$route.query.id, params: {}})
        if (data.returnCode === 0 && data.goodsType.length > 0) {
          this.goodsTypeOpts = data.goodsType
          this.goodsTypeOpts.unshift('全部')
        } else {
          this.goodsTypeOpts = ['全部']
        }
      } catch (e) {
        console.error(e)
        this.goodsTypeOpts = ['全部']
      }
    },
    initSearch (arr) {
      if (typeof(arr[0]) == 'object') {
        arr[0] = this.date2Str(arr[0])
        arr[1] = this.date2Str(arr[1])
      }
      return arr
    },
    dealSearch (params) {
      params.date = this.initSearch(params.date)
      this.queryGoodsSalesList(params.date, 'dealSearch')
    },
    queryGoods () {
      if (this.goodsForm.date == null || this.goodsForm.date == '') {
        this.msgShow(this, '请选择日期')
      } else {
        this.goodsForm.date = this.initSearch(this.goodsForm.date)
        this.queryGoodsSalesList([this.goodsForm.date[0], this.goodsForm.date[1], this.goodsForm.goodsType], 'queryGoods')
      }
    },
    pieSearch (params) {
      // debugger
      // console.log(params)
      params = this.initSearch(params)
      this.queryGoodsSalesList(params, 'pieSearch')
    },
    async queryGoodsSalesList (params, searchType) {
      try {
        let body = {
          startDate: params[0],
          endDate: params[1],
          searchType: searchType
        }
        if (params.length === 3) body.category = params[2]
        let { data } = await this.apiStreamPost('/proxy/common/post', {url: 'customerManage/cstmPortrait/sales/' + this.$route.query.id, params: body})
        console.log(data)
        if (data.returnCode === 0) {
          if (searchType === 'dealSearch') {
            this.dealTableValue.tableData = [{
              totalWeight: data.totalWeight.toFixed(3),
              totalAmount: data.totalAmount.toFixed(2),
              onlineWeight: data.onlineWeight.toFixed(3),
              onlineAmount: data.onlineAmount.toFixed(2),
              offlineAmount: data.offlineAmount.toFixed(2),
              offlineWeight: data.offlineWeight.toFixed(3)
            }]
          } else if (searchType === 'pieSearch') {
            this.pieTableVal.tableData = data.goodsTypeTable
          } else {
            this.saleGoodsChartData.labels = data.dateRange
            this.saleGoodsChartData.datasets[0].data = data.totalList.map(itm => Number(itm))
            this.saleGoodsChartData.datasets[1].data = data.onlineList.map(itm => Number(itm))
            this.saleGoodsChartData.datasets[2].data = data.offlineList.map(itm => Number(itm))
            this.$refs.goodsLineChart.update()
          }
        } else {
          this.msgShow(this, data.errMsg)
        }
      } catch (e) {
        console.error(e)
        this.msgShow(this)
      }
    },
    async loadBehaviorData () {
      try {
        this.behaviorQuery.currentPage = this.currentPage - 1
        this.behaviorQuery.pageSize = this.pageSize
        let { data } = await this.apiStreamPost('/proxy/common/post', {url: 'customerManage/cstmPortrait/list/' + this.$route.query.id, params: this.behaviorQuery})
        if (data.returnCode === 0) {
          this.behaviorTableData = data.list
          this.totalCount = data.total
        } else {
          this.msgShow(this, data.errMsg)
        }
      } catch (e) {
        console.error(e)
        this.msgShow(this)
      }
    },
    tablePgChange (val) {
      this.currentPage = val
      this.loadBehaviorData()
    },
    behaviorSearch (val) {
      console.log(val)
      let param = {}
      Object.keys(val).map(k => {
        if (val[k] && val[k] !== '') {
          param[k] = val[k]
        }
      })
      this.currentPage = 1
      this.behaviorQuery = Object.assign({}, param)
      this.loadBehaviorData()
    },
    async orderSearch (params) {
      params.date = this.initSearch(params.date)
      try {
        let { data } = await this.apiStreamPost('/proxy/common/get', {url: 'customerManage/cstmPortrait/orderTypeCount/' + this.$route.query.id + '?startDate=' + params.date[0] + '&endDate=' + params.date[1], params: {}})
        if (data.returnCode === 0) {
          this.orderTableValue.tableData = [{orderTotal: data.total, processing: data.pending, completed: data.finish, cancel: data.cancel, default: data.violate}]
        } else {
          this.msgShow(this, data.errMsg)
        }
      } catch (e) {
        console.error(e)
        this.msgShow(this)
      }
    },
    async addCartNoSearch (params) {
      params.date = this.initSearch(params.date)
      try {
        let { data } = await this.apiStreamPost('/proxy/common/get', {url: 'customerManage/cstmPortrait/goodsCount/' + this.$route.query.id + '?startDate=' + params.date[0] + '&endDate=' + params.date[1], params: {}})
        if (data.returnCode === 0) {
          this.addCartNoTableValue.tableData = [{hBeam: data.hBeam, channelSteel: data.channelSteel, iBeam: data.iBeam, angleSteel: data.angleSteel, flatSteel: data.flatSteel}]
        } else {
          this.msgShow(this, data.errMsg)
        }
      } catch (e) {
        console.error(e)
        this.msgShow(this)
      }
    },
    async successRateSearch (params) {
      params.date = this.initSearch(params.date)
      try {
        let { data } = await this.apiStreamPost('/proxy/common/get', {url: 'customerManage/cstmPortrait/orderCount/' + this.$route.query.id + '?startDate=' + params.date[0] + '&endDate=' + params.date[1], params: {}})
        if (data.returnCode === 0) {
          this.successRateTableValue.tableData = [{addCart: data.cartCount, ceartOrder: data.orderCount, rate: data.percent.toFixed(2)}]
        } else {
          this.msgShow(this, data.errMsg)
        }
      } catch (e) {
        console.error(e)
        this.msgShow(this)
      }
    }
  }
}
</script>
<style lang="stylus", scoped>
  .bg-f9
    background: #f9f9f9
</style>