<template lang="pug">
.content
  breadcrumb(:breadItems="breadItems")
  .mt-15
    button-group(:btns="btnGroups", @groupBtnClick="backPage")
  .mt-15
    el-tabs(type="border-card")
      el-tab-pane(label="基础信息")
        custom-detail(:disabled="true")
      el-tab-pane(label="沟通信息") 
        communication-info
      el-tab-pane(label="联系人信息") 
        linker-info
      el-tab-pane(label="客户信息修改")
        custom-info
</template>

<script>
import breadcrumb from '@/components/Breadcrumb.vue'
import buttonGroup from '@/components/ButtonGroup.vue'
import customDetail from '@/components/CustomDetail.vue'
import linkerInfo from '@/components/LinkerInfo.vue'
import communicationInfo from '@/components/CommunicationInfo.vue'
import customInfo from '@/components/CustomInfo.vue'
import accountInfo from '@/components/AccountInfo.vue'
export default {
  layout: 'main',
  components: {
    breadcrumb,
    buttonGroup,
    customDetail,
    linkerInfo,
    communicationInfo,
    customInfo,
    accountInfo
  },
  data () {
    return {
      breadItems: ['客户管理', '联系人管理'],
      btnGroups: [{lbl: '返回', type: 'back'}]
    }
  },
  methods: {
    backPage(type){}
  }
}
</script>