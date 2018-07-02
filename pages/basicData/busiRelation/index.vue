<template lang="pug">
  .content
    breadcrumb(:breadItems="breadItems")
    //- basic-code-search(:searchForm="searchFormItems")
</template>

<script>
  import breadcrumb from '@/components/Breadcrumb.vue'
  import basicTable from '@/components/BasicTable.vue'
  // import basicCodeSearch from '@/components/BasicCodeSearch.vue'
  export default {
    layout: 'main',
    components: {
      breadcrumb,
      basicTable,
      // basicCodeSearch
    },
    data () {
      return {
        searchFormItems: [
          {label: '关系代码', model: 'code', type: 'text', placeholder: '请输入关系代码'},
          {label: '关系名称', model: 'name', type: 'text', placeholder: ''}
        ]
      }
    }
  }
</script>