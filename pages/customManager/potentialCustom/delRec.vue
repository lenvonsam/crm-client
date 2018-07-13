<template lang = "pug">
.content
  breadcrumb(:breadItems="breadItems")
  .mt-15
    search-form(:searchFormItems="searchFormItems", @search="searchForm")
  .mt-15
    basic-table(:tableValue="tableValue")
</template>
<script>
import breadcrumb from '@/components/Breadcrumb.vue'
import basicTable from '@/components/BasicTable.vue'
import searchForm from '@/components/SearchForm.vue'
import buttonGroup from '@/components/ButtonGroup.vue'
export default {
  layout: 'main',
  components: {
    breadcrumb,
    basicTable,
    searchForm,
    buttonGroup
  },
  data () {
    return {
      breadItems: ['潜在客户', '删除记录'],
      btnGroups: [{lbl: '返回'}, {lbl: '恢复到潜在客户'}],
      tableValue: {
          tableData: [{
            id: 1,
            date: '2018-02-23',
            comp: 'xxxx公司'
          }, {
            id: 2,
            date: '2018-03-10',
            comp: 'yyyy公司'
          }],
          hasCbx: false,
          tableHead: [{
            lbl: '公司名称',
            type: 'link',
            linkUrl: '/customManager/potentialCustom/detail',
            prop: 'comp'
          }, {
            lbl: '主联系人',
            prop: 'name'
          }, {
            lbl: '联系方式',
            prop: 'tel'
          }, {
            lbl: '添加日期',
            prop: 'createAt'
          }, {
            lbl: '业务部门',
            prop: 'fkDptName'
          }, {
            lbl: '业务员',
            prop: 'fkAcctName'
          }, {
            lbl: '创建人',
            prop: 'createName'
          }, {
            lbl: '删除人',
            prop: 'delName'
          }, {
            lbl: '删除时间',
            prop: 'delTime'
          }, {
            lbl: '删除理由',
            prop: 'remark'
          }]
        },
      searchFormItems: [
          [{label: '公司名称', model: 'compName', type: 'text', placeholder: '请输入公司名称', val: ''},
            {label: '联系人姓名', model: 'linkerName', type: 'text', placeholder: '请输入联系人姓名', val: ''},
            {label: '联系方式', model: 'linkWay', type: 'text', placeholder: '请输入联系方式', val: ''}],
          [{label: '添加日期', model: 'createAt', type: 'date', placeholder: '请选择转化日期', val: ''},
          {label: '业务部门', model: 'fkDptVal', type: 'autocomplete', placeholder: '请选择业务部门', val: '', list: [
            {'id':'001', 'value':'财务'},
            {'id':'002', 'value':'销售'},
            {'id':'003', 'value':'电商'}
          ]},
          {label: '业务员', model: 'fkAcctVal', type: 'autocomplete', placeholder: '请选择业务员', val: '', list: [
            {'id':'001', 'value':'ZHJM'},
            {'id':'002', 'value':'CZK'},
            {'id':'003', 'value':'CTH'}
          ]}]
        ]
    }
  },
  methods: {
    searchForm (data) {
      console.log(data)
    }
  }
}
</script>