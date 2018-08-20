<template lang="pug">
.content
  .mt-15
    basic-table(:tableValue="tableValue", :loading="loading", :currentPage="currentPage", :pageSize="pageSize", :total="total", @tableRowEdit="rowEdit", @tableRowSave="rowSave", @tableRowCancel="rowCancel", @tableRowDelete="delCb", @pageChange="tableChange")
</template>

<script>
import basicTable from '@/components/BasicTable.vue'
import searchForm from '@/components/SearchForm.vue'
import buttonGroup from '@/components/ButtonGroup.vue'
import { mapState } from 'vuex'
export default{
  components: {
    basicTable,
    searchForm,
    buttonGroup
  },
  props: {
    year: {
      type: String,
      default: ''
    },
    month: {
      type: Number,
      default: null
    },
    tabPaneData: {
      type: Array,
      default: null
    },
    saveCb: {
      type: Function,
      require: true
    },
    delCb: {
      type: Function,
      required: true
    },
    total: {
      type: Number,
      default: 100
    },
    tableChange: {
      type: Function,
      required: true
    },
    pageSize: {
      type: Number,
      default: 15
    },
    currentPage: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      tableValue: {
        tableHead: [
          {lbl: '公司', prop: 'compName', type: 'edit', editType: 'text'},
          {lbl: '线上(吨)', prop: 'onlineTask', type: 'edit', editType: 'text'},
          {lbl: '线下(吨)', prop: 'offlineTask', type: 'edit', editType: 'text'},
          {lbl: '板材(吨)', prop: 'boardTask', type: 'edit', editType: 'text'},
          {lbl: '总销量(吨)', prop: 'amountTask', type: 'edit', editType: 'text'},
          {lbl: '高卖任务(元)', prop: 'highValueTask', type: 'edit', editType: 'text'},
          {lbl: '新客户', prop: 'firstCustNum', type: 'edit', editType: 'text'},
          {lbl: '二次开发', prop: 'secondCustNum', type: 'edit', editType: 'text'},
          {type: 'action',
          width:'120px',
            actionBtns: [{
              lbl: '编辑',
              type: 'edit'
            }]
          }],
        hasCbx: false,
        edit: true,
        tableData: []
      },
      snapData: [],
      isEdit: false,
      loading: false
    }
  },
  mounted () {
    this.tableValue.tableData = this.tabPaneData
  },
  methods: {
    dataFilter () {
      this.snapData = JSON.parse(JSON.stringify(this.tableValue.tableData))
      this.snapData.map(item=>{
        item.linkDate = new Date(item.linkDate)
      })
    },
    tableHandler (obj) {
      let idx = obj.idx
      this.tableValue.tableData[idx].edit = !this.tableValue.tableData[idx].edit
      console.log(this.tableValue.tableData[idx].edit)
    },
    rowEdit (obj) {
      if(this.isEdit){
        this.msgShow(this, '请先完成操作')
        return
      }
      this.tableHandler(obj)
      this.dataFilter()
      this.isEdit = true
    },
    rowSave (row) {
      this.saveCb(row)
      this.isEdit = false
    },
    rowCancel (row) {
      this.isEdit = false
      let idx = this.tableValue.tableData.indexOf(row)
      this.tableValue.tableData = this.snapData
      if(this.tableValue.tableData.length > idx + 1 || this.tableValue.tableData.length == idx + 1)
        this.tableValue.tableData[idx].edit = false
    }
  }
}
</script>