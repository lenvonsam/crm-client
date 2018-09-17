<template lang="pug">
.content
  breadcrumb(:breadItems="breadItems")
  .pt-15
    el-tabs(type="border-card")
      el-tab-pane(label="个人资料", style="padding-left: 5%")
        el-form.pr-5(style="max-width: 1000px", status-icon, ref="profileForm", :model="pageUser", :rules="profileRules", :validate-on-rule-change="false", v-if="pageUser.id > 0")
          template(v-for="itm in profileForm")
            el-form-item(:prop="itm.key")
              .row.flex-center
                .col.flex-80
                  label {{itm.lbl}}
                .col
                  zoom-img.profile-avatar(v-if="itm.key == 'avatar'", :url="pageUser.avatar == undefined ? defaultAvatar : pageUser.avatar")
                  //- img.profile-avatar(v-if="itm.key == 'avatar'", :src="pageUser.avatar == undefined ? '' : pageUser.avatar")
                  el-input(:readonly="!itm.edit", :value="pageUser.fkDpt == undefined ? '' : pageUser.fkDpt.name", style="max-width: 300px", v-else-if="itm.key == 'dpt'")
                  el-input(:readonly="!itm.edit", v-model="pageUser[itm.key]", style="max-width: 300px", v-else)
          el-button-group(v-if="canShow")
            simple-upload.float-left(v-model="pageUser.avatar")
              el-button(type="primary", size="medium") 修改头像
            el-button(size="medium", @click="subForm('profileForm')") 更新信息
      el-tab-pane(label="修改密码", style="padding-left: 5%", v-if="canShow")
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
            el-button(size="medium", @click="$refs.pwdForm.resetFields()") 重置

</template>

<script>
  import breadcrumb from '@/components/Breadcrumb.vue'
  import simpleUpload from '@/components/SimpleUpload.vue'
  import zoomImg from '@/components/ZoomImg.vue'
  import { mapState, mapActions } from 'vuex'
  import sha1 from 'sha1'
  export default {
    layout: 'main',
    components: {
      breadcrumb,
      simpleUpload,
      zoomImg
    },
    computed: {
      ...mapState({
        currentUser: state => state.user.currentUser,
        fileUploadUrl: state => state.fileUploadUrl,
        defaultAvatar: state => state.defaultAvatar
      }),
      canShow () {
        let result = true
        if (this.currentUser.id !== 1) {
          let idx = this.currentUser.auths.findIndex(itm => this.$route.path.startsWith(itm.fkMenu.pageUrl))
          const currentAuth = this.currentUser.auths[idx]
          if (currentAuth.hasUpdate === 0) result = false
        }
        return result
      }
    },
    beforeMount () {
      this.$nextTick(() => {
        this.pageUser = Object.assign({}, this.currentUser)
        // this.pageUser.avatar = 'http://pav6lmvyn.bkt.clouddn.com/avatar/dev_c44fd0fa7f'
      })
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
      var verifyPw = (rule, value, cb) => {
        if (value.trim().length === 0) {
          cb(new Error('不能为空'))
        } else {
          let regex = /^([A-Z])(?=.*[a-z])(?!\d+$)(?![\W_]+$)\S{5,}$/
          if (!regex.test(value)) {
            cb(new Error('密码最少6位必须包含大写字母开头并且包含小写字母和数字'))
            return
          }
          cb()
        }
      }
      return {
        url: '',
        breadItems: ['系统设置', '个人信息'],
        imageUrl: null,
        pageUser: {},
        profileRules: {
          phone: [{required: true, message: '手机号不能为空', trigger: 'blur'}, {len: 11, message: '手机号位数要是11位', trigger: 'blur'}]
        },
        profileForm: [{
          lbl: '头像',
          key: 'avatar'
        }, {
          lbl: '姓名',
          key: 'name',
          edit: false
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
          key: 'position',
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
          // newPwd: [{required: true, message: '不能为空', trigger: 'blur'}],
          newPwd: [{validator: verifyPw, trigger: 'blur'}],
          confirmPwd: [{validator: confirmPwdValidate, trigger: 'blur'}]
        }
      }
    },
    methods: {
      ...mapActions([
        'exitUser',
        'setUser'
      ]),
      subForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            formName === 'pwdForm' ? this.userUpdatePwd() : this.updateProfile()
          } else {
            console.error('invalid')
          }
        })
      },
      async resetUserPwd () {
        const me = this
        let { data } = await this.apiStreamPost('/proxy/logout', {})
        if (data.returnCode === 0) {
          this.$alert('密码更新成功,需重新登录', '友情提示', {
            confirmButtonText: '确定',
            showClose: false,
            callback: action => {
              console.log(action)
              me.exitUser()
              me.jump({path: '/login'})
            }
          })
        }
      },
      async userUpdatePwd () {
        try {
          let { data } = await this.apiStreamPost('/proxy/common/post', {url: 'setting/acct/updatePwd', params: {
            uid: this.currentUser.id,
            newPwd: sha1(this.pwdForm.newPwd.trim()),
            oldPwd: sha1(this.pwdForm.oldPwd.trim())
          }})
          if (data.returnCode === 0) {
            this.resetUserPwd()
          } else {
            this.msgShow(this, data.errMsg)
          }
        } catch (e) {
          console.error(e)
          this.msgShow(this)
        }
      },
      async updateProfile () {
        try {
          let params = {
            uid: this.currentUser.id
          }
          if (this.pageUser.avatar !== '') params.avatar = this.pageUser.avatar
          if (this.pageUser.phone !== '' && this.pageUser.phone !== null) params.phone = this.pageUser.phone.trim()
          if (this.pageUser.email !== '' && this.pageUser.email !== null) params.email = this.pageUser.email.trim()
          let { data } = await this.apiStreamPost('/proxy/common/post', {url: 'setting/acct/updateProfile', params: params})
          if (data.returnCode === 0) {
            this.setUser(data.currentUser)
            this.pageUser = Object.assign({}, data.currentUser)
            this.$forceUpdate()
            this.msgShow(this, '更新成功', 'success')
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
.profile-avatar
  img
    width 100px
    height 100px
    border-radius 50% !important
    border 1px solid #ddd
  &:hover
    cursor pointer
.max-300
  max-width 300px
</style>