  <template lang="pug">
  .content
    breadcrumb(:breadItems="breadItems")
    .mt-15
      search-form(:searchFormItems="searchFormItems", @search="searchForm")
    .pt-15
      basic-table(:tableValue="tableValue", :currentPage="currentPage", :loading="loading", :pageSize="pageSize", :total="totalCount", @chooseData="selectData", @pageChange="tableChange")
</template>

<script>
  import breadcrumb from '@/components/Breadcrumb.vue'
  import basicTable from '@/components/BasicTable.vue'
  import searchForm from '@/components/SearchForm.vue'
  // import buttonGroup from '@/components/ButtonGroup.vue'
  import { mapState } from 'vuex'
  export default {
    layout: 'main',
    components: {
      breadcrumb,
      basicTable,
      searchForm
    },
    data() {
      return {
        breadItems: ['销售管理', '销售报表'],
        currentPage: 1,
        totalCount: 0,
        queryObject: {
          currentPage: this.currentPage - 1,
          pageSize: this.pageSize,
          sort: '0'
        },
        tableValue: {
          tableData: [],
          hasCbx: false,
          rowClassName: false,
          tableHead: [{
            lbl: '品名',
            prop: 'partsName',            
            minWidth: 150
          }, {
            lbl: '材质',
            prop: 'material',
            width: 100
          }, {
            lbl: '规格',
            prop: 'goodsSpec',
            width: 150
          }, {
            lbl: '长度',
            prop: 'length',
            width: 120
          }, {
            lbl: '产地',
            prop: 'productArea',
            width: 150
          }, {
            lbl: '公差范围',
            prop: 'toleranceRange',
            width: 150
          }, {
            lbl: '重量范围',
            prop: 'weightRange',
            width: 150
          }, {
            lbl: '曾购客户(个)',
            prop: 'salesCount',
            sort: 'salesCount',
            type: 'linkRow',
            linkUrl: '/salesManage/reports/detail',
            width: 120
          }, {
            lbl: '可卖库存量(吨)',
            prop: 'goodsSupplyweight',
            width: 150
          }]
        },
        searchFormItems: [
          [{label: '品名', model: 'partsName', type: 'text', placeholder: '请输入品名', val: ''},
            {label: '材质', model: 'material', type: 'text', placeholder: '请输入材质', val: ''},
            {label: '规格', model: 'goodsSpec', type: 'text', placeholder: '请输入规格', val: ''}],
          [{label: '长度', model: 'length', placeholder: '请输入规格', val: ''},
          {label: '公差范围', model: 'toleranceRange', placeholder: '请输入公差范围', val: ''},
          {label: '重量范围', model: 'weightRange', placeholder: '请输入重量范围', val: ''}]
        ],
        chooseArray: [],
        loading: true
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
          let { data } = await this.apiStreamPost('/proxy/common/post', {url: 'salesManage/saleReports/goodSale', params: this.queryObject})
          if (data.returnCode === 0) {
            let keyArr = ['sumgoodsBatch', 'partsName', 'material', 'goodsSpec', 'length', 'productArea', 'toleranceRange', 'weightRange', 'salesCount', 'goodsSupplyweight']
            let arr = []
            data.list.map((item) => {
              let obj = {}
              for (let i=0;i<keyArr.length; i++) {                
                obj[keyArr[i]] = (item[i]) ? item[i] : '--'
              }
              arr.push(obj)
            })
            this.tableValue.tableData = arr
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
        this.queryObject['currentPage'] = 0
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
      groupBtnClick (type) {},
      tableChange (val) {
        this.loading = true
        this.currentPage = val
        this.queryObject.currentPage = this.currentPage - 1
        this.loadData()
      }
    }
  }
</script>
<style lang="styl", scoped>
  .width-input-250
    width: 250px
</style>