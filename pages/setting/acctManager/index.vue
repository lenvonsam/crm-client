<template lang="pug">
.content
  breadcrumb(:breadItems="breadItems")
  .pt-15
    button-group(:btns="btnGroups")
  .mt-15.padding(style="border: 1px dashed #ddd")
    .row.flex-center.text-center
      .col.pr-15
        .row.mb-15.flex-center
          .col.flex-60
            label 姓名
          .col
            el-input(size="small")
        .row.flex-center
          .col.flex-60
            label 部门
          .col
            el-input(size="small")
      .col.pr-15
        .row.mb-15.flex-center
          .col.flex-60
            label 账号
          .col
            el-input(size="small")
        .row.flex-center
          .col.flex-60
            label 职位
          .col
            el-input(size="small")
      .col
        .row.mb-15.flex-center
          .col.flex-60
            label 机构
          .col
            el-input(size="small")
        .row.flex-center
          .col.flex-60
            label 手机号
          .col
            el-input(size="small")
      .col.text-center(style="flex: 0 0 200px")
        el-button(size="small", type="primary") 查询
        el-button(size="small") 重置
  .pt-15
    basic-table(:tableValue="tableValue")
</template>

<script>
  import breadcrumb from '@/components/Breadcrumb.vue'
  import basicTable from '@/components/BasicTable.vue'
  import buttonGroup from '@/components/ButtonGroup.vue'
  export default {
    layout: 'main',
    components: {
      breadcrumb,
      basicTable,
      buttonGroup
    },
    data () {
      return {
        breadItems: ['系统设置', '账号管理'],
        btnGroups: [{
          lbl: '新增账号'
        }, {
          lbl: '批量启用'
        }, {
          lbl: '批量停用'
        }],
        tableValue: {
          tableData: [{
            id: 1,
            name: '测试',
            loginAcct: 'admin',
            org: '型云科技',
            dpt: '平台',
            jobTitle: '程序员',
            phone: '无',
            status: 1
          }],
          hasCbx: true,
          tableHead: [{
            lbl: '姓名',
            type: 'link',
            prop: 'name',
            linkUrl: '/setting/acctManager/detail'
          }, {
            lbl: '账号',
            prop: 'loginAcct'
          }, {
            lbl: '机构',
            prop: 'org'
          }, {
            lbl: '部门',
            prop: 'dpt'
          }, {
            lbl: '职位',
            prop: 'jobTitle'
          }, {
            lbl: '手机号',
            prop: 'phone'
          }, {
            lbl: '状态',
            prop: 'status'
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
    }
  }
</script>

<style lang="stylus", scoped>

</style>
