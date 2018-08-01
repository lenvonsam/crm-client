<template lang="pug">
.content
  breadcrumb(:breadItems="breadItems")
  .mt-15
    el-button(size="small", @click="back()") 返回列表
  .mt-15
    el-tabs(type="border-card", value="1", @tab-click="handleClick")
      el-tab-pane(label="基础信息", name="1")
        custom-detail(:url="'/customManager/contactManager/'", v-if="tabName == '1'", :isEdit="false")
      el-tab-pane(label="沟通信息", name="2") 
        communication-info(v-if="tabName == '2'")
      el-tab-pane(label="联系人信息", name="3") 
        linker-info(v-if="tabName == '3'")
      el-tab-pane(label="客户信息修改", name="4")
        custom-info(v-if="tabName == '4'")
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
      tabName: '1'
    }
  },
  methods: {
    handleClick(tab, event) {
      this.tabName = tab.name
    }
  }
}
</script>