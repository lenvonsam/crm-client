<template lang="pug">
  .content
    breadcrumb(:breadItems="breadItems")
    .pt-15
      button-group(:btns="btnGroups", @groupBtnClick="groupBtnClick")
    .mt-15
      search-form(:searchFormItems="searchFormItems", @search="searchForm")
    .pt-15
      basic-table(:tableValue="tableValue", :currentPage="currentPage", :pageSize="pageSize", :total="totalCount", @pageChange="tableChange", @tableRowDelete="rowDel", @tableRowEdit="rowEdit", v-if="tableValue.tableData.length > 0")
    el-dialog(title="删除", :visible.sync="dialogFormVisible")
      .row.flex-center
        .col.flex-80 删除理由：
        .col
          el-input.full-width(v-model="reason", auto-complete="off")
      .dialog-footer(slot="footer")
        el-button(@click="delSubmit('cancel')") 取消
        el-button(type="primary", @click="delSubmit('ok')") 确定
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
    data() {
      return {
        breadItems: ['客户管理', '潜在客户'],
        currentPage: 1,
        totalCount: 0,
        queryObject: {
          currentPage: this.currentPage - 1,
          pageSize: this.pageSize
        },
        btnGroups: [{
          lbl: '添加潜在客户',
          type: 'add'
        }, {
          lbl: '转化为正式客户',
          type: 'conversion'
        }, {
          lbl: '删除记录',
          type: 'delRec'
        }, {
          lbl: '转化记录',
          type: 'conversionRec'
        }],
        tableValue: {
          tableData: [],
          hasCbx: false,
          tableHead: [{
            lbl: '公司名称',
            prop: 'compName',
            type: 'link',
            linkUrl: '/customManager/potentialCustom/detail'
          }, {
            lbl: '主联系人',
            prop: 'link',
            type: 'object',
            factValue (row) {
              return row.name
            }
          }, {
            lbl: '联系方式',
            type: 'object',
            prop: 'link',
            factValue (row) {
              return row.phone
            }
          }, {
            lbl: '添加日期',
            prop: 'createAt'
          }, {
            lbl: '业务部门',
            prop: 'fkDpt',
            type: 'object',
            factValue (row) {
              return row.name
            }
          }, {
            lbl: '业务员',
            prop: 'fkAcct',
            type: 'object',
            factValue (row) {
              return row.name
            }
          }, {
            type: 'action',
            actionBtns: [{
              lbl: '编辑',
              type: 'edit'
            }, {
              lbl: '删除',
              type: 'delete'
            }]
          }]
        },
        searchFormItems: [
          [{label: '公司名称', model: 'compName', type: 'text', placeholder: '请输入公司名称', val: ''},
            {label: '联系人姓名', model: 'name', type: 'text', placeholder: '请输入联系人姓名', val: ''},
            {label: '联系方式', model: 'phone', type: 'text', placeholder: '请输入联系方式', val: ''}],
          [{label: '添加日期', model: 'createAt', type: 'date', placeholder: '请选择转化日期', val: ''},
          {label: '业务部门', model: 'dptName', placeholder: '请选择业务部门', val: ''},
          {label: '业务员', model: 'acctName', placeholder: '请选择业务员', val: ''}]
        ],
        reason: '',
        dialogFormVisible: false,
        rowDelObj: {}
      }
    },
    mounted () {
      this.queryObject = {
        currentPage: this.currentPage - 1,
        pageSize: this.pageSize
      }
      this.loadData()
    },
    computed: {
      ...mapState({
        pageSize: state => state.pageSize
      })
    },
    methods: {
      async loadData () {
        try {
          let { data } = await this.apiStreamPost('/proxy/common/post', {url: 'customerManage/customer', params: this.queryObject})
          if (data.returnCode === 0) {
            let arr = []
            data.list.map(itm => {
              itm[0].link = itm[1]
              arr.push(itm[0])
            })
            console.log(arr)
            this.tableValue.tableData = arr
            this.totalCount = data.total
          } else {
            this.msgShow(this, data.errMsg)
          }
        } catch (e) {
          console.error(e)
          this.msgShow(this)
        }
      },
      searchForm (paramsObj) {
        console.log(paramsObj)
        this.currentPage = 1
        this.queryObject.currentPage = this.currentPage - 1
        Object.keys(paramsObj).map(key => {
          if (paramsObj[key] && paramsObj[key].length > 0) {
            this.queryObject[key] = paramsObj[key].trim()
          } else {
            delete this.queryObject[key]
          }
        })
        this.loadData()
      },
      groupBtnClick (type) {
        if(type == 'add'){
          this.$router.push({path: '/customManager/potentialCustom/form?type=new'})
        }
        if(type == 'conversion'){}
        if(type == 'delRec'){
          this.$router.push({path: '/customManager/potentialCustom/delRec'})
        }
        if(type == 'conversionRec'){
          this.$router.push({path: '/customManager/potentialCustom/conversionRec'})
        }
      },
      tableChange (val) {
        this.currentPage = val
        this.queryObject.currentPage = this.currentPage - 1
        this.loadData()
      },
      rowDel (obj) {
        this.dialogFormVisible = true
        this.rowDelObj = obj
        // this.confirmDialog(this, '您确认要删掉本行记录吗？').then(() => {
        //   this.actionDelete(obj.id)
        // }, () => {
        //   console.log('cancel')
        // })
      },
      delSubmit (flg) {
        if (flg == 'ok') {
          this.actionDelete()
        }
        this.dialogFormVisible = false
      },
      async actionDelete () {
        try {
          let url = 'customerManage/customerDel/'
          let params = {
            id: this.rowDelObj.id,
            reason: this.reason,
            currentPage: this.currentPage - 1,
            pageSize: this.pageSize
          }
          let { data } = await this.apiStreamPost('/proxy/common/post', {url: url, params: params})
          if (data.returnCode === 0) {
            this.currentPage = 1
            this.queryObject.currentPage = this.currentPage - 1
            this.loadData()
            this.msgShow(this, '删除成功', 'success')
          } else {
            this.msgShow(this, data.errMsg)
          }
        } catch (e) {
          console.error(e)
          this.msgShow(this)
        }
      },
      rowEdit (obj) {
        this.jump('/customManager/potentialCustom/form?type=edit&id=' + obj.id)
      }
    }
  }
</script>
<style lang="styl", scoped>
  .width-input-250
    width: 250px
</style>