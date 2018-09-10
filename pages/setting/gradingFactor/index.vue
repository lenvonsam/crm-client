<template lang="pug">
.content
  breadcrumb(:breadItems="breadItems")
  .full-width.bg-f9.mt-20.p-15
    el-tabs(@tab-click="handleClick", tab-position="left", v-model="tabName")
      el-tab-pane(:label="itm.name", :name="itm.id", :key="idx", v-for="(itm, idx) in elTabPaneVal", v-if="elTabPaneVal.length > 0")
        grading-factor(v-if="tabName == '2' && loadDataVal.length > 0", :cb="saveHandler", :loadDataVal="loadDataVal", :currentAuth="currentAuth")
        regional-score(v-if="tabName == '3' && loadDataVal.length > 0", :cb="saveHandler", :loadDataVal="loadDataVal", :del="delData", :currentAuth="currentAuth")
        type-score(v-if="tabName == '4' && loadDataVal.length > 0", :cb="saveHandler", :loadDataVal="loadDataVal", :currentAuth="currentAuth")
        arrears-score(v-if="tabName == '5' && loadDataVal.length > 0", :cb="saveHandler", :loadDataVal="loadDataVal", :del="delData", :currentAuth="currentAuth")
        grading-factor(v-if="tabName == '6' && loadDataVal.length > 0", :cb="saveHandler", :loadDataVal="loadDataVal", :currentAuth="currentAuth")
        grading-factor(v-if="tabName == '7' && loadDataVal.length > 0", :cb="saveHandler", :loadDataVal="loadDataVal", :currentAuth="currentAuth")
        grading-factor(v-if="tabName == '8' && loadDataVal.length > 0", :cb="saveHandler", :loadDataVal="loadDataVal", :currentAuth="currentAuth")
        oficial-and-public-score(v-if="tabName == '9' && loadDataVal.length > 0", :cb="saveHandler", :loadDataVal="loadDataVal", :currentAuth="currentAuth")
        category-score(v-if="tabName == '10' && loadDataVal.length > 0", :cb="saveHandler", :loadDataVal="loadDataVal", :del="delData", :currentAuth="currentAuth") 
        generation-billing-score(v-if="tabName == '11' && loadDataVal.length > 0", :cb="saveHandler", :loadDataVal="loadDataVal", :currentAuth="currentAuth")
        customer-score(v-if="tabName == '12' && loadDataVal.length > 0", :cb="saveHandler", :loadDataVal="loadDataVal", :currentAuth="currentAuth")
        grading-factor(v-if="tabName == '30' && loadDataVal.length > 0", :cb="saveHandler", :loadDataVal="loadDataVal", :currentAuth="currentAuth")
  .full-width.bg-f9.mt-20.p-15
    .ft-16.border-bottom-line.pb-10 分级公式
      span.text-red.text-left.ft-13.pl-5 所有客户按得分每10%分一档，共10档：A、B、C、D、E、F、G、H、I、J
    .bg-white.mt-15.p-10 插入系数：
      el-button(v-for="(itm, idx) in elTabPaneVal", :key="idx", :type="itm.active == true ? 'success' : ''", size="mini", @click="insertFormulaHandler(itm.name, idx)") {{itm.name}}
      el-button(size="mini", @click="insertFormulaHandler('插入符号')") 插入符号
    .bg-white.mt-15.p-10 总得分 =
      span.pointer.ml-15(v-for="(itm, idx) in formulaVal", :key="idx")
        i.el-icon-close.icon-del(@click="handleClose(itm, idx)", v-if="currentAuth.hasDelete == 1")
        span(v-if="itm !=='+' && itm !=='-' && itm !=='*' && itm !=='/' && itm !=='(' && itm !==')'")
          span.el-tag.ml-5.ft-15 {{ itm }}
        span.symbol(v-else)
          el-select(v-model="formulaVal[idx]", size="mini")
            el-option(v-for="item in options", :key="idx + item", :label="item", :value="item")
    .mt-15.p-10.text-center(v-if="currentAuth.hasUpdate == 1")
      el-button(size="small", type="primary", @click="saveFormula") 保存公式
      el-button(size="small", @click="resetFormula") 重置公式
      el-button(size="small", @click="clearFormula") 清除公式
