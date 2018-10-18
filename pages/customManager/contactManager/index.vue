<template lang="pug">
  .content
    breadcrumb(:breadItems="breadItems")
    .pt-15
      button-group(:btns="btnGroups", @groupBtnClick="groupBtnClick")
    .mt-15
      search-form(:searchFormItems="searchFormItems", @search="searchForm")
    .mt-15
      basic-table(:tableValue="tableValue", :loading="loading", :currentPage="currentPage", :pageSize="pageSize", :total="totalCount", @pageChange="tableChange", @tableRowDelete="rowDel", @tableRowEdit="rowEdit", @tableRowDetail="rowDetail")
    el-dialog(:title="dialogTitle", :visible.sync="dialogShow", width="800px", @close="subForm('cancel')")
      el-form(:model="linker", :rules="rules", ref="linker", status-icon, label-width="100px", :validate-on-rule-change="false")
        .row
          .col
            el-form-item(label="所属客户", prop="compName")
              el-select.full-width(v-model="linker.compName", :loading="cstmLoading", :disabled="disabledMainStatus", clearable, value-key, filterable, remote, placeholder="请输入关键词", :remote-method="customerGet")
                el-option(v-for="item in cstmIdList", :key="item.id", :label="item.compName", :value="item.id")
          .col
            el-form-item(prop="name", label="联系人姓名")
              el-input(v-model="linker.name", clearable)
        .row
          .col
            el-form-item(label="是否主联系人")
              el-select.full-width(v-model="linker.mainStatus", :disabled="disabled", clearable)
                el-option(v-for="item in mainStatusOpts", :key="item.value", :label="item.label", :value="item.value")
          .col
            el-form-item(prop="phone", label="联系方式")
              el-input(v-model="linker.phone")
        .row
          .col
            el-form-item(label="性别", prop="sex")
              el-select.full-width(v-model="linker.sex", clearable)
                el-option(v-for="item in sexOpts", :key="item.value", :label="item.label", :value="item.value")
          .col
            el-form-item(label="年龄")
              el-input(v-model="linker.age", type="number", clearable)
        .row
          .col
            el-form-item(label="学历")
              el-select.full-width(v-model="linker.edu", clearable)
                el-option(v-for="item in eduOpts", :key="item.value", :label="item.label", :value="item.value")
          .col
            el-form-item(label="职位")
              el-input(v-model="linker.position",  clearable)
        .row
          .col
            el-form-item(label="微信")
              el-input.full-width(v-model="linker.wxNo", clearable)
          .col
            el-form-item(label="QQ")
              el-input(v-model="linker.qqNo",  clearable)
        .row
          .col
            el-form-item(label="备注")
              el-input.full-width(v-model="linker.remark", clearable)
      .dialog-footer.text-right(slot="footer")
        el-button(size="medium", @click="subForm('cancel')") 取消
        el-button(type="primary", size="medium", @click="subForm('ok')") {{btnStr}}
    el-dialog(title="删除", :visible.sync="dialogDel", @close="delSubmit('cancel')")
      .row.flex-center
        .col.flex-80 删除理由:
        .col
          el-input.full-width(v-model="reason", auto-complete="off")
      .dialog-footer(slot="footer")
        el-button(@click="delSubmit('cancel')") 取消
        el-button(type="primary", @click="delSubmit('ok')") 确定
    el-dialog(title="联系人信息", :visible.sync="dialogDetail", width="1000px", @close="closeDetail")
      .box-detail
        .row.flex-center
          .col
            .row
              .col.flex-100 所属客户：
              .col {{rowObj.compName}}
          .col
            .row
              .col.flex-100 联系人姓名：
              .col {{rowObj.name}}
        .row.flex-center.mt-15
          .col
            .row
              .col.flex-100 是否主联系人：
              .col(v-text="rowObjMainStatus()")
          .col
            .row
              .col.flex-100 联系方式：
              .col {{rowObj.phone}}
        .row.flex-center.mt-15
          .col
            .row
              .col.flex-100 职位：
              .col {{rowObj.position}}
          .col
            .row
              .col.flex-100 年龄：
              .col {{rowObj.age}}
        .row.flex-center.mt-15
          .col
            .row
              .col.flex-100 学历：
              .col {{rowObj.edu}}
          .col
            .row
              .col.flex-100 QQ：
              .col {{rowObj.qqNo}}
        .row.flex-center.mt-15
          .col
            .row
              .col.flex-100 微信：
              .col {{rowObj.wxNo}}
          .col
            .row
              .col.flex-100 备注：
              .col {{rowObj.remark}}
      .mt-20.ft-18.ft-color 修改记录
      .mt-15
        basic-table(:tableValue="tableEditValue", :loading="loadDetail", :currentPage="currentPageDetail", :pageSize="pageSize", :total="totalCountDetail", @pageChange="tableChangeDetail")
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
        breadItems: ['客户管理', '联系人管理'],
        btnGroups: [{lbl: '新增联系人信息', type: 'add'}, {lbl: '删除记录', type: 'delRec'}],
        searchFormItems: [
          [{label: '公司名称', model: 'compName', type: 'text', placeholder: '请输入公司名称', val: ''},
            {label: '联系人姓名', model: 'name', type: 'text', placeholder: '请输入联系人姓名', val: ''},
            {label: '联系方式', model: 'phone', type: 'text', placeholder: '请输入联系方式', val: ''}],
          [{label: '添加日期', model: 'createAt', type: 'timeLimit', placeholder: '请选择添加日期', val: ''},
          {label: '联系人类型', model: 'mainStatus', type: 'select', placeholder: '请选择联系人类型', val: '', list: []},
          {label: '性别', model: 'sex', type: 'select', placeholder: '请选择性别', val: '', list: []}],
          [{label: '职位', model: 'position', type: 'autocomplete', placeholder: '请选择职位', val: ''},
          {label: '业务部门', model: 'dptName', type: 'text', placeholder: '请选择业务部门', val: ''},
          {label: '业务员', model: 'acctName', type: 'text', placeholder: '请选择业务员', val: ''}]
        ],
        tableValue: {
          tableData: [],
          hasCbx: false,
          rowClassName: false,
          tableHead: [{
            lbl: '所属客户',
            prop: 'fkCustom',
            type: 'linkObject',
            minWidth: '340px',
            linkUrl: '/customManager/contactManager/detail',
            factValue (row) {
              let arr = {
                id: row.id,
                name: row.compName
              }
              return arr
            }
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
            align: 'center',
            width: '150px'
          }, {
            lbl: '微信',
            prop: 'wxNo',
            align: 'center',
            width: '150px'
          }, {
            lbl: '添加时间',
            prop: 'createAt',
            width: '195px',
            align: 'center',
            sort: true
          }, {
            lbl: '创建人',
            prop: 'creator',
            type: 'object',
            // width: '145px',
            factValue (row) {
              return row.name
            }
          }, {
            type: 'action',
            width: '150px',
            fixed: 'right',
            actionBtns: [{
              lbl: '详情',
              type: 'detail'
            }, {
              lbl: '编辑',
              type: 'edit'
            }, {
              lbl: '删除',
              type: 'delete'
            }]
          }]
        },
        dialogTitle: '新增联系人信息',
        btnStr: '创建',
        linker: {
          id: null,
          name: '',
          phone: '',
          sex: null,
          age: '0',
          edu: '',
          wxNo: '',
          qqNo: '',
          mainStatus: 0,
          position: '',
          cstmId: '',
          compName: '',
          uid: '',
          remark: ''
        },
        cstmIdList: [],
        rules: {
          name: [{ required: true, message: '不能为空', trigger: 'blur' }],
          phone: [{required: true, message: '手机号不能为空', trigger: 'blur'}, {len: 11, message: '手机号位数要是11位', trigger: 'blur'}],
          sex: [{ required: true, message: '不能为空', trigger: 'change' }],
          compName: [{ required: true, message: '不能为空', trigger: 'change' }]
        },
        dialogShow: false,
        dialogDel: false,
        dialogDetail: false,
        reason: '',
        currentPage: 1,
        totalCount: 0,
        queryObject: {
          currentPage: this.currentPage - 1,
          pageSize: this.pageSize
        },
        snapData: [],
        disabled: false,
        disabledMainStatus: false,
        loading: true,
        loadDetail: true,
        rowObj: {},
        tableEditValue: {
          tableData: [],
          hasCbx: false,
          rowClassName: false,
          tableHead: [{
            lbl: '修改时间',
            prop: 'createAt'
          }, {
            lbl: '字段名称',
            prop: 'columnName'
          }, {
            lbl: '原值',
            prop: 'originVal'
          }, {
            lbl: '修改值',
            prop: 'modifyVal'
          }, {
            lbl: '修改人',
            prop: 'creator',
            type: 'object',
            factValue (row) {
              return row.name
            }
          }]
        },
        currentPageDetail: 1,
        totalCountDetail: 0,
        linkerModifyObj: {
          currentPage: this.currentPageDetail - 1,
          pageSize: this.pageSize
        },
        cstmLoading: false
      }
    },
    beforeMount () {
      this.searchFormItems[1][1].list = [{value: '', label: '全部'}, {value: 1, label: '主联系人'}, {value: 0, label: '普通联系人'}]
      this.searchFormItems[1][2].list = this.sexOpts
    },
    mounted () {
      this.$nextTick(() => {
        this.linker = {id: this.currentUser.id, name: '', phone: '',  sex: null, age: '0', edu: '', wxNo: '', qqNo: '',
          mainStatus: 0, position: '', cstmId: '', compName: '', uid: '', remark: ''}
        this.snapData = JSON.parse(JSON.stringify(this.linker))  
      })      
      this.queryObject = {
        currentPage: this.currentPage - 1,
        pageSize: this.pageSize
      }
      this.loadData()        
    },
    methods: {
      rowObjMainStatus () {
        return (this.rowObj.mainStatus == 1) ?  '是' : '否' 
      },
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
      groupBtnClick (type) {
        if (type == 'add') {
          debugger
          this.linker = JSON.parse(JSON.stringify(this.snapData))
          if (this.cstmIdList.length == 0) {
            this.customerGet()
          }
          this.dialogShow = true
          if(this.$refs['linker']!==undefined){
            this.$refs['linker'].clearValidate()
            this.disabled = false
            this.disabledMainStatus = false
          }
          this.dialogTitle = '新增联系人信息'
          this.btnStr = '创建'
        } else if (type == 'delRec') {
          this.jump({path: '/customManager/contactManager/delRec'})
        }
      },
      subForm (flg) {
        if(flg == 'ok'){
          this.linker.age = Number(this.linker.age)
          debugger
          this.$refs['linker'].validate((valid) => {
            if (valid) {
              if (typeof(this.linker.compName) == 'number') {
                this.linker.cstmId = this.linker.compName
              }
              this.linker.uid = this.currentUser.id
              if (this.disabled) {
                // delete this.linker.compName
                delete this.linker.fkCustom
                delete this.linker.creator
                delete this.linker.createAt
                delete this.linker.updateAt
              }
              this.createOrUpdate(this.linker)
            }
          })
        } else {
          this.dialogShow = false
          this.disabledMainStatus = false
        }
      },
      tableChange (val) {
        this.loading = true
        this.currentPage = val
        this.queryObject.currentPage = this.currentPage - 1
        this.loadData()
      },
      tableChangeDetail (val) {
        this.loadDetail = true
        this.currentPageDetail = val
        this.linkerModifyObj.currentPage = this.currentPageDetail - 1
        this.linkerModify()
      },
      delSubmit (flg) {
        if(flg == 'ok'){
          if(this.reason.trim() == ''){
            this.msgShow(this, '请填写删除理由')
            return
          }
          this.linkerDelete()
        } else {
          this.dialogDel = false
        }
      },
      rowDetail (obj) {
        this.dialogDetail = true
        this.rowObj = obj
        this.linkerModifyObj = {
          currentPage: this.currentPageDetail - 1,
          pageSize: this.pageSize,
          linkId: obj.id
        }
        this.linkerModify()
      },
      closeDetail () {
        this.currentPageDetail = 1
      },
      rowDel (obj) {
        this.dialogDel = true
        this.rowObj = obj
      },
      rowEdit (row) {
        if (this.cstmIdList.length == 0) {
          this.customerGet()
        }
        this.linker = JSON.parse(JSON.stringify(row))
        this.linker.originCstmId = this.linker.cstmId
        if(this.$refs['linker'] !== undefined){
          this.$refs['linker'].clearValidate()
        }
        this.disabled = true
        if(row.mainStatus == 1){
          this.disabledMainStatus = true
        }
        this.dialogTitle = '编辑联系人信息'
        this.btnStr = '更新'
        this.dialogShow = true
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
      async linkerModify () {
        try {
          let { data } = await this.apiStreamPost('/proxy/common/post', {url: 'customerManage/linkerModify', params: this.linkerModifyObj})
            if (data.returnCode === 0) {
              this.tableEditValue.tableData = data.list
              this.totalCountDetail = data.total
              this.loadDetail = false
            } else {
              this.msgShow(this, data.errMsg)
            }
        } catch (e) {
          console.error(e)
          this.msgShow(this)
        }
      },
      async loadData (params) {
        this.queryObject.uid = this.currentUser.id
        this.loading = true
        try {
          let { data } = await this.apiStreamPost('/proxy/common/post', {url: 'customerManage/linker', params: this.queryObject})
            if (data.returnCode === 0) {
              let arr = []
              data.list.map(itm => {
                itm[0].fkCustom  = itm[1]
                itm[0].cstmId = itm[1].id
                itm[0].compName = itm[1].compName                
                arr.push(itm[0])
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
      async createOrUpdate (params) {
        try {
          let { data } = await this.apiStreamPost('/proxy/common/post', {url: 'customerManage/linker/createOrUpdate', params: params})
            if (data.returnCode === 0) {
              this.msgShow(this, '保存成功', 'success')
              this.dialogShow = false
              this.loadData()
              this.$refs['linker'].resetFields();
            } else {
              this.msgShow(this, data.errMsg)
            }
        } catch (e) {
          console.error(e)
          this.msgShow(this)
        }
      },
      async linkerDelete () {
        try {
          let params = {
            id: this.rowObj.id,
            cstmId: this.rowObj.cstmId,
            uid: this.currentUser.id,
            reason: this.reason
          }
          let { data } = await this.apiStreamPost('/proxy/common/post', {url: 'customerManage/linkerDel', params: params})
            if (data.returnCode === 0) {
              this.dialogDel = false
              this.reason = ''
              this.msgShow(this, '删除成功', 'success')
              this.loadData()              
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
  .ft-color{
    color: #303133;
  }
  .box-detail{
    background: #f9f9f9; 
    padding: 20px;
  }
</style>