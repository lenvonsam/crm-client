<template lang="pug">
.content
  .row.ft-24
    .col.bg-f9.p-15.ft-16
      .row.flex-center(style="width:400px;")
        .col.flex-120.avatar
          img(:src="currentUser.avatar == undefined ? defaultAvatar : currentUser.avatar")
        .col.pl-15
          .mt-5.ft-20 {{currentUser.fkDpt.name}}
          .ft-13.text-gray.mt-5 登录时间：{{currentUser.loginTime}}
          .mt-5.ft-14
            i.icon-custom.iconfont
            span.pl-5 {{currentUser.name}}
            el-tag.ml-5(type="success", size="mini", v-if="acctName !== ''") {{acctName}}
    .col.bg-f9.ml-25.text-center
      .text-white.pt-20.pb-20.bg-success.ft-30(v-if="cstmNum !== ''") {{cstmNum}}
      .pt-20.pb-20.text-green
        i.icon-nav_promoter.iconfont.ft-24
        span.pl-5 客户数
    .col.bg-f9.ml-25.text-center
      .text-white.pt-20.pb-20.bg-primary.ft-30(v-if="salesNum !== ''") {{salesNum}}
      .pt-20.pb-20.text-primary
        i.icon-fl-xiaoshoudan.iconfont.ft-24
        span.pl-5 销售量（吨）
    .col.bg-f9.ml-25.text-center
      .text-white.pt-20.pb-20.bg-warning.ft-30(v-if="sales !== ''") {{sales}}万
      .pt-20.pb-20.text-warning
        i.icon-qianmoney125.iconfont.ft-24
        span.pl-5 销售额（元）
  .full-width.bg-f9.mt-20.p-15
    .ft-16.border-bottom-line.pb-10 今日待拜访客户
    .bg-white.row.mt-10.p-10.ft-666
      .col
        span.text-red *
        span 您今日有 {{totalCount}} 位客户待拜访，请注意及时拜访并签到。
      .col.text-right
        router-link.ft-666(to="/customManager/customerVisit") 管理拜访计划
    .mt-15
      //- el-table(:data="tableValue.tableData", border)
      //-   template(v-for="head in tableValue.tableHead")
      //-     el-table-column(v-if="head.type == 'object'", :label="head.lbl", :width="head.width? head.width : 'auto'", :min-width="head.minWidth? head.minWidth : 'auto'",  :prop="head.prop", :sortable="head.sort")
      //-       template(slot-scope="scope") {{head.factValue(scope.row[head.prop])}}
      //-     el-table-column(v-else, :label="head.lbl", :width="head.width ? head.width : 'auto'", :min-width="head.minWidth? head.minWidth : 'auto'", :prop="head.prop", :sortable="head.sort", :align="head.align ? head.align : 'left'")
      //-       template(slot-scope="scope") {{scope.row[head.prop] | rowData(head.prop)}}
      basic-table(:tableValue="tableValue", :currentPage="currentPage", :pageSize="pageSizeVisit", :total="totalCount", :loading="loading", @tableRowMap = "rowMap")
      //- basic-table(:tableValue="tableValue", :currentPage="currentPage", :pageSize="pageSize", :total="totalCount", @chooseData="selectData", @pageChange="tableChange", :loading="loading", @tableRowEdit="rowEdit", @tableRowLock="rowLock", @tableRowMap = "rowMap")
  .full-width.bg-f9.mt-20.p-15
    .ft-16.border-bottom-line.pb-10 任务完成情况
    .bg-white.row.mt-10.p-10.ft-666
      el-tabs.full-width(type="border-card", @tab-click="tackHandler")
        el-tab-pane.elTabPaneTask(:label="itm.lbl", :name= 'itm.name', v-for="itm in tabPaneDateType", :key="itm.name")
          .row
            .col
              el-button.el-tag-btn.mr-5(:type="tagHave == btnItm.name ? 'success' : '' ", :key="btnItm.name", v-for="btnItm in elButton", @click="tagHandler(btnItm.name)", size="mini") {{ btnItm.lbl }}
            .col.text-right.text-red(v-if="schedule !== ''") *本月已经过去了 {{schedule}} %
          dash-task-completion(v-if="taskData.length > 0", :taskData='taskData')
  .full-width.bg-f9.mt-20.p-15
    .ft-16.border-bottom-line.pb-10 产品销售情况
    .bg-white.row.mt-10.p-10.ft-666
      el-tabs.full-width(type="border-card", value="0", @tab-click="saleHandler")
        el-tab-pane.elTabPaneSale(:label="itm.lbl", :name= 'itm.name', v-for="itm in productSalesVal", :key="itm.name")
          el-button.el-tag-btn.mr-5(:type="tagSalesHave == btnItm.name ? 'success' : '' ",  :key="btnItm.name", v-for="btnItm in elButton", @click="tagSalesHandler(btnItm.name)", size="mini") {{ btnItm.lbl }}
          dash-product-sales(v-if="taskSalesData.length > 0", :taskData='taskSalesData', :dateType="saleTabName")
  baidu-map(v-if="dialogMap", :baiduMapData= "baiduMapData", :cb="baiduMapCb")
