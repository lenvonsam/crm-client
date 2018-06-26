<template lang="pug">
div
  el-table(:data="tableValue.tableData", style="width: 100%", border, v-if="tableValue", @selection-change="handleSelectionChange", :default-sort="{order: 'descending'}", size="medium", header-cell-class-name="crm-table-head-bg")
    el-table-column(v-if="tableValue.hasCbx", type="selection", width="55")
    template(v-for="head in tableValue.tableHead")
      el-table-column(v-if="head.type == 'date'", :label="head.lbl", :width="head.width ? head.width : 'auto'")
        template(slot-scope="scope") {{scope.row[head.prop]}}
      el-table-column(v-else-if="head.type == 'link'", :label="head.lbl", width="head.width ? head.width : 'auto'")
        template(slot-scope="scope")
          a(:href="head.linkUrl + '?id=' + scope.row.id") {{scope.row[head.prop]}}
      el-table-column(v-else-if="head.type == 'action'", label="操作")
        template(slot-scope="scope")
          template(v-for="btn in head.actionBtns")
            el-button(type="text", :class="btn.class ? btn.class : 'default'", @click="handerRowBtn(scope.row, btn.type)") {{ btn.lbl}}
      el-table-column(v-else,:label="head.lbl", :width="head.width ? head.width : 'auto'", :property="head.prop", :sortable="head.sort ? head.sort : false")
  .padding.text-right
    el-pagination(:current-page="currentPage", :page-size="pageSize", background, layout="prev, pager, next, jumper", :total="total", @current-change="pgCurrentChange")

</template>

<script>
  export default {
    props: {
      tableValue: {
        type: null,
        default: false
      },
      currentPage: {
        type: Number,
        default: 1
      },
      total: {
        type: Number,
        default: 100
      },
      pageSize: {
        type: Number,
        default: 15
      }
    },
    methods: {
      handerRowBtn (row, btnType) {
        if (btnType === 'add')
          this.$emit('tableRowAdd', row)
        else if (btnType === 'edit')
          this.$emit('tableRowEdit', row)
        else if (btnType === 'delete')
          this.$emit('tableRowDelete', row)
      },
      handleSelectionChange (rows) {
        console.log(rows)
      },
      pgCurrentChange (val) {
        console.log(val)
      }
    }
  }
</script>

<style lang="stylus", scoped>
@import "../assets/stylus/color"
.el-table__row
  .cell
    a
      color $color-main
      &:hover
        cursor pointer
</style>
