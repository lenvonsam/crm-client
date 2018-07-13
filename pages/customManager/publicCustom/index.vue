<template lang="pug">
  .content
    breadcrumb(:breadItems="breadItems")
    .pt-15
      button-group(:btns="btnGroups", @groupBtnClick="groupBtnClick")
    .mt-15
      search-form(:searchFormItems="searchFormItems", @search="searchForm")
    .mt-5  
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
        breadItems: ['客户管理', '公共客户'],
        btnGroups: [{lbl: '添加到客户拜访', type: 'add'}],
        searchFormItems: [
          [{label: '公司名称', model: 'compName', type: 'text', placeholder: '请输入公司名称', val: ''},
            {label: '联系人姓名', model: 'linkerName', type: 'text', placeholder: '请输入联系人姓名', val: ''},
            {label: '联系方式', model: 'linkWay', type: 'text', placeholder: '请输入联系方式', val: ''}],
          [{label: '流失日期', model: 'createAt', type: 'date', placeholder: '请选择流失日期', val: ''},
          {label: '业务部门', model: 'fkDptName', type: 'text', placeholder: '请选择业务部门', val: ''},
          {label: '业务员', model: 'fkAcctName', type: 'text', placeholder: '请选择业务员', val: ''}]
        ],
        tableValue: {
          tableData: [{
            id: 1,
            date: '2018-05-21',
            comp: '江苏江阴经济开发区靖江园区金鼎商贸有限公司',
            linkerName: '孙君涛',
            linkerWay: '12345678901',
            lossDate: '2018-05-21',
            fkAcctName: '王佳浩',
            fkDptName: '营销一部',
            fkAcctName: '业务员',
            createName: '王佳浩'
          }],
          hasCbx: true,
          tableHead: [{
            lbl: '公司名称',
            prop: 'comp',
            type: 'link',
            linkUrl: '/customManager/publicCustom/detail'
          }, {
            lbl: '主联系人',
            prop: 'linkerName'
          }, {
            lbl: '联系方式',
            prop: 'linkerWay'
          }, {
            lbl: '流失时间',
            prop: 'lossDate',
            sort: true
          }, {
            lbl: '业务部门',
            prop: 'fkDptName'
          }, {
            lbl: '业务员',
            prop: 'fkAcctName'
          }, {
            lbl: '未开单天数',
            prop: '',
            sort: true
          }, {
            lbl: '拜访次数',
            prop: '',
            sort: true
          }, {
            type: 'action',
            actionBtns: [{
              lbl: '编辑',
              type: 'edit'
            }]
          }]
        }
      }
    },
    methods: {
      searchForm (data) {
        console.log(data)
      },
      groupBtnClick (type) {
        if(type == 'outflow'){
          this.$router.push({path: '/customManager/formalCustom/outflowRec'})
        }
      }
    }
  }
</script>