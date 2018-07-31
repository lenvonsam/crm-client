<template lang="pug">
div
  el-table(:data="currentData", :row-class-name="tableRowClassName",  v-loading="loading", style="width: 100%", border, @selection-change="handleSelectionChange", :default-sort="{order: 'descending'}", size="medium", :header-cell-class-name="headerCellClassName", :filter-change="tableFiler")
    el-table-column(v-if="tableValue.hasCbx", type="selection", width="55")
    template(v-for="head in tableValue.tableHead")
      //- el-table-column(v-if="head.type == 'date'", :label="head.lbl", :width="head.width ? head.width : 'auto'")
        template(slot-scope="scope") {{scope.row[head.prop]}}
      el-table-column(v-if="head.type == 'link'", :label="head.lbl", width="head.width ? head.width : 'auto'")
        template(slot-scope="scope")
          a(:href="head.linkUrl + '?id=' + scope.row.id") {{scope.row[head.prop]}}
            el-badge.mark(value="主", v-if="scope.row.mainStatus == 1 && head.prop == 'name'")
      el-table-column(v-else-if="head.type == 'linkObject'", :label="head.lbl", :width="head.width? head.width : 'auto'")
        template(slot-scope="scope")
          a(:href="head.linkUrl + '?id=' + head.factValue(scope.row[head.prop]).id") {{head.factValue(scope.row[head.prop]).name}}
      el-table-column(v-else-if="head.type == 'edit'", :label="head.lbl", :width="head.width ? head.width : 'auto'",  :prop="head.prop", :sortable="head.sort ? head.sort : false")
        template(slot-scope="scope")
          span(v-if="!scope.row.edit") {{scope.row[head.prop] | rowData(head.prop)}}
            el-badge.mark(value="主", v-if="(scope.row.mainStatus == 1 || scope.row.mainAcct == 1) && head.prop == 'name'")
          template(v-else)
            el-input(size="mini", v-if="head.editType == 'text'", v-model="scope.row[head.prop]")
            el-date-picker.full-width(v-else-if="head.editType == 'date'", type="date", v-model="scope.row[head.prop]", size="small", format="yyyy-MM-dd", value-format="yyyy-MM-dd")
            el-select(v-else-if="head.editType == 'select'", v-model="scope.row[head.prop]", size="mini")
              el-option(v-for="item in head.selectList", :key="item.value", :label="item.label", :value="item.value")
      el-table-column(v-else-if="head.type == 'action'", label="操作", :width="head.width ? head.width : 'auto'")
        template(slot-scope="scope")
          template(v-if="!scope.row.edit")
            template(v-for="btn in head.actionBtns")
              el-button(type="text", v-if="canShowRowBtn(btn.type, scope, btn.lbl)", :class="btn.class ? btn.class : 'default'", @click="handerRowBtn(scope.row, btn.type)") {{btn.lbl}}
          template(v-else)
            el-button(type="text", class="default", @click="handerRowBtn(scope.row, 'save')") 保存
            el-button(type="text", class="default", @click="handerRowBtn(scope.row, 'cancel')") 取消
      el-table-column(v-else-if="head.type == 'object'", :label="head.lbl", :width="head.width? head.width : 'auto'",  :prop="head.prop", :sortable="head.sort")
        template(slot-scope="scope") {{head.factValue(scope.row[head.prop])}}
      el-table-column(v-else,:label="head.lbl", :width="head.width ? head.width : 'auto'", :prop="head.prop", :sortable="head.sort", :align="head.align ? head.align : 'left'")
        template(slot-scope="scope") {{scope.row[head.prop] | rowData(head.prop)}}
          el-badge.mark(value="主", v-if="scope.row.mainStatus == 1 && head.prop == 'name'")
          span(v-if="head.prop == 'billDate'", @click="handerRowBtn(scope.row, 'lock')") / 90
            i.iconfont.icon-lockb(v-if="scope.row.lockStatus == 0")
            i.iconfont.icon-locka(v-else)
  .padding.text-right
    el-pagination(:current-page="currentPage", :page-size="pageSize", background, layout="prev, pager, next, jumper", :total="total", @current-change="pgCurrentChange")

</template>

<script>
  import { mapState } from 'vuex'
  export default {
    data () {
      return {
        currentData: []
      }
    },
    computed: {
      ...mapState({
        currentUser: state => state.user.currentUser
      })
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
      },
      loading: {
        type: Boolean,
        default: true
      },
      lockFun: {
        type: Function,
        require: true
      }
    },
    methods: {
      tableRowClassName ({row, rowIndex}) {
        if(this.tableValue.rowClassName){
          if (row.billDate > 60) {
            return 'loss-cstm'
          } else if (row.billDate > 30) {
            return 'communicate-cstm'
          }
        }
      },
      headerCellClassName ({row, column, rowIndex, columnIndex}) {
        let head = this.tableValue.tableHead[columnIndex]
        if (head !== undefined && head.hasOwnProperty('required')) {
          return 'crm-table-required'
        }
      },
      str2Date (dateStr) {
        return new Date(dateStr)
      },
      canShowRowBtn (type, scope, lbl) {
        let result = true
        let condition = true
        if (this.currentUser.id !== 1) {
          let idx = this.currentUser.auths.findIndex(itm => this.$route.path.startsWith(itm.fkMenu.pageUrl))
          const currentAuth = this.currentUser.auths[idx]
          if (type === 'edit' && currentAuth.hasUpdate === 0) result = false
          if (type === 'delete' && currentAuth.hasDelete === 0) result = false
        }
        if(type === 'setVisit'){
          condition = !(scope.row.status == 0 && lbl == '设为失败') && !(scope.row.status == 1 && lbl == '设为已拜访')
        } else {
          condition = !((scope.row.mainStatus == 1 || scope.row.mainAcct == 1) && lbl == '删除')
        }
        return result && condition
      },
      handerRowBtn (row, btnType) {
        this.$emit(`tableRow${btnType.substring(0, 1).toUpperCase()}${btnType.substring(1)}`, row)
      },
      handleSelectionChange (rows) {
        this.$emit('chooseData', rows)
      },
      pgCurrentChange (val) {
        // console.log(val)
        this.$emit('pageChange', val)
      },
      tableFiler (row, col) {
        // console.log('row')
        // console.log(row)
        // console.log('col')
        // console.log(col)
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
    i.iconfont.icon-locka:hover,
    i.iconfont.icon-lockb:hover
      cursor pointer
</style>
