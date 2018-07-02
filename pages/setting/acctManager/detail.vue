<template lang="pug">
.content
  breadcrumb(:breadItems="breadItems")
  .pt-15
    el-button(size="medium", icon="el-icon-back", @click="back()") 返回
  detail-table.mt-15(:tableForm="formItems", :tableValue="obj")
</template>

<script>
  import breadcrumb from '@/components/Breadcrumb.vue'
  import detailTable from '@/components/DetailTable.vue'
  export default {
    layout: 'main',
    components: {
      breadcrumb,
      detailTable
    },
    data () {
      return {
        breadItems: ['系统设置', '账号管理', '查看详情'],
        obj: {
          loginAcct: 'admin',
          name: '测试',
          org: '型云科技',
          dpt: '平台',
          phone: '1333',
          dataAuth: '公司',
          status: 1,
          role: '业务员',
          jobTitle: '业务员',
          sex: 1
        },
        formItems: [
          [{lbl: '编号', key: 'loginAcct'}, {lbl: '姓名', key: 'name'}],
          [{lbl: '机构', key: 'org'}, {lbl: '部门', key: 'dpt'}],
          [{lbl: '手机号', key: 'phone'}, {lbl: '数据权限等级', key: 'dataAuth'}],
          [{lbl: '状态', key: 'status'}, {lbl: '角色', key: 'role'}],
          [{lbl: '职位', key: 'jobTitle'}, {lbl: '性别', key: 'sex'}]
        ]
      }
    }
  }
</script>