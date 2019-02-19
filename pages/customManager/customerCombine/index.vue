<template lang="pug">
  .content
    breadcrumb(:breadItems="breadItems")
    //- .pt-15
    //-   button-group(:btns="btnGroups", @groupBtnClick="groupBtnClick")
    .mt-15
      search-form(:searchFormItems="searchFormItems", @search="searchForm")
    .mt-5
      basic-table(:tableValue="tableValue", :currentPage="currentPage", :pageSize="pageSize", :total="totalCount", @chooseData="selectData", @pageChange="tableChange", ref="table", :loading="loading", @tableRowMerge="rowMerge")
    el-dialog(title="客户合并", :visible.sync="dialogShow", width="500px")
      .ft-16 将客户：
      el-row.mt-10(:gutter="10")
        //- el-input(v-model="custmOld.compName", value="custmOld.compName", size="small", :disabled="true")
        el-col(:span="8")
          el-input(v-model="custmOld.erpCode", value="custmOld.erpCode", size="small", :disabled="true")
        el-col(:span="16")
          el-input(v-model="custmOld.compName", value="custmOld.compName", size="small", :disabled="true")
      .ft-16.mt-15 合并到：
      el-row.mt-10(:gutter="10")
        //- el-select.full-width(v-model="custmNew.compName",  size="small",  value-key, filterable, remote, placeholder="请输入客户名称", :remote-method="customSearch", clearable, @change="custmChange")
          el-option(v-for="item in custmVal", :key="item.id", :label="item.compName", :value="item.id")
        el-col(:span="8")
          el-input(v-model="custmNew.erpCode", value="custmNew.erpCode", size="small", :disabled="true")
        el-col(:span="16")
          el-select.full-width(v-model="custmNew.compName",  size="small",  value-key, filterable, remote, placeholder="请输入客户名称", :remote-method="customSearch", clearable, @change="custmChange")
            el-option(v-for="item in custmVal", :key="item.id", :label="item.compName", :value="item.id")
      .row.mt-15(style="display: flex; justify-content: center;")
        el-button(size="small", @click="dialogShow = false") 取消
        el-button(type="primary", size="small", @click="mergeSave") 确定
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
        custmOld: {id: '', compName: '', erpCode: ''},
        custmNew: {id: '', compName: '', erpCode: ''},
        custmVal: [],
        breadItems: ['客户管理', '客户合并'],
        searchFormItems: [
          [{label: '公司名称', model: 'compName', type: 'text', placeholder: '请输入公司名称', val: ''},
            {label: '联系人姓名', model: 'name', type: 'text', placeholder: '请输入联系人姓名', val: ''},
            {label: '业务部门', model: 'dptName', type: 'text', placeholder: '请输入业务部门', val: ''}],
          [{label: '业务员', model: 'acctName', type: 'text', placeholder: '请输入业务员', val: ''}]
        ],
        dialogShow: false,
        tableValue: {
          tableData: [],
          hasCbx: false,
          rowClassName: false,
          tableHead: [{
            lbl: '公司名称',
            prop: 'compName',
            minWidth: '340px'
          }, {
            lbl: '主联系人',
            prop: 'linkName',
            width: '150px'
          }, {
            lbl: '联系方式',
            prop: 'linkPhone',
            width: '150px'
          }, {
            lbl: '业务部门',
            prop: 'dptName',
            width: '200px'
          }, {
            lbl: '业务员',
            prop: 'acctName',
            width: '200px'
          }, {
            lbl: '创建人',
            prop: 'creatorName',
            width: '200px'
          }, {
            type: 'action',
            fixed: 'right',
            width: '55px',
            actionBtns: [{
              lbl: '合并',
              type: 'merge'
            }]
          }]
        },
        currentPage: 1,
        totalCount: 0,
        queryObject: {
          currentPage: this.currentPage - 1,
          pageSize: this.pageSize,
          orderType: '0',
          mark: '4'
        },
        loading: true
      }
    },
    computed: {
      ...mapState({
        pageSize: state => state.pageSize,
        currentUser: state => state.user.currentUser,
        cstmArr: state => state.cstmArr
      })
    },
    beforeMount () {
      this.$nextTick(() => {        
        this.queryObject = {
          currentPage: this.currentPage - 1,
          pageSize: this.pageSize,
          orderType: '0',
          mark: '4'
        }
        this.loadData()
      })
    },
    methods: {
      searchForm (paramsObj) {
        this.loading = true
        this.currentPage = 1
        this.queryObject.currentPage = this.currentPage - 1
        Object.keys(paramsObj).map(key => {
          if(key == 'createAt'){
            if (paramsObj.createAt !== null && paramsObj.createAt !== undefined) {
              this.queryObject.startTime = paramsObj.createAt[0]
              this.queryObject.endTime = paramsObj.createAt[1]
            } else {
              delete this.queryObject.startTime
              delete this.queryObject.endTime
            }
          } else if (paramsObj[key].length > 0) {
            this.queryObject[key] = paramsObj[key].trim()
          } else {
            delete this.queryObject[key]
          }
        })
        this.loadData()
      },
      custmChange (val) {
        let items = this.custmVal.filter(item => item.id == val)
        this.custmNew.id = items[0].id
        this.custmNew.erpCode = items[0].erpCode
      },
      rowMerge (obj) {        
        this.dialogShow = true
        this.custmNew = {id: '', compName: '', erpCode: ''}
        this.custmOld.erpCode = obj.erpCode
        this.custmOld.id = obj.id
        this.custmOld.compName = obj.compName
      },
      selectData (val) {
        this.chooseArray = val
      },
      tableChange (val) {
        this.loading = true
        this.currentPage = val
        this.queryObject.currentPage = this.currentPage - 1
        this.loadData()
      },
      async loadData () {
        this.queryObject.uid = this.currentUser.id
        try {
          let { data } = await this.apiStreamPost('/proxy/common/post', {url: 'customerManage/customer', params: this.queryObject})
          if (data.returnCode === 0) {
            let arr = []
            // let endDate = new Date(this.date2Str(new Date()) + ' 02:00:00')
            let arrList = this.cstmArr
            data.list.map(itm => {
              let obj = {}
              for(let i=0; i<arrList.length; i++){
                obj[arrList[i]] = itm[i]
              }
              // let startDate = new Date(this.date2Str(new Date(itm[5])) + ' 02:00:00')
              // let date = endDate.getTime() - startDate.getTime()
              // let days = Math.floor(date / (24*3600*1000))
              // obj.billDateDays = (days < 0)? 0 : days
              arr.push(obj)
            })
            this.tableValue.tableData = arr
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
      },
      mergeSave () {
        if (!this.custmNew.compName) {
          this.msgShow(this, '请输入客户名称')
          return
        }
        this.dialogShow = false
        let params = {
          newId: this.custmNew.id,
          oldId: this.custmOld.id
        }
        this.createCombine(params)
      },
      async createCombine (params) {
        try {
          let { data } = await this.apiStreamPost('/proxy/common/post', {url: 'customerManage/customer/combine', params: params})
            if (data.returnCode === 0) {
              this.msgShow(this, '合并成功', 'success')
              this.loadData()
            } else {
              this.msgShow(this, data.errMsg)
            }
        } catch (e) {
          console.error(e)
          this.msgShow(this)
        }
      },
      async customSearch (query) {
        let params = {
          pageSize: 10,
          compName: query
        }
        let me = this
        try {
          let { data } = await this.apiStreamPost('/proxy/common/post', {url: 'customerManage/customer/queryAll', params: params})
            if (data.returnCode === 0) {
              this.custmVal = data.list
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
<style>
  .baidu-map{
    width: 100%;
    height: 550px;
  }
  .bm-serch{
  }
</style>