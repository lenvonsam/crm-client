<template lang="pug">
.bg-white.p-10 
  //- span 类型得分=score[类型]
  .mt-10
    basic-table(:tableValue="tableValue", :loading="loading")
  .mt-10.text-center(v-if="currentAuth.hasUpdate == 1")
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
      // debugger
      // console.log(this.loadDataVal[0].parentId)
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
