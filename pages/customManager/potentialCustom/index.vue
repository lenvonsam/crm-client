<template lang="pug">
  .content
    breadcrumb(:breadItems="breadItems")
    .pt-15
      button-group(:btns="btnGroups", @groupBtnClick="groupBtnClick")
    .mt-15
      search-form(:searchFormItems="searchFormItems", @search="searchForm")
    .pt-15
      basic-table(:tableValue="tableValue", :currentPage="currentPage", :loading="loading", :pageSize="pageSize", :total="totalCount", @chooseData="selectData", @pageChange="tableChange", @tableRowEdit="rowEdit", @tableRowMap = "rowMap", @tableRowConversion="rowConversion")
    baidu-map(v-if="dialogMap", :baiduMapData= "baiduMapData", :cb="baiduMapCb")
    el-dialog(title="提示", :visible="dialogShow", @close="dialogShow=false")
      span.ft-16 转为正式客户请确认以下内容是否完善：
      .mt-5 工商证照编码， 公司地址， 公司规模， 公司类型， 税号， 开户名称， 开户银行， 开户账号， 开票地址， 营业执照（附件）， 开票资料（附件）
      span(slot="footer" class="dialog-footer")
        el-button(@click="rowEdit(rowObj)", size="small") 编 辑
        el-button(type="primary" @click="conversionSure", size="small") 确 定
</template>

