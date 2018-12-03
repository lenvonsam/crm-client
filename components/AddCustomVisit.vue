<template lang="pug">
el-dialog(title="提示", :visible="dialogShow", width="450px", height="80px",@close="subForm('cancel')")
  .row.flex-center
    .col.flex-100 公司名称
      sup.text-red *
    .col
      el-select.full-width(v-model="cstmId", :loading="loading", value-key, filterable, remote, placeholder="请输入关键词", :remote-method="customerGet", clearable)
        el-option(v-for="item in cstmIdList", :key="item.id", :label="item.compName", :value="item.id")
  .row.flex-center.mt-10
    .col.flex-100 计划拜访日期
      sup.text-red *
    .col
      el-date-picker.full-width(v-model="planVisitTime", type="datetime", placeholder="选择日期", clearable)
    .ft-13.text-red.mt-10 请选择计划完成日期，设置完成后不能修改。在日期前客户开单视为转化成功。
  //- .row.flex-center.mt-10
  //-   .col.flex-100 计划开单日期
  //-   .col
  //-     el-date-picker.full-width(v-model="planDate", type="date", placeholder="选择日期", clearable, value-format="yyyy-MM-dd")    
  .dialog-footer.text-right(slot="footer")
    el-button(size="medium", @click="subForm('cancel')") 取消
    el-button(type="primary", size="medium", @click="subForm('ok')") 确认
</template>
<script>
  export default {
    data () {
      return {
        planVisitTime: '',
        // planDate: '',
        cstmId: '',
        cstmIdList: [],
        loading: false
      }
    },
    props: {
      uid: {
        type: Number,
        default: null
      },
      cb: {
        type: Function,
        require: true
      },
      dialogShow: {
        type: Boolean,
        default: false
      }
    },
    mounted () {
      this.init()
      this.customerGet()
    },
    methods: {
      init () {
        this.planVisitTime = ''
        this.cstmId = ''
        let date = new Date()
        // this.planDate = new Date(date.getTime() + 86400000 * 7)
      },
      async cstmCallCreate (paramsObj) {
        try{
          let { data } = await this.apiStreamPost('/proxy/common/post', {url: 'customerManage/cstmCall/callCreate', params: paramsObj})
          if (data.returnCode === 0) {
            this.msgShow(this, '添加成功', 'success')
            this.cb()
            this.init()
          } else {
            this.msgShow(this, data.errMsg)
          }
        } catch (e) {
          console.error(e)
          this.msgShow(this)
        }
      },
      async customerGet (query) {
        this.loading = true
        let params = {
          uid: this.uid,
          pageSize: 10,
          compName: query
        }
        if(query !== ''){
          try {
            let { data } = await this.apiStreamPost('/proxy/common/post', {url: 'customerManage/customer/queryCombo', params: params})
              if (data.returnCode === 0) {
                this.cstmIdList = data.list
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
      subForm (flg) {
        if(flg == 'ok'){
          let toDay = new Date()
          if(typeof(this.cstmId) !== 'number'){
            this.msgShow(this, '请输入公司名称', 'warning')
            return
          }
          if(typeof(this.planVisitTime) == 'string' || this.planVisitTime == null){
            this.msgShow(this, '请选择计划拜访日期', 'warning')
            return
          }
          if(this.planVisitTime < toDay){
            this.msgShow(this, '拜访时间不能小于当前时间', 'warning')
            return
          }
          let paramsObj = {
            cstmId: this.cstmId,
            uid: this.uid,
            // planDate: this.planDate,
            planVisitTime: this.datetime2Str(this.planVisitTime)
          }
          this.cstmCallCreate(paramsObj)
        } else {
          this.cb()
          this.init()
        }
      }
    }
  }
</script>