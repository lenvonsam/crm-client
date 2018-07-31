<template lang="pug">
  .content
    breadcrumb(:breadItems="breadItems")
    .pt-15
      button-group(:btns="btnGroups", @groupBtnClick="groupBtnClick")
    .mt-15
      search-form(:searchFormItems="searchFormItems", @search="searchForm")
    .pt-15
      basic-table(:tableValue="tableValue", :currentPage="currentPage", :loading="loading", :pageSize="pageSize", :total="totalCount", @chooseData="selectData", @pageChange="tableChange", @tableRowDelete="rowDel", @tableRowEdit="rowEdit")
    el-dialog(title="删除", :visible.sync="dialogFormVisible")
      .row.flex-center
        .col.flex-80 删除理由：
        .col
          el-input.full-width(v-model="reason", auto-complete="off")
      .dialog-footer(slot="footer")
        el-button(@click="delSubmit('cancel')") 取消
        el-button(type="primary", @click="delSubmit('ok')") 确定
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
        breadItems: ['客户管理', '潜在客户'],
        currentPage: 1,
        totalCount: 0,
        queryObject: {
          currentPage: this.currentPage - 1,
          pageSize: this.pageSize,
          mark: '1'
        },
        btnGroups: [{
          lbl: '添加潜在客户',
          type: 'add'
        }, {
          lbl: '转化为正式客户',
          type: 'conversion'
        }, {
          lbl: '删除记录',
          type: 'delRec'
        }, {
          lbl: '转化记录',
          type: 'conversionRec'
        }],
        tableValue: {
          tableData: [],
          hasCbx: true,
          rowClassName: false,
          tableHead: [{
            lbl: '公司名称',
            prop: 'compName',
            type: 'link',
            linkUrl: '/customManager/potentialCustom/detail'           
          }, {
            lbl: '主联系人',
            prop: 'name',
            width: 200
          }, {
            lbl: '联系方式',
            prop: 'phone',
            width: 200
          }, {
            lbl: '添加日期',
            prop: 'createAt',
            width: 200
          }, {
            lbl: '业务部门',
            prop: 'dptName',
            width: 150
          }, {
            lbl: '业务员',
            prop: 'acctName',
            width: 150
          }, {
            lbl: '创建人',
            prop: 'createName',
            width: 100
          }, {
            type: 'action',
            width: 100,
            actionBtns: [{
              lbl: '编辑',
              type: 'edit'
            }, {
              lbl: '删除',
              type: 'delete'
            }]
          }]
        },
        searchFormItems: [
          [{label: '公司名称', model: 'compName', type: 'text', placeholder: '请输入公司名称', val: ''},
            {label: '联系人姓名', model: 'name', type: 'text', placeholder: '请输入联系人姓名', val: ''},
            {label: '联系方式', model: 'phone', type: 'text', placeholder: '请输入联系方式', val: ''}],
          [{label: '添加日期', model: 'createAt', type: 'timeLimit', val: ''},
          {label: '业务部门', model: 'dptName', placeholder: '请选择业务部门', val: ''},
          {label: '业务员', model: 'acctName', placeholder: '请选择业务员', val: ''}]
        ],
        reason: '',
        dialogFormVisible: false,
        rowDelObj: {},
        chooseArray: [],
        loading: true
      }
    },
    mounted () {
      this.queryObject = {
        currentPage: this.currentPage - 1,
        pageSize: this.pageSize,
        mark: '1'
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
          let { data } = await this.apiStreamPost('/proxy/common/post', {url: 'customerManage/customer', params: this.queryObject})
          if (data.returnCode === 0) {
            this.tableValue.tableData = this.cstmListData(data.list)
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
        this.currentPage = 1
        this.queryObject.currentPage = this.currentPage - 1
        Object.keys(paramsObj).map(key => {
          if(key == 'createAt'){
            if (paramsObj.createAt !== null) {
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
      selectData (val) {
        this.chooseArray = val
      },
      groupBtnClick (type) {
        if(type == 'add'){
          this.$router.push({path: '/customManager/potentialCustom/form?type=new'})
        }
        if(type == 'conversion'){
          if (this.chooseArray.length === 0) {
            this.msgShow(this, '请选择需要转换的行数', 'warning')
            return
          }
          this.confirmDialog(this, '您确认要转换为正式客户吗？').then(() => {
            let arr = []
            this.chooseArray.map(item => {
              arr.push(item.id)
            })
            let ids = arr.join(',')
            let paramsObj = {
              ids: ids,
              uid: this.currentUser.id
            }
            console.log(ids)
            this.customerBatchChange(paramsObj)
          }, () => {
            console.log('cancel')
          })
        }
        if(type == 'delRec'){
          this.$router.push({path: '/customManager/potentialCustom/delRec'})
        }
        if(type == 'conversionRec'){
          this.$router.push({path: '/customManager/potentialCustom/conversionRec'})
        }
      },
      tableChange (val) {
        this.loading = true
        this.currentPage = val
        this.queryObject.currentPage = this.currentPage - 1
        this.loadData()
      },
      rowDel (obj) {
        this.dialogFormVisible = true
        this.rowDelObj = obj
      },
      delSubmit (flg) {
        if (flg == 'ok') {
          this.actionDelete()
        }
        this.dialogFormVisible = false
      },
      async actionDelete () {
        try {
          let url = 'customerManage/customerDel/'
          let params = {
            id: this.rowDelObj.id,
            reason: this.reason,
            currentPage: this.currentPage - 1,
            pageSize: this.pageSize,
            uid: this.currentUser.id
          }
          let { data } = await this.apiStreamPost('/proxy/common/post', {url: url, params: params})
          if (data.returnCode === 0) {
            this.currentPage = 1
            this.queryObject.currentPage = this.currentPage - 1
            this.loadData()
            this.reason = ''
            this.msgShow(this, '删除成功', 'success')
          } else {
            this.msgShow(this, data.errMsg)
          }
        } catch (e) {
          console.error(e)
          this.msgShow(this)
        }
      },
      async customerBatchChange (paramsObj) {
        try{
          let { data } = await this.apiStreamPost('/proxy/common/post', {url: 'customerManage/customerBatchChange', params: paramsObj})
          if (data.returnCode === 0) {
            this.msgShow(this, '转换成功', 'success')
            this.loadData()
          } else {
            this.msgShow(this, data.errMsg)
          }
        } catch (e) {
          console.error(e)
          this.msgShow(this)
        }
      },
      rowEdit (obj) {
        this.jump('/customManager/potentialCustom/form?type=edit&id=' + obj.id)
      }
    }
  }
</script>
<style lang="styl", scoped>
  .width-input-250
    width: 250px
</style>