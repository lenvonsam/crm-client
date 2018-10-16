<template lang="pug">
  .content
    breadcrumb(:breadItems="breadItems")
    .mt-15
      el-form.pt-15(:inline="true", :model="searchVal" ref="searchVal" label-width="100px")
        el-form-item(label="日期范围：", prop="date")
          el-date-picker(type="daterange", range-separator="-", start-placeholder="开始日期", end-placeholder="结束日期", v-model="searchVal.date", style="width: 250px;", size="small", :picker-options="datePickerOpts", value-format="yyyy-MM-dd")
        el-form-item(label="消息内容")
          el-input(type="text", v-model="searchVal.content", placeholder="请输入异常内容", size="small")
        el-form-item(label="消息类型")
          // el-input(type="text", v-model="searchVal.msgType", placeholder="请选择类型", size="small")
          el-select.full-width(v-model="searchVal.msgType", placeholder="请选择类型")
            el-option(v-for="item in msgTypeList", :key="item.value", :label="item.label", :value="item.value")
        el-form-item
          el-button(type="primary", @click="submitForm('searchVal')", size="small") 查询
          el-button(@click="resetForm('searchVal')", size="small") 重置
      basic-table(:tableValue="tableValue", :loading="loading", :currentPage="currentPage", :pageSize="pageSize", :total="totalCount", @pageChange="tableChange",@tableRowSend="rowSend")
</template>

<script>
  import breadcrumb from '@/components/Breadcrumb.vue'
  import basicTable from '@/components/BasicTable.vue'
  import { mapState } from 'vuex'
  export default {
    layout: 'main',
    components: {
      breadcrumb,
      basicTable
    },
    data () {
      return {
        msgTypeList: [{value: 0,label: '接收'},{ value: 1,label: '发送'}],
        breadItems: ['系统设置', '消息管理'],
        searchVal: {
          date: [],
          content: ''
        },
        tableValue: {
          tableData: [],
          hasCbx: false,
          rowClassName: false,
          tableHead: [{
            lbl: '消息编码',
            minWidth: '40px',
            prop: 'id'
          },{
            lbl: '创建时间',
            prop: 'createAt',
            width: '180px'
          },{
            lbl: '消息内容',
            minWidth: '300px',
            prop: 'content'
          },{
            lbl: '消息名称',
            minWidth: '80px',
            prop: 'mqName'
          },{
            lbl: '处理次数',
            minWidth: '40px',
            prop: 'dealNum'
          },{
            type: 'action',
            width: '60px',
            fixed: 'right',
            actionBtns: [{
              lbl: '重发',
              type: 'send'
            }]
          }
          /*,{
            lbl: '消息状态',
            minWidth: '40px',
            prop: 'status1',
            type: 'object',
            factValue: function (row) {
              return (row == 0) ? '成功' : '失败'
            }
          }*/
          ]
        },
        currentPage: 1,
        totalCount: 0,
        loading: false,
        queryObject: {
          currentPage: this.currentPage - 1,
          pageSize: this.pageSize
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
        pageSize: this.pageSize
      }
      this.loadData()
    },
    methods: {
      tableChange (val) {
        this.loading = true
        this.currentPage = val
        this.queryObject.currentPage = this.currentPage - 1
        this.loadData()
      },
      submitForm () {
        let dateArr = this.searchVal.date
        if (dateArr !== null && dateArr !== undefined && dateArr !== '') {
          this.queryObject.startTime = dateArr[0]
          this.queryObject.endTime = dateArr[1]
        } else {
          delete this.queryObject.startTime
          delete this.queryObject.endTime
        }
        if (this.searchVal.content !== '') {
          this.queryObject.content = this.searchVal.content
        } else {
          delete this.queryObject.content
        }
        this.queryObject.msgType = this.searchVal.msgType
        this.currentPage = 1
        this.queryObject.currentPage = this.currentPage - 1
        this.loadData()
      },
      rowSend (row) {
        console.log(row.id)
        this.resendGet(row.id)
      },
      async resendGet (id) {
          try {
            let { data } = await this.apiStreamPost('/proxy/common/get', {url: 'setting/mqResend/'+ Number(id)})
            if (data.returnCode === 0) {
              console.log('重发成功')
              this.msgShow(this, '重发成功', 'success')
            } else {
              console.log('重发失败')
              this.msgShow(this, data.errMsg)
            }
          } catch (e) {
            console.error(e)
            this.msgShow(this)
          }
      },
      resetForm () {
        this.searchVal = {
          date: [],
          content: ''
        }
      },
      async loadData () {
        try {
          let { data } = await this.apiStreamPost('/proxy/common/post', {url: 'setting/mqMsg', params: this.queryObject})
          if (data.returnCode === 0) {
            console.log(data.list)
            data.list.map(item => {
              item.status1 = item.status
            })
            this.tableValue.tableData = data.list
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
      }
    }
  }
</script>
