<template lang="pug">
  .content
    breadcrumb(:breadItems="breadItems")
    .pt-15
      button-group(:btns="btnGroups", @groupBtnClick="groupBtnClick")
    .mt-15
      search-form(:searchFormItems="searchFormItems", @search="searchForm")
    .mt-5
      basic-table(:tableValue="tableValue", :loading="loading", :currentPage="currentPage", :pageSize="pageSize", :total="totalCount", @chooseData="selectData", @pageChange="tableChange", @tableRowLock="rowLock")
    el-dialog(title="提示", :visible.sync="dialogFormVisible", width="450px", height="100px")
      .row.flex-center
        .col.flex-100 计划拜访日期
          sup.text-red *
        .col
          el-date-picker.full-width(v-model="planVisitTime", type="datetime", placeholder="选择日期")
      .row.flex-center.mt-10
        .col.flex-100 计划开单日期
          sup.text-red *
        .col
          el-date-picker.full-width(v-model="planDate", type="date", placeholder="选择日期")
        .ft-13.text-red.mt-10 请选择计划完成日期，设置完成后不能修改。在日期前客户开单视为转化成功。
      .dialog-footer.text-right(slot="footer")
        el-button(size="medium", @click="subForm('cancel')") 取消
        el-button(type="primary", size="medium", @click="subForm('ok')") 确认
</template>

