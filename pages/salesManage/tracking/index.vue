<template lang="pug">
  .content
    breadcrumb(:breadItems="breadItems")
    el-tabs(type="border-card", v-model="tabName", @tab-click="elTabsHandler")
      el-tab-pane(label='离职人员销量报表', name="1")
        resignation-report(v-if="tabName == '1'")
      el-tab-pane(label='销量预警报表', name="2")
        early-warning(v-if="tabName == '2'")
</template>

<script>
  import breadcrumb from '@/components/Breadcrumb.vue'
  // import basicTable from '@/components/BasicTable.vue'
  // import searchForm from '@/components/SearchForm.vue'
  import ResignationReport from './ResignationReport.vue'
  import EarlyWarning from './EarlyWarning.vue'
  // import buttonGroup from '@/components/ButtonGroup.vue'
  // import { mapState } from 'vuex'
  export default {
    layout: 'main',
    components: {
      breadcrumb,
      // basicTable,
      // searchForm,
      ResignationReport,
      EarlyWarning
    },
    data() {
      return {
        breadItems: ['销售管理', '交易跟踪'],
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
  .width-input-250
    width: 250px
</style>