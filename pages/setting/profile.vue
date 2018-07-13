<template lang="pug">
.content
  breadcrumb(:breadItems="breadItems")
  .pt-15
    el-tabs(type="border-card")
      el-tab-pane(label="个人资料", style="padding-left: 5%")
        el-form.pr-5(style="max-width: 1000px", status-icon, ref="profileForm", :model="pageUser", :rules="profileRules", :validate-on-rule-change="false")
          template(v-for="itm in profileForm")
            el-form-item(:prop="itm.key")
              .row.flex-center
                .col.flex-80
                  label {{itm.lbl}}
                .col
                  img.profile-avatar(v-if="itm.key == 'avatar'")
                  el-input(:readonly="!itm.edit", :value="pageUser.fkDpt == undefined ? '' : pageUser.fkDpt.name", style="max-width: 300px", v-else-if="itm.key == 'dpt'")
                  el-input(:readonly="!itm.edit", v-model="pageUser[itm.key]", style="max-width: 300px", v-else)
          el-button-group
            el-upload.float-left(:action="fileUploadUrl", name="upfile", :data="{'action': 'avatar'}", :on-success="uploadSuccess")
              el-button(type="primary", size="medium") 修改头像
            el-button(size="medium", @click="subForm('profileForm')") 更新信息
      el-tab-pane(label="修改密码", style="padding-left: 5%")
        el-form(style="max-width: 1000px", status-icon, ref="pwdForm", :model="pwdForm", :rules="pwdRules", :validate-on-rule-change="false")
          el-form-item(prop="oldPwd")
            .row.flex-center
              .col.flex-80
                label 旧密码
              .col
                el-input.max-300(v-model="pwdForm.oldPwd", type="password")
          el-form-item(prop="newPwd")
            .row.flex-center
              .col.flex-80
                label 新密码
              .col
                el-input.max-300(v-model="pwdForm.newPwd", type="password")
          el-form-item(prop="confirmPwd")
            .row.flex-center
              .col.flex-80
                label 确认新密码
              .col
                el-input.max-300(v-model="pwdForm.confirmPwd", type="password")
          el-button-group
            el-button(type="primary", size="medium", @click="subForm('pwdForm')") 保存
            el-button(size="medium") 重置

</template>

<script>
  import breadcrumb from '@/components/Breadcrumb.vue'
  import { mapState } from 'vuex'
  export default {
    layout: 'main',
    components: {
      breadcrumb
    },
    computed: {
      ...mapState({
        currentUser: state => state.user.currentUser,
        fileUploadUrl: state => state.fileUploadUrl
      })
    },
    beforeMount () {
      console.log(this.currentUser)
      this.pageUser = Object.assign({}, this.currentUser)
      console.log(this.pageUser)
    },
    data () {
      var confirmPwdValidate = (rule, value, cb) => {
        if (value.trim().length === 0) {
          cb(new Error('不能为空'))
        } else if (value !== this.pwdForm.newPwd) {
          cb(new Error('密码不一致'))
        } else {
          cb()
        }
      }
      return {
        url: '',
        breadItems: ['系统设置', '个人信息'],
        imageUrl: null,
        pageUser: {},
        profileRules: {
          name: [{required: true, message: '名称不能为空', trigger: 'blur'}, {min: 1, message: '名称请都不小于1个位', trigger: 'blur'}],
          phone: [{required: true, message: '手机号不能为空'}, {len: 11, message: '手机号位数要是11位', trigger: 'blur'}]
        },
        profileForm: [{
          lbl: '头像',
          key: 'avatar'
        }, {
          lbl: '姓名',
          key: 'name',
          edit: true
        }, {
          lbl: '账号',
          key: 'loginAcct',
          edit: false
        }, {
          lbl: '部门',
          key: 'dpt',
          edit: false
        }, {
          lbl: '职位',
          key: 'jobTitle',
          edit: false
        }, {
          lbl: '手机号',
          key: 'phone',
          edit: true
        }, {
          lbl: '邮箱',
          key: 'email',
          edit: true
        }],
        pwdForm: {
          oldPwd: '',
          newPwd: '',
          confirmPwd: ''
        },
        pwdRules: {
          oldPwd: [{required: true, message: '不能为空', trigger: 'blur'}],
          newPwd: [{required: true, message: '不能为空', trigger: 'blur'}],
          confirmPwd: [{validator: confirmPwdValidate, trigger: 'blur'}]
        }
      }
    },
    methods: {
      subForm (formName) {
        console.log(this.currentUser)
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit')
          } else {
            console.error('invalid')
          }
        })
      },
      uploadSuccess (resp, file, fileList) {
        console.log(resp)
        console.log(file)
        console.log(fileList)
      }
    }
  }
</script>

<style lang="stylus", scoped>
.profile-avatar
  width 100px
  height 100px
  border-radius 50%
  border 1px solid #ddd
  &:hover
    cursor pointer
.max-300
  max-width 300px
</style>