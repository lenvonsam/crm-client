import Vue from 'vue'
import httpUtil from '../utils/httpUtil'
import elementUtil from '../utils/elmtUtil'
// import { mapState } from 'vuex'

function formatNumber (n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function generatePickerOpts () {
  const end = new Date(new Date().getTime() - 3600 * 1000 * 24)
  const days = [6, 29, 89]
  const texts = ['最近一周', '最近一个月', '最近三个月']
  let arr = []
  texts.map((itm, idx) => {
    arr.push({
      text: itm,
      onClick (picker) {
        picker.$emit('pick', [new Date(end.getTime() - 3600 * 1000 * 24 * days[idx]), end])
      }
    })
  })
  return arr
}

/**
 * mjj 2019-06-12
 * 规则： 
　　密码可输入类型（数字，字母大写，字母小写，特殊字符）,必须6位以上,包含两种以上类型。 
　　基础分为，密码长度，长度必须大于6位，一个长度为一分，大于18个字符都为18分；密码里面包含一种可输入类型，基础分加4分。 
　　加分为，一种密码可输入类型的总数量大于等于2个，加分2分，如果总数量大于等于5，加分4分。 
　　减分为，如果有连续重复的相同字符（aaaa,1111），则重复一次减1分。 十位以下纯数字，连续长度大于6位减10分。
　　总分50分。 
　　0~10分：弱 
　　11~20分：一般 
　　21~30分：很好 
　　31~50分：极佳 
 */
//以下是密码强度校验  
//计算分数
function passwordGrade(pwd) {
  var score = 0
  var regexArr = ['[0-9]', '[a-z]', '[A-Z]', '[\\W_]']
  var type = 0
  //长度一个加一分，大于18按18算   
  var len = pwd.length
  score += len > 18 ? 18 : len
  //长度必须大于6位
  score += len <= 6 ? -50: 0
  //字符类型多一个加4分   
  for (var i = 0, num = regexArr.length; i < num; i++) {  
    if (eval('/' + regexArr[i] + '/').test(pwd)) {  
      score += 4
      type++
    }  
  }
  //单一类型不通过
  if(type==1){
    return 0;
  }
  for (var i = 0, num = regexArr.length; i < num; i++) {  
    if (pwd.match(eval('/' + regexArr[i] + '/g')) && pwd.match(eval('/' + regexArr[i] + '/g')).length >= 2) {  
      score += 2
    }  
    if (pwd.match(eval('/' + regexArr[i] + '/g')) && pwd.match(eval('/' + regexArr[i] + '/g')).length >= 5) {  
      score += 2
    }  
  }  
  //重复一次减一分  
  var repeatCount = 0;  
  var prevChar = '';  
  for (var i = 0, num = pwd.length; i < num; i++) {  
    if (pwd.charAt(i) == prevChar) {  
      repeatCount++
    }  
    else {  
      prevChar = pwd.charAt(i)
    }  
  } 
  score -= repeatCount * 1
  
  //10位以下纯数字
  if(pwd.match(eval('/^[0-9]{0,10}$/'))){
    //6位以上递增
    var tempNum=-10;
    var continueCount=0;
    for (var i = 0, num = pwd.length; i < num; i++) { 
      if (pwd.charAt(i) == (tempNum+1+continueCount)) {
        continueCount++;
      } else {
        if(continueCount>=5){//其中一段数字递增6位也算
          score -= 10;
          break;
        }
        tempNum = pwd.charAt(i)-0;
        continueCount=0;
      }
    }
    if(continueCount>=5){
      score -= 10;
    }
    
    //6位以上递减
    tempNum=-10;
    continueCount=0;
    for (var i = 0, num = pwd.length; i < num; i++) { 
      if (pwd.charAt(i) == (tempNum-(1+continueCount))) {
        continueCount++;
      } else {
        if(continueCount>=5){
          score -= 10;
          break;
        }
        tempNum = pwd.charAt(i)-0;
        continueCount=0;
      }  
    }
    if(continueCount>=5){
      score -= 10;
    }
  }
  return score;  
}

const minixs = {
  data () {
    return {
      phoneReg: /^1[345789]\d{9}$/
      // bkProxyUrl: 'http://localhost:8668/api/'
    }
  },
  computed: {
  //   ...mapState({
  //     globalSuccessMsg: state => state.globalSuccessMsg
  //   })
    datePickerOpts () {
      return {
        shortcuts: generatePickerOpts()
      }
    }
  },
  watch: {
    '$store.state.globalSuccessMsg' (newVal, oldVal) {
      if (newVal !== '') this.msgShow(this, newVal, 'success')
    },
    '$store.state.globalErrorMsg' (newVal, oldVal) {
      if (newVal !== '') this.msgShow(this, newVal)
    }
  },
  methods: {
    checkIfPass(pwd) {
      if (pwd == null || pwd == ''||pwd.length <= 6) {  
          return false;  
      } else { 
        var mark = passwordGrade(pwd);     
        if (mark<=10) {  
          return false;  
        }else{
          return true;
        }  
      }
    },
    pwStrengthStr (pwd) {
      //pwStrength函数
      if (pwd == null || pwd == '') {  
        return '';
      } else {
        if (pwd.length <= 6) { 
          return '弱';
        }  
        var levelStr;  
        var mark = passwordGrade(pwd);  
        // 弱
        if (mark <= 10) {  
          levelStr = '弱';
        }  
        //一般  
        if (mark > 10 && mark <= 20) {  
          levelStr = '一般';
        }  
        //很好  
        if (mark > 20 && mark <= 30) {  
          levelStr = '很好';
        }  
        //极佳  
        if (mark > 30) {  
          levelStr = '极佳';
        }
        return levelStr;  
      }
    },
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
    getRandomColor () {
      return '#'+(Math.random()*0xffffff<<0).toString(16)
    },
    apiGet: httpUtil.httpGet,
    apiPost: httpUtil.httpPost,
    apiStreamPost: httpUtil.httpStreamPost,    
    pageShow: elementUtil.pageShow,
    pageHide: elementUtil.pageHide,
    msgShow: elementUtil.msgShow,
    confirmDialog: elementUtil.confirmDialog,
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
    },
    arr2DoubleArr (array, full = true, cols = 3) {
      let row = Math.ceil(array.length / cols)
      let doubleArr = []
      for (let i = 0; i < row; i++) {
        let tempRow = []
        for (let j = i * cols; j < (i + 1) * cols; j++) {
          if (j < array.length) {
            tempRow.push(array[j])
          }
          else {
            if (full) tempRow.push('')
          }
        }
        doubleArr.push(tempRow)
      }
      return doubleArr
    },
    getValidateCode () {
      // const basicArray = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
      const basicArray = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
      let basiCode = ['Z', 'H', '1', '8']
      basiCode.map((itm, idx) => {
        const rdmIdx = Math.floor(Math.random() * 100) % basicArray.length
        basiCode[idx] = basicArray[rdmIdx]
      })
      return basiCode.join('')
    },
    cstmListData(dataList, arrList) {
      let arr = []
      dataList.map(itm => {
        let obj = {}
        for(let i=0; i<arrList.length; i++){
          obj[arrList[i]] = itm[i]
        }
        arr.push(obj)
      })
      return arr
    },
    chineseReg (val) {
      let reg = /^[\u4e00-\u9fa5]+$/g
      return reg.test(val)
    },
    faxNumReg (val) {
      let reg = /^(\d{3,4}-)?\d{7,8}$/
      return reg.test(val)
    },
    mobileReg (mobile) {
      var reg = /^1[3|4|5|8|9][0-9]\d{4,8}$/
      return reg.test(mobile)
    },
    // 解决js计算误差问题
    // 加法
    accAdd (a, b) {
      var c, d, e;
      try {
          c = a.toString().split(".")[1].length;
      } catch (f) {
          c = 0;
      }
      try {
          d = b.toString().split(".")[1].length;
      } catch (f) {
          d = 0;
      }
      return e = Math.pow(10, Math.max(c, d)), (this.accMul(a, e) + this.accMul(b, e)) / e;
    },
    // 减法
    accSub(a, b) {
      var c, d, e;
      try {
          c = a.toString().split(".")[1].length;
      } catch (f) {
          c = 0;
      }
      try {
          d = b.toString().split(".")[1].length;
      } catch (f) {
          d = 0;
      }
      return e = Math.pow(10, Math.max(c, d)), (this.accMul(a, e) - this.accMul(b, e)) / e;
    },
    // 乘法
    accMul(a, b) {
      var c = 0,
          d = a.toString(),
          e = b.toString();
      try {
          c += d.split(".")[1].length;
      } catch (f) {}
      try {
          c += e.split(".")[1].length;
      } catch (f) {}
      return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
    },
    // 除法
    accDiv(a, b) {
      var c, d, e = 0,
          f = 0;
      try {
          e = a.toString().split(".")[1].length;
      } catch (g) {}
      try {
          f = b.toString().split(".")[1].length;
      } catch (g) {}
      return c = Number(a.toString().replace(".", "")), d = Number(b.toString().replace(".", "")), this.accMul(c / d, Math.pow(10, f - e));
    }
  }
}
Vue.mixin(minixs)