<template lang="pug">
div
  .mt-15
     search-form(:searchFormItems="searchFormItems", @search="searchForm")
  .mt-15
    basic-table(:tableValue="tableValue", :loading='loading', :currentPage="currentPage", :pageSize="pageSize", :total="totalCount", @chooseData="selectData", @pageChange="tableChange")
</template>

<script>
import basicTable from '@/components/BasicTable.vue'
import searchForm from '@/components/SearchForm.vue'
import { mapState } from 'vuex'
export default{
  components: {
    basicTable,
    searchForm
  },
  data () {
    return {
      searchFormItems: [
        [{label: '修改日期', model: 'updateAt', type: 'timeLimit', placeholder: '请输入公司名称', val: ''},
          {label: '操作员', model: 'acctName', type: 'text', placeholder: '请输入操作员', val: ''},
          {label: '字段名称', model: 'columnName', type: 'text', placeholder: '请输入字段名称', val: ''}]
      ],
      tableValue: {
        tableHead: [
          {lbl: '修改时间', prop: 'updateAt', type: 'text'},          
          {lbl: '操作员', prop: 'creator', type: 'object', factValue: (row) => { return row.name}},
          {lbl: '字段名称', prop: 'columnName', type: 'text'},
          {lbl: '原值', prop: 'originVal', type: 'text'},
          {lbl: '修改值', prop: 'modifyVal', type: 'text'},
          {lbl: '备注', prop: 'remark', type: 'text'}],
        hasCbx: false,
        edit: true,
        page: true,
        tableData: []
      },
      snapData: [],
      currentPage: 1,
      totalCount: 0,
      queryObject: {
        currentPage: this.currentPage - 1,
        pageSize: this.pageSize,
        cstmId: this.$route.query.id
      },
      chooseArray: [],
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
      pageSize: this.pageSize,
      cstmId: this.$route.query.id
    }
    this.loadData()
  },
  methods: {
    searchForm (paramsObj) {
      this.loading = true
      this.currentPage = 1
      this.queryObject.currentPage = this.currentPage - 1
      Object.keys(paramsObj).map(key => {
        if(key == 'updateAt'){
          if (paramsObj.updateAt !== null) {
            this.queryObject.startTime = paramsObj.updateAt[0]
            this.queryObject.endTime = paramsObj.updateAt[1]
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
      this.chooseArray = val
    },
    tableChange (val) {
      this.loading = true
      this.currentPage = val
      this.queryObject.currentPage = this.currentPage - 1
      this.loadData()
    },
    async loadData () {
      try {
        let { data } = await this.apiStreamPost('/proxy/common/post', {url: 'customerManage/cstmModify', params: this.queryObject})
          if (data.returnCode === 0) {
            this.tableValue.tableData = data.list
            // this.totalCount = data.total
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
