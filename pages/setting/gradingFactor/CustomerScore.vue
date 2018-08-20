<template lang="pug">
.bg-white.p-10 
  //- span 新旧客户得分=score[新客户/老客户]
  .mt-10
    basic-table(:tableValue="tableValue", :loading="loading")
  .mt-5.text-red.ft-13 *添加日期在1年1个月之内的为新客户，否则为老客户
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
            {lbl: '类型', prop: 'type', type: 'text'},
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
      // this.objectParams.parentId = this.loadDataVal[0].parentId
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
