<template lang = "pug">
.content
  breadcrumb(:breadItems="breadItems")
  .mt-15
    button-group(:btns="btnGroups", @groupBtnClick="groupBtnClick")
  .mt-15
    search-form(:searchFormItems="searchFormItems", @search="searchForm")
  .mt-15
    basic-table(:tableValue="tableValue", :loading="loading", :currentPage="currentPage", :pageSize="pageSize", :total="totalCount", @chooseData="selectData", @pageChange="tableChange", v-if="tableValue.tableData.length > 0")
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
      breadItems: ['潜在客户', '潜在客户', '删除记录'],
      currentPage: 1,
      totalCount: 0,
      btnGroups: [{lbl: '返回列表', type: 'back'}, {lbl: '恢复到潜在客户', type: 'res'}],
      tableValue: {
          tableData: [],
          hasCbx: true,
          rowClassName: false,
          tableHead: [{
            lbl: '公司名称',
            linkUrl: '/customManager/potentialCustom/detail',
            prop: 'fkCustom',
            type: 'object',
            factValue: (row) => {
              return row.compName
            }
          }, {
            lbl: '联系人名称',
            prop: 'link',
            type: 'object',
            width: 200,
            factValue: (row) => {
              return row.name
            }
          }, {
            lbl: '联系人电话',
            prop: 'link',
            type: 'object',
            width: 200,
            factValue: (row) => {
              return row.phone
            }
          }, {
            lbl: '添加日期',
            prop: 'fkCustom',
            type: 'object',
            width: 150,
            factValue: (row) => {
              return row.createAt
            }
          }, {
            lbl: '业务部门',
            prop: 'fkCustom',
            type: 'object',
            width: 150,
            factValue: (row) => {
              return row.fkDpt.name
            }
          }, {
            lbl: '业务员',
            prop: 'fkCustom',
            type: 'object',
            width: 100,
            factValue: (row) => {
              return row.fkAcct.name
            }
          }, {
            lbl: '创建人',
            prop: 'link',
            type: 'object',
            width: 100,
            factValue: (row) => {
              return row.creator.name
            }
          }, {
            lbl: '删除人',
            prop: 'fkAcct',
            type: 'object',
            width: 100,
            factValue: (row) => {
              return row.name
            }
          }, {
            lbl: '删除时间',
            prop: 'createAt',
            width: 200
          }, {
            lbl: '删除理由',
            prop: 'reason',
            width: 150
          }]
        },
      searchFormItems: [
        [{label: '公司名称', model: 'compName', type: 'text', placeholder: '请输入公司名称', val: ''},
          {label: '联系人姓名', model: 'name', type: 'text', placeholder: '请输入联系人姓名', val: ''},
          {label: '联系方式', model: 'phone', type: 'text', placeholder: '请输入联系方式', val: ''}],
        [{label: '删除日期', model: 'createAt', type: 'timeLimit', placeholder: '请选择转化日期', val: ''},
          {label: '业务部门', model: 'dptName', placeholder: '请选择业务部门', val: ''},
          {label: '业务员', model: 'acctName', placeholder: '请选择业务员', val: ''}]
      ],
      queryObject: {
        currentPage: this.currentPage - 1,
        pageSize: this.pageSize,
        recordType: '1'
      },
      chooseArray: [],
      loading: true
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
      recordType: '1'
    }
    console.log(this.currentUser.auths)
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
    selectData (val) {
      this.chooseArray = val
    },
    groupBtnClick (type) {
      if(type == 'back') this.back()
      if (type == 'res') {
        if (this.chooseArray.length === 0) {
          this.msgShow(this, '请选择需要恢复的行数', 'warning')
          return
        }
        this.confirmDialog(this, '您确认要恢复记录吗？').then(() => {
          let arr = []
          this.chooseArray.map(item => {
            arr.push(item.id)
          })
          let ids = arr.join(',')
          let paramsObj = {
            ids: ids
          }
          console.log(arr)
          console.log(ids)
          this.customerBatchRecover(paramsObj)
        }, () => {
          console.log('cancel')
        })
      }
    },
    tableChange (val) {
      this.loading = true
      this.currentPage = val
      this.queryObject.currentPage = this.currentPage - 1
      this.loadData()
    },
    async customerBatchRecover (paramsObj) {
      try{
        let { data } = await this.apiStreamPost('/proxy/common/post', {url: 'customerManage/customerBatchRecover', params: paramsObj})
        if (data.returnCode === 0) {
          this.msgShow(this, '恢复成功', 'success')
          this.loadData()
        } else {
          this.msgShow(this, data.errMsg)
        }
      } catch (e) {
        console.error(e)
        this.msgShow(this)
      }
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
            this.totalCount = data.total
            this.loading = false
          } else {
            this.msgShow(this, data.errMsg)
            this.loading = false
          }
      } catch (e) {
        console.error(e)
        this.msgShow(this)
      }
    }
  }
}
</script>