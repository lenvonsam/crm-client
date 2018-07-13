<template lang="pug">
div
  basic-table(:tableValue="tableValue")
</template>

<script>
import basicTable from '@/components/BasicTable.vue'
export default{
  components: {
    basicTable
  },
  data () {
    return {
      tableValue: {
        tableHead: [
          {lbl: '时间', prop: 'date', type: 'text'},
          {lbl: '业务员', prop: 'fkDptName', type: 'text'},
          {lbl: '操作员', prop: 'operatorName', type: 'text'}],
        hasCbx: false,
        edit: true,
        tableData: []
      },
      snapData: [],
    }
  },
  mounted () {
    this.tableValue.tableData = [{id: 1, date: '2018-05-21  18:32:22',fkDptName: '王佳浩',operatorName: 'erp同步'}]
  },
  methods: {}
}
</script>
