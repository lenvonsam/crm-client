<template lang="pug">
.bg-white.p-10 
  .row
    //- .col 品类得分=sum[品名得分]
    //- .col.text-right
    //-   el-button(@click="addClick", size="small", type="primary") 新增品名score
    el-button(@click="addClick", size="small", type="primary", v-if="currentAuth.hasCreate == 1") 新增品名score
  //- .mt-10 品名得分=[品名]销量*score[品名]
  .mt-10
    basic-table(:tableValue="tableValue", :loading="loading", @tableRowEdit="rowEdit", @tableRowSave="rowSave", @tableRowCancel="rowCancel", @tableRowDelete="rowDelete")
</template>
<script>
  import basicTable from '@/components/BasicTable.vue'
  export default {
    components: {
      basicTable
    },
    props: {
      cb: {
        type: Function,
        require: true
      },
      loadDataVal: {
        type: Array,
        default: null
      },
      del: {
        type: Function,
        required: true
      },
      currentAuth: {
        type: Object,
        require: true
      }
    },
    data () {
      return {
        tableValue: {
          tableHead: [
            {lbl: '品名', prop: 'name', type: 'edit', editType: 'gradingCategory', required: true},
            {lbl: 'score', prop: 'score', type: 'edit', editType: 'text', required: true},
            {type: 'action',
            width: '120px',
              actionBtns: [{
                lbl: '编辑',
                type: 'edit'
              },{
                lbl: '删除',
                type: 'delete'
              }]
            }],
          page: true,
          hasCbx: false,
          edit: true,
          tableData: []
        },
        loading: false,
        snapData: [],
        isEdit: false,
        objectParams: {
          grades: [],
          parentId: '',
          type: '1'
        }
      }
    },
    mounted () {
      // this.objectParams.parentId = this.loadDataVal[0].parentId
      this.loadDataVal.map(itm => {
        let obj = {
          name: itm.name,
          score: itm.coefficient,
          id: itm.id,
          order: itm.nameOrder
        }
        if (itm.name == '其他') {
          obj.del = false
        }
        this.tableValue.tableData.push(obj)
      })
    },
    methods: {
      addClick (type) {
        if(this.isEdit){
          this.msgShow(this, '请先保存新增')
          return
        }
        this.linkDateFilter()      
        let addData = {id: null, name: '',score: '0', edit: true}
        this.tableValue.tableData.push(addData)
        this.isEdit = true
      },
      rowDelete (obj) {
        this.rowObj = obj
        this.del(obj.id)
      },
      rowEdit (obj) {
        if(this.isEdit){
          this.msgShow(this, '请先完成操作')
          return
        }
        this.tableHandler(obj)
        this.linkDateFilter()
        this.isEdit = true
      },
      rowSave (row) {
        if (row.name.trim() == 0) {
          this.msgShow(this, '请选择品名')
          return
        }
        if (row.score.trim() == '') {
          this.msgShow(this, '请输入得分')
          return
        }
        this.objectParams.grades = []
        let nameStr = row.name
        let parStr = ''
        if (row.id == null) {
          parStr = nameStr + '|' + row.score + '|' + 0
          this.objectParams.type = '1'
        } else {
          parStr = row.id + '|' + nameStr + '|' + row.score
          this.objectParams.type = '2'
        }
        this.objectParams.grades.push(parStr)
        this.isEdit = false
        this.cb(this.objectParams)
      },
      rowCancel (row) {
        this.isEdit = false
        let idx = this.tableValue.tableData.indexOf(row)
        this.tableValue.tableData = this.snapData
        if(this.tableValue.tableData.length > idx + 1 || this.tableValue.tableData.length == idx + 1)
          this.tableValue.tableData[idx].edit = false
      },
      tableHandler (obj) {
        let idx = obj.idx
        this.tableValue.tableData[idx].edit = !this.tableValue.tableData[idx].edit
      },
      linkDateFilter () {
        this.snapData = JSON.parse(JSON.stringify(this.tableValue.tableData))
      }
    }
  }
</script>

<style lang="stylus", scoped>
  .input-border-radius{
    border-radius: 3px!important;
    width: 100px;
  }
</style>
