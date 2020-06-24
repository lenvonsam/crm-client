<template lang="pug">
div
  button-group(:btns="linkerAddInfo", @groupBtnClick="linkerAddClick")
  .mt-15
    basic-table(:tableValue.sync="tableValue",rowEdit, :loading="loading", :currentPage="currentPage", :pageSize="pageSize", :total="totalCount", @tableRowSave="rowSave", @tableRowDelete="rowDelete")
</template>

<script>
import basicTable from '@/components/BasicTable.vue'
import buttonGroup from '@/components/ButtonGroup.vue'
import { mapState } from 'vuex'
export default {
  components: {
    basicTable,
    buttonGroup
  },
  data () {
    return {
      linkerAddInfo: [{ lbl: '新增账户信息', type: 'add' }],
      tableValue: {
        tableHead: [
          { lbl: '开户名称', prop: 'name', type: 'edit', editType: 'text', required: true },
          { lbl: '开户银行', prop: 'openBank', type: 'edit', editType: 'text', required: true },
          { lbl: '银行账号', prop: 'bankAcct', type: 'edit', editType: 'text', required: true },
          { lbl: '备注', prop: 'remark', type: 'edit', editType: 'text' },
          {            type: 'action',
            actionBtns: [{
              lbl: '编辑',
              type: 'edit'
            }, {
              lbl: '删除',
              type: 'delete'
            }]
          }],
        hasCbx: false,
        edit: true,
        tableData: []
      },
      currentPage: 1,
      totalCount: 0,
      snapData: [],
      isEdit: false,
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
    this.loadData()
  },
  methods: {
    linkerAddClick () {
      let addData = { id: null, name: '', openBank: '', bankAcct: '', remark: '', edit: true }
      this.tableValue.tableData.push(addData)
    },
    rowDelete (row) {
      this.confirmDialog(this, '您确认要删掉本行记录吗？').then(() => {
        this.bankInfoDelete(row.id)
      }, () => {
        console.log('delete')
      })
    },
    rowSave (row) {
      if (!row.name) {
        this.msgShow(this, '开户名称不能为空')
        return
      }
      if (!row.openBank) {
        this.msgShow(this, '开户银行不能为空')
        return
      }
      if (!row.bankAcct) {
        this.msgShow(this, '银行账号不能为空')
        return
      }
      let params = {
        id: row.id,
        name: row.name,
        openBank: row.openBank,
        bankAcct: row.bankAcct,
        remark: row.remark,
        cstmId: Number(this.$route.query.id)
      }
      this.createOrUpdate(params)
    },
    rowCancel (row) {
      let idx = this.tableValue.tableData.indexOf(row)
      this.tableValue.tableData = this.snapData
      if (this.tableValue.tableData.length > idx + 1 || this.tableValue.tableData.length == idx + 1)
        this.tableValue.tableData[idx].edit = false
    },
    async loadData () {
      try {
        let { data } = await this.apiStreamPost('/proxy/common/post', { url: 'customerManage/bankInfo/queryCombo', params: { cstmId: this.$route.query.id } })
        if (data.returnCode === 0) {
          var arr = []
          data.list.map(itm => {
            itm.edit = false
            if (itm.name == null) itm.name = '无'
            if (itm.openBank == null) itm.openBank = '无'
            if (itm.bankAcct == null) itm.bankAcct = '无'
            arr.push(itm)
          })
          this.tableValue.tableData = arr
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
    async createOrUpdate (params) {
      try {
        params.uid = this.currentUser.id
        let { data } = await this.apiStreamPost('/proxy/common/post', { url: 'customerManage/bankInfo/createOrUpdate', params: params })
        if (data.returnCode === 0) {
          this.msgShow(this, '保存成功', 'success')
          this.loadData()
        } else {
          this.msgShow(this, data.errMsg)
        }
      } catch (e) {
        console.error(e)
        this.msgShow(this)
      }
    },
    async bankInfoDelete (id) {
      try {
        let { data } = await this.apiStreamPost('/proxy/common/del', { url: 'customerManage/bankInfo/' + id })
        if (data.returnCode === 0) {
          this.msgShow(this, '删除成功', 'success')
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
