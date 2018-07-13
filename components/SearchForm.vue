<template lang="pug">
.search-box
  .row.flex-center.text-center
    .col.pt-20
      .row(v-for="(items, index) in copyItems")
        .col(:class="index != 3 ? 'pr-15' : ''", v-for="(item, idx) in items")
          .row.mb-15.flex-center
            .col.flex-120.text-right.pr-5
              label(v-if="item.label") {{item.label}}：
            .col
              el-date-picker.full-width(v-model="item.val", type="date",v-if="item.type == 'date'", :placeholder="item.placeholder",size="small", value-format="yyyy-MM-dd")
              el-autocomplete.full-width(v-model="item.val", v-else-if="item.type == 'autocomplete'", @focus="selectIdx(index, idx)", :fetch-suggestions="querySearchAsync", :placeholder="item.placeholder", size="small")
              el-select.full-width(v-model="item.val", :placeholder="item.placeholder", v-else-if="item.type == 'select'", size="small")
                el-option(v-for="itemIist in item.list", :key="itemIist.value", :label="itemIist.label", :value="itemIist.value")
                  span {{itemIist.label}}
              el-input(v-model="item.val", v-else-if="item.label", :placeholder="item.placeholder", size="small")
    .text-center(style="flex: 0 0 200px")
      el-button(size="small", type="primary", @click="search('submit')") 查询
      el-button(size="small", @click="search('reset')") 重置
</template>
<script>
  export default {
    data () {
      return {
        copyItems: null,
        selectIdxArr: []
      }
    },
    beforeMount () {
      this.copyItems = Object.assign([], this.searchFormItems)
      if (this.copyItems.length>1){
        let i = 3 - this.copyItems[this.copyItems.length - 1 ].length
        for (let n = 0; n< i; n++){
          this.copyItems[this.copyItems.length - 1 ].push({})
        }
      }
    },
    props: {
      searchFormItems: {
        type: Array,
        required: true
      }
    },
    methods: {
      search (type) {
        let itemLength = this.copyItems.length
          let searchParm = {}
          for(let i=0; i<itemLength; i++){
            for(let n=0; n<this.copyItems[i].length; n++){
              if(this.copyItems[i][n].model && type == 'submit'){
                let key = this.copyItems[i][n].model
                searchParm[key] = this.copyItems[i][n].val
              } else if(type == 'reset'){
                this.copyItems[i][n].val = ''
              }
            }
          }
        this.$emit('search', searchParm)
      },
      querySearchAsync(queryString, cb) {
        let copyItemsIdx = this.selectIdxArr[0]
        let itemsIdx = this.selectIdxArr[1]
        let restaurants = this.copyItems[copyItemsIdx][itemsIdx].list
        var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          cb(results);
        }, 3000 * Math.random());
      },
      createStateFilter(queryString) {
        return (state) => {
          return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      selectIdx (index, idx) {
        this.selectIdxArr = [index, idx]
      }
    }
  }
</script>
<style lang="stylus", scoped>
  .search-box
    border: 1px dashed #ddd
</style>
