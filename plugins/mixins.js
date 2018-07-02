import Vue from 'vue'
// import httpUtil from '../utils/httpUtil'
// import elementUtil from '../utils/elmtUtil'
// import { mapState } from 'vuex'

function formatNumber (n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const minixs = {
  data () {
    return {
      // bkProxyUrl: 'http://localhost:8668/api/'
    }
  },
  // computed: {
  //   ...mapState({
  //     globalSuccessMsg: state => state.globalSuccessMsg
  //   })
  // },
  watch: {
    '$store.state.globalSuccessMsg' (newVal, oldVal) {
      if(newVal !== '') this.msgShow(this, newVal, 'success')
    }
  },
  methods: {
    jump (to) {
      if (this.$router) this.$router.push(to)
    },
    back () {
      if (this.$router) this.$router.go(-1)
    },
    fullScreen (element) {
      var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen
      if (requestMethod) {
        requestMethod.call(element)
      } else if (typeof window.ActiveXObject !== 'undefined') {
        const wscript = new ActiveXObject('WScript.Shell')
        if (wscript !== null) wscript.SendKeys('{F11}')
      }
    },
    num2Str (num) {
      return num.toString()
    },
    date2Str (date) {
      if (date) {
        let years = date.getFullYear()
        let month = date.getMonth() + 1
        let day = date.getDate()
        return [years, month, day].map(formatNumber).join('-')
      } else {
        return ''
      }
    },
    datetime2Str (date) {
      if (date) {
        let years = date.getFullYear()
        let month = date.getMonth() + 1
        let day = date.getDate()
        let hours = date.getHours()
        let mins = date.getMinutes()
        let secds = date.getSeconds()
        let dateStr = [years, month, day].map(formatNumber).join('-')
        return dateStr + ' ' + [hours, mins, secds].map(formatNumber).join(':')
      } else {
        return ''
      }
    },
    time2Str (date) {
      if (date) {
        let hours = date.getHours()
        let mins = date.getMinutes()
        let secds = date.getSeconds()
        return [hours, mins, secds].map(formatNumber).join(':')
      } else {
        return ''
      }
    },
    // apiGet: httpUtil.httpGet,
    // apiPost: httpUtil.httpPost,
    // apiStreamPost: httpUtil.httpStreamPost,
    // msgShow: elementUtil.msgShow,
    // confirmDialog: elementUtil.confirmDialog,
    commonValidate (context, keyArr, errorInfo = '必填字段不能为空') {
      let result = true
      for (let i=0; i < keyArr.length; i++) {
        if (context[keyArr[i]].toString().trim().length === 0) {
          result = false
          this.msgShow(context, errorInfo)
          break
        }
      }
      return result
    }
  }
}

Vue.mixin(minixs)