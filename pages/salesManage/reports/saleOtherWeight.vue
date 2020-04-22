  <template lang="pug">
  .content
    breadcrumb(:breadItems="breadItems")
    .pt-15
      button-group(:btns="btnGroups", @groupBtnClick="groupBtnClick")
    .mt-15
      search-form(:searchFormItems="searchFormItems", @search="searchForm", ref="searchFrom", className='')
    .pt-15
      basic-table(:tableValue="tableValue", :currentPage="currentPage", :loading="loading", :pageSize="pageSize", @tableRowDelete="rowDel", @tableRowEdit="rowEdit", @pageChange="tableChange", :total="totalCount")
    el-dialog(:title="dialogTitle", :visible="dialogShow", width="800px", @close="subForm")
      el-form(:model="dialogForm", :rules="rules", ref="dialogForm", status-icon, label-width="80px", :validate-on-rule-change="false")
        .row
          .col
            el-form-item(label="月份")
              el-date-picker.full-width(v-model="dialogForm.yearMonth", type="month", :disabled="isEdit", placeholder="请选择月份", size="small", value-format="yyyyMM")
          .col
            el-form-item(label="业务员")
              el-select.full-width(v-model="dialogForm.empName", value-key, filterable, :disabled="isEdit", remote, size="small", placeholder="请输入业务员", :remote-method="selectRemote", clearable)
                el-option(v-for="item in empList", :key="item.id", :label="item.name", :value="item.name")
          .col
            el-form-item(label="销量")
              el-input.full-width(v-model="dialogForm.weight", placeholder="请输入销量", size="small") 
      .dialog-footer.text-right(slot="footer")
        el-button(size="medium", @click="subForm") 取消
        el-button(type="primary", size="medium", @click="subForm('ok')") 确定
</template>

<script>
import breadcrumb from '@/components/Breadcrumb.vue'
import basicTable from '@/components/BasicTable.vue'
import searchForm from '@/components/SearchForm.vue'
import buttonGroup from '@/components/ButtonGroup.vue'
import { mapState } from 'vuex'
export default {
  layout: 'main',
  components: {
    breadcrumb,
    basicTable,
    searchForm,
    buttonGroup
  },
  data () {
    return {
      dialogTitle: '新增',
      isEdit: false,
      rules: {},
      dialogForm: {
        empId: '',
        empName: '',
        yearMonth: '',
        weight: ''
      },
      dialogShow: false,
      btnGroups: [{ lbl: '新增', type: 'add' }],
      breadItems: ['销售管理', '销售其他销量'],
      currentPage: 0,
      totalCount: 0,
      pageSize: 20,
      tableValue: {
        height: 640,
        page: true,
        tableData: [],
        tableHead: [{
          lbl: '业务员',
          prop: 'empName',
          width: 150
        }, {
          lbl: '日期',
          prop: 'yearMonth',
          width: 120
        }, {
          lbl: '销量',
          prop: 'weight'
        }, {
          type: 'action',
          width: '150px',
          fixed: 'right',
          actionBtns: [{
            lbl: '编辑',
            type: 'edit'
          }, {
            lbl: '删除',
            type: 'delete'
          }]
        }]
      },
      loading: false,
      yearMonth: '',
      searchFormItems: [
        [
          { label: '年份', model: 'yearMonth', type: 'month', placeholder: '请选择月份', val: '' },
          { label: '业务员', model: 'platformCode', type: 'selectRemote', list: [], val: '', url: 'setting/acct/queryCombo', queryKey: 'acctName' }
        ]
      ],
      empList: []
    }
  },
  mounted () {
    this.searchFormItems[0][0].val = this.dataMonthStr(new Date())
    this.$nextTick(() => {
      this.yearMonth = this.searchFormItems[0][0].val
      this.loadData()
      this.selectRemote()
    })
  },
  computed: {
    ...mapState({
      currentUser: state => state.user.currentUser
    })
  },
  methods: {
    dialogCancel () {
      this.dialogShow = false
    },
    groupBtnClick () {
      // this.pageShow(this)
      this.isEdit = false
      this.dialogShow = true
    },
    tableChange (val) {
      this.loading = true
      this.currentPage = val
      this.loadData()
    },
    async loadData () {
      try {
        let url = `erpReport/otherWeightList?pageSize=${this.pageSize}&currentPage=${this.currentPage}&uid=${this.currentUser.id}`
        if (this.yearMonth) url += `&yearMonth=${this.yearMonth}`
        if (this.empCode) url += `&empCode=${this.empCode}`
        let { data } = await this.apiStreamPost('/proxy/common/get', { url: encodeURI(url) })
        if (data.returnCode === 0) {
          this.tableValue.tableData = data.list
          this.totalCount = data.total
          this.loading = false
        } else {
          this.msgShow(this, data.errMsg)
        }
      } catch (e) {
        console.error(e)
        this.msgShow(this)
        this.loading = false
      }
    },
    searchForm (paramsObj) {
      this.loading = true
      this.yearMonth = paramsObj.yearMonth
      this.empCode = paramsObj.platformCode
      this.loadData()
    },
    rowEdit (row) {
      this.dialogTitle = '编辑'
      this.isEdit = true
      this.dialogShow = true
      this.dialogForm = JSON.parse(JSON.stringify(row))
    },
    subForm (type) {
      if (type === 'ok') {
        this.save()
      } else {
        this.dialogShow = false
      }
      console.log('subForm')
    },
    rowDel (row) {
      this.confirmDialog(this, '您确认要删掉本行记录吗？').then(() => {
        this.del(row.id)
      }, () => {
        console.log('delete')
      })
    },
    async del (id) {
      try {
        let { data } = await this.apiStreamPost('/proxy/common/del', { url: 'erpReport/deleteOtherWeight/' + id })
        if (data.returnCode === 0) {
          this.msgShow(this, '删除成功', 'success')
          this.loadData()
        } else {
          this.msgShow(this, data.errMsg)
        }
      } catch (e) {
        console.error(e)
        this.msgShow(this)
      }
    },
    async save () {
      try {
        const params = this.dialogForm
        const emp = this.empList.find(item => {
          return item.name === this.dialogForm.empName
        })
        if (emp) {
          params.platformCode = emp.platformCode
          params.empId = emp.id
        }
        delete params.idx
        delete params.createAt
        delete params.updateAt
        let url = 'erpReport/saveOtherWeight'
        if (params.id) url = 'erpReport/updateOtherWeight'
        let { data } = await this.apiStreamPost('/proxy/common/post', { url: url, params: params })
        if (data.returnCode === 0) {
          this.msgShow(this, '操作成功', 'success')
          this.dialogShow = false
          this.loadData()
        } else {
          this.msgShow(this, data.errMsg)
        }

      } catch (e) {
        console.log(e)
      }
    },
    async selectRemote (val) {
      const url = 'setting/acct/queryCombo'
      let params = {
        pageSize: 10,
        uid: this.currentUser.id
      }
      params.acctName = val
      let me = this
      try {
        let { data } = await this.apiStreamPost('/proxy/common/post', { url: url, params: params })
        if (data.returnCode === 0) {
          this.empList = data.list
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
<style lang="stylus", scoped>
.width-input-250
  width 250px
</style>