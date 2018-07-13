<template lang="pug">
.content
  .box( v-if="tableValue")
    .ft-16.border-bottom-line.pb-10 {{tableValue.title}}
    el-form.pt-15(:inline="true", :model="searchForm" ref="searchForm" label-width="60px")
      el-form-item(label="日期：", prop="date")
        el-date-picker(type="date", placeholder="选择日期", v-model="searchForm.date" style="width: 200px;", size="small")
      el-form-item
        el-button(type="primary", @click="submitForm('searchForm')", size="small") 查询
        el-button(type="primary", @click="resetForm('searchForm')", size="small") 重置
    el-table(:data="tableValue.tableData", border)
      template(v-for="head in tableValue.tableHead")
        el-table-column(:prop="head.prop", :label="head.label")
          template(slot-scope="scope") {{scope.row[head.prop] | rowData(head.prop)}}
</template>
<script>
  export default{
    layout: 'main',
    props: {
      title: {
        type: String,
        default: ''
      },
      tableValue: {
        type: null,
        default: false
      },
      search: {
        type: Function,
        required: true
      }
    },
    data () {
      return {
        searchForm: {
          date: new Date()
        }
      }
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.search(this.searchForm)
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>
<style lang="stylus", scoped>
  .box
    width: 100%
    padding: 10px
    box-sizing: border-box
</style>