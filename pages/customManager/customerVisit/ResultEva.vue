<template lang="pug">
.content
  button-group(:btns="btns")
  .mt-15
    search-form(:searchFormItems="searchFormItems")
  .mt-15
    basic-table(:tableValue="tableValue")
</template>
<script>
import searchForm from '@/components/SearchForm.vue'
import basicTable from '@/components/BasicTable.vue'
import buttonGroup from '@/components/ButtonGroup.vue'
export default {
  components: {
    basicTable,
    searchForm,
    buttonGroup
  },
  data () {
    return {
      btns: [{lbl:'导出excel'}],
      searchFormItems: [[{label: '公司名称', model: 'compName', type: 'text', placeholder: '请输入公司名称', val: ''},
          {label: '添加人', model: 'createName', type: 'text', placeholder: '请输入添加人', val: ''}]],
      tableValue: {
        tableData: [{
          id: 1,
          fkDptName: '营销二部',
          fkAcctName: '王佳浩',
          planVisit: '100',
          actualVisit: '80',
          successVisit: '65',
          successRate: '65%',
          Untraded: '15',
          notVisit: '20'
        }],
        hasCbx: false,
        edit: true,
        tableHead: [{
          lbl: '业务部门',
          prop: 'fkDptName'
        }, {
          lbl: '业务员',
          prop: 'fkAcctName'
        }, {
          lbl: '计划拜访',
          prop: 'planVisit'
        }, {
          lbl: '实际拜访',
          prop: 'actualVisit'
        }, {
          lbl: '拜访成功',
          prop: 'successVisit'
        }, {
          lbl: '成功率',
          prop: 'successRate'
        }, {
          lbl: '未交易',
          prop: 'Untraded'
        }, {
          lbl: '未拜访',
          prop: 'notVisit'
        }]
      }
    }
  }
}
</script>
