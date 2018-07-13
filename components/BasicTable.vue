<template lang="pug">
div
  el-table(:data="currentData", style="width: 100%", border, @selection-change="handleSelectionChange", :default-sort="{order: 'descending'}", size="medium", header-cell-class-name="crm-table-head-bg", :filter-change="tableFiler")
    el-table-column(v-if="tableValue.hasCbx", type="selection", width="55")
    template(v-for="head in tableValue.tableHead")
      //- el-table-column(v-if="head.type == 'date'", :label="head.lbl", :width="head.width ? head.width : 'auto'")
        template(slot-scope="scope") {{scope.row[head.prop]}}
      el-table-column(v-if="head.type == 'link'", :label="head.lbl", width="head.width ? head.width : 'auto'")
        template(slot-scope="scope")
          a(:href="head.linkUrl + '?id=' + scope.row.id") {{scope.row[head.prop]}}
      el-table-column(v-else-if="head.type == 'edit'", :label="head.lbl", :width="head.width ? head.width : 'auto'", :sortable="head.sort ? head.sort : false")
        template(slot-scope="scope")
          span(v-if="!scope.row.edit") {{scope.row[head.prop] | rowData(head.prop)}}
          template(v-else)
            el-input(size="mini", v-if="head.editType == 'text'", v-model="scope.row[head.prop]")
            el-date-picker.full-width(v-else-if="head.editType == 'date'", type="date", v-model="scope.row[head.prop]", size="small", format="yyyy-MM-dd")
            el-select(v-else-if="head.editType == 'select'", v-model="scope.row[head.prop]", size="mini")
              el-option(v-for="item in head.selectList", :key="item.value", :label="item.label", :value="item.value")
      el-table-column(v-else-if="head.type == 'action'", label="操作")
        template(slot-scope="scope")
          template(v-for="btn in head.actionBtns", v-if="!scope.row.edit")
            el-button(type="text", :class="btn.class ? btn.class : 'default'", @click="handerRowBtn(scope.row, btn.type)") {{btn.lbl}}
          template(v-else)
            el-button(v-if="scope.row.edit", type="text", :class="btn.class ? btn.class : 'default'", @click="handerRowBtn(scope.row, 'save')") 保存
            el-button(v-if="scope.row.edit", type="text", :class="btn.class ? btn.class : 'default'", @click="handerRowBtn(scope.row, 'cancel')") 取消
      el-table-column(v-else-if="head.type == 'object'", :label="head.lbl", :width="head.width? head.width : 'auto'")
        template(slot-scope="scope") {{head.factValue(scope.row[head.prop])}}
      el-table-column(v-else,:label="head.lbl", :width="head.width ? head.width : 'auto'", :sortable="head.sort ? head.sort : false")
        template(slot-scope="scope") {{scope.row[head.prop] | rowData(head.prop)}}
  .padding.text-right
    el-pagination(:current-page="currentPage", :page-size="pageSize", background, layout="prev, pager, next, jumper", :total="total", @current-change="pgCurrentChange")

</template>

<script>
  export default {
    data () {
      return {
        currentData: []
      }
    },
    beforeMount () {
    	this.$nextTick(() => {
    		this.currentData = Object.assign([], this.tableValue.tableData)
    	})
    },
    watch: {
      'tableValue.tableData': {
        handler (newVal, oldVal) {
          this.currentData = Object.assign([], newVal)
        },
        deep: true
      }
    },
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
      str2Date (dateStr) {
        console.log('dataStr:>>>' + dateStr)
        return new Date(dateStr)
      },
      handerRowBtn (row, btnType) {
        if (btnType === 'add')
          this.$emit('tableRowAdd', row)
        else if (btnType === 'query')
          this.$emit('tableRowQuery', row)
        else if (btnType === 'edit')
          this.$emit('tableRowEdit', row)
        else if (btnType === 'delete')
          this.$emit('tableRowDelete', row)
        else if (btnType === 'save')
          this.$emit('tableRowSave', row)
        else if (btnType === 'cancel')
          this.$emit('tableRowCancel', row)
      },
      handleSelectionChange (rows) {
        this.$emit('chooseData', rows)
      },
      pgCurrentChange (val) {
        console.log(val)
        this.$emit('pageChange', val)
      },
      tableFiler (row, col) {
        console.log('row')
        console.log(row)
        console.log('col')
        console.log(col)
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
