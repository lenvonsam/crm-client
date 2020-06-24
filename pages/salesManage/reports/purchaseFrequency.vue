<template lang="pug">
.content
  breadcrumb(:breadItems="breadItems")
  search-form.mt-15(:searchFormItems="searchFormItems", @search="searchForm")
  basic-table.mt-15(:tableValue.sync="tableValue",
  :currentPage="currentPage",
  rowEdit,
  :pageSize="pageSize",
  :total="total",
  :loading="loading",
  @tableRowSave="rowSave",
  @pageChange="tableChange")  
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
        [
          { label: '公司名称', model: 'compName', type: 'text', placeholder: '请输入公司名称', val: '' },
          { label: '业务部门', model: 'dptName', type: 'selectDept', placeholder: '请输入业务部门', val: '' },
          { label: '业务员', model: 'employeeName', placeholder: '请输入业务员', val: '', type: 'selectRemote', list: [], url: 'setting/acct/queryCombo', queryKey: 'acctName', selectValue: 'name', init: true }
        ], [
          { label: '跟踪状态', model: 'status', type: 'select', val: 0, list: [{ label: '全部', value: 0 }, { label: '未跟踪', value: 1 }, { label: '已跟踪', value: 2 }] },
          { label: '起始日期', model: 'startDate', val: '', type: 'date' }, { label: '结束日期', model: 'endDate', val: '', type: 'date' }
        ]
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
          width: '120px'
        }, {
          lbl: '未交易天数',
          prop: 'unDealDays',
          width: '100px'
        }, {
          lbl: '平均购买周期',
          prop: 'period',
          width: '110px',
        }, {
          lbl: '超期天数',
          prop: 'overDays',
        }, {
          lbl: '联系反馈',
          prop: 'feedBack',
          width: '220px',
          type: 'edit',
          editType: 'text'
        }, {
          lbl: '反馈时间',
          prop: 'updateAt',
          width: '200px'
        }]
      },
      currentPage: 1,
      total: 0,
      loading: true,
      queryObject: {}
    }
  },
  beforeMount () {
    this.$nextTick(function () {
      this.queryObject = {
        currentPage: this.currentPage - 1,
        pageSize: this.pageSize,
        uid: this.currentUser.id
      }
      if (this.currentUser.dataLevel === '业务员' || this.currentUser.id === 1) {
        this.tableValue.tableHead.push({
          type: 'action',
          fixed: 'right',
          width: '100px',
          actionBtns: [{
            lbl: '编辑',
            type: 'edit'
          }]
        })
      }
      this.loadData()
    })
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
      this.currentPage = 1
      this.queryObject = {
        currentPage: this.currentPage - 1,
        pageSize: this.pageSize,
        uid: this.currentUser.id
      }
      Object.keys(paramsObj).map(key => {
        if (paramsObj[key] && paramsObj[key].toString().trim().length > 0)
          this.queryObject[key] = paramsObj[key]
      })
      console.log('clientSearchForm_queryObject=====>' + JSON.stringify(this.queryObject))
      this.loadData()
    },
    tableChange (val) {
      this.loading = true
      this.currentPage = val
      this.queryObject.currentPage = this.currentPage - 1
      this.loadData()
    },
    async loadData () {
      try {
        console.log('this.queryObject:>>', this.queryObject)
        let { data } = await this.apiStreamPost('/proxy/common/post',
          { url: 'salesManage/customerPurchaseFrequency', params: this.queryObject })
        //console.log('loadClientEvalData_data.list----------' + JSON.stringify(data.list))
        this.loading = false
        if (data.returnCode === 0) {
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
    },
    async savePurchaseFrequency (params) {
      this.currentPage = 1
      this.queryObject.currentPage = this.currentPage - 1
      try {
        const { data } = await this.apiStreamPost('/proxy/common/post',
          { url: 'salesManage/customerPurchaseFrequency/save', params: params })
        this.loading = false
        if (data.returnCode === 0) {
          this.msgShow(this, '保存成功', 'success')
        } else {
          console.error(data.errMsg)
          this.msgShow(this, data.errMsg)
        }
        this.loadData()
      } catch (e) {
        this.loading = false
        this.msgShow(this, e.message || '网络异常')
        this.loadData()
      }
    },
    rowSave (row) {
      console.log('row save:>>', row)
      delete row.id
      delete row.updateAt
      row.uid = this.currentUser.id
      this.savePurchaseFrequency(row)
    }
  }

}
</script>
