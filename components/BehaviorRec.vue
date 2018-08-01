<template lang="pug">
  .content
    search-form(:searchFormItems="behaviorSearchItems", @search="formSearch")
    el-table.mt-20(:data="behaviorRecVal.tableData", border)
      el-table-column(type="expand")
        template(slot-scope="props")
          .row(v-for="(r,idx) in filterExpandData(props.row)", :class="{'pb-15': idx < (filterExpandData(props.row).length - 1)}")
            .col(v-for="c in r")
              label(v-if="c.key").mr-15 {{behaviorMap[c.key]}}:
              label {{c.val}}
      el-table-column(v-for="head in behaviorRecVal.tableHead", :key="head.prop", :label="head.label")
        template(slot-scope="scope") {{scope.row[head.prop] | rowData(head.prop)}}
    .padding.text-right
      el-pagination(:current-page="currentPage", :page-size="pageSize", background, layout="prev, pager, next, jumper", :total="total", @current-change="pgCurrentChange")
</template>

<script>
import searchForm from '@/components/SearchForm.vue'
export default {
  props: {
    behaviorData: {
      type: Array,
      required: true
    },
    currentPage: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    },
    total: {
      type: Number,
      default: 1
    }
  },
  components: {
    searchForm
  },
  beforeMount () {
    this.$nextTick(() => {
      this.behaviorRecVal.tableData = this.behaviorData
    })
  },
  data () {
    const arr = [{lbl: '事件', model: 'event'}, {lbl: '操作日期', model: 'optTime'}, {lbl: '来源', model: 'source'}, {lbl: '商品ID', model: 'orderId'}, {lbl: '订单号', model: 'orderNo'}, {lbl: '品名', model: 'goodsName'}, {lbl: '规格', model: 'standard'}, {lbl: '长度', model: 'length'}, {lbl: '产地', model: 'supply'}, {lbl: '仓库', model: 'warehouse'}, {lbl: '材质', model: 'material'}, {lbl: '计量方式', model: 'measure'}, {lbl: '公差范围', model: 'toleranceRange'}, {lbl: '重量范围', model: 'weightRange'}, {lbl: '公差起', model: 'toleranceStart'}, {lbl: '公差止', model: 'toleranceEnd'}, {lbl: '搜索内容', val: 'search'}]
    const doubleArr = this.arr2DoubleArr(arr, false)
    const generateSearchItems = () => {
      let searchItems = []
      doubleArr.map(itm => {
        let tempItems = []
        itm.map(subItem => {
          if (subItem.lbl === '操作日期') {
            tempItems.push({label: subItem.lbl, model: subItem.model, type: 'date', val: ''})
          } else {
            tempItems.push({label: subItem.lbl, model: subItem.model, type: 'text', val: ''})
          }
        })
        searchItems.push(tempItems)
      })
      return searchItems
    }
    console.log(generateSearchItems())
    return {
      behaviorMap: {
        ip: 'IP地址',
        ipLocation: 'IP地址解析结果',
        userId: '电商编号',
        userName: '公司名称',
        emp: '业务员',
        goodsName: '品名',
        supply: '产地',
        material: '材质',
        standard: '规格',
        search: '搜索内容',
        warehouse: '仓库',
        toleranceStart: '公差起',
        toleranceEnd: '公差止',
        orderId: '商品ID',
        toleranceRange: '公差范围',
        weightRange: '重量范围',
        amount: '支数',
        weight: '重量',
        orderNo: '订单号',
        diff: '价差',
        dealFrom: '订单来源',
        type: '类型',
        deploy: '延迟时间',
        carryNo: '提单号',
        money: '金额',
        priority: '优先级',
        contractNo: '合同号',
        mphone: '手机号',
        nickName: '昵称',
        ditchWay: '邀请渠道',
        startArea: '装货地',
        endArea: '卸货地',
        num: '数量',
        isSpecialOffer: '是否特价',
        isNewProduct: '是否新品',
        length: '长度',
        ljPrice: '理计价格',
        bjPrice: '磅计价格',
        minPrice: '最小限价',
        sellType: '销售方式',
        categoryName: '品种',
        minWeight: '最小成交重量',
        percentage: '挂牌比例',
        region: '地区',
        tolerance: '公差搜索内容',
        dateRange: '日期范围',
        status: '状态',
        measure: '计量方式'
      },
      behaviorSearchItems: generateSearchItems(),
      behaviorRecVal: {
        tableHead: [{label: '事件', prop: 'event'}, {label: '操作时间', prop: 'time'}, {label: '来源', prop: 'source'}],
        tableData: []
      }
    }
  },
  watch: {
    behaviorData (newVal, oldVal) {
      this.behaviorRecVal.tableData = newVal
    }
  },
  methods: {
    filterExpandData (row) {
      let currentRow = Object.assign({}, row)
      delete currentRow.createAt
      delete currentRow.updateAt
      delete currentRow.time
      delete currentRow.event
      delete currentRow.source
      delete currentRow.id
      delete currentRow.rowkey
      let tableArray = []
      Object.keys(currentRow).map(k => {
        if (currentRow[k] != null) tableArray.push({key: k, val: currentRow[k]})
      })
      return this.arr2DoubleArr(tableArray)
    },
    pgCurrentChange (val) {
      this.$emit('pgChange', val)
    },
    formSearch (val) {
      this.$emit('search', val)
    }
  }
}
</script>