<template lang="pug">
div
  button-group(:btns="linkerAddInfo", @groupBtnClick="linkerAddClick")
  .mt-15
    basic-table(
      ref="basicTable",
      :tableValue.sync="tableValue", 
      :loading="loading", 
      rowEdit,
      :currentPage="currentPage", 
      :pageSize="pageSize", 
      :total="totalCount", 
      :showRowBtnFun="showRowBtnFun",
      @tableRowSave="rowSave", 
      @tableRowDelete="rowDelete",
      @tableRowDefault="rowDefault")
    el-dialog(title="删除", :visible.sync="dialogDel", @close="delSubmit('cancel')")
      .row.flex-center
        .col.flex-80 删除理由：
        .col
          el-input.full-width(v-model="reason", auto-complete="off")
      .dialog-footer(slot="footer")
        el-button(@click="delSubmit('cancel')", size="small") 取消
        el-button(type="primary", @click="delSubmit('ok')", size="small") 确定
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
      sexOpts: state => state.sexOpts,
      eduOpts: state => state.eduOpts,
      pageSize: state => state.pageSize,
      currentUser: state => state.user.currentUser
    })
  },
  data () {
    return {
      linkerAddInfo: [{ lbl: '新增联系人', type: 'add' }],
      tableValue: {
        tableHead: [
          { lbl: '姓名', prop: 'name', type: 'edit', editType: 'text', required: true },
          { lbl: '联系电话', prop: 'phone', type: 'edit', editType: 'text', required: true },
          { lbl: 'QQ', prop: 'qqNo', type: 'edit', editType: 'text' },
          { lbl: '微信', prop: 'wxNo', type: 'edit', editType: 'text' },
          { lbl: '职位', prop: 'position', type: 'edit', editType: 'text' },
          { lbl: '性别', prop: 'sex', type: 'edit', editType: 'select', selectList: [], required: true },
          { lbl: '年龄', prop: 'age', type: 'edit', editType: 'text' },
          { lbl: '学历', prop: 'edu', type: 'edit', editType: 'select', selectList: [] },
          {            type: 'action', width: '180px',
            actionBtns: [{
              lbl: '编辑',
              type: 'edit'
            }, {
              lbl: '删除',
              type: 'delete'
            }, {
              lbl: '设置默认',
              type: 'default'
            }]
          }],
        page: true,
        hasCbx: false,
        edit: true,
        tableData: []
      },
      currentPage: 1,
      totalCount: 0,
      snapData: [],
      isEdit: false,
      loading: true,
      dialogDel: false,
      reason: '',
      rowObj: {}
    }
  },
  mounted () {
    this.loadData()
    this.tableValue.tableHead.map(item => {
      if (item.prop == 'sex') item.selectList = this.sexOpts
      if (item.prop == 'edu') item.selectList = this.eduOpts
    })
  },
  methods: {
    showRowBtnFun (scope, lbl) {
      let isShow = true
      if (scope.row.commMark === 1 && lbl === '设置默认') {
        isShow = false
      }
      return isShow
    },
    linkerAddClick (type) {
      let addData = { id: null, name: '', phone: '', qqNo: '', wxNo: '', position: '', sex: 1, age: 0, edu: '', edit: true }
      this.tableValue.tableData.push(addData)
    },
    delSubmit (flg) {
      if (flg == 'ok') {
        if (this.reason.trim() == '') {
          this.msgShow(this, '请填写删除理由')
          return
        }
        this.linkerDelete()
      }
      this.dialogDel = false
    },
    rowDefault (obj) {
      const params = {
        linkId: obj.id,
        cstmId: this.$route.query.id
      }
      this.linkerDefault(params)
    },
    rowDelete (obj) {
      this.dialogDel = true
      this.rowObj = obj
    },
    async linkerDefault (params) {
      try {
        let { data } = await this.apiStreamPost('/proxy/common/post', { url: 'customerManage/linker/' + params.linkId + '/common', params: params })
        if (data.returnCode === 0) {
          this.loadData()
          this.$message.success('设置成功')
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
    async loadData () {
      try {
        let { data } = await this.apiStreamPost('/proxy/common/post', { url: 'customerManage/linker/queryCombo', params: { cstmId: this.$route.query.id } })
        if (data.returnCode === 0) {
          const arr = []
          let idx = null
          data.list.map(itm => {
            itm.edit = false
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
        let { data } = await this.apiStreamPost('/proxy/common/post', { url: 'customerManage/linker/createOrUpdate', params: params })
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
    async linkerDelete (params) {
      try {
        let params = {
          id: this.rowObj.id,
          cstmId: Number(this.$route.query.id),
          uid: this.currentUser.id,
          reason: this.reason
        }
        let { data } = await this.apiStreamPost('/proxy/common/post', { url: 'customerManage/linkerDel', params: params })
        if (data.returnCode === 0) {
          this.msgShow(this, '删除成功', 'success')
          this.dialogDel = false
          this.loadData()
        } else {
          this.msgShow(this, data.errMsg)
        }
      } catch (e) {
        console.error(e)
        this.msgShow(this)
      }
    },
    rowSave (row) {
      if (!row.name) {
        this.msgShow(this, '请添加联系人姓名')
        return
      }
      if (!row.phone) {
        this.msgShow(this, '请添加联系方式')
        return
      }
      let params = {
        id: row.id,
        name: row.name,
        phone: row.phone,
        qqNo: row.qqNo,
        wxNo: row.wxNo,
        position: row.position,
        sex: row.sex,
        age: Number(row.age),
        edu: row.edu,
        remark: row.remark,
        cstmId: Number(this.$route.query.id),
        uid: this.currentUser.id
      }
      this.createOrUpdate(params, row)
    },
    rowCancel (row) {
      this.isEdit = false
      let idx = this.tableValue.tableData.indexOf(row)
      this.tableValue.tableData = this.snapData
      if (this.tableValue.tableData.length > idx + 1 || this.tableValue.tableData.length == idx + 1)
        this.tableValue.tableData[idx].edit = false
    }
  }
}
</script>