<script>
  import breadcrumb from '@/components/Breadcrumb.vue'
  import basicTable from '@/components/BasicTable.vue'
  import searchForm from '@/components/SearchForm.vue'
  import buttonGroup from '@/components/ButtonGroup.vue'
  import { mapState } from 'vuex'
  import baiduMap from '@/components/BaiduMap.vue'
  export default {
    layout: 'main',
    components: {
      breadcrumb,
      basicTable,
      searchForm,
      buttonGroup,
      baiduMap
    },
    data() {
      return {
        breadItems: ['客户管理', '潜在客户'],
        currentPage: 1,
        totalCount: 0,
        queryObject: {
          currentPage: this.currentPage - 1,
          pageSize: this.pageSize,
          orderType: '0',
          mark: '1'
        },
        btnGroups: [{
          lbl: '添加潜在客户',
          type: 'add'
        }, {
          lbl: '转化记录',
          type: 'conversionRec'
        }],
        tableValue: {
          tableData: [],
          hasCbx: false,
          rowClassName: false,
          tableHead: [{
            lbl: '公司名称',
            prop: 'compName',
            type: 'link',
            minWidth: '340px',
            linkUrl: '/customManager/potentialCustom/detail'           
          }, {
            lbl: '主联系人',
            prop: 'linkName',
            width: '200px'
          }, {
            lbl: '联系方式',
            prop: 'linkPhone',
            width: '120px'
          }, {
            lbl: '添加日期',
            prop: 'createAt',
            width: '200px'
          }, {
            lbl: '业务部门',
            prop: 'dptName',
            width: '150px'
          }, {
            lbl: '业务员',
            prop: 'acctName',
            width: '150px'
          }, {
            lbl: '创建人',
            prop: 'creatorName',
            width: '100px'
          }, {
            type: 'action',
            width: '200px',
            fixed: 'right',
            actionBtns: [{
              lbl: '编辑',
              type: 'edit'
            }, {
              lbl: '转化正式客户',
              type: 'conversion'
            }, {
              lbl: '地图',
              type: 'map'
            }]
          }]
        },
        searchFormItems: [
          [{label: '公司名称', model: 'compName', type: 'text', placeholder: '请输入公司名称', val: ''},
            {label: '联系人姓名', model: 'name', type: 'text', placeholder: '请输入联系人姓名', val: ''},
            {label: '联系方式', model: 'phone', type: 'text', placeholder: '请输入联系方式', val: ''}],
          [{label: '添加日期', model: 'createAt', type: 'timeLimit', val: ''},
          {label: '业务部门', model: 'dptName', placeholder: '请选择业务部门', val: ''},
          {label: '业务员', model: 'acctName', placeholder: '请选择业务员', val: ''}]
        ],
        reason: '',
        // dialogFormVisible: false,
        rowDelObj: {},
        chooseArray: [],
        loading: true,
        dialogMap: false,
        baiduMapData: {
          center: {lng: 116.404, lat: 39.915},
          zoom: 6,
          location: '中国',
          keyWord: ''
        },
        dialogShow: false,
        rowObj: {}
      }
    },
    mounted () {
      this.queryObject = {
        currentPage: this.currentPage - 1,
        pageSize: this.pageSize,
        orderType: '0',
        mark: '1'
      }
      this.loadData()
    },
    computed: {
      ...mapState({
        pageSize: state => state.pageSize,
        currentUser: state => state.user.currentUser,
        cstmArr: state => state.cstmArr
      })
    },
    methods: {
      baiduMapCb() {
        this.dialogMap = false
      },
      rowMap (obj) {
        this.baiduMapData.keyWord = obj.compName
        this.baiduMapData = {
          center: {lng: 116.404, lat: 39.915},
          zoom: 6,
          location: '',
          keyWord: obj.compName
        }
        this.dialogMap = true
      },
      async loadData () {
        this.queryObject.uid = this.currentUser.id
        try {
          let { data } = await this.apiStreamPost('/proxy/common/post', {url: 'customerManage/customer', params: this.queryObject})
          if (data.returnCode === 0) {
            this.tableValue.tableData = this.cstmListData(data.list, this.cstmArr)
            this.totalCount = data.total
            this.loading = false
          } else {
            this.msgShow(this, data.errMsg)
          }
        } catch (e) {
          console.error(e)
          this.msgShow(this)
          this.loading = false
        }
      },
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
      selectData (val) {
        console.log(val)
        this.chooseArray = val
      },
      groupBtnClick (type) {
        if(type == 'add'){
          this.$router.push({path: '/customManager/potentialCustom/form?type=new'})
        }
        if(type == 'conversionRec'){
          this.$router.push({path: '/customManager/potentialCustom/conversionRec'})
        }
      },
      tableChange (val) {
        this.loading = true
        this.currentPage = val
        this.queryObject.currentPage = this.currentPage - 1
        console.log(this.queryObject.orderType)
        this.loadData()
      },
      rowConversion (obj) {
        // this.confirmDialog(this, '您确认要转换为正式客户吗？').then(() => {
        //   let arr = []
        //   let paramsObj = {
        //     cstmId: obj.id,
        //     uid: this.currentUser.id,
        //     orderType: 0
        //   }
        //   this.customerTransform(paramsObj)
        // }, () => {
        //   console.log('cancel')
        // })
        this.rowObj = obj
        this.dialogShow = true
      },
      conversionSure () {
        let paramsObj = {
          cstmId: this.rowObj.id,
          uid: this.currentUser.id,
          orderType: 0
        }
        this.customerTransform(paramsObj)
      },
      async actionDelete () {
        try {
          let url = 'customerManage/customerDel/'
          let params = {
            id: this.rowDelObj.id,
            reason: this.reason,
            currentPage: this.currentPage - 1,
            pageSize: this.pageSize,
            uid: this.currentUser.id
          }
          let { data } = await this.apiStreamPost('/proxy/common/post', {url: url, params: params})
          if (data.returnCode === 0) {
            this.currentPage = 1
            this.queryObject.currentPage = this.currentPage - 1
            this.loadData()
            this.reason = ''
            this.msgShow(this, '删除成功', 'success')
          } else {
            this.msgShow(this, data.errMsg)
          }
        } catch (e) {
          console.error(e)
          this.msgShow(this)
        }
      },
      async customerTransform (paramsObj) {
        try{
          let { data } = await this.apiStreamPost('/proxy/common/post', {url: 'customerManage/customerTransform', params: paramsObj})
          if (data.returnCode === 0) {
            this.msgShow(this, '转换成功', 'success')
            this.dialogShow = false
            this.loadData()
          } else {
            this.msgShow(this, data.errMsg)
          }
        } catch (e) {
          console.error(e)
          this.msgShow(this)
        }
      },
      rowEdit (obj) {
        this.jump('/customManager/potentialCustom/form?type=edit&id=' + obj.id)
      }
    }
  }
</script>
<style lang="styl", scoped>
  .width-input-250
    width: 250px
</style>