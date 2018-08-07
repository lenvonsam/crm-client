<template lang="pug">
  .content
    breadcrumb(:breadItems="breadItems")
    .mt-15
      search-form(:searchFormItems="searchFormItems", @search="searchForm")
    .mt-5
      basic-table(:tableValue="tableValue", :loading="loading", :currentPage="currentPage", :pageSize="pageSize", :total="totalCount", @chooseData="selectData", @pageChange="tableChange", @tableRowLock="rowLock", @tableRowMap = "rowMap")
    baidu-map(v-if="dialogMap", :baiduMapData= "baiduMapData", :cb="baiduMapCb")
</template>

<script>
  import breadcrumb from '@/components/Breadcrumb.vue'
  import basicTable from '@/components/BasicTable.vue'
  import searchForm from '@/components/SearchForm.vue'
  import buttonGroup from '@/components/ButtonGroup.vue'
  import baiduMap from '@/components/BaiduMap.vue'
  import { mapState } from 'vuex'
  export default {
    layout: 'main',
    components: {
      breadcrumb,
      basicTable,
      searchForm,
      buttonGroup,
      baiduMap
    },
    data () {
      return {
        breadItems: ['客户管理', '公共客户'],
        // btnGroups: [{lbl: '添加到客户拜访', type: 'add'}],
        searchFormItems: [
          [{label: '公司名称', model: 'compName', type: 'text', placeholder: '请输入公司名称', val: ''},
            {label: '联系人姓名', model: 'name', type: 'text', placeholder: '请输入联系人姓名', val: ''},
            {label: '联系方式', model: 'phone', type: 'text', placeholder: '请输入联系方式', val: ''}],
          [{label: '流失日期', model: 'createAt', type: 'timeLimit', val: ''},
          {label: '业务部门', model: 'dptName', type: 'text', placeholder: '请选择业务部门', val: ''},
          {label: '业务员', model: 'acctName', type: 'text', placeholder: '请选择业务员', val: ''}]
        ],
        tableValue: {
          tableData: [],
          hasCbx: false,
          rowClassName: false,
          tableHead: [{
            lbl: '公司名称',
            prop: 'compName',
            type: 'link',
            minWidth: 340,
            linkUrl: '/customManager/publicCustom/detail'
          }, {
            lbl: '主联系人',
            width: 200,
            prop: 'name'
          }, {
            lbl: '联系方式',
            width: 250,
            prop: 'phone'
          }, {
            lbl: '流失时间',
            prop: 'createAt',
            width: 200,
            sort: true
          }, {
            lbl: '业务部门',
            width: 200,
            prop: 'dptName'
          }, {
            lbl: '业务员',
            width: 200,
            prop: 'acctName'
          }, {
            lbl: '未开单天数',
            width: 120,
            prop: 'billDateDays',
            sort: true
          }, {
            type: 'action',
            width: '60px',
            fixed: 'right',
            actionBtns: [{
              lbl: '地图',
              type: 'map'
            }]
          }]
        },
        currentPage: 1,
        totalCount: 0,
        queryObject: {
          currentPage: this.currentPage - 1,
          pageSize: this.pageSize,
          mark: '3'
        },
        chooseArray: [],
        // planDate: '',
        // planVisitTime: '',
        // dialogFormVisible: false,
        loading: true,
        dialogMap: false,
        baiduMapData: {
          center: {lng: 116.404, lat: 39.915},
          zoom: 6,
          location: '中国',
          keyWord: ''
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
      this.queryObject = {
        currentPage: this.currentPage - 1,
        pageSize: this.pageSize,
        mark: '3'
      }
      this.loadData()
    },
    methods: {
      baiduMapCb() {
        this.dialogMap = false
      },
      searchForm (paramsObj) {
        this.loading = true
        this.currentPage = 1
        this.queryObject.currentPage = this.currentPage - 1
        Object.keys(paramsObj).map(key => {
          if(key == 'createAt'){
            if (paramsObj.createAt !== null) {
              this.queryObject.startTime = paramsObj.createAt[0]
              this.queryObject.endTime = paramsObj.createAt[1]
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
      rowMap (obj) {
        this.baiduMapData.keyWord = obj.compName
        this.baiduMapData = {
          center: {lng: 116.404, lat: 39.915},
          zoom: 6,
          location: '',
          keyWord: obj.compName
        }
        // console.log(obj.compName)
        this.dialogMap = true
      },
      // subForm (flg) {
      //   if(flg == 'ok'){
      //     let toDay = new Date()
      //     if(typeof(this.planDate) == 'string' || this.planDate == null){
      //       this.msgShow(this, '请选择计划完成日期', 'warning')
      //       return
      //     }
      //     if(typeof(this.planVisitTime) == 'string' || this.planVisitTime == null){
      //       this.msgShow(this, '请选择计划开单日期', 'warning')
      //       return
      //     }
      //     if(this.planVisitTime < toDay){
      //       this.msgShow(this, '拜访时间不能小于当前时间', 'warning')
      //       return
      //     }
      //     if(this.planDate < this.planVisitTime){
      //       this.msgShow(this, '开单日期不能小于拜访日期', 'warning')
      //       return
      //     }
      //     let arr = []
      //     this.chooseArray.map(item => {
      //       arr.push(item.id)
      //     })
      //     let ids = arr.join(',')
      //     let paramsObj = {
      //       cstmIds: ids,
      //       uid: this.currentUser.id,
      //       planDate: this.date2Str(this.planDate),
      //       planVisitTime: this.datetime2Str(this.planVisitTime)
      //     }
      //     this.cstmCallCreate(paramsObj)
      //   }
      //   this.dialogFormVisible = false
      // },
      // groupBtnClick (type) {
      //   if(type == 'add'){
      //     if (this.chooseArray.length === 0) {
      //       this.msgShow(this, '请选择需要操作的数据', 'warning')
      //       return
      //     }
      //     this.dialogFormVisible = true
      //   }
      // },
      selectData (val) {
        this.chooseArray = val
      },
      tableChange (val) {
        this.loading = true
        this.currentPage = val
        this.queryObject.currentPage = this.currentPage - 1
        this.loadData()
      },
      rowLock (obj) {
        console.log(obj)
        console.log(obj.lockStatus)
        let paramsObj = {
          cstmId: obj.id,
          status: (obj.lockStatus === 0) ? 1 : 0
        }
        if (this.updateLock(paramsObj)) {
          obj.lockStatus = (obj.lockStatus === 0) ? 1 : 0
        }
      },
      async loadData () {
        this.queryObject.uid = this.currentUser.id
        try {
          let { data } = await this.apiStreamPost('/proxy/common/post', {url: 'customerManage/customer', params: this.queryObject})
          if (data.returnCode === 0) {
            let arr = []
            let endDate = new Date()
            let arrList = ['id', 'compName', 'name', 'phone', 'createAt', 'billDate', 'dptName', 'acctName', 'createName', 'mark', 'orgId', 'dptId', 'acctId', 'visitCount', 'rownum']
            data.list.map(itm => {
              let obj = {}
              for(let i=0; i<arrList.length; i++){
                obj[arrList[i]] = itm[i]
              }
              let startDate = new Date(itm[5])
              let date = endDate.getTime() - startDate.getTime()
              let days = Math.floor(date/(24*3600*1000))
              obj.billDateDays = days
              arr.push(obj)
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
      // async cstmCallCreate (paramsObj) {
      //   try{
      //     let { data } = await this.apiStreamPost('/proxy/common/post', {url: 'customerManage/cstmCall/batchCreate', params: paramsObj})
      //     if (data.returnCode === 0) {
      //       this.msgShow(this, '添加成功', 'success')
      //       this.loadData()
      //     } else {
      //       this.msgShow(this, data.errMsg)
      //     }
      //   } catch (e) {
      //     console.error(e)
      //     this.msgShow(this)
      //   }
      // },
      async updateLock (params) {
        try {
          let { data } = await this.apiStreamPost('/proxy/common/post', {url: 'customerManage/customer/updateLock', params: params})
          if (data.returnCode === 0) {
            return true
          } else {
            this.msgShow(this, data.errMsg)
          }
        } catch (e) {
          console.error(e)
          this.msgShow(this)
          this.loading = false
        }
      }
    }
  }
</script>