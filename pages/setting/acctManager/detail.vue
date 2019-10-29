<template lang="pug">
.content
  breadcrumb(:breadItems="breadItems")
  .pt-15
    el-button(size="small", @click="back()") 返回列表
  detail-table.mt-15(:tableForm="formItems", :tableValue="obj", v-if="obj.id")
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
        },
        formItems: [
          [{lbl: '账号', key: 'loginAcct'}, {lbl: '姓名', key: 'name'}],
          [{lbl: '机构', key: 'fkDpt', type: 'object', factValue: (row) => {return row.fkOrg.name || ''}}, {lbl: '部门', key: 'fkDpt', type: 'object', factValue: (row) => {return row.name}}],
          [{lbl: '手机号', key: 'phone'}, {lbl: '数据权限等级', key: 'dataLevel'}],
          [{lbl: '状态', key: 'status'}, {lbl: '角色', key: 'fkRole', type: 'object', factValue: (row) => {return row.name}}],
          [{lbl: '职位', key: 'position'}, {lbl: '性别', key: 'sex'}],
          [{lbl: '民族', key: 'national'}, {lbl: '学历', key: 'edu'}],
          [{lbl: '专业', key: 'professional'}, {lbl: '邮箱', key: 'email'}],
          [{lbl: '职称', key: 'jobTitle'}, {lbl: '电话', key: 'telephone'}],
          [{lbl: '地址', key: 'addr'}, {lbl: '籍贯', key: 'nativePlace'}],
          [{lbl: '婚姻状况', key: 'maritalStatus'}, {lbl: '政治面貌', key: 'politicalLandscape'}],
          [{lbl: '生日', key: 'birthday'}, {lbl: '入职时间', key: 'inTime'}],
          [{lbl: '工作组', key: 'workGroup'}, {lbl: '备注', key: 'remark'}],
          [{lbl: '身份证', key: 'idCardNo'}]
        ]
      }
    },
    beforeMount () {
      this.loadData()
    },
    methods: {
      async loadData () {
        try {
          let { data } = await this.apiStreamPost('/proxy/common/get', {url: 'setting/acct/' + this.$route.query.id})
          if (data.returnCode === 0) {
            this.obj = data.obj
          } else {
            this.msgShow(this, data.errMsg)
          }
        } catch (e) {
          console.error(e)
          this.msgShow(this)
        }
      }
    }
  }
</script>