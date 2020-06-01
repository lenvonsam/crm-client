<template lang="pug">
.content
  breadcrumb(:breadItems="breadItems")
  .mt-15
    el-button(size="small", @click="back()") 返回列表
  .mt-15
    el-tabs(type="border-card", value="1", @tab-click="handleClick")
      el-tab-pane(label="基础信息", name="1")
        custom-detail(:url="'/customManager/customerEvalution/'", v-if="tabName == '1'")
</template>

<script>
import breadcrumb from '@/components/Breadcrumb.vue'
import customDetail from '@/components/CustomDetail'
export default {
  layout: 'main',
  components: {
    breadcrumb,
    customDetail,
  },
  data () {
    return {
      breadItems: ['客户管理', '客户评估', '客户评估详情'],
      tabName: '1'
    }
  },
  methods: {
    handleClick (tab, event) {
      this.tabName = tab.name
    }
  }
}
</script>
<style lang="styl", scoped>
.label-style
  label
    width: 100% !important
</style>