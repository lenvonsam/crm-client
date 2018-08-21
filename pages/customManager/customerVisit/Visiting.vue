<template lang="pug">
.content
  .mt-15
    button-group(:btns="btnGroups", @groupBtnClick="groupBtnClick")
  .mt-15
    search-form(:searchFormItems="searchFormItems", @search="searchForm")
  //- .mt-15.ft-13.text-red (*拜访中、已拜访客户不能重复拜访，需等待本次拜访完成后，才能再次拜访）
  .mt-15
    basic-table(:tableValue="tableValue", :loading="loading", :currentPage="currentPage", :pageSize="pageSize", :total="totalCount", @pageChange="tableChange", @tableRowSetVisit="tableRowStatus")
  add-custom-visit(:cb="addCustomVisitBack", :uid="currentUser.id", :dialogShow="dialogShow")
</template>
<script>
import searchForm from '@/components/SearchForm.vue'
import basicTable from '@/components/BasicTable.vue'
import buttonGroup from '@/components/ButtonGroup.vue'
import addCustomVisit from '@/components/AddCustomVisit'
import { mapState } from 'vuex'
export default {
  layout: 'main',
  components: {
    basicTable,
    searchForm,
    buttonGroup,
    addCustomVisit
  },
  data () {
    return {
      btnGroups: [{lbl: '增加客户拜访', type: 'add'}],
      searchFormItems: [[{label: '公司名称', model: 'compName', type: 'text', placeholder: '请输入公司名称', val: ''},
          {label: '拜访结果', model: 'callResult', type: 'select', val: '', list: [{value: '', label: '全部'}, {value: '0', label: '未拜访'}, {value: '1', label: '已拜访'}]},
          {label: '计划拜访日期', model:'planAt', type: 'timeLimit', val: ''}]],
      tableValue: {
        tableData: [],
        hasCbx: false,
        rowClassName: false,
        edit: true,
        tableHead: [{
          lbl: '公司名称',
          prop: 'customer',
          type: 'linkObject',
          minWidth: '340px',
          linkUrl: '/customManager/publicCustom/detail',
          factValue(row){
            let arr = {
              id: row.id,
              name: row.compName
            }
            return arr
          }
        }, {
          lbl: '主联系人',
          prop: 'link',
          width: '200px',
          type: 'object',
          factValue(row){
            return row.name
          }
        }, {
          lbl: '联系方式',
          prop: 'link',
          type: 'object',
          width: '250px',
          factValue(row){
            return row.phone
          }
        }, {
          lbl: '流失日期',
          prop: 'customer',
          type: 'object',
          width: '180px',
          factValue (row) {
            return row.createAt
          }
        }, {
          lbl: '添加人',
          prop: 'creator',
          width: '150px',
          type: 'object',
          factValue (row) {
            return row.name
          }
        }, {
          lbl: '计划拜访时间',
          width: '180px',
          prop: 'planVisitTime'
        }, {
          lbl: '计划开单日期',
          width: '120px',
          prop: 'planDate'
        }, {
          type: 'action',
          width: '100',
          fixed: 'right',
          actionBtns: [{
            lbl: '设为已拜访',
            type: 'setVisit'
          }]
        }]
      },
      currentPage: 1,
      totalCount: 0,
      queryObject: {
        currentPage: this.currentPage - 1,
        pageSize: this.pageSize,
        mark: '1'
      },
      loading: true,
      dialogShow: false
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
      mark: '1'
    }
    this.loadData()
  },
  methods: {
    groupBtnClick() {
      this.dialogShow = true
    },
    addCustomVisitBack() {
      this.loadData()
      this.dialogShow = false
    },
    searchForm (paramsObj) {
      this.loading = true
      this.currentPage = 1
      this.queryObject.currentPage = this.currentPage - 1
      Object.keys(paramsObj).map(key => {
        if(key == 'planAt'){
          if (paramsObj.planAt !== null && paramsObj.planAt !== undefined) {
            this.queryObject.startTime = paramsObj.planAt[0]
            this.queryObject.endTime = paramsObj.planAt[1]
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
    tableRowStatus (row) {
      let cstmCall = {
        id: row.id,
        status: 2
      }
      this.cstmCallUpdateStatus(cstmCall)
    },
    tableChange (val) {
      this.loading = true
      this.currentPage = val
      this.queryObject.currentPage = this.currentPage - 1
      this.loadData()
    },
    async loadData () {
      this.queryObject.uid = this.currentUser.id
      try {
        let { data } = await this.apiStreamPost('/proxy/common/post', {url: 'customerManage/cstmCall', params: this.queryObject})
        if (data.returnCode === 0) {
          let arr = []
          data.list.map(itm => {
            itm[0].planDate = this.date2Str(new Date(itm[0].planDate))
            itm[0].customer.createAt = this.datetime2Str(new Date(itm[0].customer.createAt))
            itm[0].link = itm[1]
            arr.push(itm[0])
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
    async cstmCallUpdateStatus (params) {
      try {
        let { data } = await this.apiStreamPost('/proxy/common/post', {url: 'customerManage/cstmCall/updateStatus', params: params})
        if (data.returnCode === 0) {
          this.msgShow(this, '设置成功', 'success')
          this.loadData()
        } else {
          this.msgShow(this, data.errMsg)
        }
      } catch (e) {
        console.error(e)
        this.msgShow(this)
      }
    }
  }
}
</script>