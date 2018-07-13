<template lang="pug">
.content
  breadcrumb(:breadItems="breadItems")
  .mt-15  
    el-tabs(type="border-card")
      el-tab-pane(label="拜访中")
        visiting
      el-tab-pane(label="拜访历史")
        visiting-history
      el-tab-pane(label="结果评估")
        result-eva
</template>
<script>
import breadcrumb from '@/components/Breadcrumb.vue'
import visiting from '@/pages/customManager/customerVisit/Visiting.vue'
import visitingHistory from '@/pages/customManager/customerVisit/VisitingHistory.vue'
import resultEva from '@/pages/customManager/customerVisit/ResultEva.vue'
export default {
  layout: 'main',
  components: {
    breadcrumb,
    visiting,
    visitingHistory,
    resultEva
  },
  data () {
    return {
      breadItems: ['客户管理', '客户拜访']
    }
  }
}
</script>