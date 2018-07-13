<template lang="pug">
div
  button-group(:btns="linkerAddInfo", @groupBtnClick="linkerAddClick")
  .mt-15
    basic-table(:tableValue="tableValue", @tableRowEdit="rowEdit", @tableRowSave="rowSave", @tableRowCancel="rowCancel", @tableRowDelete="rowDelete")
</template>

<script>
import basicTable from '@/components/BasicTable.vue'
import buttonGroup from '@/components/ButtonGroup.vue'
export default{
  components: {
    basicTable,
    buttonGroup
  },
  data () {
    return {
      linkerAddInfo: [{lbl: '新增账户信息', type: 'add'}],
      tableValue: {
        tableHead: [
          {lbl: '开户名称', prop: 'openAcctName', type: 'edit', editType: 'text'},
          {lbl: '开户银行', prop: 'openBank', type: 'edit', editType: 'text'},
          {lbl: '银行账号', prop: 'openAccount', type: 'edit', editType: 'text'},
          {lbl: '备注', prop: 'wxNo', type: 'edit', editType: 'text'},
          {type: 'action',
            actionBtns: [{
              lbl: '编辑',
              type: 'edit'
            },{
              lbl: '删除',
              type: 'delete'
            }]
          }],
        hasCbx: false,
        edit: true,
        tableData: []
      },
      snapData: [],
    }
  },
  mounted () {
    this.tableValue.tableData = [{id: 1, openAcctName: '江苏智恒达网络科技有限公司',openBank: '建行常州分行九龙支行',openAccount: '625455224552225552', remark: '其他抬头'}]
  },
  methods: {
    linkerAddClick (type) {
      this.linkDateFilter()
      let addData ={id: 1, openAcctName: '',openBank: '',openAccount: '', remark: '', edit: true}
      this.tableValue.tableData.push(addData)
    },
    linkDateFilter () {
      this.snapData = JSON.parse(JSON.stringify(this.tableValue.tableData))
      this.snapData.map(item=>{
        item.linkDate = new Date(item.linkDate)
      })
    },
    tableHandler (row) {
      let idx = this.tableValue.tableData.indexOf(row)
      this.tableValue.tableData[idx].edit = !this.tableValue.tableData[idx].edit
    },
    rowEdit (row) {
      this.tableHandler(row)
      this.linkDateFilter()
    },
    rowDelete (row) {
      this.confirmDialog(this, '您确认要删掉本行记录吗？').then(() => {
        // this.busiRelationDel(row.id)
      }, () => {
        console.log('delete')
      })
    },
    rowSave (row) {
      this.tableHandler(row)
    },
    rowCancel (row) {
      let idx = this.tableValue.tableData.indexOf(row)
      this.tableValue.tableData = this.snapData
      if(this.tableValue.tableData.length > idx + 1 || this.tableValue.tableData.length == idx + 1)
        this.tableValue.tableData[idx].edit = false
    }
  }
}
</script>