</template>

<script>
  import { mapState } from 'vuex'
  import basicTable from '@/components/BasicTable.vue'
  import dashTaskCompletion from '@/components/DashTaskCompletion.vue'
  import dashProductSales from '@/components/DashProductSales.vue'
  import baiduMap from '@/components/BaiduMap.vue'
  export default {
    layout: 'main',
    data () {
      return {
        avatar: '',
        cstmNum: 0,
        salesNum: 0,
        sales: 0,
        acctName: '',
        tableValue: {
          tableData:[],
          page: true,
          hasCbx: false,
          rowClassName: true,
          tableHead:[{
            lbl: '客户名称',
            prop: 'customer',
            minWidth: '340px',
            type: 'object',
            factValue (row) {
              return row.compName
            }
          },{
            lbl: '联系人',
            prop: 'link',
            width: '180px',
            align: 'center',
            type: 'object',
            factValue (row) {
              return row.name
            },
          },{
            lbl: '联系方式',
            prop: 'link',
            width: '180px',
            align: 'center',
            type: 'object',
            factValue (row) {
              return row.phone
            }
          },{
            lbl: '计划拜访时间',
            prop: 'planVisitTime',
            width: '180px',
            align: 'center'
          },{
            lbl: '客户公司地址',
            prop: 'customer',
            minWidth: '300px',
            type: 'object',
            factValue (row) {
              return `${row.compProv == null ? '' : row.compProv} ${row.compCity == null ? '' : row.compCity} ${row.compArea == null ? '' : row.compArea} ${row.compAddr == null ? '' : row.compAddr}`
            }
          }, {
            type: 'action',
            fixed: 'right',
            align: 'center',
            width: '80px',
            actionBtns: [{
              lbl: '地图',
              type: 'map'
            }]
          }
          ]
        },
        currentPage: 1,
        totalCount: 0,
        pageSizeVisit: 10,
        queryObject: {
          currentPage: 0,
          pageSize: 100,
          mark: '1'
        },
        queryTaskObject: {
          acctId: '',
          dateType: '0',
          type: 3
        },
        querySalesObject: {
          acctId: '',
          dateType: '0',
          type: 3
        },
        loading: false,
        elButton: [{lbl: '个人', name: 3}, {lbl: '部门', name: 2}, {lbl: '机构', name: 1}, {lbl: '公司', name: 0}],
        tabPaneDateType: [{lbl: '本月度', name: '0'}, {lbl: '本季度', name: '1'}, {lbl: '本年度', name: '2'}],
        productSalesVal: [{lbl: '昨日', name: '0'}, {lbl: '本周', name: '1'}, {lbl: '本月', name: '2'}, {lbl: '本季度', name: '3'}, {lbl: '本年度', name: '4'}],
        tackTabName: '0',
        saleTabName: '0',
        tagHave: 3,
        tagSalesHave: 3,
        taskData: [],
        taskSalesData: [],
        schedule: '',
        dialogMap: false,
        baiduMapData: {
          center: {lng: 116.404, lat: 39.915},
          zoom: 6,
          location: '中国',
          keyWord: ''
        }
      }
    },
    components: {
      basicTable,
      dashTaskCompletion,
      dashProductSales,
      baiduMap
    },
    computed: {
      ...mapState({
        pageSize: state => state.pageSize,
        defaultAvatar: state => state.defaultAvatar,
        currentUser: state => state.user.currentUser
      })
    },
    mounted () {
      console.log(this.currentUser.avatar)
      this.currentUser.loginTime = this.datetime2Str(new Date(this.currentUser.loginTime))
      this.$nextTick(function () {
        let d = new Date()
        let monthDay = this.getDaysInOneMonth(d.getFullYear(), d.getMonth() + 1)
        this.schedule = Number(d.getDate()/monthDay*100).toFixed(0)
      })
      this.queryObject = {
        currentPage: 0,
        pageSize: 100,
        mark: '1',
        startTime: this.date2Str(new Date()),
        endTime: this.date2Str(new Date())
      }
      this.queryTaskObject = {
        acctId: this.currentUser.id,
        dateType: 0,
        type: 3
      }
      this.getCstmHome()
      this.getVisitLoadData()
      this.getTaskCompletion()
      this.getProductSales()
    },
    methods: {
      selectData (val) {
        this.chooseArray = val
      },
      getDaysInOneMonth(year, month){
        let d = new Date(year, month, 0)
        month = parseInt(month, 10)
        return d.getDate()
      },
      rowMap (obj) {
        this.baiduMapData = {
          center: {lng: 116.404, lat: 39.915},
          zoom: 6,
          location: '',
          keyWord: obj.customer.compName
        }
        this.dialogMap = true
      },
      baiduMapCb() {
        this.dialogMap = false
      },
      async getVisitLoadData () {
        try {
          this.queryObject.uid = this.currentUser.id
          let { data } = await this.apiStreamPost('/proxy/common/post', {url: 'customerManage/cstmCall', params: this.queryObject})
          if (data.returnCode === 0) {
            let arr = []
            data.list.map(itm => {
              itm[0].link = itm[1]
              arr.push(itm[0])
            })
            this.tableValue.tableData = arr
            this.totalCount = data.total
          } else {
            this.msgShow(this, data.errMsg)
          }
        } catch (e) {
          console.error(e)
          this.msgShow(this)
        }
      },
      tackHandler (tab, event) {
        this.queryTaskObject.dateType = Number(tab.name)
        // this.queryTaskObject.type = 0
        this.getTaskCompletion()
      },
      tagHandler (val) {
        this.tagHave = val
        this.queryTaskObject.type = Number(val)
        this.getTaskCompletion()
      },
      saleHandler (tab, event) {
        // this.querySalesObject.type = 0
        this.saleTabName = tab.name
        this.querySalesObject.dateType = Number(this.saleTabName)
        this.getProductSales()
      },
      tagSalesHandler (val) {
        this.tagSalesHave = val
        this.querySalesObject.type = val
        this.getProductSales()
      },
      async getTaskCompletion () {
        try {
          this.taskData = []
          this.queryTaskObject.acctId = this.currentUser.id
          let { data } = await this.apiStreamPost('/proxy/common/post', {url: 'customerManage/home/taskCompletion', params: this.queryTaskObject})
          if (data.returnCode === 0) {
            let arr = []
            for (let i = 0; i < 14; i++) {
              if (i < 4 || (i > 6 && i < 11)) {
                arr.push(Number(data.list[i].toFixed(3)))
              } else if (i == 5 || i == 11) {
                arr.push(Number(data.list[i].toFixed(2)))
              } else {
                arr.push(Number(data.list[i].toFixed(0)))
              }
            }
            this.taskData = arr
          } else {
            this.msgShow(this, data.errMsg)
          }
        } catch (e) {
          console.error(e)
          this.msgShow(this)
        }
      },
      async getProductSales () {
        try {
          this.taskSalesData = []
          this.querySalesObject.acctId = this.currentUser.id
          let { data } = await this.apiStreamPost('/proxy/common/post', {url: 'customerManage/home/productSales', params: this.querySalesObject})
          if (data.returnCode === 0) {
            let arr = []
            for (let i=0; i<30; i++) {
              if (i <=2 || (i>=15 && i<=17)) {
                arr.push(Number(data.list[i].toFixed(3)))
              } else if ((i>=3 && i <=5) || (i>=18 && i<=20)) {
                arr.push(Number(data.list[i].toFixed(2)))
              } else {
                arr.push(Number(data.list[i].toFixed(0)))
              }
            }
            this.taskSalesData = arr
            console.log(this.taskSalesData)
          } else {
            this.msgShow(this, data.errMsg)
          }
        } catch (e) {
          console.error(e)
          this.msgShow(this)
        }
      },
      async getCstmHome () {
        try {
          this.taskSalesData = []
          let { data } = await this.apiStreamPost('/proxy/common/get', {url: 'customerManage/home/' + this.currentUser.id})
          if (data.returnCode === 0) {
            this.acctName = data.list[0]
            this.cstmNum = data.list[1]
            this.salesNum = Number(data.list[2])
            this.sales = Number(data.list[3])
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
  .avatar{
    width: 120px;
    height: 120px;
    border-radius: 100%;
    overflow: hidden;
    border: 4px #fff solid;
  }
  .avatar img{
    width: 100%;
  }
  .box-header{
    border-radius: 10px;
  }
  .elTabPaneSale{
    height: 880px;
  }
  .elTabPaneTask {
    height: 600px;
  }
</style>