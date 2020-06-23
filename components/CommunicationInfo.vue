<template lang="pug">
div
  button-group(:btns="btnGroupsAddInfo", @groupBtnClick="groupBtnClick")
  .mt-15
    basic-table(:tableValue.sync="tableValue", :loading="loading",rowEdit, :currentPage="currentPage", :pageSize="pageSize", :total="totalCount", @tableRowSave="rowSave", @tableRowDelete="tableRowDelete")
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
  computed: {
    ...mapState({
      pageSize: state => state.pageSize,
      contactTypeOpts: state => state.contactTypeOpts,
      currentUser: state => state.user.currentUser
    })
  },
  data () {
    return {
      btnGroupsAddInfo: [{ lbl: '新增沟通信息', type: 'add' }],
      tableValue: {
        tableHead: [
          { lbl: '添加时间', prop: 'createAt', type: 'text', sort: true },
          { lbl: '添加人', prop: 'fkAcctName', type: 'text' },
          { lbl: '沟通类型', prop: 'contactType', type: 'edit', editType: 'select', selectList: [] },
          { lbl: '沟通日期', prop: 'contactDate', type: 'edit', editType: 'date', sort: true },
          { lbl: '内容', prop: 'content', type: 'edit', editType: 'text' },
          {            type: 'action',
            actionBtns: [{
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
      loading: true
    }
  },
  mounted () {
    this.tableValue.tableHead.map(item => {
      if (item.prop == 'contactType') item.selectList = this.contactTypeOpts
    })
    this.loadData()
  },
  methods: {
    groupBtnClick (type) {
      if (type == 'back') {
        this.back()
      }
      if (type == 'add') {
        let addData = { id: null, createAt: new Date(), fkAcctName: this.currentUser.name, contactType: [], contactDate: null, content: '', edit: true }
        this.tableValue.tableData.push(addData)
      }
    },
    rowSave (row) {
      let params = {
        fkAcctId: Number(this.currentUser.id),
        contactType: row.contactType,
        fkContactDate: row.contactDate,
        content: row.content,
        fkCstmId: Number(this.$route.query.id)
      }
      this.communicateCreate(params)
    },
    tableRowDelete (obj) {
      this.confirmDialog(this, '您确认要删掉本行记录吗？').then(() => {
        this.communicateDelete(obj.id)
      }, () => {
        console.log('cancel')
      })
    },
    async loadData () {
      try {
        let { data } = await this.apiStreamPost('/proxy/common/post', { url: 'customerManage/communicate/queryCombo', params: { cstmId: this.$route.query.id } })
        if (data.returnCode === 0) {
          data.list.map(item => {
            if (item.contactDate != null) {
              item.contactDate = this.date2Str(new Date(item.contactDate))
            }
            item.fkAcctName = item.fkAcct.name
          })
          this.tableValue.tableData = data.list
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
    async communicateCreate (params) {
      try {
        let { data } = await this.apiStreamPost('/proxy/common/post', { url: 'customerManage/communicate/create', params: params })
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
    async communicateDelete (id) {
      try {
        let { data } = await this.apiStreamPost('/proxy/common/del', { url: 'customerManage/communicate/' + id })
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