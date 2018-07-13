<template lang="pug">
.content
  breadcrumb(:breadItems="breadItems")
  .pt-15
    el-tabs(type="border-card", v-model="activeName")
      el-tab-pane(label="机构设置", name="org")
        template(v-if="tabModel == 'orgList'")
          button-group(:btns="orgBtnGroups", @groupBtnClick="btnsClick")
          .pt-20
            search-form(:searchFormItems="orgSearchItems", @search="searchBtn")
          .pt-20
            basic-table(:tableValue="orgTableValue", :currentPage="currentPage", :pageSize="pageSize", :total="totalCount", @tableRowQuery="orgRowQuery", @tableRowEdit="orgRowEdit", @tableRowDelete="rowDel", @chooseData="selectData", @pageChange="tablePgChange")
        template(v-else-if="tabModel == 'orgFormDetail'")
          el-button(@click="tabModel = 'orgList'", size="small") 返回列表
          .pt-15
            detail-table(:tableForm="orgDetailItems", :tableValue="orgItems")
      el-tab-pane(label="部门设置", name="dpt")
        template(v-if="tabModel == 'dptList'")
          button-group(:btns="dptBtnGroups", @groupBtnClick="btnsClick")
          .pt-20
            search-form(:searchFormItems="dptSearchItems", @search="searchBtn")
          .pt-20
            basic-table(:tableValue="dptTableValue", :currentPage="currentPage", :pageSize="pageSize", :total="totalCount", @chooseData="selectData", @tableRowDelete="rowDel", @tableRowEdit="dptRowEdit", @tableRowQuery="dptRowQuery", @pageChange="tablePgChange")
        template(v-else-if="tabModel == 'dptFormDetail'")
          el-button(@click="tabModel = 'dptList'", size="small") 返回列表
          .pt-15
            detail-table(:tableForm="dptDetailItems", :tableValue="dptItems")
  el-dialog(:title="dialogTitle", :visible.sync="dialogShow", width="35%")
    template(v-if="activeName == 'org'")
      el-form(:model="orgItems", :rules="orgFormRules", ref="orgForm", status-icon, label-width="80px", :validate-on-rule-change="false")
        el-form-item(prop="name", label="机构全称")
          el-input(v-model="orgItems.name")
        el-form-item(prop="simpleName", label="机构简称")
          el-input(v-model="orgItems.simpleName")
        el-form-item(prop="status", label="机构状态")
          el-radio(v-model="orgItems.status", label="1") 启用
          el-radio(v-model="orgItems.status", label="0") 停用
        el-form-item(prop="legalRept", label="法人代表")
          el-input(v-model="orgItems.legalRept")
        el-form-item(prop="remark", label="机构备注")
          el-input(v-model="orgItems.remark", type="textarea")
    template(v-else)
      el-form(:model="dptItems", :rules="dptFormRules", ref="dptForm", status-icon, label-width="80px", :validate-on-rule-change="false")
        el-form-item(prop="name", label="部门名称")
          el-input(v-model="dptItems.name")
        el-form-item(prop="leader", label="负责人")
          el-input(v-model="dptItems.leader")
        el-form-item(prop="status", label="部门状态")
          el-radio(v-model="dptItems.status", label="1") 启用
          el-radio(v-model="dptItems.status", label="0") 停用
        el-form-item(prop="orgId", label="所属机构")
          el-select.full-width(v-model="dptItems.orgId", @change="orgSelect", ref="orgSelect")
            el-option(v-for="(optg,idx) in orgOpts", :key="idx", :label="optg.label", :value="optg.value")
        el-form-item(label="机构简称", prop="orgShortName")
          el-input.no-border(readOnly, v-model="dptItems.orgShortName")
        el-form-item(prop="remark", label="部门备注")
          el-input(v-model="dptItems.remark")
    .dialog-footer.text-right(slot="footer")
      el-button(size="medium", @click="cancelForm") 取消
      el-button(type="primary", size="medium", @click="subForm") {{formType == 'create' ? '创建' : '更新'}}

</template>

