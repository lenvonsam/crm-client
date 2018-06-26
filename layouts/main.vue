<template lang="pug">
.crm.main
  .crm-topbar
    .item.brand CRM管理系统
    .item
    .item.flex-50 退出
  .crm-sidebar
    side-bar
  .crm-content
    router-view
</template>

<script>
  import sideBar from '@/components/SideBar.vue'
  export default {
    middleware: 'mainRouteMatch',
    components: {
      sideBar
    }
  }
</script>

<style lang="stylus">
@import "../assets/stylus/common"
</style>