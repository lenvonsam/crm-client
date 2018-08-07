<template lang="pug">
  .content
    breadcrumb(:breadItems="breadItems")
    .pt-15
      button-group(:btns="btnGroups", @groupBtnClick="groupBtnClick")
    .mt-15
      search-form(:searchFormItems="searchFormItems", @search="searchForm")
    .mt-15
      .text-red.ft-15 *橙色代表快流失客户，绿色代表建议沟通客户，白色为正常客户
    .mt-5
      basic-table(:tableValue="tableValue", :currentPage="currentPage", :pageSize="pageSize", :total="totalCount", @chooseData="selectData", @pageChange="tableChange", :loading="loading", @tableRowEdit="rowEdit", @tableRowLock="rowLock", @tableRowMap = "rowMap")
    baidu-map(v-if="dialogMap", :baiduMapData= "baiduMapData", :cb="baiduMapCb")
</template>

<script>
  import breadcrumb from '@/components/Breadcrumb.vue'
  import basicTable from '@/components/BasicTable.vue'
  import searchForm from '@/components/SearchForm.vue'
  import buttonGroup from '@/components/ButtonGroup.vue'
  import { mapState } from 'vuex'
  import baiduMap from '@/components/BaiduMap.vue'
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
        breadItems: ['客户管理', '正式客户'],
        btnGroups: [{lbl: '流失记录', type: 'outflow'}],
        searchFormItems: [
          [{label: '公司名称', model: 'compName', type: 'text', placeholder: '请输入公司名称', val: ''},
            {label: '联系人姓名', model: 'name', type: 'text', placeholder: '请输入联系人姓名', val: ''},
            {label: '联系方式', model: 'phone', type: 'text', placeholder: '请输入联系方式', val: ''}],
          [{label: '转化日期', model: 'createAt', type: 'timeLimit', placeholder: '请选择转化日期', val: ''},
          {label: '业务部门', model: 'dptName', type: 'text', placeholder: '请选择业务部门', val: ''},
          {label: '业务员', model: 'acctName', type: 'text', placeholder: '请选择业务员', val: ''}]
        ],
        tableValue: {
          tableData: [],
          hasCbx: false,
          rowClassName: true,
          tableHead: [{
            lbl: '公司名称',
            prop: 'compName',
            type: 'link',
            minWidth: '340px',
            linkUrl: '/customManager/formalCustom/detail'
          }, {
            lbl: '主联系人',
            prop: 'name',
            width: '150px'
          }, {
            lbl: '联系方式',
            prop: 'phone',
            width: '150px'
          }, {
            lbl: '转化时间',
            width: '150px',
            prop: 'createAtDate2'
          }, {
            lbl: '业务部门',
            prop: 'dptName',
            width: '150px'
          }, {
            lbl: '业务员',
            prop: 'acctName',
            width: '150px'
          }, {
            lbl: '创建人',
            prop: 'createName',
            width: '100px'
          }, {
            lbl: '未开单天数',
            align: 'center',
            prop: 'billDate',
            width: '150px',
            sort: true
          }, {
            type: 'action',
            fixed: 'right',
            width: '100px',
            actionBtns: [{
              lbl: '编辑',
              type: 'edit'
            }, {
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
          mark: '2'
        },
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
    beforeMount () {
      let idx = this.btnGroups.findIndex(itm => itm.lbl === '批量导入')
      if (this.currentUser.id === 1 && idx < 0) {
        this.btnGroups.push({lbl: '批量导入', dataType: 'custm', type: 'excel'})
        this.btnGroups.push({lbl: '型云导入', dataType: 'xycustm', type: 'excel'})
        this.$forceUpdate()
      }
      this.$nextTick(() => {
      	this.queryObject = {
        	currentPage: this.currentPage - 1,
        	pageSize: this.pageSize,
        	mark: '2'
      	}
      	this.loadData()
      })
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
            if (paramsObj.createAt !== null && paramsObj.createAt !== undefined) {
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
      groupBtnClick (type) {
        if(type == 'outflow'){
          this.$router.push({path: '/customManager/formalCustom/outflowRec'})
        }
      },
      selectData (val) {
        this.chooseArray = val
      },
      tableChange (val) {
        this.loading = true
        this.currentPage = val
        this.queryObject.currentPage = this.currentPage - 1
        this.loadData()
      },
      rowEdit (obj) {
        this.jump('/customManager/formalCustom/form?type=edit&id=' + obj.id)
      },
      rowLock (obj) {
        let paramsObj = {
          cstmId: obj.id,
          status: (obj.lockStatus === 0) ? 1 : 0
        }
        if (this.updateLock(paramsObj)) {
          obj.lockStatus = (obj.lockStatus === 0) ? 1 : 0
        }
      },
      rowMap (obj) {
        // this.baiduMapData.keyWord = obj.compName
        this.baiduMapData = {
          center: {lng: 116.404, lat: 39.915},
          zoom: 6,
          location: '',
          keyWord: obj.compName
        }
        console.log(obj.compName)
        this.dialogMap = true
      },
      async loadData () {
        this.queryObject.uid = this.currentUser.id
        try {
          let { data } = await this.apiStreamPost('/proxy/common/post', {url: 'customerManage/customer', params: this.queryObject})
          if (data.returnCode === 0) {
            let arr = []
            let endDate = new Date()
            let arrList = ['id', 'compName', 'name', 'phone', 'createAt', 'billDate', 'dptName', 'acctName', 'createName', 'mark', 'orgId', 'dptId', 'acctId', 'visitCount', 'lockStatus']
            data.list.map(itm => {
              let obj = {}
              for(let i=0; i<arrList.length; i++){
                obj[arrList[i]] = itm[i]
              }
              let startDate = new Date(itm[5])
              let date = endDate.getTime() - startDate.getTime()
              let days = Math.floor(date / (24*3600*1000))
              obj.billDate = days
              obj.createAtDate2 = this.date2Str(new Date(itm[4]))
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
<style>
  .baidu-map{
    width: 100%;
    height: 550px;
  }
  .bm-serch{
  }
</style>