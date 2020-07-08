<template lang="pug">
  .content
    .mt-15
      search-form(:searchFormItems="searchFormItems", @search="searchForm")
    .pt-15
      basic-table(:tableValue="tableValue", :currentPage="paramsObj.currentPage + 1", :loading="loading", :pageSize="paramsObj.pageSize", 
      :total="totalCount", @pageChange="tableChange")
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
        dealTypeStr: ''
      },
      tableValue: {
        tableName: 'overdueHistory',
        height: 640,
        numShow: false,
        hasCbx: false,
        rowClassName: false,
        spanMethod: true,
        tableData: [],
        provinceArr: [],
        OrderIndexArr: [],
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
          prop: 'linkmobile',
          width: '130px'
        }, {
          lbl: '联系人',
          prop: 'linkman'
        }, {
          lbl: '提货状态',
          prop: 'goodsFlag',
          class: 'text-green'
        }, {
          lbl: '超期吨位(吨)',
          prop: 'realUndelivery'
        }, {
          lbl: '开始时间',
          prop: 'startDate',
          width: '130px'
        }, {
          lbl: '提货截止时间',
          prop: 'endDate',
          width: '130px'
        }, {
          lbl: '操作时间',
          prop: 'operateTime',
          width: '130px'
        }, {
          lbl: '超期时间(天)',
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
      },
      loading: false,
    }
  },
  beforeMount () {
    this.$nextTick(() => {
      this.searchFormItems[0][2].val = ''
      this.searchFormItems[1][1].val = ''
      // this.searchFormItems[1][3].val = ''     
    })
  },
  mounted () {
    this.loadData()
    console.log('searchFormItem:>>', this.searchFormItems)
  },
  computed: {
    ...mapState({
      currentUser: state => state.user.currentUser
    }),
    searchFormItems: {
      get () {
        let searchFrom = [
          [
            { label: '开始时间起', model: 'startTime', type: 'month', placeholder: '请选择年月', val: '' },
            { label: '开始时间止', model: 'endTime', type: 'month', placeholder: '请选择年月', val: '' },
            {              label: '来源', model: 'source', placeholder: '请选择来源', type: 'select',
              list: [
                { label: '全部', value: '' },
                { label: 'ERP', value: 0 },
                { label: '型云', value: 1 }
              ], val: ''
            },
            { label: '单号', model: 'billCode', placeholder: '请输入单号', val: '' }
          ],
          [
            { label: '客户', model: 'customer', placeholder: '请输入客户', val: '' },
            {
              label: '提货状态', model: 'goodsFlag', type: 'select',
              list: [
                { label: '全部', value: '' },
                { label: '未完成', value: 0 },
                { label: '已完成', value: 1 }
              ], val: ''
            },
            {
              label: '状态', model: 'dealTypeStr', type: 'select',
              list: [
                { label: '全部', value: '' },
                { label: '已免收', value: '已免收' },
                { label: '已收款', value: '已收款' },
                { label: '已删除', value: '已删除' }
              ], val: ''
            }
          ]
        ]
        if (this.currentUser.dataLevel === '公司' || this.currentUser.dataLevel === '机构') {
          searchFrom = [[
            { label: '开始时间起', model: 'startTime', type: 'month', placeholder: '请选择年月', val: '' },
            { label: '开始时间止', model: 'endTime', type: 'month', placeholder: '请选择年月', val: '' },
            {              label: '来源', model: 'source', placeholder: '请选择来源', type: 'select',
              list: [
                { label: '全部', value: '' },
                { label: 'ERP', value: 0 },
                { label: '型云', value: 1 }
              ], val: ''
            },
            { label: '单号', model: 'billCode', placeholder: '请输入单号', val: '' }
          ],
          [
            { label: '客户', model: 'customer', placeholder: '请输入客户', val: '' },
            { label: '业务员', model: 'empCode', placeholder: '请输入业务员', type: 'selectRemote', list: [], val: '', url: 'setting/acct/queryCombo', queryKey: 'acctName' },
            {              label: '业务部门', model: 'dptName', placeholder: '请输入业务部门', type: 'selectDept',
              list: [], val: ''
            },
            {
              label: '提货状态', model: 'goodsFlag', type: 'select',
              list: [
                { label: '全部', value: '' },
                { label: '未完成', value: 0 },
                { label: '已完成', value: 1 }
              ], val: ''
            }
          ],
          [
            {
              label: '状态', model: 'dealTypeStr', type: 'select',
              list: [
                { label: '全部', value: '' },
                { label: '已免收', value: '已免收' },
                { label: '已收款', value: '已收款' },
                { label: '已删除', value: '已删除' }
              ], val: ''
            }
          ]]
        } else if (this.currentUser.dataLevel === '部门') {
          searchFrom = [[
            { label: '开始时间起', model: 'startTime', type: 'month', placeholder: '请选择年月', val: '' },
            { label: '开始时间止', model: 'endTime', type: 'month', placeholder: '请选择年月', val: '' },
            {              label: '来源', model: 'source', placeholder: '请选择来源', type: 'select',
              list: [
                { label: '全部', value: '' },
                { label: 'ERP', value: 0 },
                { label: '型云', value: 1 }
              ], val: ''
            },
            { label: '单号', model: 'billCode', placeholder: '请输入单号', val: '' }
          ],
          [
            { label: '客户', model: 'customer', placeholder: '请输入客户', val: '' },
            { label: '业务员', model: 'empCode', placeholder: '请输入业务员', type: 'selectRemote', list: [], val: '', url: 'setting/acct/queryCombo', queryKey: 'acctName' },
            {
              label: '提货状态', model: 'goodsFlag', type: 'select',
              list: [
                { label: '全部', value: '' },
                { label: '未完成', value: 0 },
                { label: '已完成', value: 1 }
              ], val: ''
            }
          ],
          [
            {
              label: '状态', model: 'dealTypeStr', type: 'select',
              list: [
                { label: '全部', value: '' },
                { label: '已免收', value: '已免收' },
                { label: '已收款', value: '已收款' },
                { label: '已删除', value: '已删除' }
              ], val: ''
            }
          ]]
        }
        return searchFrom
      }
    }
  },
  methods: {
    searchForm (obj) {
      this.paramsObj = Object.assign({}, obj)
      this.paramsObj.currentPage = 0
      this.paramsObj.pageSize = 20
      this.loadData()
    },
    tableChange (val) {
      this.loading = true
      this.paramsObj.currentPage = val - 1
      this.loadData()
    },
    async loadData () {
      this.canClick = false
      this.loading = true
      this.paramsObj.uid = this.currentUser.id
      console.log('入参========>' + JSON.stringify(this.paramsObj))
      try {
        let { data } = await this.apiStreamPost('/proxy/common/post',
          { url: 'overdue/findOverdueDealHistory', params: this.paramsObj })
        if (data.returnCode === 0) {
          this.totalCount = data.total
          this.tableValue.tableData = data.list
          this.merge()
          // console.log(JSON.stringify(this.tableValue.tableData))
          this.feePrice = data.feePrice
          this.canClick = true
        } else {
          this.msgShow(this, data.errMsg)
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
    merge () {
      let OrderObj = {};
      let provinceObj = {};
      this.tableValue.OrderIndexArr = []
      this.tableValue.tableData.forEach((item, index) => {
        item.rowIndex = index;
        if (OrderObj[item.billcode]) {
          let nextItem = this.tableValue.tableData[index] //为防止报错，先判断this.tableData[index+1]项是否存在，否则js会报错
            ? this.tableValue.tableData[index].billcode
            : undefined;
          let prevItem = this.tableValue.tableData[index - 1].billcode
            ? this.tableValue.tableData[index - 1].billcode
            : undefined;
          if (item.billcode == nextItem) {
            OrderObj[item.billcode].push(index);
          } else if (item.billcode == prevItem) {
            OrderObj[item.billcode].push(index);
          }
        } else {
          OrderObj[item.billcode] = [];
          OrderObj[item.billcode].push(index);
        }
        console.log(OrderObj)
        if (provinceObj[item.province]) {
          let nextPro = this.tableValue.tableData[index + 1]
            ? this.tableValue.tableData[index + 1].province
            : undefined;
          let prevPro = this.tableValue.tableData[index - 1].province
            ? this.tableValue.tableData[index - 1].province
            : undefined;
          if (item.province == nextPro) {
            provinceObj[item.province].push(index);
          } else if (item.province == prevPro) {
            provinceObj[item.province].push(index);
          }
        } else {
          provinceObj[item.province] = [];
          provinceObj[item.province].push(index);
        }
        console.log(provinceObj)
      });
      // 将数组长度大于1的值 存储到this.OrderIndexArr（也就是需要合并的项）
      for (let k in OrderObj) {
        if (OrderObj[k].length > 1) {
          this.tableValue.OrderIndexArr.push(OrderObj[k]);
        }
      }
      for (let i in provinceObj) {
        if (provinceObj[i].length > 1) {
          this.handleData(provinceObj[i])
        }
      }
    },
    handleData (data) {
      let temp = data;
      let itemArr = [];
      let itemArrNew = [];
      let resArr = [];
      if (data.length > 2) {
        for (let i = 0; i < data.length; i++) {
          if (data[i + 1]) {
            if (data[i + 1] - data[i] > 1) {
              itemArr = data.slice(0, i + 1)
              itemArrNew = temp.slice(i + 1, temp.length)
              break;
            } else {
              resArr = data
            }
          }
        }
        if (itemArr.length > 0 || itemArrNew.length > 0) {
          this.tableValue.provinceArr.push(itemArr)
          this.tableValue.provinceArr.push(itemArrNew)
        } else {
          this.tableValue.provinceArr.push(data)
        }
      } else {
        this.tableValue.provinceArr.push(data)
      }
    },
  }
}
</script>