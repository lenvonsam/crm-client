<template lang="pug">
  .content
    breadcrumb(:breadItems="breadItems")
    .mt-15
      search-form(:searchFormItems="searchFormItems", @search="searchForm")
    .mt-15
      .text-red.ft-15 *橙色代表快流失客户，绿色代表建议沟通客户，白色为正常客户
    .mt-5
      basic-table(:tableValue="tableValue", :currentPage="currentPage", :pageSize="pageSize", :total="totalCount", @chooseData="selectData", @pageChange="tableChange", :loading="loading", @tableRowEdit="rowEdit", @sort="sortHandler")
</template>

<script>
  import breadcrumb from '@/components/Breadcrumb.vue'
  import basicTable from '@/components/BasicTable.vue'
  import searchForm from '@/components/SearchForm.vue'
  import buttonGroup from '@/components/ButtonGroup.vue'
  import { mapState } from 'vuex'
  export default {
    layout: 'main',
    components: {
      breadcrumb,
      basicTable,
      searchForm,
      buttonGroup
    },
    data () {
      return {
        breadItems: ['客户管理', '客户画像'],
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
            linkUrl: '/customManager/customerPortrait/detail'
          }, {
            lbl: '主联系人',
            width: 200,
            prop: 'linkName'
          }, {
            lbl: '联系方式',
            width: 250,
            prop: 'linkPhone'
          }, {
            lbl: '转化时间',
            width: 200,
            prop: 'createAtDate2',
            sort: 'custom'
          }, {
            lbl: '业务部门',
            width: 200,
            prop: 'dptName'
          }, {
            lbl: '业务员',
            width: 150,
            prop: 'acctName'
          }, {
            lbl: '创建人',
            width: 160,
            prop: 'creatorName'
          }, {
            lbl: '未开单天数',
            width: 160,
            align: 'center',
            prop: 'billDateDays',
            sort: 'custom'
          }]
        },
        currentPage: 1,
        totalCount: 0,
        queryObject: {
          currentPage: this.currentPage - 1,
          pageSize: this.pageSize,
          orderType: '0',
          mark: '2'
        },
        loading: true
      }
    },
    computed: {
      ...mapState({
        pageSize: state => state.pageSize,
        currentUser: state => state.user.currentUser,
        cstmArr: state => state.cstmArr
      })
    },
    beforeMount () {
      this.$nextTick(() => {
        this.queryObject = {
          currentPage: this.currentPage - 1,
          pageSize: this.pageSize,
          orderType: '0',
          mark: '2'
        }
        this.loadData()
      })
    },
    methods: {
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
      async loadData () {
        this.queryObject.uid = this.currentUser.id
        try {
          let { data } = await this.apiStreamPost('/proxy/common/post', {url: 'customerManage/customer', params: this.queryObject})
          if (data.returnCode === 0) {
            let arr = []
            // let endDate = new Date()
            let endDate = new Date(this.date2Str(new Date()) + ' 00:00:00')
            let arrList = this.cstmArr
            data.list.map(itm => {
              let obj = {}
              for(let i=0; i<arrList.length; i++){
                obj[arrList[i]] = itm[i]
              }
              // let startDate = new Date(itm[5])
              let startDate = new Date(this.date2Str(new Date(itm[5])) + ' 23:59:59')
              let date = endDate.getTime() - startDate.getTime()
              let days = Math.floor(date/(24*3600*1000))
              console.log('客户画像--' + days)
              obj.billDateDays = days
              obj.createAtDate2 = this.datetime2Str(new Date(itm[17]))
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
      sortHandler (obj) {
        if (obj.property =='createAtDate2' || obj.property =='billDateDays') {
          this.loading = true
          let dateAsc = (obj.order =='ascending' && obj.property =='createAtDate2')
          let dateDesc = (obj.order =='descending' && obj.property =='createAtDate2')
          let billDateDaysAsc = (obj.order =='ascending' && obj.property =='billDateDays')
          let billDateDaysDesc = (obj.order =='descending' && obj.property =='billDateDays')
          this.queryObject.orderType = (dateAsc) ? '1' : (dateDesc) ? '2' : (billDateDaysAsc) ? '3' : (billDateDaysDesc)? '4' : '0'
          this.currentPage = 1
          this.queryObject.currentPage = this.currentPage - 1
          this.loadData()
        }
      }
    }
  }
</script>