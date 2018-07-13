<template lang="pug">
  .content
    breadcrumb(:breadItems="breadItems")
    .mt-15
      search-form(:searchFormItems="searchFormItems", @search="searchForm")
    .mt-15
      .text-red.ft-15 *橙色代表快流失客户，绿色代表建议沟通客户，白色为正常客户
    .mt-5  
      basic-table(:tableValue="tableValue")
</template>

<script>
  import breadcrumb from '@/components/Breadcrumb.vue'
  import basicTable from '@/components/BasicTable.vue'
  import searchForm from '@/components/SearchForm.vue'
  export default {
    layout: 'main',
    components: {
      breadcrumb,
      basicTable,
      searchForm
    },
    data () {
      return {
        breadItems: ['客户管理', '客户画像'],
        searchFormItems: [
          [{label: '公司名称', model: 'compName', type: 'text', placeholder: '请输入公司名称', val: ''},
            {label: '联系人姓名', model: 'linkerName', type: 'text', placeholder: '请输入联系人姓名', val: ''},
            {label: '联系方式', model: 'linkWay', type: 'text', placeholder: '请输入联系方式', val: ''}],
          [{label: '转化日期', model: 'createAt', type: 'date', placeholder: '请选择转化日期', val: ''},
          {label: '业务部门', model: 'fkDptName', type: 'text', placeholder: '请选择业务部门', val: ''},
          {label: '业务员', model: 'fkAcctName', type: 'text', placeholder: '请选择业务员', val: ''}]
        ],
        tableValue: {
          tableData: [{
            id: 1,
            date: '2018-05-21',
            comp: '江苏江阴经济开发区靖江园区金鼎商贸有限公司',
            linker: '孙君涛',
            linkWay: '12345678901',
            fkDptName: '营销一部',
            fkAcctName: '王佳浩',
            createName: '王佳浩'
          }],
          hasCbx: false,
          tableHead: [{
            lbl: '公司名称',
            prop: 'comp',
            type: 'link',
            linkUrl: '/customManager/customerPortrait/detail'
          }, {
            lbl: '主联系人',
            prop: 'linker'
          }, {
            lbl: '联系方式',
            prop: 'linkWay'
          }, {
            lbl: '转化时间',
            prop: 'date'
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
            lbl: '未开单天数',
            prop: '',
            sort: true
          }]
        }
      }
    },
    methods: {
      searchForm (data) {
        console.log(data)
      }
    }
  }
</script>