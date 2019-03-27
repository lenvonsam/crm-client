<template lang="pug">
.content
  breadcrumb(:breadItems="breadItems")
  .pt-20
    search-form(:searchFormItems="searchItems", @search="searchBtn")
  .pt-20
    basic-table(:tableValue="loginTableValue", :loading="loading", :currentPage="currentPage", :pageSize="pageSize", :total="totalCount", @chooseData="selectData", @pageChange="tableChange")
</template>
<script>
import breadcrumb from '@/components/Breadcrumb.vue'
import searchForm from '@/components/SearchForm.vue'
import basicTable from '@/components/BasicTable.vue'
import { mapState } from 'vuex'
export default {
  layout: 'main',
  data () {
    return {
      breadItems: ['系统设置', '登录信息管理'],
      searchItems: [
        [{label: '业务员', model: 'acctName', type: 'text', placeholder: '请输入业务员', val: ''},
        {label: '日期范围', model: 'loginTime', type: 'timeLimit', val: ''}]
      ],
      loginTableValue: {
        tableData: [],
        tableHead: [{
          lbl: '账号ID',
          width: '80px',
          prop: 'acctId'
        }, {
          lbl: '登录账号',
          width: '100px',
          prop: 'loginAcct'
        }, {
          lbl: '姓名',
          width: '130px',
          prop: 'acctName'
        }, {
          lbl: '登录时间',
          prop: 'loginDate',
          width: '160px'
        }, {
          lbl: '登录IP',
          width: '130px',
          prop: 'ip'
        }, {
          lbl: '浏览器标识',
          prop: 'deviceType'
        }],
        hasCbx: false
      },
      currentPage: 1,
      totalCount: 0,
      chooseArray: [],
      loading: true,
      queryObject: {
        currentPage: this.currentPage - 1,
        pageSize: this.pageSize,
        orderType: '0',
        status: '1',
        mark: '1'
      },
    }
  },
  computed: {
    ...mapState({
      pageSize: state => state.pageSize,
      currentUser: state => state.user.currentUser
    })
  },
  components: {
    breadcrumb,
    searchForm,
    basicTable
  },
  beforeMount () {
    this.$nextTick(() => {
      this.queryObj = {
        currentPage: this.currentPage - 1,
        pageSize: this.pageSize
      }
      this.loadData()
    })
  },
  methods: {
    btnsClick () {},
    selectData (val) {
      console.log(val)
      this.chooseArray = val
    },
    tableChange (val) {
      this.loading = true
      this.currentPage = val
      this.queryObj.currentPage = this.currentPage - 1
      this.loadData()
    },
    searchBtn (paramsObj) {
      this.loading = true
      this.currentPage = 1
      this.queryObj.currentPage = this.currentPage - 1
      Object.keys(paramsObj).map(key => {
        if(key == 'loginTime'){
          if (paramsObj.loginTime !== null) {
            this.queryObj.startTime = paramsObj.loginTime[0]
            this.queryObj.endTime = paramsObj.loginTime[1]
          } else {
            delete this.queryObj.startTime
            delete this.queryObj.endTime
          }
        } else if (paramsObj[key].length > 0) {
          this.queryObj[key] = paramsObj[key].trim()
        } else {
          delete this.queryObj[key]
        }
      })
      this.loadData()
    },
    async loadData () {
      this.loading = true
      try {
        let { data } = await this.apiStreamPost('/proxy/common/post', {url: 'setting/loginMsg', params: this.queryObj})
        if (data.returnCode === 0) {
          this.loginTableValue.tableData = data.list
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
    }
  }
}
</script>
<style lang="styl", scoped>
  .width-input-250
    width: 250px
</style>