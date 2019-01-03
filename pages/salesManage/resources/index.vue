<template lang="pug">
  .content
    breadcrumb(:breadItems="breadItems")
    .pt-15
      button-group(:btns="btnGroups", @groupBtnClick="groupBtnClick")
    .mt-15
      search-form(:searchFormItems="searchFormItems", @search="searchForm")
    .pt-15
      basic-table(:tableValue="tableValue", :currentPage="currentPage", :loading="loading", :pageSize="pageSize", :total="totalCount", @chooseData="selectData", @pageChange="tableChange", @tableRowTempSave="rowTempSave", @sort="sortHandler", ref="table")
    el-dialog(title="暂存", :visible="dialogShow", :before-close="dialogClose")
      //- zan-cun(:tempStore="tempStore")
</template>

<script>
  import breadcrumb from '@/components/Breadcrumb.vue'
  import basicTable from '@/components/BasicTable.vue'
  import searchForm from '@/components/SearchForm.vue'
  import buttonGroup from '@/components/ButtonGroup.vue'
  // import zanCun from './zancun.vue'
  import { mapState } from 'vuex'
  export default {
    layout: 'main',
    components: {
      breadcrumb,
      basicTable,
      searchForm,
      buttonGroup
    },
    data() {
      return {
        breadItems: ['销售管理', '产品资源'],
        currentPage: 1,
        totalCount: 0,
        queryObject: {
          currentPage: this.currentPage - 1,
          pageSize: this.pageSize,
          sort: '0'
        },
        btnGroups: [{
          lbl: '批量暂存',
          type: 'tempSave'
        }, {
          lbl: '显示暂存',
          type: 'tempShow'
        }, {
          lbl: '批量导出',
          type: 'exportExcel'
        }],
        tableValue: {
          tableData: [],
          hasCbx: true,
          rowClassName: false,
          tableHead: [{
            lbl: '磅计销售价格',
            prop: 'pricesetMakeprice',
            minWidth: 120
          }, {
            lbl: '理计销售价格',
            prop: 'ajuPricesetMakeprice',
            minWidth: 120
          }, {
            lbl: '计量方式',
            prop: 'goodsMetering',
            width: 80
          }, {
            lbl: '品名',
            prop: 'partsnameName',
            minWidth: 120
          }, {
            lbl: '材质',
            prop: 'goodsMaterial',
            minWidth: 100
          }, {
            lbl: '规格',
            prop: 'goodsSpec',
            minWidth: 150
          }, {
            lbl: '长度',
            prop: 'goodsProperty1',
            width: '100px'
          }, {
            lbl: '产地',
            prop: 'productareaName',
            width: '100px'
          }, {
            lbl: '仓库',
            prop: 'warehouseName',
            width: 100
          }, {
            lbl: '公差范围',
            prop: 'goodsProperty5',
            width: 150
          }, {
            lbl: '重量范围',
            prop: 'goodsProperty4',
            width: 150
          }, {
            lbl: '支件数',
            prop: 'goodsAssistnum',
            width: 80
          }, {
            lbl: '可卖数量',
            prop: 'goodsSupplynum',
            sort: 'goodsSupplynum',
            width: 120
          }, {
            lbl: '可卖重量(吨）',
            prop: 'goodsSupplyweight',
            sort: 'goodsSupplyweight',
            width: 140
          }, {
            lbl: '可卖理重(吨）',
            prop: 'goodsSupplyassistweight',
            width: 140
          }, {
            lbl: '磅计可让价',
            prop: 'pricesetPrefprice',
            width: '100px'
          }, {
            lbl: '理计可让价',
            prop: 'ajuPricesetPrefprice',
            width: '100px'
          }, {
            lbl: '公差',
            prop: 'datasDetailStr1',
            width: '100px'
          }, {
            lbl: '实物数量',
            prop: 'goodsNum',
            sort: 'goodsNum',
            width: 110
          }, {
            lbl: '实物重量(吨）',
            prop: 'goodsWeight',
            sort: 'goodsWeight',
            width: 140
          }, {
            lbl: '实物理重(吨）',
            prop: 'goodsAssistweight',
            width: 140
          }, {
            type: 'action',
            width: '60px',
            fixed: 'right',
            actionBtns: [{
              lbl: '暂存',
              type: 'tempSave'
            }]
          }]
        },
        searchFormItems: [
          [{label: '品名', model: 'partsName', placeholder: '请输入品名', val: ''},
            {label: '材质', model: 'material', placeholder: '请输入材质', val: ''},
            {label: '规格', model: 'goodsSpec', placeholder: '请输入规格', val: ''}],
          [{label: '长度', model: 'length', placeholder: '请输入长度', val: ''},
          {label: '产地', model: 'productArea', placeholder: '请输入产地', val: ''},
          {label: '仓库', model: 'warehouseName', placeholder: '请输入仓库', val: ''}],
          [{label: '公差范围', model: 'toleranceRange', placeholder: '请输入公差范围', val: ''},
          {label: '重量范围', model: 'weightRange', placeholder: '请输入重量范围', val: ''}]
        ],
        reason: '',
        rowDelObj: {},
        chooseArray: [],
        loading: true,
        tempStore: [],
        dialogShow: false
      }
    },
    mounted () {
      this.queryObject = {
        currentPage: this.currentPage - 1,
        pageSize: this.pageSize,
        sort: '0'
      }
      this.loadData()
    },
    computed: {
      ...mapState({
        pageSize: state => state.pageSize,
        currentUser: state => state.user.currentUser
      })
    },
    methods: {
      async loadData () {
        this.queryObject.uid = this.currentUser.id
        try {
          let { data } = await this.apiStreamPost('/proxy/common/post', {url: 'salesManage/resources/goodStock', params: this.queryObject})
          if (data.returnCode === 0) {
            data.list.map((item) => {
              item['goodsProperty5'] = (item['goodsProperty5']) ? item['goodsProperty5'] : '--'
              item['goodsProperty4'] = (item['goodsProperty4']) ? item['goodsProperty4'] : '--'
            })
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
      async exportExcel (params) {
        try {
          let { data } = await this.apiStreamPost('/proxy/common/post', {url: 'file/export/excel', params: params})
          if (data.returnCode !== -1) {
              window.location.href = data
          } else {
            this.msgShow(this, '导出失败')
          }
          this.loading = false
        } catch (e) {
          console.error(e)
          this.msgShow(this)
          this.loading = false
        }
      },
      searchForm (paramsObj) {
        this.loading = true
        this.currentPage = 1
        this.queryObject.currentPage = this.currentPage - 1
        for (let key in paramsObj) {
          if (paramsObj[key].trim() != '') {
            this.queryObject[key] = paramsObj[key]
          } else {
            delete this.queryObject[key] 
          }          
        }
        this.loadData()
      },
      selectData (val) {
        console.log(val)
        this.chooseArray = val
      },
      groupBtnClick (type) {
        let table = this.$refs.table.$refs.multipleTable
        const tempStoreArr = this.tempStore
        if(type == 'tempSave'){
          if (table.selection.length == 0) {
            this.msgShow(this, '请选择需要暂存的数据')
            return
          } else {
            table.selection.map((item) => {
              if (tempStoreArr.indexOf(item) == -1) {
                tempStoreArr.push(item)
              }
              this.msgShow(this, '暂存成功', 'success')
            })
          }
        } else if (type == 'tempShow') {
          this.dialogShow = true
        } else if (type == 'exportExcel') {
          if (this.tempStore.length == 0 && table.selection.length == 0) {
            this.msgShow(this, '请选择需要导出的数据')
            return
          }
          let exportArr = JSON.parse(JSON.stringify(this.tempStore))
          if (table.selection.length > 0) {
            table.selection.map((item) => {
              if (tempStoreArr.indexOf(item) == -1) {
                exportArr.push(item)
              }
            })
          }
          let params = {
            mark: 1,
            content: JSON.stringify(exportArr)
          }
          this.exportExcel(params)
        }
      },
      tableChange (val) {
        this.loading = true
        this.currentPage = val
        this.queryObject.currentPage = this.currentPage - 1
        this.loadData()
      },
      rowTempSave (row) {
        delete row['idx']
        const tempStoreArr = this.tempStore
        if (tempStoreArr.indexOf(row) == -1) {
          tempStoreArr.push(row)
          this.msgShow(this, '暂存成功', 'success')       
        } else {
          this.msgShow(this, '请不要重复暂存')
          return
        }        
      },
      rowExportExcel (row) {
        delete row['idx']
        let exportExcelArr = []
        exportExcelArr.push(row)
        let params = {
          mark: 1,
          content: JSON.stringify(exportExcelArr)
        }
        this.exportExcel(params)
      },
      sortHandler (obj) {
        const goodsSupplyNumAsc = (obj['order'] == 'ascending' && obj['property'] == 'goodsSupplynum')
        const goodsSupplyNumDesc = (obj['order'] == 'descending' && obj['property'] == 'goodsSupplynum')
        const goodsSupplyweightAsc = (obj['order'] == 'ascending' && obj['property'] == 'goodsSupplyweight')
        const goodsSupplyweightDesc = (obj['order'] == 'descending' && obj['property'] == 'goodsSupplyweight')
        const goodsNumAsc = (obj['order'] == 'ascending' && obj['property'] == 'goodsNum')
        const goodsNumDesc = (obj['order'] == 'descending' && obj['property'] == 'goodsNum')
        const goodsWeightAsc = (obj['order'] == 'ascending' && obj['property'] == 'goodsWeight')
        const goodsWeightDesc = (obj['order'] == 'descending' && obj['property'] == 'goodsWeight')
        this.queryObject.sort = goodsSupplyNumAsc ? '0' : goodsSupplyNumDesc ? '1' : goodsSupplyweightAsc ? '2' : goodsSupplyweightDesc ? '3' : goodsNumAsc ? '4' : goodsNumDesc ? '5' : goodsWeightAsc ? '6' : goodsWeightDesc ? '7' : '0' 
        this.currentPage = 1
        this.queryObject.currentPage = this.currentPage - 1
        this.loadData()
      },
      dialogClose () {
        this.dialogShow = false
      }
    }
  }
</script>
<style lang="styl", scoped>
  .width-input-250
    width: 250px
</style>