<template lang="pug">
.bg-white.p-10 
  //- span 代开票得分=score[Y/N]
  .mt-10
    basic-table(:tableValue="tableValue", :loading="loading")
  .mt-10.text-center
    el-button(type="primary", size="small", @click="save") 保存
    el-button(size="small", @click="reset") 重置
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
      }
    },
    data () {
      return {
        tableValue: {
          tableHead: [
            {lbl: '是否有代开票行为', prop: 'type', type: 'text'},
            {lbl: 'score', prop: 'score', type: 'edit', editType: 'text'}],
          page: true,
          hasCbx: false,
          edit: true,
          tableData: []
        },
        loading: false,
        resetData: [],
        objectParams: {
          grades: [],
          parentId: '',
          type: '2'
        }
      }
    },
    mounted () {
      this.loadDataVal.map(itm => {
        let obj = {
          type: itm.name,
          score: itm.coefficient,
          edit: true,
          id: itm.id
        }
        this.tableValue.tableData.push(obj)
      })
      this.resetData = JSON.parse(JSON.stringify(this.tableValue.tableData))
    },
    methods: {
      save () {
        this.objectParams.grades = []
        this.tableValue.tableData.map(itm => {
          let str = itm.id + '|' + itm.type + '|' + itm.score
          this.objectParams.grades.push(str)
        })
        this.cb(this.objectParams)
      },
      reset () {
        this.tableValue.tableData = JSON.parse(JSON.stringify(this.resetData))
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
