<template lang="pug">
div
  el-form(ref="form", :inline="true", label-width="145px", label-position="right")
    el-form-item(v-for="item in searchFormItems", :label="item.label")
      el-input(:v-model="item.model", v-if="item.type == 'text'", placeholder="item.placeholder")
      el-select.full-width(v-model="item.model", placeholder="item.placeholder", v-if="item.type == 'select'")
        el-option(v-for="item in form.purchaseCycle", :key="item.value", :label="item.label", :value="item.value")
</template>

<script>
  export default {
    props: {
      searchForm: {
        type: Array,
        default: false
      }
    },
    methods: {
    }
  }
</script>
