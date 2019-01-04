<template lang="pug">
.content
  breadcrumb(:breadItems="breadItems")
  el-form.mt-25.border.padding.pt-25(style="max-width: 1200px", ref="acctForm", :model="obj", :rules="formRules", status-icon, inline, label-width="120px", :validate-on-rule-change="false")
    template(v-for="fm in formItems")
      .row
        .col
          el-form-item(:prop="fm[0].key", :label="fm[0].lbl")
            template(v-if="fm[0].type == 'select'")
              .w-250
                el-select(v-model="obj[fm[0].key]", style="width: 100%", size="small")
                  el-option(v-for="(opt,idx) in getPageObj(fm[0].selectKey)", :key="idx", :label="opt.label", :value="opt.value")
            template(v-else-if="fm[0].type == 'remoteSelect'")
              .w-250
                el-select(v-model="obj[fm[0].key]", style="width: 100%", size="small")
                  el-option(v-for="opt in getPageObj(fm[0].selectKey)", :key="opt.id", :value="opt.id", :label="opt.name")
            template(v-else-if="fm[0].type == 'radio'")
              el-radio(v-for="(r,idx) in fm[0].radios", v-model="obj[fm[0].key]", :label="r.val", :key="idx") {{r.lbl}}
            template(v-else-if="fm[0].type == 'date'")
              el-date-picker.w-250(v-model="obj[fm[0].key]", type="date", size="small")
            template(v-else-if="fm[0].type == 'readOnly'")
              el-input.w-250(readOnly, :placeholder="fm[0].placeholder", v-model="obj[fm[0].key]", size="small")
            template(v-else)
              el-input.w-250(size="small", v-model="obj[fm[0].key]")
        .col(v-if="fm.length == 2")
          el-form-item(:prop="fm[1].key", :label="fm[1].lbl")
            template(v-if="fm[1].type == 'select'")
              .w-250
                el-select(v-model="obj[fm[1].key]", style="width: 100%", size="small", @change="selectChange")
                  el-option(v-for="(opt,idx) in getPageObj(fm[1].selectKey)", :key="idx", :label="opt.label", :value="opt.value")
            template(v-else-if="fm[1].type == 'remoteSelect'")
              .w-250
                el-select(v-model="obj[fm[1].key]", style="width: 100%", size="small", @change="selectChange")
                  el-option(v-for="(opt,idx) in getPageObj(fm[1].selectKey)", :key="idx", :label="opt.name", :value="opt.id")
            template(v-else-if="fm[1].type == 'radio'")
              el-radio(v-for="(r,idx) in fm[1].radios", v-model="obj[fm[1].key]", :label="r.val", :key="idx") {{r.lbl}}
            template(v-else-if="fm[1].type == 'date'")
               el-date-picker.w-250(v-model="obj[fm[1].key]", type="date", size="small")
            template(v-else)
              el-input.w-250(size="small", v-model="obj[fm[1].key]")
    .text-center.pt-25.pb-15
      el-button(type="primary", size="medium", @click="subForm('acctForm')") {{$route.query.type == 'new' ? '保存' : '更新'}}
      el-button.ml-60(size="medium", @click="back") 取消
</template>

