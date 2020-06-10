
  <template lang="pug">
  .content
    breadcrumb(:breadItems="breadItems")
    .pt-15
      el-row
        el-button(:type="tab === 0 ? 'primary' : 'default'" @click="getTab(0)") 超期未提
        el-button(:type="tab === 1 ? 'primary' : 'default'" @click="getTab(1)") 历史记录
    .mt-15
      search-form(:searchFormItems="searchFormItems", @search="searchForm", ref="searchFrom")
    .mt-15(v-if="tab === 0") 超期未提，费用单价为
      span.text-bule {{feePrice}}
        span.text-black 元/天/吨
    .pt-15
      basic-table(:tableValue="tableValue", :currentPage="paramsObj.currentPage", :loading="loading", 
      :pageSize="paramsObj.pageSize", :total="totalCount", @pageChange="tableChange", 
      @tableRowViodFee="rowViodFee", @tableRowPaying="rowPaying", @tableRowDelete="rowDelete")
</template>

<script>
import breadcrumb from '@/components/Breadcrumb.vue'
import basicTable from '@/components/BasicTable.vue'
import searchForm from '@/components/SearchForm.vue'
import { mapState } from 'vuex'
export default {
  layout: 'main',
  components: {
    breadcrumb,
    basicTable,
    searchForm
  },
  data () {
    return {
      breadItems: ['销售管理', '超期未提仓储费'],
      feePrice: '*',
      totalCount: 100,
      paramsObj: {
        currentPage: 0,
        pageSize: 20,
        startTime: '',
        endTime: '',
        source: '',
        billCode: '',
        customer: '',
        empCode: '',
        dptName: '',
        goodsFlag: '',
      },
      tableValue: {
        height: 640,
        numShow: true,
        hasCbx: false,
        rowClassName: false,
        tableData: [],
        tableHead: [{
          lbl: '来源',
          prop: 'wsFlag'
        }, {
          lbl: '单号',
          prop: 'billcode',
          width: '150px'
        }, {
          lbl: '客户名称',
          prop: 'datasCustomername',
          width: '200px'
        }, {
          lbl: '联系电话',
          prop: 'linkmobile'
        }, {
          lbl: '提货状态',
          prop: 'goodsFlag',
          class: 'text-green'
        }, {
          lbl: '预计未提',
          prop: 'preUndelivery'
        }, {
          lbl: '实超未提',
          prop: 'realUndelivery'
        }, {
          lbl: '开始时间',
          prop: 'startDate'
        }, {
          lbl: '提货截止时间',
          prop: 'endDate'
        }, {
          lbl: '超期时间',
          prop: 'overdueDate'
        }, {
          lbl: '超期金额',
          prop: 'undeliveryMoney'
        }, {
          lbl: '业务员',
          prop: 'employeeName'
        }, {
          lbl: '部门',
          prop: 'deptName'
        }, {
          type: 'action',
          width: '150px',
          fixed: 'right',
          actionBtns: [{
            lbl: '免收',
            type: 'viodFee',
            class: 'text-orange'
          }, {
            lbl: '待收款',
            type: 'paying'
          }, {
            lbl: '删除',
            type: 'delete',
            class: 'text-red'
          }]
        }]
      },
      loading: false,
      canClick: false,
      tab: 0
    }
  },
  mounted () {
    this.tab = 0
    this.$nextTick(() => {
      this.loadData(0)
    })
  },
  computed: {
    ...mapState({
      currentUser: state => state.user.currentUser
    }),
    searchFormItems () {
      let searchFrom = [
        [
          { label: '起始年月', model: 'startTime', type: 'month', placeholder: '请选择年月', val: '' },
          { label: '结束年月', model: 'endTime', type: 'month', placeholder: '请选择年月', val: '' },
          {            label: '来源', model: 'source', placeholder: '请选择来源', type: 'select',
            list: [
              { label: '全部', value: '全部' },
              { label: 'ERP', value: 'ERP' },
              { label: '型云', value: '型云' }
            ], val: ''          },
          { label: '单号', model: 'billCode', placeholder: '请输入单号', val: '' }
        ],
        [
          { label: '客户', model: 'customer', placeholder: '请输入客户', val: '' },
          { label: '业务员', model: 'empCode', placeholder: '请输入业务员', type: 'selectRemote', list: [], val: '', url: 'setting/acct/queryCombo', queryKey: 'acctName' },
          {            label: '业务部门', model: 'dptName', placeholder: '请输入业务部门', type: 'selectDept',
            list: [], val: ''          },
          {
            label: '提货状态', model: 'goodsFlag', type: 'select',
            list: [
              { label: '全部', value: '全部' },
              { label: '已完成', value: '已完成' },
              { label: '未完成', value: '未完成' }
            ], val: ''
          }
        ]
      ]
      return searchFrom
    }
  },
  methods: {
    searchForm (obj) {
      this.paramsObj = obj
      if (obj.source == 'ERP') {
        this.paramsObj.source = 0
      } else if (obj.source == '型云') {
        this.paramsObj.source = 1
      } else {
        this.paramsObj.source = ''
      }
      if (obj.goodsFlag == '未完成') {
        this.paramsObj.goodsFlag = 0
      } else if (obj.goodsFlag == '已完成') {
        this.paramsObj.goodsFlag = 1
      } else {
        this.paramsObj.goodsFlag = ''
      }
      this.paramsObj.currentPage = 0
      this.paramsObj.pageSize = 20
      this.loadData(this.tab)
    },
    getTab (tab) {
      if (this.canClick) {
        if (tab === 0) {
          this.tab = 0
          this.tableValue.tableHead = [
            {
              lbl: '来源',
              prop: 'wsFlag'
            }, {
              lbl: '单号',
              prop: 'billcode',
              width: '150px'
            }, {
              lbl: '客户名称',
              prop: 'datasCustomername',
              width: '200px'
            }, {
              lbl: '联系电话',
              prop: 'linkmobile'
            }, {
              lbl: '提货状态',
              prop: 'goodsFlag',
              class: 'text-green'
            }, {
              lbl: '预计未提',
              prop: 'preUndelivery'
            }, {
              lbl: '实超未提',
              prop: 'realUndelivery'
            }, {
              lbl: '开始时间',
              prop: 'startDate'
            }, {
              lbl: '提货截止时间',
              prop: 'endDate'
            }, {
              lbl: '超期时间',
              prop: 'overdueDate'
            }, {
              lbl: '超期金额',
              prop: 'undeliveryMoney'
            }, {
              lbl: '业务员',
              prop: 'employeeName'
            }, {
              lbl: '部门',
              prop: 'deptName'
            }, {
              type: 'action',
              width: '150px',
              fixed: 'right',
              actionBtns: [{
                lbl: '免收',
                type: 'viodFee',
                class: 'text-orange'
              }, {
                lbl: '待收款',
                type: 'paying'
              }, {
                lbl: '删除',
                type: 'delete',
                class: 'text-red'
              }]
            }]
        }
        if (tab === 1) {
          this.tab = 1
          this.tableValue.tableHead = [
            {
              lbl: '来源',
              prop: 'wsFlag'
            }, {
              lbl: '单号',
              prop: 'billcode',
              width: '150px'
            }, {
              lbl: '客户名称',
              prop: 'datasCustomername',
              width: '200px'
            }, {
              lbl: '联系电话',
              prop: 'linkmobile'
            }, {
              lbl: '提货状态',
              prop: 'goodsFlag',
              class: 'text-green'
            }, {
              lbl: '预计未提',
              prop: 'preUndelivery'
            }, {
              lbl: '实超未提',
              prop: 'realUndelivery'
            }, {
              lbl: '开始时间',
              prop: 'startDate'
            }, {
              lbl: '提货截止时间',
              prop: 'endDate'
            }, {
              lbl: '超期时间',
              prop: 'overdueDate'
            }, {
              lbl: '超期金额',
              prop: 'undeliveryMoney'
            }, {
              lbl: '业务员',
              prop: 'employeeName'
            }, {
              lbl: '部门',
              prop: 'deptName'
            }, {
              lbl: '状态',
              prop: 'state'
            }]
        }
        this.loadData(tab)
      } else {
        this.msgShow(this, '点击过于频繁，请稍后再试！')
      }

    },
    tableChange (val) {
      this.loading = true
      this.currentPage = val
      this.paramsObj.currentPage = this.currentPage
      this.loadData()
    },
    async loadData (tab) {
      this.canClick = false
      this.loading = true
      this.paramsObj.uid = this.currentUser.id
      console.log('入参========>' + JSON.stringify(this.paramsObj))
      try {
        let { data } = await this.apiStreamPost('/proxy/common/post',
          { url: tab === 0 ? 'overdue/overdueReport' : 'overdue/findOverdueDealHistory', params: this.paramsObj })
        if (data.returnCode === 0) {
          this.totalCount = data.total
          this.tableValue.tableData = data.list
          this.feePrice = data.feePrice
          this.tableValue.tableHead[4].class = this.tableValue.tableData.goodsFlag === '已完成' ? 'text-green' : 'text-red'
          console.log('this.tableValue.tableHead[4]===========>',JSON.stringify(this.tableValue.tableHead[4]))
          this.canClick = true
        }
        this.loading = false
      } catch (e) {
        console.error(e)
        this.loading = false
        this.canClick = true
        this.msgShow(this)
      }
    },
    async overdueDeal (params) {
      try {
        let { data } = await this.apiStreamPost('/proxy/common/post', { url: 'overdue/dealOverdueReport', params: params })
        if (data.returnCode === 0) {
          this.msgShow(this, '操作成功', 'success')
          this.loadData(0)
        } else {
          this.msgShow(this, data.errMsg)
        }
      } catch (e) {
        console.error(e)
        this.msgShow(this)
      }
    },
    rowViodFee (obj) {
      console.log(JSON.stringify(obj))
      this.confirmDialog(this, '是否免收该单位超期未提仓储费？', '提示').then(() => {
        let params = {}
        params.uid = this.currentUser.id
        params.billCode = obj.billcode
        params.dealType = 0
        this.overdueDeal(params)
      }, (e) => {
        console.log(e)
      })
    },
    rowPaying (obj) {
      let overdueMoney = ''
      this.$alert('<form>实际待收金额：<input id="money"></input><br />备注：<input id="remark"></input></form>', 'HTML 片段', {
        dangerouslyUseHTMLString: true
      }).then((res) => {
        let money = document.getElementById('money').value
        let remark = document.getElementById('remark').value
        if(money.trim() != '' && /^(?!0$|0\.00|0\.0|0\d+$)([1-9]?\d+(\.\d*)|(\\s&&[^\\f\\n\\r\\t\\v])|([1-9]*[1-9][0-9]*)?)$/.test(money)){
          console.log(money)
          console.log(remark)
          let params = {}
          params.uid = this.currentUser.id
          params.billCode = obj.billcode
          params.overdueMoney = money
          params.remark = remark
          params.dealType = 1
          this.overdueDeal(params)
        }else{
          this.msgShow(this,'请输入正确的金额')
          document.getElementById('money').value = ''
          document.getElementById('remark').value = ''
        }
        // if(/^(?!0$|0\.00|0\.0|0\d+$)([1-9]?\d+(\.\d*)|(\\s&&[^\\f\\n\\r\\t\\v])|([1-9]*[1-9][0-9]*)?)$/.test(money)){
          
        // }else{
          
        // }
      })
      // this.$prompt('实际待收金额：', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   inputPattern: /^(?!0$|0\.00|0\.0|0\d+$)([1-9]?\d+(\.\d*)|(\\s&&[^\\f\\n\\r\\t\\v])|([1-9]*[1-9][0-9]*)?)$/,
      //   inputErrorMessage: '请输入正确的金额'
      // }).then(({ value }) => {
      //   overdueMoney = value
      // }).catch((e) => {
      //   console.log(e)
      // });
      // this.confirmDialog(this, '实际待收金额：xxx（必填），备注：xxx(选填)', '提示').then(() => {
      //   let params = {}
      //   params.uid = this.currentUser.id
      //   params.billCode = obj.billcode
      //   params.overdueMoney = obj.overdueMoney
      //   params.dealType = 1
      //   this.overdueDeal(params)
      // }, (e) => {
      //   console.log(e)
      // })
    },
    rowDelete (obj) {
      this.confirmDialog(this, '您确认要删掉本行记录吗？').then(() => {
        // 删除接口
        let params = {}
        params.uid = this.currentUser.id
        params.billCode = obj.billcode
        params.dealType = 2
        this.overdueDeal(params)
      }, (e) => {
        console.log(e)
      })
    }
  }

}
</script>
<style lang="stylus", scoped>
.width-input-250
  width 250px
.text-bule
  color blue
.text-black
  color black
</style>