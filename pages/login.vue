<template lang="pug">
.login-container
  .login-box
    .logo
    .content
      h1 型云CRM管理系统
      .box
        el-form
          el-form-item
            el-input(placeholder="用户名")
          el-form-item
            el-input(placeholder="密码")
          el-form-item.flex
            .col
              el-input
            .col.code
              graphic-code(identifyCode="1334") 验证码
          el-button(type="primary", size="medium", style="border-radius: 0px; width: 100%") 登录

</template>

<script>
  import graphicCode from '@/components/GraphicCode.vue'
  export default {
    components: {
      graphicCode
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
