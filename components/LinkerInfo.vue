<template lang="pug">
div
  button-group(:btns="linkerAddInfo", @groupBtnClick="linkerAddClick")
  .mt-15
    basic-table(:tableValue="tableValue", @tableRowEdit="rowEdit", @tableRowSave="rowSave", @tableRowCancel="rowCancel", @tableRowDelete="rowDelete")
    //- basic-table(:tableValue="tableValue")
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
      linkerAddInfo: [{lbl: '新增联系人', type: 'add'}],
      tableValue: {
        tableHead: [
          {lbl: '姓名', prop: 'name', type: 'edit', editType: 'text'},
          {lbl: '联系电话', prop: 'tel', type: 'edit', editType: 'text'},
          {lbl: 'QQ', prop: 'qqNo', type: 'edit', editType: 'text'},
          {lbl: '微信', prop: 'wxNo', type: 'edit', editType: 'text'},
          {lbl: '职位', prop: '', type: 'edit', editType: 'select', selectList:[{}]},
          {lbl: '性别', prop: 'sex', type: 'edit', editType: 'select', selectList:[{}]},
          {lbl: '年龄', prop: 'age', type: 'edit', editType: 'select', selectList:[{}]},
          {lbl: '学历', prop: 'edu', type: 'edit', editType: 'select', selectList:[{}]},
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
    this.tableValue.tableData = [{id: 1, name: '王佳浩',tel: '15720623107',qqNo: '1260521048', wxNo: 'dubuhao1994', zw: '采购专员', sex: '男', age: '25', edu: '本科', 备注: '无'}]
  },
  methods: {
    linkerAddClick (type) {
      this.linkDateFilter()
      let addData = {id: 1, name: '',tel: '',qqNo: '',wxNo: '',zw: '',sex: '',age: '',edu: '',备注: '', edit: true}
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
