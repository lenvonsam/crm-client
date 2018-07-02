<template lang="pug">
.search-box.pt-20
  el-form(ref="form", :inline="true", label-width="120px", label-position="right")
    el-form-item(v-for="item in searchFormItems", :key="item.model", :label="item.label")
      el-input(:v-model="item.model", v-if="item.type == 'text'", :placeholder="item.placeholder", size="small")
      el-select.full-width(v-model="item.model", placeholder="item.placeholder", v-if="item.type == 'select'")
        el-option(v-for="itemVal in item.val", :key="itemVal.value", :label="itemVal.label", :value="itemVal.value")
    el-button.mt-5.ml-35(size="small", type="primary") 查询
    el-button.mt-5.ml-5(size="small") 重置
</template>
<script>
  export default {
    props: {
      searchFormItems: {
        type: Array,
        required: true
      }
    }
  }
</script>
<style lang="stylus", scoped>
  .search-box
    border: 1px dashed #ddd
</style>
