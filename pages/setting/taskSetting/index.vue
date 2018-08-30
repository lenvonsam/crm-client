<template lang="pug">
  .content
    breadcrumb(:breadItems="breadItems")
    //- .mt-15
    //-   button-group(:btns="btnGroups", @groupBtnClick="groupBtnClick", @fileUploadSuccess="excelUploadSuccess")
    .mt-15
      button-group(style="margin-top: 2px;", :btns="btnGroups", @groupBtnClick="groupBtnClick", @fileUploadSuccess="excelUploadSuccess")
      el-date-picker.ml-5(style="width: 120px;", v-model="tabsVal", type="year", placeholder="选择年", value-format="yyyy", format="yyyy 年", size="small", @change="handleClick")
      el-button.ml-5(v-for="(itm, idx) in monthList", size="small", :key="idx", :type="monthActive == idx ? 'success' : ''", @click="monthHandler(idx)") {{itm}}
      el-tabs.mt-15(@tab-click="typeHandleClick", type="border-card", v-model="typeTablName")
        el-tab-pane(:label="itm.lbl", :name="itm.name", :key="itm.name", v-for="(itm, idx) in elTabPaneTypeVal")
          personal(v-if="typeTablName == '3' && typeof(totalCount) == 'number'", :tabPaneData="tabPaneData", :saveCb="saveHandler", :delCb="delHandler", :searchCb="searchHandler", :total="totalCount", :tableChange="tableChange", :pageSize="pageSize", :currentPage="currentPage")
          department(v-if="typeTablName == '2' && typeof(totalCount) == 'number'", :tabPaneData="tabPaneData", :saveCb="saveHandler", :delCb="delHandler", :searchCb="searchHandler", :total="totalCount", :tableChange="tableChange", :pageSize="pageSize", :currentPage="currentPage")
          organization(v-if="typeTablName == '1' && typeof(totalCount) == 'number'", :tabPaneData="tabPaneData", :saveCb="saveHandler", :delCb="delHandler", :searchCb="searchHandler", :total="totalCount", :tableChange="tableChange", :pageSize="pageSize", :currentPage="currentPage")
          company(v-if="typeTablName == '0' && typeof(totalCount) == 'number'", :tabPaneData="tabPaneData", :saveCb="saveHandler", :delCb="delHandler", :total="totalCount", :tableChange="tableChange", :pageSize="pageSize", :currentPage="currentPage")
