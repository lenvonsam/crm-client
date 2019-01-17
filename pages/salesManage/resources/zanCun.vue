<template lang="pug">
  .content
    basic-table(:tableValue="tableTempValue", :currentPage="currentPage", :loading="loading", :pageSize="pageSize", :total="totalCount", @chooseData="selectData", @pageChange="tableChange", @tableRowTempCancel="rowTempCancel")
    .full-width.mt-10.mb-10.text-center
      span
        el-button(type="primary", size="small" ,@click="exportExcelFun") 导出
        el-button(size="small", @click="dialogClose") 取消 
</template>

<script>
  import basicTable from '@/components/BasicTable.vue'
  import { mapState } from 'vuex'
  export default {
    layout: 'main',
    components: {
      basicTable
    },
    props: {
      tempData: {
        type: null,
        require: true
      },
      dialogClose: {
        type: Function,
        require: true
      }
    },
    data() {
      return {
        currentPage: 1,
        totalCount: 0,
        pageSize: 5,
        queryObject: {
          currentPage: this.currentPage - 1,
          pageSize: this.pageSize,
          sort: '0'
        },
        tableTempValue: {
          tableData: [],
          hasCbx: false,
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
            width: 120
          }, {
            lbl: '可卖重量(吨）',
            prop: 'goodsSupplyweight',
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
            width: 110
          }, {
            lbl: '实物重量(吨）',
            prop: 'goodsWeight',
            width: 140
          }, {
            lbl: '实物理重(吨）',
            prop: 'goodsAssistweight',
            width: 140
          }, {
            type: 'action',
            width: '90px',
            fixed: 'right',
            actionBtns: [{
              lbl: '取消暂存',
              type: 'tempCancel'
            }]
          }]
        },
        chooseArray: [],
        loading: true,
        tableData: []
      }
    },
    beforeMount () {
      this.$nextTick(() => {
        this.totalCount = this.tempData.length
        this.tableTempValue.tableData = this.tempData.slice((this.currentPage-1) * this.pageSize, this.pageSize)        
        this.loading = false
      })
    },
    methods: {
      exportExcelFun () {
        if (this.tempData.length == 0) {
          this.msgShow(this, '请添加数据')
          return
        }
        let params = {
          mark: 1,
          content: JSON.stringify(this.tempData)
        }
        this.exportExcel(params)
      },
      async exportExcel (params) {
        try {
          let { data } = await this.apiStreamPost('/proxy/common/post', {url: 'file/export/excel', params: params})
          if (data.returnCode !== -1) {
              window.location.href = decodeURIComponent(data)
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
      selectData (val) {
        console.log(val)
        this.chooseArray = val
      },
      tableChange (val) {
        this.currentPage = val
        this.queryObject.currentPage = this.currentPage - 1
        this.tableTempValue.tableData = this.tempData.slice((val-1)*this.pageSize, this.currentPage*this.pageSize)
      },
      rowTempCancel (row) {                
        delete row['idx']        
        this.$emit('tempDataCancel', row)
        let idx = this.tempData.indexOf(row)
        this.tempData.splice(idx,1)
        this.tableTempValue.tableData = this.tempData.slice((this.currentPage-1)*this.pageSize, this.currentPage*this.pageSize)
        this.totalCount = this.tempData.length
        if (this.tableTempValue.tableData.length == 0 && this.totalCount !== 0) {
          this.tableChange(this.currentPage-1)
        }             
      }
    }
  }
</script>
<style lang="styl", scoped>
  .width-input-250
    width: 250px
</style>