<template lang="pug">
.content
  breadcrumb(:breadItems="breadItems")
  .mt-15  
    el-tabs(type="border-card", value="1", @tab-click="handleClick")
      el-tab-pane(label="今日拜访", name="1")
        day-visit(v-if="tabName == '1'")
      el-tab-pane(label="拜访中", name="2")
        visiting(v-if="tabName == '2'")
      el-tab-pane(label="拜访历史", name="3")
        visiting-history(v-if="tabName == '3'")
</template>
<script>
import breadcrumb from '@/components/Breadcrumb.vue'
import visiting from '@/pages/customManager/customerVisit/Visiting.vue'
import visitingHistory from '@/pages/customManager/customerVisit/VisitingHistory.vue'
import dayVisit from '@/pages/customManager/customerVisit/DayVisit.vue'
import buttonGroup from '@/components/ButtonGroup.vue'
import { mapState } from 'vuex'
export default {
  layout: 'main',
  components: {
    breadcrumb,
    visiting,
    visitingHistory,
    dayVisit,
    buttonGroup
  },
  data () {
    return {
      breadItems: ['客户管理', '客户拜访'],
      btnGroups: [{lbl: '增加客户拜访', type: 'add'}],
      tabName: '1'
    }
  },
  computed: {
    ...mapState({
      pageSize: state => state.pageSize,
      currentUser: state => state.user.currentUser
    })
  },
  methods: {
    handleClick(tab, event) {
      this.tabName = tab.name
    }
  }
}
</script>