</template>
<script>
import breadcrumb from '@/components/Breadcrumb.vue'
import buttonGroup from '@/components/ButtonGroup.vue'
import personal from '@/pages/setting/taskSetting/Personal.vue'
import department from '@/pages/setting/taskSetting/Department.vue'
import organization from '@/pages/setting/taskSetting/Organization.vue'
import company from '@/pages/setting/taskSetting/Company.vue'
import { mapState } from 'vuex'
export default {
  layout: 'main',
  components: {
    breadcrumb,
    buttonGroup,
    personal,
    department,
    organization,
    company
  },
  data () {
    return {
      breadItems: ['系统设置', '任务设置'],
      btnGroups: [{lbl: '批量导入', dataType: 'taskPlanning', type: 'excel'}],
      elTabPaneVal: [
        {lbl: '2018年度任务', name:'2018'},
        {lbl: '2017年度任务', name:'2017'},
        {lbl: '2016年度任务', name:'2016'}
      ],
      monthList: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      monthActive: 0,
      tabsVal: '2018',
      elTabPaneTypeVal: [
        {lbl: '个人', name:'3'},
        {lbl: '部门', name:'2'},
        {lbl: '机构', name:'1'},
        {lbl: '公司', name:'0'}
      ],
      typeTablName: '3',
      tabPaneData: [],
      currentPage: 1,
      totalCount: null,
      queryObject: {
        currentPage: this.currentPage - 1,
        pageSize: this.pageSize,
        type: 3
      }
    }
  },
  computed: {
    ...mapState({
      pageSize: state => state.pageSize,
      currentUser: state => state.user.currentUser
    })
  },
  mounted () {
    this.queryObject = {
      currentPage: this.currentPage - 1,
      pageSize: this.pageSize,
      type: 3,
      year: Number(this.tabsVal),
      month: this.monthActive + 1
    }
    this.loadData()
  },
  methods: {
    handleClick (val) {
      this.serachhandler()
    },
    monthHandler (idx) {
      this.monthActive = idx
      this.serachhandler()
    },
    serachhandler (tab) {
      this.queryObject = {
        currentPage: this.currentPage - 1,
        pageSize: this.pageSize,
        type: Number(this.typeTablName),
        year: Number(this.tabsVal),
        month: this.monthActive + 1
      }
      this.loadData()
    },
    typeHandleClick (tab) {
      this.typeTablName = tab.name
      this.serachhandler()
    },
    excelUploadSuccess () {
      console.log('-------')
    },
    groupBtnClick () {},
    tableChange (val) {
      this.currentPage = val
      this.queryObject.currentPage = this.currentPage - 1
      this.loadData()
    },
    searchHandler (paramsObj) {
      this.currentPage = 1
      this.queryObject.currentPage = this.currentPage - 1
      Object.keys(paramsObj).map(key => {
        if (paramsObj[key].length > 0) {
          this.queryObject[key] = paramsObj[key].trim()
        } else {
          delete this.queryObject[key]
        }
      })
      this.loadData()
    },
    saveHandler (row) {
      console.log(row)
      let arr = ['dpt', 'acct', 'org']
      let strArr = []
      let acctArr = []
      let orgArr = []
      arr.map(itm => {
        let str = row[itm + 'Name']
        if (typeof(str) == 'string' && str.indexOf('&') > -1) {
          strArr = str.split('&')
          row[itm + 'Code'] = strArr[0]
          row[itm + 'Name'] = strArr[1]
          if(this.typeTablName == '3'){
            row['dptCode'] = strArr[2]
            delete row['orgCode']
            delete row['orgName']
          } else if (this.typeTablName == '2') {
            row['orgCode'] = strArr[2]
            delete row['acctCode']
            delete row['acctName']
          } else {
            delete row['acctCode']
            delete row['acctName']
            delete row['dptCode']
            delete row['dptName']
          }
        }
      })
      row.year = Number(this.tabsVal)
      row.month = this.monthActive + 1
      row.type = Number(this.typeTablName)
      delete row.updateAt
      delete row.createAt
      delete row.idx
      console.log(row)
      this.createOrUpdate(row)
    },
    delHandler (row) {
      this.confirmDialog(this, '您确定要删掉本行记录吗？').then(() => {
        this.taskDelete(row.id)
      }, () => {
        console.log('cancel')
      })
    },
    async loadData () {
      try {
        this.totalCount = null
        let { data } = await this.apiStreamPost('/proxy/common/post', {url: 'setting/task', params: this.queryObject})
          if (data.returnCode === 0) {
            this.tabPaneData = data.list
          } else {
            this.msgShow(this, data.errMsg)
          }
          this.totalCount = data.total
      } catch (e) {
        console.error(e)
        this.msgShow(this)
      }
    },
    async createOrUpdate (params) {
      try {
        let { data } = await this.apiStreamPost('/proxy/common/post', {url: 'setting/task/createOrUpdate', params: params})
          if (data.returnCode === 0) {
            this.msgShow(this, '保存成功', 'success')
            this.loadData()
          } else {
            this.msgShow(this, data.errMsg)
          }
      } catch (e) {
        console.error(e)
        this.msgShow(this)
      }
    },
    async taskDelete (id) {
      try {
        let { data } = await this.apiStreamPost('/proxy/common/del', {url: 'setting/task/' + id})
          if (data.returnCode === 0) {
            this.msgShow(this, '删除成功', 'success')
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