</template>

<script>
  import breadcrumb from '@/components/Breadcrumb.vue'
  import regionalScore from '@/pages/setting/gradingFactor/RegionalScore.vue'
  import typeScore from '@/pages/setting/gradingFactor/TypeScore.vue'
  import arrearsScore from '@/pages/setting/gradingFactor/ArrearsScore.vue'
  import oficialAndPublicScore from '@/pages/setting/gradingFactor/OfficialAndPublicScore.vue'
  import categoryScore from '@/pages/setting/gradingFactor/CategoryScore.vue'
  import generationBillingScore from '@/pages/setting/gradingFactor/GenerationBillingScore.vue'
  import customerScore from '@/pages/setting/gradingFactor/CustomerScore.vue'
  import gradingFactor from '@/components/GradingFactor.vue'
  import { mapState } from 'vuex'
  export default {
    layout: 'main',
    components: {
      breadcrumb,
      regionalScore,
      typeScore,
      arrearsScore,
      oficialAndPublicScore,
      categoryScore,
      generationBillingScore,
      customerScore,
      gradingFactor
    },
    computed: {
      ...mapState({
        currentUser: state => state.user.currentUser
      })
    },
    data () {
      return {
        breadItems: ['系统设置', '分级系数'],
        elTabPaneVal: [],
        options: ['+', '-', '*', '(',')'],
        formulaVal: [],
        eltagSelectShow: false,
        eltagSelectValue: '+',
        parentName: '销量得分',
        parentId: '2',
        tabName: '2',
        loadDataVal: [],
        resetFormulaVal: [],
        resetElTabPaneVal: [],
        initElTabPaneVal: [],
        currentAuth: {
          hasCreate: '',
          hasDelete: '',
          hasUpdate: ''
        }
      }
    },
    mounted () {
      this.loadParentData()
    },
    methods: {
      handleClick (tab) {
        this.loadDataVal = []
        this.tabName = tab.name
        this.parentId = tab.name
        this.loadData()
      },
      insertFormulaHandler (val, idx) {
        if (this.currentAuth.hasUpdate == 1) {
          if (val == '插入符号') {
            this.formulaVal.push('+')
          } else {
            this.elTabPaneVal[idx].active = !this.elTabPaneVal[idx].active
            if(this.elTabPaneVal[idx].active == false){
              this.formulaVal.splice(this.formulaVal.indexOf(val), 1);
            } else {
              this.formulaVal.push(val)
              this.formulaVal.push('+')
            }
          }
        }        
      },
      optionsHandler (val) {
        this.formulaVal.push(val)
      },
      handleClose (val, idx) {
        this.formulaVal.splice(idx, 1)
        this.elTabPaneVal.map(itm => {
          if (itm.name == val) {
            itm.active = false
          }
        })
      },
      resetFormula () {
        this.formulaVal = JSON.parse(JSON.stringify(this.resetFormulaVal))
        this.elTabPaneVal = JSON.parse(JSON.stringify(this.resetElTabPaneVal))
      },
      clearFormula () {
        this.formulaVal = []
        this.elTabPaneVal = JSON.parse(JSON.stringify(this.initElTabPaneVal))
      },
      saveFormula () {
        let formualLength = this.formulaVal.length - 1
        let last = this.formulaVal[formualLength]
        let arr = ['+', '-', '*', '(']
        if (arr.indexOf(last) > -1) {
          // this.formulaVal = this.formulaVal.slice(0,formualLength)
          this.msgShow(this, '公式格式错误')
          return
        }
        let formualNameVal = JSON.parse(JSON.stringify(this.formulaVal))
        for(let i=0; i<formualNameVal.length; i++){
          if(/[\u4e00-\u9fa5]/.test(formualNameVal[i])){
            formualNameVal[i] = '${' + formualNameVal[i] + '}'
          }
        }
        let formualStr = this.formulaVal.toString()
        let formualCoeff = formualStr.replace(/[-+*,()]/g, '6').replace(/\d\d+/g, '*')
        formualStr = formualStr + '||' + formualCoeff
        let formualNameStr = formualNameVal.toString().replace(/,/g, '')
        let params = {
          grades: [],
          parentId: 1,
          type: '2',
          name: formualNameStr
        }
        // console.log(formualCoeff)
        params.grades.push(formualStr)
        this.saveData(params, 'formula')
      },
      handleInputConfirm () {},
      saveHandler (params) {
        params.parentId = this.parentId
        this.saveData(params)
      },
      async saveData (params, formulaStr) {
        try {
          let { data } = await this.apiStreamPost('/proxy/common/post', {url: 'setting/grading/createOrUpdate', params: params})
          if (data.returnCode === 0) {
            this.msgShow(this, '保存成功', 'success')
            if (formulaStr == 'formula') {
              this.loadFormulaData()
            } else {
              this.loadDataVal = []
              this.loadData()
            }
          } else {
            this.msgShow(this, data.errMsg)
          }
        } catch (e) {
          console.error(e)
          this.msgShow(this)
        }
      },
      async loadData () {
        try {
          let { data } = await this.apiStreamPost('/proxy/common/post', {url: 'setting/grading', params: {parentId: this.parentId}})
          if (data.returnCode === 0) {
            this.loadDataVal = data.list
          } else {
            this.msgShow(this, data.errMsg)
          }
        } catch (e) {
          console.error(e)
          this.msgShow(this)
        }
      },
      async loadFormulaData () {
        try {
          let { data } = await this.apiStreamPost('/proxy/common/post', {url: 'setting/grading', params: {parentId: 1}})
          if (data.returnCode === 0) {
            this.formulaVal = (data.grade.equationName !== null) ? data.grade.equationName.split('||')[0].split(',') : []
            this.elTabPaneVal.map(itm => {
              if (this.formulaVal.indexOf(itm.name) > -1) {
                itm.active = true
              }
            })
            this.resetFormulaVal = JSON.parse(JSON.stringify(this.formulaVal))
            this.resetElTabPaneVal = JSON.parse(JSON.stringify(this.elTabPaneVal))
          } else {
            this.msgShow(this, data.errMsg)
          }
        } catch (e) {
          console.error(e)
          this.msgShow(this)
        }
      },
      async loadParentData () {
        try {
          if (this.currentUser.id == 1) {
            this.currentAuth = {
              hasCreate: 1,
              hasDelete: 1,
              hasUpdate: 1
            }
          } else {
            let idx = this.currentUser.auths.findIndex(itm => this.$route.path.startsWith(itm.fkMenu.pageUrl))
            this.currentAuth = {
              hasCreate: this.currentUser.auths[idx].hasCreate,
              hasDelete: this.currentUser.auths[idx].hasDelete,
              hasUpdate: this.currentUser.auths[idx].hasUpdate
            }
          }
          this.$forceUpdate()
          console.log(this.currentAuth)
          let { data } = await this.apiStreamPost('/proxy/common/get', {url: 'setting/grading/queryParent'})
          if (data.returnCode === 0) {
            data.list.map(itm => {
              let obj = {
                id: itm.id.toString(),
                name: itm.name,
                active: false
              }
              this.elTabPaneVal.push(obj)
              this.initElTabPaneVal = JSON.parse(JSON.stringify(this.elTabPaneVal))
            })
            this.loadData()
            this.loadFormulaData()
          } else {
            this.msgShow(this, data.errMsg)
          }
        } catch (e) {
          console.error(e)
          this.msgShow(this)
        }
      },
      async delData (id) {
        try {
          let { data } = await this.apiStreamPost('/proxy/common/del', {url: 'setting/grading/' + id})
          if (data.returnCode === 0) {
            this.msgShow(this, '删除成功', 'success')
            this.loadDataVal = []
            this.loadData()
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
  .input-border-radius{
    border-radius: 3px!important;
    width: 100px;
  }
  .select-w{
    width: 60px;
  }
  .pointer{
    cursor: pointer;
    position: relative;
  }
  .icon-del{
    position: absolute;
    right: -5px;
    top: -10px;
    width: 15px;
    height: 15px;
    font-size: 12px;
    border-radius: 100%;
    background: red;
    text-align: center;
    color: #fff;
    line-height: 15px;
    z-index: 999;
  }
</style>
