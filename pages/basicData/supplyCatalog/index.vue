<template lang="pug">
  .content
    breadcrumb(:breadItems="breadItems")
    .pt-15
      button-group(:btns="btnGroups", @groupBtnClick="groupBtnClick")
    searchForm.mt-20(:searchFormItems="searchFormItems", @search="searchBtn")
    .mt-15
      basic-table(:tableValue="tableValue", :loading="loading", @tableRowEdit="rowEdit", @tableRowDelete="rowDel", @chooseData="chooseData", :pageSize="pageSize", :currentPage="currentPage", :total="totalPage", @pageChange="tablePageChange")
    el-dialog(:title="dialogTitle", :visible.sync="dialogShow", width="30%")
      el-form(:model="dialogObj", ref="bsrlForm", :rules="dialogRules", status-icon)
        el-form-item(label="名称", prop="name")
          el-input(v-model="dialogObj.name")
        el-form-item(label="状态", prop="status")
          el-radio(v-model="dialogObj.status", label="1") 启用
          el-radio(v-model="dialogObj.status", label="0") 停用
      .dialog-footer.text-right
        el-button(@click="dialogCancel") 取消
        el-button(type="primary", @click="submit('bsrlForm')") {{dialogModel == 'create' ? '新增' : '更新'}}
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
        breadItems: ['基础数据', '物资品类'],
        dialogShow: false,
        dialogModel: '',
        dialogTitle: '',
        totalPage: 0,
        currentPage: 1,
        dialogObj: {
          name: '',
          status: '1'
        },
        dialogRules: {
          name: [{required: true, message: '不能为空', trigger: 'blur'}]
        },
        btnGroups: [{
          lbl: '新增物资品类',
          type: 'add'
        },{
          lbl: '批量启用',
          type: 'start'
        }, {
          lbl: '批量停用',
          type: 'stop'
        }],
        searchFormItems: [
          [{label: '品类代码', model: 'id', type: 'text', placeholder: '请输入品类代码', val: ''},
          {label: '品类名称', model: 'name', type: 'text', placeholder: '请输入品类名称', val: ''}]
        ],
        tableValue: {
          tableData: [],
          hasCbx: true,
          tableHead: [{
            lbl: '物资品类代码',
            prop: 'id'
          }, {
            lbl: '物资品类名称',
            prop: 'name'
          }, {
            lbl: '状态',
            prop: 'status'
          }, {
            type: 'action',
            actionBtns: [{
              lbl: '编辑',
              type: 'edit'
            }, {
              lbl: '删除',
              type: 'delete'
            }]
          }]
        },
        chooseArray: [],
        loading: true
      }
    },
    computed: {
      ...mapState({
        pageSize: state => state.pageSize
      })
    },
    beforeMount () {
      this.$nextTick(() => {
        this.loadData()
      })
    },
    methods: {
      groupBtnClick (type) {
        if (type === 'add') {
          this.dialogModel = 'create'
          this.dialogTitle = '新增物资品类'
          this.dialogShow = true
        } else if (type === 'start') {
          if (this.chooseArray.length === 0) {
            this.msgShow(this, '请选择启用的行数', 'warning')
            return
          }
          this.batchUpdate(1)
        } else {
          if (this.chooseArray.length === 0) {
            this.msgShow(this, '请选择停用的行数', 'warning')
            return
          }
          this.batchUpdate(0)
        }
      },
      promptBtn (data) {
        console.log(data)
        this.promptShow = false
      },
      searchBtn (data) {
        this.loading = true
        this.supplyCatalogSearch(data)
      },
      dialogCancel () {
        this.dialogShow = false
        this.$refs.bsrlForm.resetFields()
      },
      submit (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.dialogModel === 'create') {
              this.supplyCatalogCreate()
            } else {
              this.supplyCatalogUpdate()
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      chooseData (rows) {
        this.chooseArray = rows
      },
      tablePageChange (cutPage) {
        this.currentPage = cutPage
        this.loadData()
      },
      async loadData () {
        this.loading = true
        try {
          let { data } = await this.apiStreamPost('/proxy/common/post', {url: 'basicData/supplyCatalog', params: {currentPage: (this.currentPage - 1), pageSize: this.pageSize}})
          if (data.returnCode === 0) {
            this.tableValue.tableData = data.list
            this.totalPage = data.total
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
      async supplyCatalogSearch (params) {
        try {
          let { data } = await this.apiStreamPost('/proxy/common/post', {url: 'basicData/supplyCatalog', params: {id: params.id, name: params.name, currentPage: (this.currentPage - 1), pageSize: this.pageSize}})
          if (data.returnCode === 0) {
            this.tableValue.tableData = data.list
            this.totalPage = data.total
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
      async supplyCatalogCreate () {
        try {
        let { data } = await this.apiStreamPost('/proxy/common/post', {url: 'basicData/supplyCatalog/create', params: {name: this.dialogObj.name, status: Number(this.dialogObj.status)}})
          if (data.returnCode === 0) {
            this.loadData()
            this.dialogShow = false
            this.$refs.bsrlForm.resetFields()
            this.msgShow(this, '保存成功', 'success')
          } else {
            this.msgShow(this, data.errMsg)
          }
        } catch (e) {
          console.error(e)
          this.msgShow(this)
        }
      },
      async batchUpdate (status) {
        try {
          let { data } = await this.apiStreamPost('/proxy/common/post', {url: 'basicData/supplyCatalog/batchUpdate', params: {status: status, ids: this.chooseArray.map(itm => itm.id).join(',')}})
          if (data.returnCode === 0) {
            this.loadData()
            this.msgShow(this, '批量操作成功', 'success')
          } else {
            this.msgShow(this, data.errMsg)
          }
        } catch (e) {
          console.error(e)
          this.msgShow(this)
        }
      },
      async supplyCatalogUpdate () {
        try {
          let { data } = await this.apiStreamPost('/proxy/common/post', {url: 'basicData/supplyCatalog/update', params: {name: this.dialogObj.name, status: Number(this.dialogObj.status), id: this.dialogObj.id}})
          if (data.returnCode === 0) {
            this.currentPage = 1
            this.loadData()
            this.dialogShow = false
            this.$refs.bsrlForm.resetFields();
            this.msgShow(this, '更新成功', 'success')
          } else {
            this.msgShow(this, data.errMsg)
          }
        } catch (e) {
          console.error(e)
          this.msgShow(this)
        }
      },
      async supplyCatalogDel (id) {
        try {
          let { data } = await this.apiStreamPost('/proxy/common/del', {url: 'basicData/supplyCatalog/' + id})
          if (data.returnCode === 0) {
            this.currentPage = 1
            this.loadData()
            this.msgShow(this, '删除成功', 'success')
          }
        } catch (e) {
          console.error(e)
          this.msgShow(this)
        }
      },
      rowEdit (obj) {
        console.log(obj)
        this.dialogObj = Object.assign({}, obj)
        this.dialogObj.status = this.dialogObj.status.toString()
        this.dialogModel = 'update'
        this.dialogTitle = '更新物资品类'
        this.dialogShow = true
      },
      rowDel (obj) {
        this.confirmDialog(this, '您确认要删掉本行记录吗？').then(() => {
          this.supplyCatalogDel(obj.id)
        }, () => {
          console.log('cancel')
        })
      }
    }
  }
</script>