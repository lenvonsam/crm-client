<template lang="pug">
  .content
    breadcrumb(:breadItems="breadItems")
    .pt-15
      el-button(size="small", @click="back()") 返回列表
    .mt-15
      search-form(:searchFormItems="searchFormItems", @search="searchForm")
    .mt-15
      basic-table(:tableValue="tableValue", :loading="loading", :currentPage="currentPage", :pageSize="pageSize", :total="totalCount", @pageChange="tableChange")
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
    computed: {
      ...mapState({
        sexOpts: state => state.sexOpts,
        mainStatusOpts: state => state.mainStatusOpts,
        eduOpts: state => state.eduOpts,
        pageSize: state => state.pageSize,
        currentUser: state => state.user.currentUser
      })
    },
    data () {
      return {
        breadItems: ['客户管理', '联系人管理', '删除记录'],
        btnGroups: [{lbl: '新增联系人信息', type: 'add'}],
        searchFormItems: [
          [{label: '公司名称', model: 'compName', type: 'text', placeholder: '请输入公司名称', val: ''},
            {label: '联系人姓名', model: 'name', type: 'text', placeholder: '请输入联系人姓名', val: ''},
            {label: '联系方式', model: 'phone', type: 'text', placeholder: '请输入联系方式', val: ''}],
          [{label: '添加日期', model: 'createAt', type: 'timeLimit', placeholder: '请选择添加日期', val: ''},
          {label: '职位', model: 'position', type: 'autocomplete', placeholder: '请选择职位', val: ''},
          // {label: '联系人类型', model: 'mainStatus', type: 'select', placeholder: '请选择联系人类型', val: '', list: []},
          {label: '性别', model: 'sex', type: 'select', placeholder: '请选择性别', val: '', list: []}],
          [{label: '业务部门', model: 'dptName', type: 'text', placeholder: '请选择业务部门', val: ''},
          {label: '业务员', model: 'acctName', type: 'text', placeholder: '请选择业务员', val: ''}]
        ],
        tableValue: {
          tableData: [],
          hasCbx: false,
          rowClassName: false,
          tableHead: [{
            lbl: '所属客户',
            prop: 'cstmName',
            minWidth: '340px',
          }, {
            lbl: '联系人',
            prop: 'name',
            width: '200px'
          }, {
            lbl: '联系方式',
            prop: 'phone',
            width: '150px'
          }, {
            lbl: '职位',
            prop: 'position',
            width: '100px'
          }, {
            lbl: '性别',
            prop: 'sex',
            align: 'center',
            width: '50px'
          }, {
            lbl: '年龄',
            prop: 'age',
            align: 'center',
            width: '50px'
          }, {
            lbl: 'qq',
            prop: 'qqNo',
            width: '150px'
          }, {
            lbl: '微信',
            prop: 'wxNo',
            width: '150px'
          }, {
            lbl: '删除日期',
            prop: 'delDate',
            width: '195px',
            align: 'center',
            sort: true
          }, {
            lbl: '删除人',
            prop: 'delName'
          }, {
            lbl: '删除原因',
            prop: 'delReason',
            width: '195px'
          }]
        },
        currentPage: 1,
        totalCount: 0,
        queryObject: {
          currentPage: this.currentPage - 1,
          pageSize: this.pageSize
        },
        loading: true,
      }
    },
    mounted () {
      this.searchFormItems[1][1].list = [{value: '', label: '全部'}, {value: 1, label: '主联系人'}, {value: 0, label: '普通联系人'}]
      this.searchFormItems[1][2].list = this.sexOpts
      this.queryObject = {
        currentPage: this.currentPage - 1,
        pageSize: this.pageSize
      }
      this.loadData()
    },
    methods: {
      searchForm (paramsObj) {
        this.currentPage = 1
        this.queryObject.currentPage = this.currentPage - 1
        Object.keys(paramsObj).map(key => {
          if(key == 'createAt'){
            if (paramsObj.createAt !== null && paramsObj.createAt !== undefined && paramsObj.createAt !== '') {
              this.queryObject.startTime = paramsObj.createAt[0]
              this.queryObject.endTime = paramsObj.createAt[1]
            } else {
              delete this.queryObject.startTime
              delete this.queryObject.endTime
            }
          } else if (typeof(paramsObj[key]) == 'number') {
            this.queryObject[key] = paramsObj[key]
          } else if (paramsObj[key].length > 0) {
            this.queryObject[key] = paramsObj[key].trim()
          } else {
            delete this.queryObject[key]
          }
        })
        this.loadData()
      },
      groupBtnClick (type) {},
      tableChange (val) {
        this.loading = true
        this.currentPage = val
        this.queryObject.currentPage = this.currentPage - 1
        this.loadData()
      },
      async loadData (params) {
        this.queryObject.uid = this.currentUser.id
        this.loading = true
        try {
          let { data } = await this.apiStreamPost('/proxy/common/post', {url: 'customerManage/linkerRecord', params: this.queryObject})
            if (data.returnCode === 0) {
              this.tableValue.tableData = data.list
              this.totalCount = data.total
            } else {
              this.msgShow(this, data.errMsg)
            }
            this.loading = false
        } catch (e) {
          console.error(e)
          this.msgShow(this)
          this.loading = false
        }
      }
    }
  }
</script>
<style>
  .ft-color{
    color: #303133;
  }
  .box-detail{
    background: #f9f9f9; 
    padding: 20px;
  }
</style>