<script>
  import breadcrumb from '@/components/Breadcrumb.vue'
  import basicTable from '@/components/BasicTable.vue'
  import searchForm from '@/components/SearchForm.vue'
  import buttonGroup from '@/components/ButtonGroup.vue'
  import { mapState } from 'vuex'
  export default {
    layout: 'main',
    components: {
      breadcrumb,
      basicTable,
      searchForm,
      buttonGroup
    },
    data () {
      return {
        breadItems: ['客户管理', '公共客户'],
        btnGroups: [{lbl: '添加到客户拜访', type: 'add'}],
        searchFormItems: [
          [{label: '公司名称', model: 'compName', type: 'text', placeholder: '请输入公司名称', val: ''},
            {label: '联系人姓名', model: 'name', type: 'text', placeholder: '请输入联系人姓名', val: ''},
            {label: '联系方式', model: 'phone', type: 'text', placeholder: '请输入联系方式', val: ''}],
          [{label: '流失日期', model: 'createAt', type: 'timeLimit', val: ''},
          {label: '业务部门', model: 'dptName', type: 'text', placeholder: '请选择业务部门', val: ''},
          {label: '业务员', model: 'acctName', type: 'text', placeholder: '请选择业务员', val: ''}]
        ],
        tableValue: {
          tableData: [],
          hasCbx: true,
          rowClassName: false,
          tableHead: [{
            lbl: '公司名称',
            prop: 'compName',
            type: 'link',
            linkUrl: '/customManager/publicCustom/detail'
          }, {
            lbl: '主联系人',
            prop: 'name'
          }, {
            lbl: '联系方式',
            prop: 'phone'
          }, {
            lbl: '流失时间',
            prop: 'createAt',
            sort: true
          }, {
            lbl: '业务部门',
            prop: 'dptName'
          }, {
            lbl: '业务员',
            prop: 'acctName'
          }, {
            lbl: '未开单天数',
            prop: 'billDateDays',
            sort: true
          }, {
            lbl: '拜访次数',
            prop: 'visitCount',
            sort: true
          }]
        },
        currentPage: 1,
        totalCount: 0,
        queryObject: {
          currentPage: this.currentPage - 1,
          pageSize: this.pageSize,
          mark: '3'
        },
        chooseArray: [],
        planDate: '',
        planVisitTime: '',
        dialogFormVisible: false,
        loading: true
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
        mark: '3'
      }
      this.loadData()
    },
    methods: {
      searchForm (paramsObj) {
        this.loading = true
        this.currentPage = 1
        this.queryObject.currentPage = this.currentPage - 1
        Object.keys(paramsObj).map(key => {
          if(key == 'createAt'){
            if (paramsObj.createAt !== null) {
              this.queryObject.startTime = paramsObj.createAt[0]
              this.queryObject.endTime = paramsObj.createAt[1]
            } else {
              delete this.queryObject.startTime
              delete this.queryObject.endTime
            }
          } else if (paramsObj[key].length > 0) {
            this.queryObject[key] = paramsObj[key].trim()
          } else {
            delete this.queryObject[key]
          }
        })
        this.loadData()
      },
      subForm (flg) {
        if(flg == 'ok'){
          let toDay = new Date()
          if(typeof(this.planDate) == 'string' || this.planDate == null){
            this.msgShow(this, '请选择计划完成日期', 'warning')
            return
          }
          if(typeof(this.planVisitTime) == 'string' || this.planVisitTime == null){
            this.msgShow(this, '请选择计划开单日期', 'warning')
            return
          }
          if(this.planVisitTime < toDay){
            this.msgShow(this, '拜访时间不能小于今天', 'warning')
            return
          }
          if(this.planDate < this.planVisitTime){
            this.msgShow(this, '开单日期不能小于拜访日期', 'warning')
            return
          }
          let arr = []
          this.chooseArray.map(item => {
            arr.push(item.id)
          })
          let ids = arr.join(',')
          let paramsObj = {
            cstmIds: ids,
            uid: this.currentUser.id,
            planDate: this.date2Str(this.planDate),
            planVisitTime: this.datetime2Str(this.planVisitTime)
          }
          this.cstmCallCreate(paramsObj)
        }
        this.dialogFormVisible = false
      },
      groupBtnClick (type) {
        if(type == 'add'){
          if (this.chooseArray.length === 0) {
            this.msgShow(this, '请选择需要操作的数据', 'warning')
            return
          }
          this.dialogFormVisible = true
        }
      },
      selectData (val) {
        this.chooseArray = val
      },
      tableChange (val) {
        this.loading = true
        this.currentPage = val
        this.queryObject.currentPage = this.currentPage - 1
        this.loadData()
      },
      rowLock (obj) {
        console.log(obj)
        console.log(obj.lockStatus)
        let paramsObj = {
          cstmId: obj.id,
          status: (obj.lockStatus === 0) ? 1 : 0
        }
        if (this.updateLock(paramsObj)) {
          obj.lockStatus = (obj.lockStatus === 0) ? 1 : 0
        }
      },
      async loadData () {
        this.queryObject.uid = this.currentUser.id
        try {
          let { data } = await this.apiStreamPost('/proxy/common/post', {url: 'customerManage/customer', params: this.queryObject})
          if (data.returnCode === 0) {
            let arr = []
            let endDate = new Date()
            let arrList = ['id', 'compName', 'name', 'phone', 'createAt', 'billDate', 'dptName', 'acctName', 'createName', 'mark', 'orgId', 'dptId', 'acctId', 'visitCount', 'rownum']
            data.list.map(itm => {
              let obj = {}
              for(let i=0; i<arrList.length; i++){
                obj[arrList[i]] = itm[i]
              }
              let startDate = new Date(itm[5])
              let date = endDate.getTime() - startDate.getTime()
              let days = Math.floor(date/(24*3600*1000))
              obj.billDateDays = days
              arr.push(obj)
            })
            this.tableValue.tableData = arr
            this.totalCount = data.total
          } else {
            this.msgShow(this, data.errMsg)
          }
          this.loading = false
        } catch (e) {
          console.error(e)
          this.msgShow(this)
          this.loading = false
        }
      },
      async cstmCallCreate (paramsObj) {
        try{
          let { data } = await this.apiStreamPost('/proxy/common/post', {url: 'customerManage/cstmCall/batchCreate', params: paramsObj})
          if (data.returnCode === 0) {
            this.msgShow(this, '添加成功', 'success')
            this.loadData()
          } else {
            this.msgShow(this, data.errMsg)
          }
        } catch (e) {
          console.error(e)
          this.msgShow(this)
        }
      },
      async updateLock (params) {
        try {
          let { data } = await this.apiStreamPost('/proxy/common/post', {url: 'customerManage/customer/updateLock', params: params})
          if (data.returnCode === 0) {
            return true
          } else {
            this.msgShow(this, data.errMsg)
          }
        } catch (e) {
          console.error(e)
          this.msgShow(this)
          this.loading = false
        }
      }
    }
  }
</script>