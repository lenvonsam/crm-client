<template lang = "pug">
.content
  breadcrumb(:breadItems="breadItems")
  .mt-15
    el-button(size="small", @click="back()") 返回列表
  .mt-15
    search-form(:searchFormItems="searchFormItems", @search="searchForm")
  .mt-15
    basic-table(:tableValue="tableValue", :loading="loading", :currentPage="currentPage", :pageSize="pageSize", :total="totalCount", @pageChange="tableChange")
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
      breadItems: ['客户管理', '客户合并', '合并记录'],
      btnGroups: [{lbl: '返回'}],
      tableValue: {
          tableData: [],
          hasCbx: false,
          tableHead: [{
            lbl: '操作ID',
            prop: 'id',
            width: 100
          }, {
            lbl: '原单位ERP编号',
            prop: 'oldCustErpCode',
            width: 120
          }, {
            lbl: '原单位电商编号',
            prop: 'oldCustEbusiCode',
            width: 120
          }, {
            lbl: '原单位名称',
            prop: 'oldCustName',
            width: 250
          }, {
            lbl: '合并单位crm编号',
            prop: 'newCustId',
            width: 150
          }, {
            lbl: '合并单位ERP编号',
            prop: 'newCustErpCode',
            width: 150
          }, {
            lbl: '合并单位电商编号',
            prop: 'newCustEbusiCode',
            width: 150
          }, {
            lbl: '合并单位名称',
            width: 245,
            prop: 'newCustName'
          }, {
            lbl: '操作员名称',
            width: 160,
            type: 'object',
            prop: 'operator',
            factValue: (row) => {
              return row.name
            }
          }, {
            lbl: '操作时间',
            width: 160,
            prop: 'createAt'
          }, {
            lbl: '操作结果',
            width: 80,
            prop: 'status',
            type: 'object',
            factValue: (row) => {              
              return (row == 0) ? '成功' : '失败'
            }
          }]
        },
      searchFormItems: [
        [{label: '原客户名', model: 'oldCustName', type: 'text', placeholder: '请输入原客户名', val: ''},
          {label: '合并客户名', model: 'newCustName', type: 'text', placeholder: '请输入合并客户名', val: ''}]
      ],
      currentPage: 1,
      totalCount: 0,
      queryObject: {
        currentPage: this.currentPage - 1,
        pageSize: this.pageSize        
      },
      loading: true
    }
  },
  computed: {
    ...mapState({
      pageSize: state => state.pageSize
    })
  },
  mounted () {
    this.queryObject = {
      currentPage: this.currentPage - 1,
      pageSize: this.pageSize
    }
    this.loadData()
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
    tableChange (val) {
      this.loading = true
      this.currentPage = val
      this.queryObject.currentPage = this.currentPage - 1
      this.loadData()
    },
    async loadData () {
      try {
        let { data } = await this.apiStreamPost('/proxy/common/post', {url: 'customerManage/combineRecord', params: this.queryObject})
          if (data.returnCode === 0) {
            // let arr = []
            this.tableValue.tableData = data.list
            console.log(this.tableValue.tableData)
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
    }
  }
}
</script>