<template lang="pug">
.login-container
  .login-box
    .logo
    .content
      h1 型云CRM管理系统
      .box
        el-form(:model="loginModel",:rules="loginRules", ref="loginForm", status-icon)
          el-form-item(prop="acct")
            el-input(placeholder="用户名", v-model="loginModel.acct")
          el-form-item(prop="pwd")
            el-input(placeholder="密码", v-model="loginModel.pwd", type="password")
          el-form-item.flex(prop="codeConfirm")
            .col
              el-input(placeholder="验证码", v-model="loginModel.codeConfirm")
            .col.code
              graphic-code(:identifyCode="code", @refresh="refreshCode") 验证码
          el-button(type="primary", size="medium", style="border-radius: 0px; width: 100%", @click="submit('loginForm')") 登录

</template>

<script>
  import graphicCode from '@/components/GraphicCode.vue'
  import sha1 from 'sha1'
  import { mapActions } from 'vuex'
  export default {
    components: {
      graphicCode
    },
    data () {
      var codeValidate = (rule, value, cb) => {
        if (value.trim() === '') {
          cb(new Error('不能为空'))
        } else if (this.loginModel.codeConfirm.trim().toLocaleLowerCase() !== this.code.toLocaleLowerCase()) {
          cb(new Error('验证码输入错误'))
        } else {
          cb()
        }
      }
      return {
        code: '',
        loginModel: {
          acct: '',
          pwd: '',
          codeConfirm: ''
        },
        loginRules: {
          acct: [{required: true, message: '不能为空', trigger: 'blur'}],
          pwd: [{required: true, message: '不能为空', trigger: 'blur'}],
          codeConfirm: [{validator: codeValidate, trigger: 'blur'}]
        }
      }
    },
    beforeMount () {
      this.code = this.getValidateCode()
    },
    methods: {
      ...mapActions([
        'configVal'
      ]),
      refreshCode () {
        this.code = this.getValidateCode()
      },
      submit (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
            this.login()
          } else {
            console.error('error submit!!')
            return false
          }
        });
      },
      async login () {
        let encodePwd = sha1(this.loginModel.pwd.trim())
        let now = this.date2Str(new Date())
        let { data } = await this.apiStreamPost('/proxy/common/post', {url: 'login', params: {code: this.code, acct: this.loginModel.acct.trim(), pwd: encodePwd, hashCode: sha1(now+this.code)}})
        if (data.returnCode === 0) {
          this.configVal({key: 'globalSuccessMsg', val: '登录成功'})
          this.jump('/')
        } else {
          this.msgShow(this, data.errMsg)
        }
      }
    }
  }
</script>

<style lang="stylus">
.login-container
  position fixed
  top 0
  bottom 0
  left 0
  right 0
  margin 0 auto
  padding 0 auto
  background-image url('http://pav6lmvyn.bkt.clouddn.com/login_bg.jpg')
  background-size cover
  background-position center
  overflow hidden
  .login-box
    display flex
    overflow hidden
    margin 0 auto
    position relative
    width 1200px
    height 600px
    top calc((100% - 600px) / 2)
    align-items center
    .logo
      flex 0 0 600px
      height 600px
      background-image url('http://pav6lmvyn.bkt.clouddn.com/login_logo.png?imageView2/2/w/600/h/600')
      background-size cover
      background-position center
    .content
      flex 0 0 600px
      padding-left 15px
      text-align center
      color #fff
      .box
        margin 0 auto
        width 400px
        background #fff
        padding 30px 15px
        margin-top 15px
        .el-input__inner
          border-radius 0px !important
        .el-form-item.flex
          .el-form-item__content
            width 100%
            display -webkit-box
            display -webkit-flex
            display flex
            flex-wrap wrap
            .col
              flex 1
              &.code
                flex 0 0 180px
                padding-left 20px

</style>
