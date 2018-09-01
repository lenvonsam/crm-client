<template lang="pug">
.content
  button-group(:btns="btnGroups", @groupBtnClick="groupBtnClick")
  .mt-15
    search-form(:searchFormItems="searchFormItems", @search="searchForm")
  .mt-15
    basic-table(:tableValue="tableValue", :loading="loading", :currentPage="currentPage", :pageSize="pageSize", :total="totalCount", @pageChange="tableChange", @tableRowMapVisit="RowMap")
  el-dialog(title="统计结果", :visible.sync="dialogTableVisible", width="500px", center)
    .barChartBox
      el-tag.ft-13.text-left 成功率：{{successRate}}%
      .mt-15
        bar-chart(:data="barVal.barData", :options="barVal.barOptions")
    .mt-10.text-center
      el-button(type="primary", size="small", @click="onSubmit('ok')") 确认
  el-dialog(title="地图", :visible.sync="dialogMap", width="900", @close="baiduMapCb")
    baidu-map.baidu-map(:ak="bdMapAk", :center="baiduMapData.center", :zoom="baiduMapData.zoom", :scroll-wheel-zoom="true")
      bm-marker.baidu-map(:position="baiduMapData.center", :dragging="true", animation="BMAP_ANIMATION_BOUNCE")
</template>
<script>
import buttonGroup from '@/components/ButtonGroup.vue'
import searchForm from '@/components/SearchForm.vue'
import basicTable from '@/components/BasicTable.vue'
import barChart from '@/components/BarChart.js'
import baiduMap from 'vue-baidu-map/components/map/Map.vue'
import bmMarker from 'vue-baidu-map/components/overlays/Marker.vue'
import { mapState } from 'vuex'
export default {
  components: {
    basicTable,
    searchForm,
    buttonGroup,
    barChart,
    baiduMap,
    bmMarker
  },
  data () {
    return {
      btnGroups: [{lbl: '生成统计结果', type: 'statistics'}],
      searchFormItems: [[{label: '公司名称', model: 'compName', type: 'text', placeholder: '请输入公司名称', val: ''},
          {label: '拜访结果', model: 'callResult', type: 'select', val: '', list: [{value: '', label: '全部'}, {value: '1', label: '拜访成功'}, {value: '2', label: '拜访失败'}]},
          {label: '计划拜访日期', model:'planAt', type: 'timeLimit', val: ''}]],
      tableValue: {
        tableData: [],
        hasCbx: false,
        rowClassName: false,
        edit: true,
        tableHead: [{
          lbl: '公司名称',
          prop: 'customer',
          type: 'linkObject',
          minWidth: '340px',
          linkUrl: '/customManager/publicCustom/detail',
          factValue(row){
            let arr = {
              id: row.id,
              name: row.compName
            }
            return arr
          }
        }, {
          lbl: '主联系人',
          prop: 'link',
          width: '200px',
          type: 'object',
          factValue(row){
            return row.name
          }
        }, {
          lbl: '联系方式',
          prop: 'link',
          type: 'object',
          width: '250px',
          factValue(row){
            return row.phone
          }
        }, {
          lbl: '流失日期',
          prop: 'customer',
          width: '160px',
          type: 'object',
          factValue (row) {
            return row.convertDate
          }
        }, {
          lbl: '添加人',
          prop: 'creator',
          type: 'object',
          width: '200px',
          factValue (row) {
            return row.name
          }
        }, {
          lbl: '添加时间',
          width: '120px',
          prop: 'createAtDate2'
        }, {
          lbl: '计划拜访时间',
          width: '130px',
          prop: 'planVisitTimeDate2'
        }, {
          lbl: '结果',
          width: '110px',
          prop: 'status',
          type: 'object',
          factValue(row){
            return (row==0) ? '未拜访' : (row==1) ? '拜访成功' : '拜访失败'
          }
        }, {
          type: 'action',
          width: '60',
          fixed: 'right',
          actionBtns: [{
            lbl: '地图',
            type: 'mapVisit'
          }]
        }]
      },
      currentPage: 1,
      totalCount: 0,
      queryObject: {
        currentPage: this.currentPage - 1,
        pageSize: this.pageSize,
        mark: '0'
      },
      dialogTableVisible: false,
      barVal: {
        barData: {
          labels: ["计划拜访", "拜访成功", "拜访失败"],
          datasets: [{
            data: [],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)'
            ],
          }]
        },
        barOptions: {
          responsive: false,
          maintaionAspectRatio: false,
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero:true
              }
            }]
          },
          legend: {
            fullWidth: true,
            display: false
          }
        }
      },
      successRate: '',
      loading: true,
      dialogMap: false,
      baiduMapData: {
        zoom: 12,
        center: {lng: 31.47, lat: 119.58}
      }
    }
  },
  computed: {
    ...mapState({
      pageSize: state => state.pageSize,
      currentUser: state => state.user.currentUser,
      bdMapAk: state => state.bdMapAk
    })
  },
  mounted () {
    this.queryObject = {
      currentPage: this.currentPage - 1,
      pageSize: this.pageSize,
      mark: '0'
    }
    this.loadData()
  },
  methods: {
    baiduMapCb() {
      this.dialogMap = false
    },
    RowMap() {
      this.baiduMapData = {
        zoom: 20,
        center: {lng: 119.9995 , lat: 31.8177}
      }
      this.dialogMap = true
    },
    searchForm (paramsObj) {
      this.loading = true
      this.currentPage = 1
      this.queryObject.currentPage = this.currentPage - 1
      Object.keys(paramsObj).map(key => {
        if(key == 'planAt'){
          if (paramsObj.planAt !== null && paramsObj.planAt !== undefined) {
            this.queryObject.startTime = paramsObj.planAt[0]
            this.queryObject.endTime = paramsObj.planAt[1]
          } else {
            delete this.queryObject.startTime
            delete this.queryObject.endTime
          }
        } else if (paramsObj[key].length > 0) {
          this.queryObject[key] = paramsObj[key].trim()
        } else {
          delete this.queryObject[key]
        }
      })
      this.loadData()
    },
    groupBtnClick () {
      this.cstmCallBarChart()
    },
    onSubmit (flg) {
      this.dialogTableVisible = false
    },
    tableChange (val) {
      this.loading = true
      this.currentPage = val
      this.queryObject.currentPage = this.currentPage - 1
      this.loadData()
    },
    async loadData () {
      this.queryObject.uid = this.currentUser.id
      try {
        let { data } = await this.apiStreamPost('/proxy/common/post', {url: 'customerManage/cstmCall', params: this.queryObject})
        if (data.returnCode === 0) {
          let arr = []
          data.list.map(itm => {
            itm[0].createAtDate2 = this.date2Str(new Date(itm[0].createAt))
            itm[0].planVisitTimeDate2 = this.date2Str(new Date(itm[0].planVisitTime))
            itm[0].customer.convertDate = this.datetime2Str(new Date(itm[0].customer.convertDate))
            itm[0].link = itm[1]
            arr.push(itm[0])
          })
          this.tableValue.tableData = arr
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
    async cstmCallBarChart (id) {
      try {
        let { data } = await this.apiStreamPost('/proxy/common/get', {url: 'customerManage/cstmCall/' + this.currentUser.id})
        if (data.returnCode === 0) {
          this.barVal.barData.datasets[0].data = data.list[0]
          this.successRate = (data.list[0][1] / data.list[0][0] * 100).toFixed(3)
          this.dialogTableVisible = true
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
  .barChartBox{
    width:400px; 
    margin: 0 auto;
  }
  .baidu-map{
    width: 100%;
    height: 550px;
  }
</style>