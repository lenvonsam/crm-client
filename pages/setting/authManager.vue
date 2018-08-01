<template lang="pug">
.content
  breadcrumb(:breadItems="breadItems")
  .pt-15
    el-tabs(type="border-card", v-model="activeName")
      el-tab-pane(label="角色设置", name="role")
        template(v-if="tabModel == 'roleList'")
          button-group(:btns="roleBtnGroups", @groupBtnClick="btnsClick")
          .pt-20
            search-form(:searchFormItems="roleSearchItems", @search="searchBtn")
          .pt-10
            basic-table(:tableValue="roleTableValue", :loading="loading", :currentPage="currentPage", :pageSize="pageSize", :total="totalCount", @tableRowEdit="rowEdit", @tableRowDelete="rowDelete", @chooseData="selectData", @pageChange="tablePgChange")
        template(v-else-if="tabModel == 'roleFormNew' || tabModel == 'roleFormUpdate'")
          .padding
            el-button(size="small", @click="tabModel = 'roleList'") 返回列表
          el-form.mt-15(label-width="85px", style="max-width: 40%", ref="roleForm", :model="formObj", :rules="formRules", status-icon, :validate-on-rule-change="false")
            el-form-item(label="角色名称", prop="name")
              el-input(size="medium", v-model="formObj.name")
            el-form-item(label="启用状态", status="status")
              el-radio(label="1", v-model="formObj.status") 启用
              el-radio(label="0", v-model="formObj.status") 停用
          .pl-10
            el-tag(type="primary") 菜单权限设置
          .padding.pr-0.max-60
            el-steps(:active="stepIdx")
              el-step(title="设置菜单")
              el-step(title="分配权限")
              el-step(title="提交")
          .padding.pt-0.pb-0.text-right.max-60
            template(v-if="stepIdx == 1")
              el-button(size="small", @click="nextStep") 下一步
            template(v-else-if="stepIdx == 2")
              el-button(size="small", @click="stepIdx = 1") 上一步
              el-button(size="small", @click="stepFinish") 提交
            template(v-else)
              el-button(size="small", @click="stepIdx = 2") 上一步
          .padding(style="max-width: 60%", v-if="stepIdx == 1")
            el-transfer(filterable, :titles="['未分配菜单', '已分配菜单']", style="margin: 0 auto", :data="originMenuData", :props="{key: 'id', label: 'name'}", v-model="chooseData", :render-content="renderFunc")
          .padding.max-60(v-else)
            el-table(border, :span-method="tableRowSpan", :data="menuList", v-if="menuList.length > 0")
              el-table-column(label="一级菜单", width="100")
                template(slot-scope="scope") {{scope.row.parent.name}}
              el-table-column(prop="name", label="二级菜单", width="120")
              el-table-column(label="权限")
                template(slot-scope="scope")
                  cbx-group(:cbxs="rowCbxLbl", @change="cbxChange", :rIdx="scope.$index", :chooseGroup="scope.row.authConfig")
      el-tab-pane(label="权限分配", name="auth")
        template(v-if="tabModel == 'authList'")
          search-form(:searchFormItems="acctSearchItems", @search="searchBtn")
          .pt-20
            basic-table(:tableValue="authTableValue", :loading="loading", :currentPage="currentPage", :pageSize="pageSize", :total="totalCount", @pageChange="tablePgChange", @tableRowAuthManage="rowEdit")
        template(v-else)
          .padding
            el-button(size="small", @click="tabModel = 'authList'") 返回列表
          .row.padding
            .col.flex-80 姓名：
            .col {{formObj.name}}
            .col.flex-80 账号：
            .col {{formObj.loginAcct}}
          //- .row.padding.pt-0
            .col.flex-80 数据权限
            .col {{formObj.dataLevel}}
          .row.padding.pt-0
            .col.flex-80 机构：
            .col(v-if="formObj.fkDpt") {{formObj.fkDpt.fkOrg.name || ''}}
            .col.flex-80 部门：
            .col(v-if="formObj.fkDpt") {{formObj.fkDpt.name}}
          .row.padding.pt-0
            .col.flex-80 职业：
            .col {{formObj.position}}
            .col.flex-80 角色：
            .col(v-if="formObj.fkRole") {{formObj.fkRole.name || ''}}
          .pl-10
            el-tag(type="primary") 菜单权限设置
          .padding.pr-0.max-60
            el-steps(:active="stepIdx")
              el-step(title="设置菜单")
              el-step(title="分配权限")
              el-step(title="提交")
          .padding.pt-0.pb-0.text-right.max-60
            template(v-if="stepIdx == 1")
              el-button(size="small", @click="nextStep") 下一步
            template(v-else-if="stepIdx == 2")
              el-button(size="small", @click="stepIdx = 1") 上一步
              el-button(size="small", @click="stepFinish") 提交
            template(v-else)
              el-button(size="small", @click="stepIdx = 2") 上一步
          .padding(style="max-width: 60%", v-if="stepIdx == 1")
            el-transfer(filterable, :titles="['未分配菜单', '已分配菜单']", style="margin: 0 auto", :data="originMenuData", :props="{key: 'id', label: 'name'}", v-model="chooseData", :render-content="renderFunc")
          .padding.max-60(v-else)
            el-table(border, :span-method="tableRowSpan", :data="menuList", v-if="menuList.length > 0")
              el-table-column(label="一级菜单", width="100")
                template(slot-scope="scope") {{scope.row.parent.name}}
              el-table-column(prop="name", label="二级菜单", width="120")
              el-table-column(label="权限")
                template(slot-scope="scope")
                  cbx-group(:cbxs="rowCbxLbl", @change="cbxChange", :rIdx="scope.$index", :chooseGroup="scope.row.authConfig")


