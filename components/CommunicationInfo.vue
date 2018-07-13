<template lang="pug">
div
  button-group(:btns="btnGroupsAddInfo", @groupBtnClick="groupBtnClick")
  .mt-15
    basic-table(:tableValue="tableValue", @tableRowEdit="tableRowEdit", @tableRowSave="tableRowSave", @tableRowCancel="tableRowCancel", @tableRowDelete="tableRowDelete")
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
      btnGroupsAddInfo: [{lbl: '新增沟通信息', type: 'addInfo'}],
      tableValue: {
        tableHead: [
          {lbl: '添加时间', prop: 'date', type: 'text'},
          {lbl: '添加人', prop: 'name', type: 'text'},
          {lbl: '沟通类型', prop: 'linkWay', type: 'edit', editType: 'select', selectList: [{ value: '电话', label: '电话'}, {value: '短信', label: '短信'}, {value: '见面拜访', label: '见面拜访'}, {value: '其他', label: '其他'}]},
          {lbl: '沟通日期', prop: 'linkDate', type: 'edit', editType: 'date'},
          {lbl: '内容', prop: 'remark', type: 'edit', editType: 'text'},
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
      snapData: []
    }
  },
  mounted () {
    this.tableValue.tableData = [
      {id: 1, date: '2018-05-21  18:32:22',
        name: '王佳浩',
        linkWay: '电话',
        linkDate: new Date('2018-05-21'),
        remark: '嘘寒问暖，询问客户经营状况',
        edit: false
        }
    ]
  },
  methods: {
    groupBtnClick (type) {
      if(type == 'back'){}
      if(type == 'addInfo'){
        this.linkDateFilter()
        let addData = {id:2, date: '2018-05-21  18:32:22', name: '王佳浩', linkDate: new Date(), linkWay: '', remark: '', edit: true}
        this.tableValue.tableData.push(addData)
      }
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
    tableRowEdit (row) {
      this.tableHandler(row)
      this.linkDateFilter()
    },
    tableRowSave (row) {
      this.tableHandler(row)
    },
    tableRowDelete (obj) {
      this.confirmDialog(this, '您确认要删掉本行记录吗？').then(() => {
        // this.busiRelationDel(obj.id)
      }, () => {
        console.log('cancel')
      })
    },
    tableRowCancel (row) {
      let idx = this.tableValue.tableData.indexOf(row)
      this.tableValue.tableData = this.snapData
      if(this.tableValue.tableData.length > idx + 1 || this.tableValue.tableData.length == idx + 1)
        this.tableValue.tableData[idx].edit = false
    }
  }
}
</script>