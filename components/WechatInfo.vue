<template lang="pug">
.row(style="align-items:normal")
  .col.relative
    div(style="position:absolute; top: 0; bottom: 0px; right: 12%;width: 1px; background: #ddd")
    div
      span.ft-16.ft-bold 二维码分享绑定
      span.ml-15 分享此码，用户关注，即可自动绑定
    .mt-15
      div(style="display:inline-block;width: 150px;")
        #xyQrCode
          img(:src="'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=' + xyTicket", style="width: 150px; height: 150px", v-if="xyTicket !== null")
          //- img(src="http://www.xingyun361.com/webpage/zhd/images/logo.png", style="width: 150px; height: 150px", v-if="xyTicket !== null")
        .mt-5.text-center {{xyName}}公众号
        //- .text-center.mt-10
          button(@click="copyQrImg('xy')", ref="xyBtn", data-clipboard-target="#xyQrCode", data-clipboard-action="copy") 复制
          //- el-button(size="mini", type="primary", @click="copyQrImg('xy')", ref="xyBtn", data-clipboard-target="#xyQrCode") 复制
      //- div(style="display:inline-block;width: 130px;")
        img(src="https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=gQGi8DwAAAAAAAAAAS5odHRwOi8vd2VpeGluLnFxLmNvbS9xLzAycUdzU1UtQmJjNTAxMDAwME0wN0YAAgRsWQ1eAwQAAAAA", style="width: 120px; height: 120px")
  .col
    .ft-16.ft-bold 已关注的可手动添加绑定
    .mt-15
      wx-user-select(style="width: 50%;", :multiple="false", @change="wxUserChange")
      el-button.ml-25(type="primary", @click="wxUserAdd") 添加
    .mt-15
      basic-table(:tableValue="tableValue", :loading="loading", :currentPage="currentPage", :pageSize="pageSize", :total="totalCount", @tableRowDelete="rowDelete")
</template>

<script>
import basicTable from '@/components/BasicTable.vue'
import buttonGroup from '@/components/ButtonGroup.vue'
import wxUserSelect from '@/components/WxUserSelector.vue'
// import Clipboard from 'clipboard'
import { mapState } from 'vuex'
export default {
  components: {
    basicTable,
    buttonGroup,
    wxUserSelect
  },
  data () {
    return {
      linkerAddInfo: [{ lbl: '新增账户信息', type: 'add' }],
      tableValue: {
        tableHead: [
          { lbl: '微信昵称', prop: 'name' },
          { lbl: '公众号名', prop: 'appName' },
          { lbl: '是否关注', prop: 'subscribe' },
          {            type: 'action',
            actionBtns: [{
              lbl: '删除',
              type: 'delete'
            }]
          }],
        hasCbx: false,
        tableData: []
      },
      currentPage: 1,
      totalCount: 0,
      snapData: [],
      isEdit: false,
      loading: true,
      wxUser: {},
      xyKey: 'xingYun',
      xyName: '型云',
      xyTicket: null

    }
  },
  computed: {
    ...mapState({
      pageSize: state => state.pageSize,
      currentUser: state => state.user.currentUser
    })
  },
  beforeMount () {
    this.getWxTicket('xy')
  },
  mounted () {
    this.loadData()
  },
  methods: {
    async getWxTicket (prefix) {
      try {
        const { data } = await this.apiStreamPost('/proxy/common/post', { url: `customerManage/customer/${this.$route.query.id}/wxTicket`, params: { appKey: this[`${prefix}Key`], appName: this[`${prefix}Name`] } })
        if (data.returnCode === 0) {
          this[`${prefix}Ticket`] = data.ticket
        }
      } catch (e) {
        console.error(e)
      }
    },
    async wxUserAdd () {
      try {
        if (!this.wxUser.id) {
          this.msgShow(this, '请选择需要添加的微信用户')
          return
        }
        const { data } = await this.apiStreamPost('/proxy/common/post', { url: `customerManage/customer/${this.$route.query.id}/wxLinker`, params: { content: JSON.stringify(this.wxUser) } })
        if (data.returnCode === 0) {
          this.msgShow(this, '新增成功', 'success')
          this.currentPage = 1
          this.loadData()
        } else {
          this.msgShow(this, data.errMsg)
        }
      } catch (e) {
        console.error(e)
        this.msgShow(this, e.message || '网络异常')
      }
    },
    wxUserChange (val) {
      // 单选
      this.wxUser = val[0]
      console.log('wxUser', this.wxUser)
    },
    rowDelete (row) {
      this.confirmDialog(this, '您确认要删掉本行记录吗？').then(() => {
        this.wxUserDel(row.id)
      }, () => {
        console.log('delete')
      })
    },
    async loadData () {
      try {
        let { data } = await this.apiStreamPost('/proxy/common/get', { url: `customerManage/customer/${this.$route.query.id}/wxLinkers?currentPage=${this.currentPage - 1}&pageSize=${this.pageSize}`, params: {} })
        if (data.returnCode === 0) {
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
    },
    async wxUserDel (id) {
      try {
        let { data } = await this.apiStreamPost('/proxy/common/del', { url: 'customerManage/wxLinker/' + id })
        if (data.returnCode === 0) {
          this.msgShow(this, '删除成功', 'success')
          this.currentPage = 1
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
