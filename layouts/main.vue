<template lang="pug">
.crm.main
  //- .crm-topbar.pl-15
  .crm-topbar
    .item.brand.pl-10.row(@click="jump({path: '/dashboard'})")
      div
        img.logo-img(src="../static/logo2.png")
      span.pl-10.ft-16 CRM管理系统
    .item
    .item.flex-50(@click="jump({path: '/setting/profile'})")
      img.header-img(:src="currentUser.avatar == undefined ? defaultAvatar : currentUser.avatar")
    .item.flex-50.ellps(@click="jump({path: '/setting/profile'})") {{currentUser.name}}
    .item.flex-50(@click="exitAction") 退出
  .crm-sidebar
    side-bar
  .crm-content
    router-view
    el-dialog(title="密码等级较低，请修改密码", :visible="pwDialogBox", width="500px", :show-close="false")
      el-form(ref="pwdForm", :model="pwdForm", :rules="pwdRules")
        el-form-item(prop="oldPwd")
          .row.flex-center
            .col.flex-80
              label 旧密码
            .col
              el-input.max-330(v-model="pwdForm.oldPwd", type="password", placeholder="请输入旧密码")
        el-form-item(prop="newPwd")
          .row.flex-center
            .col.flex-80
              label 新密码
            .col
              el-input.max-330(v-model="pwdForm.newPwd", maxlength="18", type="password", placeholder="6-18位字母、数字、特殊字符、任意两种组合")
              span.pl-10(:class="pwMsg === '弱' ? 'text-red' : 'text-green'") {{pwMsg}}
        el-form-item(prop="confirmPwd")
          .row.flex-center
            .col.flex-80
              label 确认新密码
            .col
              el-input.max-330(v-model="pwdForm.confirmPwd", type="password", maxlength="18", placeholder="请输入新密码")
        el-form-item.text-center
          el-button-group
            el-button(type="primary", size="size", @click="savePwd('pwdForm')") 保存
            el-button(size="size", @click="reset") 重置
</template>

<script>
  import sideBar from '@/components/SideBar.vue'
  import sha1 from 'sha1'
  import { mapState, mapActions } from 'vuex'
  export default {
    middleware: 'mainRouteMatch',
    data () {
      const confirmPwdValidate = (rule, value, cb) => {
        if (value.trim().length === 0) {
          cb(new Error('不能为空'))
        } else if (value !== this.pwdForm.newPwd) {
          cb(new Error('密码不一致'))
        } else {
          cb()
        }
      }
      const verifyPw = (rule, value, cb) => {        
        this.pwMsg = this.pwStrengthStr(value.trim())
        if(value.indexOf(" ")!=-1){
          cb(new Error('存在非法字符‘空格’，请修改！'))
          return
        }
        if (this.checkIfPass(value.trim())) {
          cb()
        } else {
          cb(new Error('6-18位字母、数字、特殊字符、任意两种组合'))
        }        
      }
      return {
        pwDialogBox: false,
        pwMsg: '',
        pwdForm: {
          oldPwd: '',
          newPwd: '',
          confirmPwd: ''
        },
        pwdRules: {
          oldPwd: [{required: true, message: '不能为空', trigger: 'blur'}],
          newPwd: [
            {validator: verifyPw, message: '6-18位字母、数字、特殊字符、任意两种组合', trigger: 'blur'},
            {validator: verifyPw, message: '6-18位字母、数字、特殊字符、任意两种组合', trigger: 'change'}
          ],
          confirmPwd: [{validator: confirmPwdValidate, trigger: 'blur'}]
        }
      }
    },
    components: {
      sideBar
    },
    computed: {
      ...mapState({
        currentUser: state => state.user.currentUser,
        defaultAvatar: state => state.defaultAvatar
      })
    },
    mounted() {
      if (this.currentUser.safeLevel === '弱') {
        this.pwDialogBox = true
      }
    },
    methods: {
      ...mapActions([
        'exitUser',
        'clearSearchParams'
      ]),
      exitAction () {
        this.confirmDialog(this, '请确定要退出吗?').then(() => {
          this.serverExit()
        }).catch(() => {
          console.log('cancel')
        })
      },
      async serverExit () {
        try {
          let { data } = await this.apiStreamPost('/proxy/logout', {})
          if (data.returnCode === 0) {
            this.exitUser()
            this.clearSearchParams()
            this.jump({path: '/login'})
          }
        } catch (e) {
          console.error(e)
          this.msgShow(this)
        }
      },
      savePwd (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.userUpdatePwd()
          } else {
            console.error('invalid')
          }
        })
      },
      reset () {
        this.$refs.pwdForm.resetFields()
        this.pwMsg = ''
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
            this.pwDialogBox = false
            this.resetUserPwd()
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

<style lang="stylus">
@import "../assets/stylus/common"
.header-img{
  border-radius: 50%;
  width: 36px;
  height: 36px;
  margin-top: 7px;
}
.logo-img{
  width: 50px;
  padding-top: 16px;
}
.row{
  align-items: center;
}
</style>