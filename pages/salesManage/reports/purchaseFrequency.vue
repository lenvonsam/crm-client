<template lang="pug">
.content
  breadcrumb(:breadItems="breadItems")
  search-form.mt-15(:searchFormItems="searchFormItems", @search="searchForm")
  basic-table.mt-15(:tableValue="tableValue", :currentPage="currentPage", 
  :pageSize="pageSize", :total="total", :loading="loading", 
  @tableRowEdit="areaEvalRowEdit",@tableRowSave="areaEvalRowSave", 
  @tableRowCancel="rowCancel", @tableRowDefault="rowDefault",@pageChange="tableChange")  
</template>

<script>
import breadcrumb from '@/components/Breadcrumb.vue'
import searchForm from '@/components/SearchForm.vue'
import basicTable from '@/components/BasicTable.vue'
import { mapState } from 'vuex'
export default {
  layout: 'main',
  components: {
    breadcrumb,
    searchForm,
    basicTable
  },
  data () {
    return {
      breadItems: ['销售管理', '超期客户'],
      searchFormItems: [
        [{ label: '公司名称', model: 'compName', type: 'text', placeholder: '请输入公司名称', val: '' },
        { label: '业务部门', model: 'dptName', placeholder: '请输入业务部门', val: '' }, { label: '业务员', model: 'employeeName', placeholder: '请输入业务员', val: '' }],
        [{ label: '跟踪状态', model: 'status', type: 'select', val: 0, list: [{ label: '全部', value: 0 }, { label: '未跟踪', value: 1 }, { label: '已跟踪', value: 2 }] }]
      ],
      tableValue: {
        tableData: [],
        hasCbx: false,
        rowClassName: false,
        tableHead: [{
          lbl: '公司名称',
          prop: 'compName',
          // type: 'link',
          // linkUrl: '/customManager/customerEvalution/detail',
          minWidth: '340px'
        }, {
          lbl: '业务员',
          prop: 'employeeName',
          width: '150px'
        }, {
          lbl: '业务部门',
          prop: 'dptName',
          width: '150px'
        }, {
          lbl: '电话',
          prop: 'phone',
          width: '150px'
        }, {
          lbl: '未交易天数',
          prop: 'unDealDays',
        }, {
          lbl: '平均购买周期',
          prop: 'period',
          type: 'edit',
          width: '110px',
          editType: 'text'
        }, {
          lbl: '超期天数',
          prop: 'overDays',
        }, {
          lbl: '联系反馈',
          prop: 'feedBack',
          width: '220px'
        }, {
          type: 'action',
          fixed: 'right',
          width: '100px',
          actionBtns: [{
            lbl: '编辑',
            type: 'edit'
          }]
        }]
      },
      currentPage: 0,
      total: 0,
      loading: true,
      queryObject: {}
    }
  },
  beforeMount () {
    this.queryObject = {
      currentPage: this.currentPage,
      pageSize: this.pageSize,
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
    searchForm (paramsObj) {
      console.log('clientSearchForm (paramsObj)=====>' + JSON.stringify(paramsObj))
      this.loading = true
      this.currentPage1 = 1
      this.queryObject.currentPage = this.currentPage1 - 1
      Object.keys(paramsObj).map(key => {
        if (key == 'createAt') {
          if (paramsObj.createAt !== null) {
            this.queryObject.startDate = paramsObj.createAt[0]
            this.queryObject.endDate = paramsObj.createAt[1]
          } else {
            delete this.queryObject.startDate
            delete this.queryObject.endDate
          }
        } else {
          this.queryObject[key] = paramsObj[key].trim()
        }
      })
      console.log('clientSearchForm_queryObject=====>' + JSON.stringify(this.queryObject))
      this.loadClientEvalData()
    },
    tableChange (val) {
      this.loading = true
      this.currentPage = val
      this.queryObject.currentPage = this.currentPage1 - 1
      this.loadData()
    },
    async loadData () {
      try {
        let { data } = await this.apiStreamPost('/proxy/common/post',
          { url: 'salesManage/customerPurchaseFrequency', params: this.queryObject })
        //console.log('loadClientEvalData_data.list----------' + JSON.stringify(data.list))
        this.loading = false
        if (data.returnCode === 0) {
          data.list.map(item => {
            item.mark = (item.mark === '1' ? '潜在' : (item.mark === '2' ? '正式' : '公共'))
            item.customerPropertyMark = item.customerPropertyMark === '0' ? '长期维护' : '二次开发'
            item.showUpdate = item.cstmId === 0 ? '未评估' : '已评估'
          })
          this.tableValue.tableData = data.list
          this.total = data.total
        } else {
          console.error(data.errMsg)
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
