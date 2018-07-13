<template lang="pug">
.content
  search-form(:searchFormItems="searchFormItems")
  .mt-15
    basic-table(:tableValue="tableValue")
</template>
<script>
import searchForm from '@/components/SearchForm.vue'
import basicTable from '@/components/BasicTable.vue'
export default {
  components: {
    basicTable,
    searchForm
  },
  data () {
    return {
      searchFormItems: [[{label: '公司名称', model: 'compName', type: 'text', placeholder: '请输入公司名称', val: ''},
          {label: '添加人', model: 'createName', type: 'text', placeholder: '请输入添加人', val: ''}]],
      tableValue: {
        tableData: [{
          id: 1,
          compName: '江苏江阴经济开发区靖江园区金鼎商贸有限公司',
          linkerName: '孙君涛',
          linkerWay: '12345678901',
          lossDate: '2018-05-21',
          createName: '王佳浩',
          createDate: '2018-05-21',
          visiNo: '10'
        }],
        hasCbx: false,
        edit: true,
        tableHead: [{
          lbl: '公司名称',
          prop: 'compName',
          type: 'link',
          linkUrl: '/customManager/contactManager/detail'
        }, {
          lbl: '主联系人',
          prop: 'linkerName'
        }, {
          lbl: '联系方式',
          prop: 'linkerWay'
        }, {
          lbl: '流失日期',
          prop: 'lossDate'
        }, {
          lbl: '添加人',
          prop: 'createName'
        }, {
          lbl: '添加时间',
          prop: 'createDate'
        }, {
          lbl: '拜访次数',
          prop: 'visiNo'
        }, {
          lbl: '计划完成日期',
          prop: '',
          editType: 'date'
        }, {
          type: 'action',
          actionBtns: [{
            lbl: '设为已拜访',
            type: ''
          }, {
            lbl: '编辑',
            type: 'edit'
          }]
        }]
      }
    }
  }
}
</script>