<script>
  import breadcrumb from '@/components/Breadcrumb.vue'
  import buttonGroup from '@/components/ButtonGroup.vue'
  import searchForm from '@/components/SearchForm.vue'
  import basicTable from '@/components/BasicTable.vue'
  import detailTable from '@/components/DetailTable.vue'
  import { mapState } from 'vuex'
  export default {
    layout: 'main',
    data () {
      return {
        tabModel: 'orgList',
        activeName: 'org',
        breadItems: ['系统设置', '组织架构', '机构设置'],
        currentPage: 1,
        dialogShow: false,
        dialogTitle: '',
        formType: 'create',
        chooseArray: [],
        orgItems: {
          name: '',
          simpleName: '',
          status: '1',
          legalRept: '',
          remark: ''
        },
        orgFormRules: {
          name: [{required: true, message: '机构全称不能为空', trigger: 'blur'}]
        },
        orgBtnGroups: [{
          lbl: '机构新增',
          type: 'add'
        }, {
          lbl: '批量启用',
          type: 'start'
        }, {
          lbl: '批量停用',
          type: 'stop'
        }],
        orgSearchItems: [
          [{label: '机构代码', model: 'id', type: 'text', placeholder: '请输入机构代码', val: ''},
          {label: '机构全称', model: 'name', type: 'text', placeholder: '请输入机构全称', val: ''},
          {
            label: '机构简称', model: 'simpleName', type: 'text', placeholder: '请输入机构简称', val: ''
          }],
          [{label: '机构备注', model: 'remark', type: 'text', placeholder: '请输入机构备注', val: ''}]
        ],
        orgTableValue: {
          tableData: [],
          tableHead: [{
            lbl: '机构代码',
            prop: 'id'
          }, {
            lbl: '机构全称',
            prop: 'name'
          }, {
            lbl: '机构简称',
            prop: 'simpleName'
          }, {
            lbl: '机构状态',
            prop: 'status',
            width: '80'
          }, {
            lbl: '机构备注',
            prop: 'remark'
          }, {
            type: 'action',
            actionBtns: [{
              lbl: '查看',
              type: 'query'
            }, {
              lbl: '编辑',
              type: 'edit'
            }, {
              lbl: '删除',
              type: 'delete'
            }]
          }],
          hasCbx: true
        },
        orgDetailItems: [
          [{lbl: '机构全称', key: 'name'}, {lbl: '机构简称', key: 'simpleName'}],
          [{lbl: '机构状态', key: 'status'}, {lbl: '法人代表', key: 'legalRept'}],
          [{lbl: '机构备注', key: 'remark'}, {lbl: '更新时间', key: 'updateAt'}],
          [{lbl: '创建时间', key: 'createAt'}]
        ],
        orgOpts: [],
        dptBtnGroups: [{
          lbl: '部门新增',
          type: 'add'
        }, {
          lbl: '批量启用',
          type: 'start'
        }, {
          lbl: '批量停用',
          type: 'stop'
        }],
        dptSearchItems: [
          [{label: '部门代码', model: 'id', type: 'text', placeholder: '请输入部门代码', val: ''},
          {label: '部门名称', model: 'name', type: 'text', placeholder: '请输入部门名称', val: ''},
          {
            label: '所属机构', model: 'orgName', type: 'text', placeholder: '请输入所属机构', val: ''
          }],
          [{label: '机构简称', model: 'orgShortName', type: 'text', placeholder: '请输入机构简称', val: ''},
          {
            label: '部门备注', model: 'remark', type: 'text', placeholder: '请输入部门备注', val: ''
          }]
        ],
        dptTableValue: {
          hasCbx: true,
          tableHead: [{
            lbl: '部门代码',
            prop: 'id'
          }, {
            lbl: '部门名称',
            prop: 'name'
          }, {
            lbl: '状态',
            prop: 'status'
          }, {
            type: 'object',
            lbl: '所属机构',
            prop: 'fkOrg',
            factValue (row) {
              return row.name
            }
          }, {
            type: 'object',
            lbl: '机构简称',
            prop: 'fkOrg',
            factValue (row) {
              return row.simpleName
            }
          }, {
            lbl: '部门备注',
            prop: 'remark'
          }, {
            type: 'action',
            actionBtns: [{
              lbl: '查看',
              type: 'query'
            }, {
              lbl: '编辑',
              type: 'edit'
            }, {
              lbl: '删除',
              type: 'delete'
            }]
          }],
          tableData: []
        },
        dptItems: {
          name: '',
          leader: '',
          status: '1',
          orgId: '',
          orgShortName: '',
          remark: ''
        },
        dptFormRules: {
          name: [{required: true, message: '名称不能为空', trigger: 'blur'}],
          orgId: [{required: true, message: '请选择所属机构', trigger: 'change'}]
        },
        dptDetailItems: [
          [{lbl: '部门名称', key: 'name'}, {lbl: '负责人', key: 'leader'}],
          [{lbl: '部门状态', key: 'status'}, {lbl: '所属机构', key: 'orgName'}],
          [{lbl: '机构简称', key: 'orgShortName'}, {lbl: '备注', key: 'remark'}],
          [{lbl: '更新时间', key: 'updateAt'}, {lbl: '创建时间', key: 'createAt'}]
        ],
        totalCount: 0,
        queryObj: {
          currentPage: this.currentPage - 1,
          pageSize: this.pageSize
        }
      }
    },
    computed: {
      ...mapState({
        pageSize: state => state.pageSize
      })
    },
    components: {
      breadcrumb,
      buttonGroup,
      searchForm,
      basicTable,
      detailTable
    },
    watch: {
      activeName (newVal, oldVal) {
        console.log(newVal)
        this.currentPage = 1
        this.queryObj.currentPage = this.currentPage - 1
        if (newVal === 'org') {
          this.breadItems = ['系统设置', '组织架构', '机构设置']
          this.tabModel = 'orgList'
          this.loadData()
        } else {
          this.orgAll()
          this.tabModel = 'dptList'
          this.breadItems = ['系统设置', '组织架构', '部门设置']
          this.loadData()
        }
      }
    },
    beforeMount () {
      this.$nextTick(() => {
        this.queryObj = {
          currentPage: this.currentPage - 1,
          pageSize: this.pageSize
        }
        this.loadData()
        // 获取机构下拉数据
        this.orgAll()
      })
    },
    methods: {
      btnsClick (type) {
        if (type === 'add') {
          this.dialogTitle = this.activeName === 'org' ? '机构新增' : '部门新增'
          this.dialogShow = true
          this.formType = 'create'
        } else if (type === 'start') {
          if (this.chooseArray.length === 0) {
            this.msgShow(this, '请选择启用的行', 'warning')
            return
          }
          this.batchUpdate(1)
        } else if (type === 'stop') {
          if (this.chooseArray.length === 0) {
            this.msgShow(this, '请选择停用的行', 'warning')
            return
          }
          this.batchUpdate(0)
        }
      },
      searchBtn (val) {
        console.log(val)
        this.currentPage = 1
        this.queryObj = {
          currentPage: this.currentPage - 1,
          pageSize: this.pageSize
        }
        Object.keys(val).map(k => {
          if (val[k].length > 0) {
            this.queryObj[k] = val[k]
          } else {
            delete this.queryObj[k]
          }
        })
        this.loadData()
      },
      cancelForm () {
        this.dialogShow = false
        this.$refs[this.activeName + 'Form'].resetFields()
      },
      subForm () {
        this.$refs[this.activeName + 'Form'].validate((valid) => {
          if (valid) {
            this.formAction()
          } else {
            console.error('error submit!!')
            return false
          }
        })
      },
      selectData (val) {
        this.chooseArray = val
      },
      async batchUpdate (status) {
        try {
          let url = 'setting/org/batchUpdate'
          if (this.activeName === 'dpt') url = 'setting/dpt/batchUpdate'
          let { data } = await this.apiStreamPost('/proxy/common/post', {url: url, params: {status: status, ids: this.chooseArray.map(itm => itm.id).join(',')}})
          if (data.returnCode === 0) {
            this.currentPage = 1
            this.queryObj.currentPage = this.currentPage - 1
            this.loadData()
            this.msgShow(this, `批量${status === 1 ? '启用' : '停用'}成功`, 'success')
          } else {
            this.msgShow(this, data.errMsg)
          }
        } catch (e) {
          console.error(e)
          this.msgShow(this)
        }

      },
      async orgAll () {
        let { data } = await this.apiStreamPost('/proxy/common/get', {url: 'setting/org/queryCombo'})
        if (data.returnCode === 0) {
          this.orgOpts = []
          data.list.map(itm => {
            this.orgOpts.push({
              value: itm.id.toString(),
              label: itm.name,
              shortName: itm.simpleName
            })
          })
        }
      },
      orgSelect (val) {
        let idx = this.orgOpts.findIndex(itm => itm.value === val)
        if (idx > -1) this.dptItems.orgShortName = this.orgOpts[idx].shortName
        this.$forceUpdate()
      },
      orgRowQuery (row) {
        this.tabModel = 'orgFormDetail'
        this.orgItems = Object.assign({}, row)
      },
      orgRowEdit (row) {
        this.orgItems = Object.assign({}, row)
        this.orgItems.status = row.status.toString()
        delete this.orgItems.createAt
        delete this.orgItems.updateAt
        this.dialogTitle = '机构更新'
        this.formType = 'update'
        this.dialogShow = true
      },
      dptRowEdit (row) {
        console.log(row)
        this.dptItems = Object.assign({}, row)
        this.dptItems.status = row.status.toString()
        this.dptItems.orgId = row.fkOrg.id.toString()
        this.dptItems.orgShortName = row.fkOrg.simpleName
        delete this.dptItems.fkOrg
        delete this.dptItems.createAt
        delete this.dptItems.updateAt
        this.dialogTitle = '部门更新'
        this.formType = 'update'
        this.dialogShow = true
      },
      dptRowQuery (row) {
        this.tabModel = 'dptFormDetail'
        this.dptItems = Object.assign({}, row)
        this.dptItems.orgName = row.fkOrg.name
        this.dptItems.orgShortName = row.fkOrg.simpleName
      },
      rowDel (row) {
        this.confirmDialog(this, '您确认要删掉本行记录吗？').then(() => {
          this.rowDelete(row.id)
        }, () => {
          console.log('cancel')
        })
      },
      async rowDelete (id) {
        try {
          let url = 'setting/org/' + id
          if (this.activeName === 'dpt') url = 'setting/dpt/' + id
          let { data } = await this.apiStreamPost('/proxy/common/del', {url: url})
          if (data.returnCode === 0) {
            this.msgShow(this, '删除成功', 'success')
            this.currentPage = 1
            this.queryObj.currentPage = this.currentPage - 1
            this.loadData()
          } else {
            this.msgShow(this, data.errMsg)
          }
        } catch (e) {
          console.error(e)
          this.msgShow(this)
        }
      },
      async loadData () {
        try {
          let url = 'setting/org'
          if (this.activeName === 'dpt') url = 'setting/dpt'
          let { data } = await this.apiStreamPost('/proxy/common/post', {url: url, params: this.queryObj})
          if (data.returnCode === 0) {
            if (this.activeName === 'org')
              this.orgTableValue.tableData = data.list
            if (this.activeName === 'dpt')
              this.dptTableValue.tableData = data.list
            this.totalCount = data.total
          } else {
            this.msgShow(this, data.errMsg)
          }
        } catch (e) {
          console.error(e)
          this.msgShow(this)
        }
      },
      async formAction () {
        try {
          let newObj = Object.assign({}, this.orgItems)
          if (this.activeName === 'dpt') {
            newObj = Object.assign({}, this.dptItems)
            newObj.orgId = Number(newObj.orgId)
          }
          newObj.status = Number(newObj.status)
          let url = 'setting/org/create'
          if (this.activeName === 'org' && this.formType === 'update')
            url = 'setting/org/update'
          else if (this.activeName === 'dpt' && this.formType === 'create')
            url = 'setting/dpt/create'
          else if (this.activeName === 'dpt' && this.formType === 'update')
            url = 'setting/dpt/update'
          let { data } = await this.apiStreamPost('/proxy/common/post', {url: url, params: newObj})
          if (data.returnCode === 0) {
            this.currentPage = 1
            this.queryObj.currentPage = this.currentPage - 1
            this.loadData()
            this.msgShow(this, this.formType === 'create' ? '创建成功' : '更新成功', 'success')
            this.dialogShow = false
            this.$refs[this.activeName + 'Form'].resetFields()
          } else {
            this.msgShow(this, data.errMsg)
          }
        } catch (e) {
          console.error(e)
          this.msgShow(this)
        }
      },
      tablePgChange (val) {
        this.currentPage = val
        this.queryObj.currentPage = this.currentPage - 1
      }
    }
  }
</script>

<style lang="stylus", scoped>

</style>
