<template lang="pug">
  .content
    breadcrumb(:breadItems="breadItems")
    .mt-15
      //- el-button(size="small", @click="back()") 返回列表
      button-group(:btns="btnGroups", @groupBtnClick="groupBtnClick")
    .mt-15
      search-form(:searchFormItems="searchFormItems", @search="searchForm")
    .pt-15
      basic-table(:tableValue="tableValue", :currentPage="currentPage", :loading="loading", :pageSize="pageSize", :total="totalCount", @chooseData="selectData", @pageChange="tableChange", ref="table", @sort="sortHandler")
    el-dialog(title="短信发送", :visible="smsBoxShow", :before-close="smsBoxClose")      
      .ft-15 发送内容
      el-input.mt-15(type="textarea", :autosize="{minRows:3}", maxlenght=500, placeholder="请输入内容", v-model="smsContent")
      .ft-13.text-red.mt-10 模板最多输入500个字符
      span(slot="footer" class="dialog-footer")
        el-button(size="small", @click="smsBoxClose") 取消
        el-button(size="small", type="primary", @click="smsButton") 发送
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
    data() {
      return {
        breadItems: ['销售管理', '客户购买汇总表'],
        btnGroups: [{
          lbl: '返回列表',
          type: 'back'
        }, {
          lbl: '发送短信',
          type: 'sms'
        }],
        currentPage: 1,
        totalCount: 0,
        queryObject: {
          currentPage: this.currentPage - 1,
          pageSize: this.pageSize,
          sort: '0'
        },
        tableValue: {
          tableData: [],
          hasCbx: true,
          rowClassName: false,
          tableHead: [{
            lbl: '公司名称',
            prop: 'compName',            
            minWidth: 150
          }, {
            lbl: '业务部门',
            prop: 'dptName',
            width: 100
          }, {
            lbl: '业务员',
            prop: 'acctName',
            width: 150
          }, {
            lbl: '主联系人',
            prop: 'linkName',
            width: 120
          }, {
            lbl: '联系方式',
            prop: 'linkPhone',
            width: 150
          }, {
            lbl: '客户采购量（吨）',
            prop: 'weight',
            sort: 'weight',
            width: 180
          }]
        },
        searchFormItems: [
          [{label: '公司名称', model: 'compName', type: 'text', placeholder: '请输入公司名称', val: ''},
            {label: '业务部门', model: 'dptName', type: 'text', placeholder: '请输入业务部门', val: ''},
            {label: '业务员', model: 'acctName', type: 'text', placeholder: '请输入业务员', val: ''}]
        ],
        chooseArray: [],
        loading: true,
        query: {},
        smsPageSize: 5,
        smsTotalCount: 0,
        smsCurrentPage: 1,
        smsBoxShow: false,
        smsContent: ''
      }
    },
    mounted () {
      let str = this.$route.query.row      
      if (this.$route.fullPath.indexOf('#') != -1) {
        str += decodeURI(this.$route.hash)
      }
      this.query = JSON.parse(str)
      this.queryObject = {
        currentPage: this.currentPage - 1,
        pageSize: this.pageSize,
        sort: '0',
        sumgoodsBatch: this.query['sumgoodsBatch']
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
          let { data } = await this.apiStreamPost('/proxy/common/post', {url: 'salesManage/saleReports/cstmSale', params: this.queryObject})
          if (data.returnCode === 0) {
            let keyArr = ['sumgoodsBatch', 'compName', 'dptName', 'acctName', 'linkName', 'linkPhone', 'weight']
            let arr = []
            data.list.map((item) => {
              let obj = {}
              for (let i=0;i<keyArr.length; i++) {
                obj[keyArr[i]] = item[i]
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
        this.chooseArray = val
      },
      groupBtnClick (type) {
        if (type == 'back') {
          this.back()
        } else if (type == 'sms') {
          let table = this.$refs.table.$refs.multipleTable
          if (table.selection.length == 0) {
            this.msgShow(this, '请选择需要发送短信的客户')
            return
          }
          this.smsBoxShow = true
          const partsNameStr = '#品名' + this.query['partsName'] + '#/'
          const materialStr = '#材质' + this.query['material'] + '#/'
          const goodsSpecStr = '#规格' + this.query['goodsSpec'] + '#/'
          const lengthStr = '#长度' + this.query['length'] + '#/'
          const productAreaStr = '#产地' + this.query['productArea'] + '#/'
          const toleranceRangeStr = '#公差范围' + this.query['toleranceRange'] + '#/'
          const weightRangeStr = '#重量范围' + this.query['weightRange'] + '#'
          this.smsContent = '亲爱的客户,智恒达最近来了一批新货' + partsNameStr + materialStr + goodsSpecStr + lengthStr + productAreaStr + toleranceRangeStr + weightRangeStr + '感兴趣的话快来联系' + this.currentUser.name +this.currentUser.phone
        }
      },
      smsBoxClose () {
        this.smsBoxShow = false
      },
      smsButton () {
        let mobileArr = []
        let table = this.$refs.table.$refs.multipleTable
        table.selection.map((item) => {
          console.log(item)
          mobileArr.push(item.linkPhone)
        })
        let params = {
          mobile: mobileArr.toString(),
          content: this.smsContent,
          mark: '0',
          uid: this.currentUser.id
        }
        this.smsCreate(params)
      },
      async smsCreate (params) {
        try {
          let { data } = await this.apiStreamPost('/proxy/common/post', {url: 'callCenter/smsCreate', params: params})
          if (data.returnCode === 0) {
            this.msgShow(this, '发送成功', 'success')
            this.smsBoxShow = false         
          } else {
            this.msgShow(this, data.errMsg)
          }
        } catch (e) {
          console.error(e)
          this.msgShow(this)
          this.loading = false
        }
      },
      tableChange (val) {
        this.loading = true
        this.currentPage = val
        this.queryObject.currentPage = this.currentPage - 1
        this.loadData()
      },
      sortHandler (obj) {
        console.log(obj)
        const weightAsc = (obj['order'] == 'ascending' && obj['property'] == 'weight')
        const weightDesc = (obj['order'] == 'descending' && obj['property'] == 'weight')
        this.queryObject.sort = weightDesc ? '0' : '1'
        this.queryObject.currentPage = 0
        this.loading = true
        this.loadData()
      }
    }
  }
</script>
<style lang="styl", scoped>
  .width-input-250
    width: 250px
</style>