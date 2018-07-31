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
      breadItems: ['客户管理', '正式客户', '流失记录'],
      btnGroups: [{lbl: '返回'}],
      tableValue: {
          tableData: [],
          hasCbx: false,
          tableHead: [{
            lbl: '公司名称',
            linkUrl: '/customManager/potentialCustom/detail',
            prop: 'fkCustom',
            type: 'linkObject',
            factValue: (row) => {
              let arr = {
                name: row.compName,
                id: row.id
              }
              return arr
            }
          }, {
            lbl: '主联系人',
            prop: 'link',
            type: 'object',
            factValue: (row) => {
              return row.name
            }
          }, {
            lbl: '联系方式',
            prop: 'link',
            type: 'object',
            factValue: (row) => {
              return row.phone
            }
          }, {
            lbl: '添加日期',
            prop: 'fkCustom',
            type: 'object',
            factValue: (row) => {
              return row.createAt
            }
          }, {
            lbl: '业务部门',
            prop: 'fkCustom',
            type: 'object',
            factValue: (row) => {
              return row.fkDpt.name
            }
          }, {
            lbl: '业务员',
            prop: 'fkCustom',
            type: 'object',
            factValue: (row) => {
              return row.fkAcct.name
            }
          }, {
            lbl: '创建人',
            prop: 'fkCustom',
            type: 'object',
            factValue: (row) => {
              return row.createAcct.name
            }
          }, {
            lbl: '流失时间',
            prop: 'createAt'
          }]
        },
      searchFormItems: [
        [{label: '公司名称', model: 'compName', type: 'text', placeholder: '请输入公司名称', val: ''},
          {label: '联系人姓名', model: 'name', type: 'text', placeholder: '请输入联系人姓名', val: ''},
          {label: '联系方式', model: 'phone', type: 'text', placeholder: '请输入联系方式', val: ''}],
        [{label: '流失日期', model: 'createAt', type: 'timeLimit', placeholder: '请选择转化日期', val: ''},
          {label: '业务部门', model: 'dptName', placeholder: '请选择业务部门', val: ''},
          {label: '业务员', model: 'acctName', placeholder: '请选择业务员', val: ''}]
      ],
      currentPage: 1,
      totalCount: 0,
      queryObject: {
        currentPage: this.currentPage - 1,
        pageSize: this.pageSize,
        recordType: '3'
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
      pageSize: this.pageSize,
      recordType: '3'
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
        let { data } = await this.apiStreamPost('/proxy/common/post', {url: 'customerManage/customerRecord', params: this.queryObject})
          if (data.returnCode === 0) {
            let arr = []
            data.list.map(itm => {
              itm[0].link = itm[1]
              itm[0].fkCustom.createAt = this.date2Str(new Date(itm[0].fkCustom.createAt))
              arr.push(itm[0])
            })
            this.tableValue.tableData = arr
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