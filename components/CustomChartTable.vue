<template lang="pug">
.content
  .box( v-if="tableValue")
    .ft-16.border-bottom-line.pb-10(v-if="tableValue.title") {{tableValue.title}}
    el-form.pt-15(:inline="true", :model="searchForm" ref="searchForm" label-width="60px")
      el-form-item(label="日期：", prop="date")
        el-date-picker(type="daterange", range-separator="-", start-placeholder="开始日期", end-placeholder="结束日期",v-model="searchForm.date" style="width: 250px;", size="small", :picker-options="datePickerOpts", value-format="yyyy-MM-dd")
      el-form-item
        el-button(type="primary", @click="submitForm('searchForm')", size="small") 查询
        el-button(@click="resetForm('searchForm')", size="small") 重置
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
          date: ''
        }
      }
    },
    mounted () {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      end.setTime(end.getTime() - 3600 * 1000 * 24)
      this.searchForm.date = [new Date(start), new Date(end)]
    },
    methods: {
      submitForm(formName) {
        if (this.searchForm.date == '' || this.searchForm.date == null) {
          this.msgShow(this, '请选择日期')
        }  else {
          this.search(this.searchForm)
        }
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      dateChange (val) {
        console.log(val)
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