<script>
  import breadcrumb from '@/components/Breadcrumb.vue'
  import { mapState, mapActions } from 'vuex'
  export default {
    layout: 'main',
    components: {
      breadcrumb
    },
    data () {
      var phoneValid = (rule, value, callback) => {
      let reg = this.phoneReg
      console.log('phoneReg:>>' + reg)
      console.log('len:>>' + value.trim().length)
      if (value.trim().length === 0) {
        callback(new Error('手机号不能为空'))
      } else if (value.trim().length != 11) {
        callback(new Error('手机号位数要是11位'))
      } else if (!reg.test(value.trim())) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }
      return {
        breadItems: [],
        // 部门下拉
        dptOpts: [],
        // 角色下拉
        roleOpts: [],
        obj: {
          loginAcct: '',
          name: '',
          orgName: '',
          dptId: '',
          roleId: '',
          phone: '',
          dataLevel: '',
          status: 1,
          position: '',
          sex: 1,
          national: '',
          edu: '',
          professional: '',
          email: '',
          jobTitle: '',
          telephone: '',
          addr: '',
          nativePlace: '',
          maritalStatus: '',
          politicalLandscape: '',
          birthday: '',
          inTime: '',
          workGroup: '',
          remark: ''
        },
        formItems: [
          [{lbl: '登录账号', key: 'loginAcct'}, {lbl: '姓名', key: 'name'}],
          [{lbl: '机构', key: 'orgName', type: 'readOnly', placeholder: '请选择部门'}, {lbl: '部门', key: 'dptId', type: 'remoteSelect', selectKey: 'dptOpts', valueKey: 'name'}],
          [{lbl: '手机号', key: 'phone'}, {lbl: '数据权限等级', key: 'dataLevel', type: 'select', selectKey: 'dataAuthOpts'}],
          [{lbl: '账号状态', key: 'status', type: 'radio', radios: [{lbl: '启用', val: 1}, {lbl: '停用', val: 0}]}, {lbl: '角色', key: 'roleId', type: 'remoteSelect', selectKey: 'roleOpts', valueKey: 'name'}],
          [{lbl: '职务状态', key: 'demission', type: 'radio', radios: [{lbl: '在职', val: 0}, {lbl: '离职', val: 1}]}, {lbl: '性别', key: 'sex', type: 'radio', radios: [{lbl: '男', val: 1}, {lbl: '女', val: 2}]}],
          [{lbl: '职位', key: 'position'}, {lbl: '学历', key: 'edu', type: 'select', selectKey: 'eduOpts'}],
          [{lbl: '专业', key: 'professional'}, {lbl: '邮箱', key: 'email'}],
          [{lbl: '职称', key: 'jobTitle'}, {lbl: '电话', key: 'telephone'}],
          [{lbl: '地址', key: 'addr'}, {lbl: '籍贯', key: 'nativePlace'}],
          [{lbl: '婚姻状况', key: 'maritalStatus', type: 'select', selectKey: 'maritalOpts'}, {lbl: '政治面貌', key: 'politicalLandscape', type: 'select', selectKey: 'politicalOpts'}],
          [{lbl: '生日', key: 'birthday', type: 'date'}, {lbl: '入职时间', type: 'date', key: 'inTime'}],
          [{lbl: '工作组', key: 'workGroup'}, {lbl: '民族', key: 'national'}],
          [{lbl: '备注', key: 'remark'}]
        ],
        formRules: {
          loginAcct: [{required: true, message: '不能为空', trigger: 'blur'}],
          name: [{required: true, message: '不能为空', trigger: 'blur'}],
          dptId: [{required: true, message: '不能为空', trigger: 'blur'}],
          phone: [{required: true, validator: phoneValid, trigger: 'blur'}],
          dataAuth: [{required: true, message: '不能为空', trigger: 'change'}],
          roleId: [{required: true, message: '不能为空', trigger: 'change'}],
          sex: [{required: true, message: '不能为空', trigger: 'blur'}]
        }
      }
    },
    beforeMount () {
      this.$nextTick(() => {
        this.dptCombo()
        this.roleCombo()
        if (this.$route.query.type && this.$route.query.type === 'new') {
          this.breadItems = ['系统设置', '账号管理','新增账号']
        } else {
          this.breadItems = ['系统设置', '账号管理','编辑账号']
          this.queryObj(this.$route.query.id)
        }
      })
    },
    computed: {
      ...mapState({
        dataAuthOpts: state => state.dataAuthOpts,
        eduOpts: state => state.eduOpts,
        politicalOpts: state => state.politicalOpts,
        maritalOpts: state => state.maritalOpts,
        currentUser: state => state.user.currentUser
      })
    },
    watch: {
      'obj.dptId' (newVal, oldVal) {
        console.log('id:>>' + newVal)
        let idx = this.dptOpts.findIndex(itm => itm.id === Number(newVal))
        if (idx > -1) this.obj.orgName = this.dptOpts[idx].fkOrg.name
      }
    },
    methods: {
      ...mapActions([
        'setUser'
      ]),
      selectChange (val) {
        this.$forceUpdate()
      },
      async queryObj (id) {
        try {
          let { data } = await this.apiStreamPost('/proxy/common/get', {url: 'setting/acct/' + Number(id)})
          if (data.returnCode === 0) {
            this.obj = Object.assign({}, data.obj)
            this.obj.dptId = this.obj.fkDpt.id
            this.obj.roleId = this.obj.fkRole.id
            this.obj.orgName = this.obj.fkDpt.fkOrg.name
            if (this.obj.birthday) this.obj.birthday = new Date(this.obj.birthday)
            if (this.obj.inTime) this.obj.inTime = new Date(this.obj.inTime)
          }
        } catch (e) {
          console.error(e)
          this.msgShow(this)
        }
      },
      getPageObj (key) {
        // console.log('-------------')
        // console.log(key)
        // console.log(this[key])
        return this[key]
      },
      async dptCombo () {
        try {
          let { data } = await this.apiStreamPost('/proxy/common/get', {url: 'setting/dpt/queryCombo'})
          if (data.returnCode === 0) this.dptOpts = data.list
        } catch (e) {
          console.error(e)
          this.msgShow(this)
        }
      },
      async roleCombo () {
        try {
          let { data } = await this.apiStreamPost('/proxy/common/get', {url: 'setting/role/queryCombo'})
          if (data.returnCode === 0) this.roleOpts = data.list
        } catch (e) {
          console.error(e)
          this.msgShow(this)
        }
      },
      subForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.saveOrUpdate()
          } else {
            console.log('error submit!!');
            return false;
          }
        })
      },
      async saveOrUpdate() {
        try {
          let param = Object.assign({}, this.obj)
          param.status = Number(param.status)
          param.dptId = Number(param.dptId)
          param.roleId = Number(param.roleId)
          if (param.phone !== ' ') param.phone = param.phone.trim()
          if (this.$route.query.type === 'edit') {
            delete param.createAt
            delete param.updateAt
            delete param.fkDpt
            delete param.fkRole
            delete param.auths
          }
          if (param.birthday && param.birthday !== '') param.birthday = this.date2Str(new Date(param.birthday))
          if (param.inTime && param.inTime !== '') param.inTime = this.date2Str(new Date(param.inTime))
          let { data } = await this.apiStreamPost('/proxy/common/post', {url: 'setting/acct/createOrUpdate', params: param})
          if (data.returnCode === 0) {
            if (this.currentUser.id === data.currentUser.id) this.setUser(data.currentUser)
            this.msgShow(this, this.$route.query.type === 'new' ? '保存成功' : '更新成功', 'success')
            this.back()
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

<style lang="stylus", scoped>
  .w-250 {
    width 250px
  }
</style>
