<template lang="pug">
  .content
    breadcrumb(:breadItems="breadItems")
    .pt-15
      el-button(type="primary", size="small", icon="el-icon-plus") 添加到访客户
    .pt-15
      el-form(:inline="true")
        el-form-item(label="公司名称")
          el-input(size="small")
        el-form-item(label="联系人名称")
          el-input(size="small")
        el-form-item(label="联系方式")
          el-input(size="small")
      el-form(:inline="true")
        el-form-item(label="添加日期")
          el-date-picker(size="small")
        el-form-item(label="业务部门")
          el-input(size="small")
        el-form-item(label="业务员")
          el-input(size="small")
        el-form-item
          el-button(type="primary", size="small") 查询
          el-button(size="small") 重置
    div
      el-button(type="primary", size="small", icon="iconfont icon-exchange") 转化为正式客户
    .pt-15
      basic-table(:tableValue="tableValue")
</template>

<script>
  import breadcrumb from '@/components/Breadcrumb.vue'
  import basicTable from '@/components/BasicTable.vue'
  export default {
    layout: 'main',
    data() {
      return {
        breadItems: ['客户管理', '潜在客户'],
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
          hasCbx: true,
          tableHead: [{
            lbl: '序号',
            prop: 'id',
            sort: true
          }, {
            lbl: '时间',
            prop: 'date',
            type: 'date',
            width: 120
          }, {
            lbl: '公司名称',
            type: 'link',
            prop: 'comp',
            linkUrl: '/customManager/potentialCustom/detail',
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
    components: {
      breadcrumb,
      basicTable
    }
  }
</script>