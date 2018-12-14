<template lang="pug">
  .content
    breadcrumb(:breadItems="breadItems")
    .mt-15
      search-form(:searchFormItems="searchFormItems", @search="searchForm")
    .pt-15
      basic-table(:tableValue="tableValue", :currentPage="currentPage", :loading="loading", :pageSize="pageSize", :total="totalCount", @chooseData="selectData", @pageChange="tableChange", @tableRowEdit="rowEdit", @tableRowMap = "rowMap", @tableRowConversion="rowConversion")
</template>

<script>
  import breadcrumb from '@/components/Breadcrumb.vue'
  import basicTable from '@/components/BasicTable.vue'
  import searchForm from '@/components/SearchForm.vue'
  // import buttonGroup from '@/components/ButtonGroup.vue'
  import { mapState } from 'vuex'
  import baiduMap from '@/components/BaiduMap.vue'
  export default {
    layout: 'main',
    components: {
      breadcrumb,
      basicTable,
      searchForm,
      baiduMap
    },
    data() {
      return {
        breadItems: ['销售管理', '销售报表'],
        currentPage: 1,
        totalCount: 0,
        queryObject: {
          currentPage: this.currentPage - 1,
          pageSize: this.pageSize,
          orderType: '0',
          mark: '1'
        },
        tableValue: {
          tableData: [],
          hasCbx: false,
          rowClassName: false,
          tableHead: [{
            lbl: '品名',
            prop: 'compName',            
            width: 150
          }, {
            lbl: '材质',
            prop: 'linkName',
            width: '200px'
          }, {
            lbl: '规格',
            prop: 'linkPhone',
            width: '120px'
          }, {
            lbl: '长度',
            prop: 'createAt',
            width: '200px'
          }, {
            lbl: '产地',
            prop: 'dptName',
            width: '150px'
          }, {
            lbl: '公差范围',
            prop: 'acctName',
            width: '150px'
          }, {
            lbl: '重量范围',
            prop: 'creatorName',
            width: '100px'
          }, {
            lbl: '曾购客户',
            prop: 'creatorName',
            width: '120px',
            sort: ''
          }, {
            lbl: '可卖库存量(吨)',
            prop: 'creatorName',
            width: '100px'
          }]
        },
        searchFormItems: [
          [{label: '品名', model: 'compName', type: 'text', placeholder: '请输入公司名称', val: ''},
            {label: '材质', model: 'name', type: 'text', placeholder: '请输入联系人姓名', val: ''},
            {label: '规格', model: 'phone', type: 'text', placeholder: '请输入联系方式', val: ''}],
          [{label: '长度', model: 'createAt', type: 'timeLimit', val: ''},
          {label: '公差范围', model: 'dptName', placeholder: '请输入业务部门', val: ''},
          {label: '重量范围', model: 'acctName', placeholder: '请输入业务员', val: ''}]
        ],
        reason: '',
        // dialogFormVisible: false,
        rowDelObj: {},
        chooseArray: [],
        loading: true,
        dialogMap: false,
        baiduMapData: {
          center: {lng: 116.404, lat: 39.915},
          zoom: 6,
          location: '中国',
          keyWord: ''
        },
        dialogShow: false,
        rowObj: {}
      }
    },
    mounted () {
      this.queryObject = {
        currentPage: this.currentPage - 1,
        pageSize: this.pageSize,
        orderType: '0',
        mark: '1'
      }
      this.loadData()
    },
    computed: {
      ...mapState({
        pageSize: state => state.pageSize,
        currentUser: state => state.user.currentUser,
        cstmArr: state => state.cstmArr
      })
    },
    methods: {
      baiduMapCb() {
        this.dialogMap = false
      },
      rowMap (obj) {
        this.baiduMapData.keyWord = obj.compName
        this.baiduMapData = {
          center: {lng: 116.404, lat: 39.915},
          zoom: 6,
          location: '',
          keyWord: obj.compName
        }
        this.dialogMap = true
      },
      async loadData () {
        this.queryObject.uid = this.currentUser.id
        try {
          let { data } = await this.apiStreamPost('/proxy/common/post', {url: 'customerManage/customer', params: this.queryObject})
          if (data.returnCode === 0) {
            this.tableValue.tableData = this.cstmListData(data.list, this.cstmArr)
            this.totalCount = data.total
            this.loading = false
          } else {
            this.msgShow(this, data.errMsg)
          }
        } catch (e) {
          console.error(e)
          this.msgShow(this)
          this.loading = false
        }
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
      selectData (val) {
        console.log(val)
        this.chooseArray = val
      },
      groupBtnClick (type) {
        if(type == 'add'){
          this.$router.push({path: '/customManager/potentialCustom/form?type=new'})
        }
        if(type == 'conversionRec'){
          this.$router.push({path: '/customManager/potentialCustom/conversionRec'})
        }
      },
      tableChange (val) {
        this.loading = true
        this.currentPage = val
        this.queryObject.currentPage = this.currentPage - 1
        console.log(this.queryObject.orderType)
        this.loadData()
      },
      rowConversion (obj) {
        this.confirmDialog(this, '您确认要转换为正式客户吗？').then(() => {
          let arr = []
          let paramsObj = {
            cstmId: obj.id,
            uid: this.currentUser.id,
            orderType: 0
          }
          this.customerTransform(paramsObj)
        }, () => {
          console.log('cancel')
        })
        // this.rowObj = obj
        // this.dialogShow = true
      },
      conversionSure () {
        let paramsObj = {
          cstmId: this.rowObj.id,
          uid: this.currentUser.id,
          orderType: 0
        }
        this.customerTransform(paramsObj)
      },
      async actionDelete () {
        try {
          let url = 'customerManage/customerDel/'
          let params = {
            id: this.rowDelObj.id,
            reason: this.reason,
            currentPage: this.currentPage - 1,
            pageSize: this.pageSize,
            uid: this.currentUser.id
          }
          let { data } = await this.apiStreamPost('/proxy/common/post', {url: url, params: params})
          if (data.returnCode === 0) {
            this.currentPage = 1
            this.queryObject.currentPage = this.currentPage - 1
            this.loadData()
            this.reason = ''
            this.msgShow(this, '删除成功', 'success')
          } else {
            this.msgShow(this, data.errMsg)
          }
        } catch (e) {
          console.error(e)
          this.msgShow(this)
        }
      },
      async customerTransform (paramsObj) {
        try{
          let { data } = await this.apiStreamPost('/proxy/common/post', {url: 'customerManage/customerTransform', params: paramsObj})
          if (data.returnCode === 0) {
            this.msgShow(this, '转换成功', 'success')
            this.dialogShow = false
            this.loadData()
          } else {
            this.msgShow(this, data.errMsg)
          }
        } catch (e) {
          console.error(e)
          this.msgShow(this)
        }
      },
      rowEdit (obj) {
        this.jump('/customManager/potentialCustom/form?type=edit&id=' + obj.id)
      }
    }
  }
</script>
<style lang="styl", scoped>
  .width-input-250
    width: 250px
</style>