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
        breadItems: ['客户管理', '联系人管理'],
        btnGroups: [{lbl: '新增联系人信息', type: 'add'}],
        searchFormItems: [
          [{label: '公司名称', model: 'compName', type: 'text', placeholder: '请输入公司名称', val: ''},
            {label: '联系人姓名', model: 'linkerName', type: 'text', placeholder: '请输入联系人姓名', val: ''},
            {label: '联系方式', model: 'linkerWay', type: 'text', placeholder: '请输入联系方式', val: ''}],
          [{label: '添加日期', model: 'createAt', type: 'date', placeholder: '请选择添加日期', val: ''},
          {label: '联系人类型', model: 'linkerType', type: 'select', placeholder: '请选择联系人类型', val: '', list: [{value: '001', label: '主联系人'}]},
          {label: '性别', model: 'sex', type: 'text', placeholder: '请选择性别', val: ''}],
          [{label: '职位', model: '', type: 'autocomplete', placeholder: '请选择职位', val: ''},
          {label: '业务部门', model: 'fkDptName', type: 'text', placeholder: '请选择业务部门', val: ''},
          {label: '业务员', model: 'fkAcctName', type: 'text', placeholder: '请选择业务员', val: ''}]
        ],
        tableValue: {
          tableData: [{
            id: 1,
            compName: '江苏江阴经济开发区靖江园区金鼎商贸有限公司',
            linkerName: '孙君涛',
            linkerWay: '12345678901',
            createAt: '2018-05-21',
            sex: '男',
            age: '26',
            qqNo: '1260521048',
            wxNo: 'dubuhao1994',
            createName: '王佳浩'
          }],
          hasCbx: true,
          tableHead: [{
            lbl: '所属客户',
            prop: 'compName',
            type: 'link',
            linkUrl: '/customManager/contactManager/detail'
          }, {
            lbl: '联系人',
            prop: 'linkerName'
          }, {
            lbl: '联系方式',
            prop: 'linkerWay'
          }, {
            lbl: '职位',
            prop: '',
            sort: true
          }, {
            lbl: '性别',
            prop: 'sex'
          }, {
            lbl: '年龄',
            prop: 'age'
          }, {
            lbl: 'qq',
            prop: 'qqNo',
            sort: true
          }, {
            lbl: '微信',
            prop: 'wxNo',
            sort: true
          }, {
            lbl: '添加时间',
            prop: 'createAt',
            sort: true
          }, {
            lbl: '创建人',
            prop: 'createName',
            sort: true
          }, {
            type: 'action',
            actionBtns: [{
              lbl: '编辑',
              type: 'edit'
            }, {
              lbl: '删除',
              type: 'delete'
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