</template>

<script>
  import breadcrumb from '@/components/Breadcrumb.vue'
  import buttonGroup from '@/components/ButtonGroup.vue'
  import searchForm from '@/components/SearchForm.vue'
  import cbxGroup from '@/components/CbxGroup.vue'
  import basicTable from '@/components/BasicTable.vue'
  import { mapState } from 'vuex'
  import _ from 'lodash'
  export default {
    layout: 'main',
    components: {
      breadcrumb,
      buttonGroup,
      searchForm,
      cbxGroup,
      basicTable
    },
    data () {
      return {
        rowCbxLbl: ['新增', '修改', '删除'],
        breadItems: ['权限设置', '角色设置'],
        activeName: 'role',
        tabModel: 'roleList',
        stepIdx: 1,
        currentPage: 1,
        totalCount: 0,
        queryObject: {
          currentPage: this.currentPage - 1,
          pageSize: this.pageSize
        },
        originMenuData: [],
        chooseData: [],
        // 用于批量操作
        chooseArray: [],
        menuList: [],
        // 当前角色的权限
        currentAuths: [],
        formObj: {
          name: '',
          status: '1'
        },
        formRules: {
          name: [{required: true, message: '不能为空', trigger: 'blur'}]
        },
        menuGroupList: {},
        roleBtnGroups: [{
          lbl: '新增角色',
          type: 'add'
        }, {
          lbl: '批量启用',
          type: 'start'
        }, {
          lbl: '批量停用',
          type: 'stop'
        }],
        roleSearchItems: [[{label: '角色ID', model: 'id', type: 'text', val: ''}, {label: '角色名称', model: 'name', type: 'text', val: ''}]],
        roleTableValue: {
          tableData: [],
          tableHead: [{
            lbl: '角色ID',
            prop: 'id'
          }, {
            lbl: '角色名称',
            prop: 'name'
          }, {
            lbl: '角色状态',
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
          }],
          hasCbx: true
        },
        acctSearchItems: [[{label: '姓名', model: 'name', type: 'text', val: ''}, {label: '账号', model: 'loginAcct', type: 'text', val: ''}, {label: '机构', model: 'orgName', type: 'text', val: ''}], [{label: '部门', model: 'dptName', type: 'text', val: ''}, {label: '职位', model: 'position', type: 'text', val: ''}, {label: '角色', model: 'roleName', val: '', type: 'text'}]],
        authTableValue: {
          tableData: [],
          tableHead: [{
            lbl: '姓名',
            prop: 'name'
          }, {
            lbl: '账号',
            prop: 'loginAcct'
          }, {
            lbl: '机构',
            type: 'object',
            prop: 'fkDpt',
            factValue (row) {
              return row.fkOrg.name
            }
          }, {
            lbl: '部门',
            type: 'object',
            prop: 'fkDpt',
            factValue (row) {
              return row.name
            }
          }, {
            lbl: '职位',
            prop: 'position'
          }, {
            lbl: '角色',
            prop: 'fkRole',
            type: 'object',
            factValue (row) {
              return row.name
            }
          }, {
            type: 'action',
            width: '120',
            actionBtns: [{
              lbl: '权限分配',
              type: 'authManage'
            }]
          }]
        },
        loading: true
      }
    },
    computed: {
      ...mapState({
        pageSize: state => state.pageSize
      })
    },
    beforeMount () {
      this.queryObject.currentPage = this.currentPage - 1
      this.queryObject.pageSize = this.pageSize
      this.loadMenu()
      this.loadData()
    },
    methods: {
      formSubmit (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.roleCreate()
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      async roleCreate () {
        try {
          let ids = this.menuList.map(itm => itm.id).join(',')
          let authArray = []
          this.menuList.map(itm => {
            if (itm.authConfig) {
              authArray.push(itm.authConfig.join('|'))
            } else {
              authArray.push('')
            }
          })
          let params = {
            name: this.formObj.name,
            status: Number(this.formObj.status),
            authArr: authArray,
            ids: ids
          }
          if (this.tabModel === 'roleFormUpdate') params.id = this.formObj.id
          let { data } = await this.apiStreamPost('/proxy/common/post', {url: 'setting/auth/role', params: params})
          if (data.returnCode === 0) {
            this.currentPage = 1
            this.queryObject.currentPage = this.currentPage - 1
            this.menuList = []
            this.chooseData = []
            this.stepIdx = 1
            this.$refs.roleForm.resetFields()
            if (this.tabModel === 'roleFormUpdate') delete this.formObj.id
            this.loadData()
            this.msgShow(this, this.tabModel === 'roleFormUpdate' ? '更新成功' : '创建成功', 'success')
            this.tabModel = 'roleList'
          } else {
            this.msgShow(this, data.errMsg)
          }
        } catch (e) {
          console.error(e)
          this.msgShow(this)
        }
      },
      searchBtn (val) {
        Object.keys(val).map(key => {
          if (val[key].length > 0) {
            this.queryObject[key] = val[key].trim()
          } else {
            delete this.queryObject[key]
          }
        })
        this.currentPage = 1
        this.queryObject.currentPage = this.currentPage - 1
        this.loadData()
      },
      btnsClick (type) {
        if (type === 'add') {
          this.formObj.name = ''
          this.formObj.status = '1'
          this.tabModel = this.activeName === 'role' ? 'roleFormNew' : 'authFormNew'
        } else if (type === 'start') {
          if (this.chooseArray.length === 0) {
            this.msgShow(this, '请选择启用的行', 'warning')
            return
          }
          this.batchUpdate(1)
        } else {
          if (this.chooseArray.length === 0) {
            this.msgShow(this, '请选择停用的行', 'warning')
            return
          }
          this.batchUpdate(0)
        }
      },
      nextStep () {
        let filterArr = this.originMenuData.filter(itm => this.chooseData.includes(itm.id))
        if (filterArr.length === 0) {
          this.msgShow(this, '请选择分配的菜单', 'warning')
          return
        }
        this.menuGroupList = _.groupBy(filterArr, (itm) => {
          return itm.parent.id
        })
        this.menuList = Object.assign([], filterArr)
        if (this.tabModel === 'roleFormUpdate' || this.tabModel === 'authManage') {
          // 更新数据
          this.menuList.map((itm, idx) => {
            if (this.chooseData.includes(itm.id)) {
              let ridx = this.currentAuths.findIndex(auth => auth.fkMenu.id === itm.id)
              let tempArr = []
              if (ridx > -1) {
                let temp = this.currentAuths[ridx]
                if (temp.hasCreate) tempArr.push('新增')
                if (temp.hasUpdate) tempArr.push('修改')
                if (temp.hasDelete) tempArr.push('删除')
              }
              itm.authConfig = tempArr
            }
          })
        }
        this.stepIdx = 2
      },
      tableRowSpan ({row, column,rowIndex, columnIndex}) {
        if (columnIndex === 0) {
          let firstName = this.menuGroupList[row.parent.id][0].name
          if (row.name === firstName) {
            return {
              rowspan: this.menuGroupList[row.parent.id].length,
              colspan: 1
            }
          } else {
            return {
              rowspan: 0,
              colspan: 0
            }
          }
        }
      },
      cbxChange (val, idx) {
        this.menuList[idx].authConfig = val
      },
      selectData (val) {
        this.chooseArray = val
      },
      renderFunc (h, opt) {
        return h('span',opt.parent.name + '-' + opt.name)
      },
      stepFinish () {
        this.activeName === 'role' ? this.formSubmit('roleForm') : this.authSubmit()
      },
      rowEdit (obj) {
        if (this.activeName == 'role') {
          console.log(obj)
          this.formObj.id = obj.id
          this.formObj.name = obj.name
          this.formObj.status = obj.status.toString()
        } else {
          this.formObj = obj
        }
        this.chooseData = obj.auths.map(itm => itm.fkMenu.id)
        if (obj.auths) this.currentAuths = Object.assign([], obj.auths)
        this.tabModel = this.activeName === 'role' ? 'roleFormUpdate' : 'authManage'
      },
      rowDelete (obj) {
        this.confirmDialog(this, '您确认要删掉本行记录吗？').then(() => {
          this.actionDelete(obj.id)
        }, () => {
          console.log('cancel')
        })
      },
      tablePgChange (val) {
        this.currentPage = val
        this.queryObject.currentPage = this.currentPage - 1
      },
      async actionDelete (id) {
        try {
          let url = 'setting/role/' + id
          let { data } = await this.apiStreamPost('/proxy/common/del', {url: url})
          if (data.returnCode === 0) {
            this.currentPage = 1
            this.queryObject.currentPage = this.currentPage - 1
            this.loadData()
            this.msgShow(this, '删除成功', 'success')
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
          let url = 'setting/role/batchUpdate'
          let { data } = await this.apiStreamPost('/proxy/common/post', {url: url, params: {status: status, ids: this.chooseArray.map(itm => itm.id).join(',')}})
          if (data.returnCode === 0) {
            this.currentPage = 1
            this.queryObject.currentPage = this.currentPage - 1
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
      async authSubmit () {
        // 分配权限
        try {
          let ids = this.menuList.map(itm => itm.id).join(',')
          let authArray = []
          this.menuList.map(itm => {
            if (itm.authConfig) {
              authArray.push(itm.authConfig.join('|'))
            } else {
              authArray.push('')
            }
          })
          let params = {
            authArr: authArray,
            ids: ids,
            acctId: this.formObj.id
          }
          let { data } = await this.apiStreamPost('/proxy/common/post', {url: 'setting/auth/acct', params: params})
          if (data.returnCode === 0) {
            this.formObj = {}
            this.currentPage = 1
            this.queryObject.currentPage = this.currentPage - 1
            this.chooseData = []
            this.menuList = []
            this.stepIdx = 1
            this.loadData()
            this.msgShow(this, '账号权限更新成功', 'success')
            this.tabModel = 'authList'
          }
        } catch (e) {
          console.error(e)
          this.msgShow(this)
        }
      },
      async loadMenu () {
        try {
          let { data } = await this.apiStreamPost('/proxy/common/get', {url: 'setting/menu'})
          if (data.returnCode === 0) {
            this.originMenuData = data.list
          } else {
            this.msgShow(this, data.errMsg)
          }
        } catch (e) {
          console.error(e)
          this.msgShow(this)
        }
      },
      async loadData () {
        this.loading = true
        try {
          let url = 'setting/role'
          if (this.activeName === 'auth') url = 'setting/acct'
          let { data } = await this.apiStreamPost('/proxy/common/post', {url: url, params: this.queryObject})
          if (data.returnCode === 0) {
            this[this.activeName + 'TableValue'].tableData = data.list
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
    },
    watch: {
      activeName (newVal, oldVal) {
        this.currentPage = 1
        this.queryObject = {
          currentPage:this.currentPage - 1,
          pageSize: this.pageSize
        }
        this.tabModel = newVal === 'role' ? 'roleList' : 'authList'
        this.breadItems = newVal === 'role' ? ['权限设置', '角色设置'] : ['权限设置', '权限分配']
        this.stepIdx = 1
        this.menuList = []
        this.loadData()
      }
    }
  }
</script>

<style lang="stylus", scoped>
.max-60
  max-width 60%
</style>
