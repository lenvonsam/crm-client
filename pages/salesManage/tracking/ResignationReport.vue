<template lang="pug">
  .content
    //- breadcrumb(:breadItems="breadItems")
    .mt-15
      search-form(:searchFormItems="searchFormItems", @search="searchForm")
    .pt-15
      basic-table(:tableValue="tableValue", :currentPage="currentPage", :loading="loading", :pageSize="pageSize", :total="totalCount", @chooseData="selectData", @pageChange="tableChange", @sort="sortHandler")
</template>

<script>
  import breadcrumb from '@/components/Breadcrumb.vue'
  import basicTable from '@/components/BasicTable.vue'
  import searchForm from '@/components/SearchForm.vue'
  // import buttonGroup from '@/components/ButtonGroup.vue'
  import { mapState } from 'vuex'
  export default {
    layout: 'main',
    components: {
      breadcrumb,
      basicTable,
      searchForm
    },
    data() {
      return {
        breadItems: ['销售管理', '交易跟踪'],
        currentPage: 1,
        totalCount: 0,
        queryObject: {
          currentPage: this.currentPage - 1,
          pageSize: this.pageSize,
          sort: '0'
        },
        tableValue: {
          tableData: [],
          hasCbx: false,
          rowClassName: false,
          summary: true,
          tableHead: [{
            lbl: '公司名称',
            prop: 'compName',
            type: 'linkRow',
            linkUrl: '/salesManage/tracking/ResignationDetailReport'
          }, {
            lbl: '业务部门',
            prop: 'dptName'
          }, {
            lbl: '业务员',
            prop: 'acctName'
          }, {
            lbl: '实提销量（吨）',
            prop: 'dataBweight',
            sort: 'dataBweight',
            summary: true
          }, {
            lbl: '高卖量（元）',
            prop: 'gm',
            sort: 'gm',
            summary: true
          }]
        },
        searchFormItems: [
          [{label: '公司名称', model: 'compName', type: 'text', placeholder: '请输入公司名称', val: ''},
            {label: '业务部门', model: 'dptName', placeholder: '请输入业务部门', val: ''},
          	{label: '业务员', model: 'acctName', placeholder: '请输入业务员', val: ''}]          
        ],
        reason: '',
        rowDelObj: {},
        chooseArray: [],
        loading: true
      }
    },
    mounted () {
      this.queryObject = {
        currentPage: this.currentPage - 1,
        pageSize: this.pageSize,
        sort: '0',
        uid: this.currentUser.id
      }      
      this.loadData()
    },
    computed: {
      ...mapState({
        pageSize: state => state.pageSize,
        currentUser: state => state.user.currentUser
      })
    },
    methods: {
      async loadData () {
        this.queryObject.uid = this.currentUser.id
        try {
          let { data } = await this.apiStreamPost('/proxy/common/post', {url: 'salesManage/tracking/demissionStatistic', params: this.queryObject})
          if (data.returnCode === 0) {
            let keyArr=['compName', 'acctName', 'dptName', 'dataBweight', 'gm']
            let arr = []
            data.list.map((item) => {
              let obj = {}
              for(let i=0; i< keyArr.length; i++){
                obj[keyArr[i]] = item[i]
              }
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
      tableChange (val) {
        this.loading = true
        this.currentPage = val
        this.queryObject.currentPage = this.currentPage - 1
        this.loadData()
      },
      sortHandler (obj) {
        if (obj.property =='dataBweight' || obj.property =='gm') {
          this.loading = true
          let dataBweightAsc = (obj.order =='ascending' && obj.property =='dataBweight')
          let dataBweightDesc = (obj.order =='descending' && obj.property =='dataBweight')
          let gmAsc = (obj.order =='ascending' && obj.property =='gm')
          let gmDesc = (obj.order =='descending' && obj.property =='gm')
          this.queryObject.sort = (dataBweightAsc) ? '1' : (dataBweightDesc) ? '0' : (gmAsc) ? '3' : (gmDesc)? '2' : '0'
          this.currentPage = 1
          this.queryObject.currentPage = this.currentPage - 1
          this.loadData()
        }
      }
    }
  }
</script>
<style lang="styl", scoped>
  .width-input-250
    width: 250px
</style>