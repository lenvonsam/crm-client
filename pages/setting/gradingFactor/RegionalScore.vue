<template lang="pug">
.bg-white.p-10 
  .row
    //- .col 地区得分=score[地区]
    //- .col.text-right
    //-   el-button(@click="addClick", size="small", type="primary") 新增地区score
    el-button(@click="addClick", size="small", type="primary") 新增地区score
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
      }
    },
    data () {
      return {
        tableValue: {
          tableHead: [
            {lbl: '地区', prop: 'addr', type: 'edit', editType: 'gradingRegion', required: true},
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
        },
        loadData: []
      }
    },
    mounted () {
      this.loadDataVal.map(itm => {
        let obj = {
          addr: itm.name,
          score: itm.coefficient,
          id: itm.id,
          order: itm.nameOrder
        }
        if (itm.name == '其他地区') {
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
        this.dataFilter()      
        let addData = {id: null, addr: '',score: '', edit: true}
        this.tableValue.tableData.push(addData)
        this.isEdit = true
      },
      rowDelete (obj) {
        this.confirmDialog(this, '您确认要删掉本行记录吗？').then(() => {
          this.isEdit = false
          this.del(obj.id)
        }, () => {
          console.log('cancel')
        })
      },
      rowEdit (obj) {
        if(this.isEdit){
          this.msgShow(this, '请先完成操作')
          return
        }
        this.tableHandler(obj)
        this.dataFilter()
        obj.addr = obj.addr.split(',')
        this.isEdit = true
      },
      rowSave (row) {
        if (row.addr.length == 0) {
          this.msgShow(this, '请输入地区')
          return
        }
        // if (row.score.trim() == '') {
        //   this.msgShow(this, '请输入得分')
        //   return
        // }
        this.objectParams.grades = []
        let addrStr = row.addr.join(',')
        let parStr = ''
        if (row.id == null) {
          parStr = addrStr + '|' + row.score + '|' + 0
          this.objectParams.type = '1'
        } else {
          parStr = row.id + '|' + addrStr + '|' + row.score
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
      dataFilter () {
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
