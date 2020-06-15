<template lang="pug">
  .content
    breadcrumb(:breadItems="breadItems")
    el-tabs(type="border-card", v-model="tabName", @tab-click="elTabsHandler")
      el-tab-pane(label='超期未提', name="1")
        overdue(v-if="tabName == '1'")
      el-tab-pane(label='历史记录', name="2")
        history(v-if="tabName == '2'")
</template>

<script>
  import breadcrumb from '@/components/Breadcrumb.vue'
  import overdue from './overdue.vue'
  import history from './history.vue'
  export default {
    layout: 'main',
    components: {
      breadcrumb,
      overdue,
      history
    },
    data(){
      return {
        breadItems: ['销售管理', '超期未提仓储费'],
        tabName: '1'
      }
    },
    methods: {
      elTabsHandler (tab) {
        this.tabName = tab.name
      }
    }
  }
</script>
<style lang="styl", scoped>
</style>