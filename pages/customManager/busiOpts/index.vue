<template lang="pug">
  .content
    breadcrumb(:breadItems="breadItems")
    .pt-15
      button-group(:btns="btnGroups", @groupBtnClick="groupBtnClick")
    .mt-15
      search-form(:searchFormItems="searchFormItems", @search="searchForm")
    .mt-15
      basic-table(:tableValue="tableValue", :loading="loading", :currentPage="currentPage", :pageSize="pageSize", :total="totalCount", @pageChange="tableChange")
    el-dialog(:title="dialogTitle", :visible.sync="dialogShow", width="800px", @close="subForm('cancel')")
      el-form(:model="busiOpts", :rules="rules", ref="busiOpts", status-icon, label-width="100px", :validate-on-rule-change="false")
        .row
          .col
            el-form-item(prop="opptyName", label="商机名称")
              el-input.full-width(v-model="busiOpts.opptyName", placeholder="请输入商机名称")
        .row
          .col
            el-form-item(prop="remark", label="商机描述")
              el-input.full-width(v-model="busiOpts.remark", type="textarea", placeholder="请输入商机描述")
        .row
          .col
            el-form-item(label="所属客户", prop="cstmName")
              el-select.full-width(v-model="busiOpts.cstmName", :loading="cstmLoading", clearable, value-key, filterable, remote, placeholder="请输入关键词", :remote-method="customerGet")
                el-option(v-for="item in cstmIdList", :key="item.id", :label="item.compName", :value="item.id")
          .col
            el-form-item(prop="linkerName", label="联系人姓名")
              el-input(v-model="busiOpts.linkerName", clearable, placeholder="请输入联系人姓名")
        .row
          .col
            el-form-item(label="联系人电话", prop="linkerPhone")
              el-input(v-model="busiOpts.linkerPhone", clearable, placeholder="请输入联系人电话")
          .col
            el-form-item(prop="opptyAddr", label="商机地址")
              el-input(v-model="busiOpts.opptyAddr", clearable, placeholder="请输入商机地址")
      .dialog-footer.text-right(slot="footer")
        el-button(size="medium", @click="subForm('cancel')") 取消
        el-button(type="primary", size="medium", @click="subForm('ok')") 确认
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
        pageSize: state => state.pageSize,
        currentUser: state => state.user.currentUser
      })
    },
    data () {
      return {
        breadItems: ['客户管理'],
        btnGroups: [{lbl: '新增商机', type: 'add'}],
        searchFormItems: [
          [{label: '商机名称', model: 'opptyName', type: 'text', placeholder: '请输入商机名称', val: ''},
            {label: '联系人', model: 'linkerName', type: 'text', placeholder: '请输入联系人', val: ''},
            {label: '联系电话', model: 'linkerPhone', type: 'text', placeholder: '请输入联系电话', val: ''}],
          [{label: '关联客户', model: 'cstmName', type: 'text', placeholder: '请输入关联客户', val: ''},
          {label: '提交部门', model: 'dptName', type: 'text', placeholder: '请输入提交部门', val: ''},
          {label: '提交人', model: 'acctName', type: 'text', placeholder: '请输入提交人', val: ''}],
          // [{label: '提交日期', model: 'position', type: 'timeLimit', placeholder: '请选择提交日期', val: ''},
          [{label: '提交日期', model: 'createAt', type: 'date', placeholder: '请选择提交日期', val: ''},
          {label: '地址', model: 'opptyAddr', type: 'text', placeholder: '请输入地址', val: ''}]
        ],
        tableValue: {
          tableData: [],
          hasCbx: false,
          rowClassName: false,
          tableHead: [{
            lbl: '商机名称',
            prop: 'opptyName'
          }, {
            lbl: '地址',
            prop: 'opptyAddr'
          }, {
            lbl: '关联客户',
            prop: 'cstmName'
          }, {
            lbl: '联系人',
            prop: 'linkerName'
          }, {
            lbl: '联系电话',
            prop: 'linkerPhone'
          }, {
            lbl: '提交部门',
            prop: 'creator',
            type: 'object',
            factValue (obj) {
              return obj.fkDpt.name
            }
          }, {
            lbl: '提交人',
            prop: 'creator',
            type: 'object',
            factValue (obj) {
              return obj.name
            }
          }, {
            lbl: '提交时间',
            prop: 'createAt'
          }]
        },
        currentPage: 1,
        totalCount: 0,
        queryObject: {
          currentPage: this.currentPage - 1,
          pageSize: this.pageSize
        },
        loading: false,
        dialogTitle: '新增商机',
        dialogShow: false,
        busiOpts: {
          opptyName: '',
          cstmName: '',
          linkerName: '',
          linkerPhone: '',
          opptyAddr: '',
          remark: ''
        },
        rules: {
          opptyName: [{ required: true, message: '不能为空', trigger: 'blur' }],
          linkerPhone: [{required: true, message: '手机号不能为空', trigger: 'blur'}, {len: 11, message: '手机号位数要是11位', trigger: 'blur'}],
          linkerName: [{ required: true, message: '不能为空', trigger: 'blur' }],
          cstmName: [{ required: true, message: '不能为空', trigger: 'change' }],
          opptyAddr: [{ required: true, message: '不能为空', trigger: 'blur' }],
          remark: [{ required: true, message: '不能为空', trigger: 'blur' }]
        },
        cstmIdList: [],
        cstmLoading: false
      }
    },
    mounted () {
      this.queryObject = {
        currentPage: this.currentPage - 1,
        pageSize: this.pageSize
      }
      this.loadData()
    },
    methods: {
      searchForm (paramsObj) {
        this.queryObject['currentPage'] = 0
        for (let key in paramsObj) {
          this.queryObject[key] = paramsObj[key]
          if (this.queryObject[key] == '' || this.queryObject[key] == null) {
            delete this.queryObject[key]
          }
        }
        this.tableValue.tableData = []
        this.loadData()
      },
      groupBtnClick () {
        this.dialogShow = true
      },
      subForm (flg) {
        if (flg == "ok") {
          this.$refs['busiOpts'].validate((valid) => {
            if (valid) {
              console.log('--------subForm')
              console.log(this.busiOpts)
              this.busiOpts['uid'] = this.currentUser.id
              this.createBusiOppty().then(() => {
                this.dialogShow = false
                this.loadData()
              })
            } else {
              console.log('error submit!!')
              return false;
            }
          })          
        } else {
          this.dialogShow = false
        }
      },
      tableChange (val) {
        this.loading = true
        this.currentPage = val
        this.queryObject.currentPage = this.currentPage - 1
        this.loadData()
      },
      async loadData () {
        this.queryObject.uid = this.currentUser.id
        this.loading = true
        try {
          let { data } = await this.apiStreamPost('/proxy/common/post', {url: 'customerManage/busiOppty', params: this.queryObject})
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
      },
      async customerGet (query) {
        this.cstmLoading = true
        let params = {
          uid: this.currentUser.id,
          pageSize: 10,
          compName: query
        }
        if(query !== ''){
          try {
            let { data } = await this.apiStreamPost('/proxy/common/post', {url: 'customerManage/customer/queryCombo', params: params})
              if (data.returnCode === 0) {
                this.cstmIdList = data.list
              } else {
                this.msgShow(this, data.errMsg)
              }
              this.cstmLoading = false
          } catch (e) {
            console.error(e)
            this.msgShow(this)
            this.cstmLoading = false
          }
        }
      },
      async createBusiOppty () {
        try {
          let { data } = await this.apiStreamPost('/proxy/common/post', {url: 'customerManage/busiOppty/create', params: this.busiOpts})
            if (data.returnCode === 0) {
              this.msgShow(this, '新增成功', 'success')
            } else {
              this.msgShow(this, data.errMsg)
            }
            this.cstmLoading = false
        } catch (e) {
          console.error(e)
          this.msgShow(this)
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