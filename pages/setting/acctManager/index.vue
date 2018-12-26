<template lang="pug">
.content
  breadcrumb(:breadItems="breadItems")
  .pt-15
    button-group(:btns="btnGroups", @groupBtnClick="groupBtnClick", @fileUploadSuccess="excelUploadSuccess")
  .pt-20
    search-form(:searchFormItems="searchItems", @search="searchBtn")
  .pt-15
    basic-table(:tableValue="tableValue", :loading="loading", :currentPage="currentPage", :total="totalCount", @pageChange="tablePage", @tableRowEdit="rowEdit", @chooseData="selectData", @tableRowDelete="rowDelete", @tableRowResetPwd="rowResetPwd")
</template>

<script>
  import breadcrumb from '@/components/Breadcrumb.vue'
  import basicTable from '@/components/BasicTable.vue'
  import buttonGroup from '@/components/ButtonGroup.vue'
  import searchForm from '@/components/SearchForm.vue'
  import { mapState } from 'vuex'
  export default {
    layout: 'main',
    computed: {
      ...mapState({
        pageSize: state => state.pageSize,
        currentUser: state => state.user.currentUser
      })
    },
    components: {
      breadcrumb,
      basicTable,
      buttonGroup,
      searchForm
    },
    data () {
      return {
        queryObject: {
          pageSize: this.pageSize
        },
        breadItems: ['系统设置', '账号管理'],
        btnGroups: [{
          lbl: '新增账号',
          type: 'add'
        }, {
          lbl: '批量启用',
          type: 'start'
        }, {
          lbl: '批量停用',
          type: 'stop'
        }],
        currentPage: 1,
        totalCount: 0,
        searchItems: [[{label: '姓名', model: 'name', type: 'text', val: ''}, {label: '账号', model: 'loginAcct', type: 'text', val: ''}, {label: '机构', model: 'orgName', type: 'text', val: ''}],
          [{label: '部门', model: 'dptName', type: 'text', val: ''}, {label: '职位', model: 'position', val: '', type: 'text'}, {label: '手机号', type: 'text', model: 'phone', val: ''}]
        ],
        tableValue: {
          tableData: [],
          hasCbx: true,
          tableHead: [{
            lbl: '姓名',
            type: 'link',
            prop: 'name',
            width: '150px',
            linkUrl: '/setting/acctManager/detail'
          }, {
            lbl: '账号',
            width: '150px',
            prop: 'loginAcct'
          }, {
            type: 'object',
            lbl: '机构',
            minWidth: '250px',
            prop: 'fkDpt',
            factValue (row) {
              return row.fkOrg.name
            }
          }, {
            type: 'object',
            lbl: '部门',
            width: '200px',
            prop: 'fkDpt',
            factValue (row) {
              return row.name
            }
          }, {
            lbl: '职位',
            width: '200px',
            prop: 'position'
          }, {
            lbl: '手机号',
            width: '200px',
            prop: 'phone'
          }, {
            lbl: '状态',
            width: '100px',
            align: 'center',
            prop: 'status'
          }, {
            type: 'action',
            width: '100px',
            fixed: 'right',
            actionBtns: [{
              lbl: '编辑',
              type: 'edit'
            }, {
              lbl: '删除',
              type: 'delete'
            }]
          }]
        },
        chooseArray: [],
        loading: true
      }
    },
    beforeMount () {
      let idx = this.btnGroups.findIndex(itm => itm.lbl === '批量导入')
      if (this.currentUser.id === 1 && idx < 0) {
        this.btnGroups.push({lbl: '批量导入', dataType: 'acct', type: 'excel'})
        this.$forceUpdate()
      }
      this.$nextTick(() => {
        if (this.currentUser.id === 1) {
          let idx = this.tableValue.tableHead.findIndex(th => th.type === 'action')
          this.tableValue.tableHead[idx].width=180
          this.tableValue.tableHead[idx].actionBtns =  [{
            lbl: '编辑',
            type: 'edit'
          }, {
            lbl: '删除',
            type: 'delete'
          }, {
            lbl: '重置密码',
            type: 'resetPwd'
          }]
          this.$forceUpdate()
        }
        this.queryObject = {
          currentPage: this.currentPage - 1,
          pageSize: this.pageSize
        }
        this.loadData()
      })
    },
    methods: {
      excelUploadSuccess () {
        this.currentPage = 1
        this.queryObject.currentPage = this.currentPage - 1
        this.loadData()
      },
      groupBtnClick (type) {
        if (type === 'add') {
          this.jump('/setting/acctManager/form?type=new')
        } else if (type === 'start') {
          if (this.chooseArray.length === 0) {
            this.msgShow(this, '请选择启用的行数', 'warning')
            return
          }
          this.batchUpdate(1)
        } else {
          if (this.chooseArray.length === 0) {
            this.msgShow(this, '请选择停用的行数', 'warning')
            return
          }
          this.batchUpdate(0)
        }
      },
      searchBtn (val) {
        console.log(val)
        let obj = Object.assign({}, val)
        Object.keys(val).map(key => {
          if (val[key].length === 0)
            delete this.queryObject[key]
          else
            this.queryObject[key] = val[key]
        })
        this.currentPage = 1
        this.queryObject.currentPage = this.currentPage - 1
        this.loadData()
      },
      tablePage (val) {
        this.currentPage = val
        this.queryObject.currentPage = this.currentPage - 1
        this.loadData()
      },
      rowEdit (row) {
        this.jump({path: '/setting/acctManager/form?type=edit&id=' + row.id})
      },
      selectData (val) {
        this.chooseArray = val
      },
      rowDelete (obj) {
        this.confirmDialog(this, '您确定要删掉本行记录吗？').then(() => {
          this.actionDelete(obj.id)
        }, () => {
          console.log('cancel')
        })
      },
      rowResetPwd (obj) {
        console.log(obj)
        this.confirmDialog(this, '您确定要重置密码吗？').then(() => {
          this.actionResetPwd(obj.id)
        }, () => {
          console.log('cancel')
        })
      },
      async actionResetPwd (id) {
        try {
          let { data } = await this.apiStreamPost('/proxy/common/post', {url: 'admin/resetPwd', params: {id: id}})
          if (data.returnCode === 0) {
            this.msgShow(this, '重置成功', 'success')
          } else {
            this.msgShow(this, data.errMsg)
          }
        } catch (e) {
          console.error(e)
          this.msgShow(this)
        }
      },
      async actionDelete (id) {
        try {
          let url = 'setting/acct/' + id
          let { data } = await this.apiStreamPost('/proxy/common/del', {url: url})
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
      async batchUpdate (status) {
        try {
          let url = 'setting/acct/batchUpdate'
          let { data } = await this.apiStreamPost('/proxy/common/post', {url: url, params: {status: status, ids: this.chooseArray.map(itm => itm.id).join(',')}})
          if (data.returnCode === 0) {
            this.currentPage = 1
            this.queryObject.currentPage = this.currentPage - 1
            this.loadData()
            this.msgShow(this, `批量${status === 1 ? '启用' : '停用'}成功`, 'success')
          } else {
            this.msgShow(this, data.errMsg)
          }
        } catch (e) {
          console.error(e)
          this.msgShow(this)
        }
      },
      async loadData () {
        this.loading = true
        try {
          let { data } = await this.apiStreamPost('/proxy/common/post', {url: 'setting/acct', params: this.queryObject})
          if (data.returnCode === 0) {
            this.tableValue.tableData = data.list
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

<style lang="stylus", scoped>

</style>
