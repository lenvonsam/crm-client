<template lang="pug">
.search-box
  .row.flex-center.text-center
    //- .col.pt-20
    .pt-20(:class="className")
      .row(v-for="(items, index) in copyItems")
        .col(v-for="(item, idx) in items")
          .row.mb-15.flex-center(v-if="item.label")
            .col.flex-120.text-right.pr-5
              label {{item.label}}：
            .col
              el-date-picker.full-width(v-model="item.val", type="date",v-if="item.type == 'date'", :placeholder="item.placeholder",size="small", value-format="yyyy-MM-dd")
              el-date-picker.full-width(v-model="item.val", type="month", v-else-if="item.type === 'month'", :placeholder="item.placeholder", size="small", value-format="yyyy-MM")
              el-date-picker.full-width.crm-timeLimit(v-model="item.val", type="daterange", v-else-if="item.type == 'timeLimit'", range-separator="-", start-placeholder="开始日期", end-placeholder="结束日期", size="small", value-format="yyyy-MM-dd")
              el-date-picker.full-width.crm-timeLimit(v-model="item.val", type="datetimerange", v-else-if="item.type == 'datetimerange'", range-separator="-", start-placeholder="开始日期", end-placeholder="结束日期", size="small", value-format="yyyy-MM-dd HH:mm")
              el-autocomplete.full-width(v-model="item.val", v-else-if="item.type == 'autocomplete'", @focus="selectIdx(index, idx)", :fetch-suggestions="querySearchAsync", :placeholder="item.placeholder", size="small")
              el-select.full-width(v-model="item.val", :placeholder="item.placeholder", v-else-if="item.type == 'select'", size="small")
                el-option(v-for="itemIist in item.list", :key="itemIist.value", :label="itemIist.label", :value="itemIist.value")
                  span {{itemIist.label}}
              el-select.full-width(v-model="item.val", :placeholder="item.placeholder", v-else-if="item.type == 'selectDept'", size="small", @focus="fkDptCreate", clearable)
                el-option(v-for="itemIist in deptList", :key="itemIist.name", :label="item.name", :value="itemIist.name")
                  span {{itemIist.name}}    
              el-select.full-width(v-model="item.val", v-else-if="item.type == 'selectRemote'", value-key, filterable, remote, size="small", :placeholder="item.placeholder", :remote-method="selectRemote", clearable, @focus="selectRemoteFocus(item)", @blur="selectRemoteBlur")
                el-option(v-for="item in item.list", :key="item.id", :label="item.name", :value="item.platformCode")
              el-select.full-width(v-model="item.val", v-else-if="item.type == 'selectArea'", value-key, filterable, size="small", :placeholder="item.placeholder", clearable, @focus="selectRemoteFocus(item)", @blur="selectRemoteBlur")
                el-option(v-for="item in item.list", :key="item.value", :label="item.name", :value="item.value")       
              template(v-else-if="item.type == 'range'")
                .row.flex-center
                  .col
                    el-input(v-model="item.min", :placeholder="item.minPlaceholder", size="small")
                  .col.flex-10.pl-5.pr-5.text-center
                    span -
                  .col
                    el-input(v-model="item.max", :placeholder="item.maxPlaceholder", size="small")
              el-input.full-width(v-model="item.val", v-else, :placeholder="item.placeholder", size="small")
          //- .row.mb-15.flex-center(v-if="item.model == 'showUpdate'",style="padding-left: 30px;")
          //-   el-col(:span="8")
          //-     el-checkbox(v-model="checked" @change="getCheckboxVal") 仅展示未评估的公司

    .text-center(style="flex: 0 0 200px")
      el-button(size="small", type="primary", @click="search('submit')") 查询
      el-button(size="small", @click="search('reset')") 重置
</template>
<script>
import { mapState, mapActions } from 'vuex'
export default {
  data () {
    return {
      copyItems: null,
      selectIdxArr: [],
      selectActive: {},
      deptList: [],
      checked: true
    }
  },
  computed: {
    ...mapState({
      searchParams: state => state.searchParams,
      currentUser: state => state.user.currentUser
    })
  },
  beforeMount () {
    if (this.searchParams['url'] == this.$route.path && this.autoChange) {
      for (let key in this.searchParams.params) {
        this.searchFormItems.map((item) => {
          item.map((obj) => {
            if (obj.model == key) {
              obj.val = this.searchParams.params[key]
            }
          })
        })
      }
    } else if (this.$route.path.indexOf(this.searchParams['url']) == -1) {
      this.clearSearchParams()
    }
    this.copyItems = Object.assign([], this.searchFormItems)
    if (this.copyItems.length > 1) {
      let i = 3 - this.copyItems[this.copyItems.length - 1].length
      for (let n = 0; n < i; n++) {
        this.copyItems[this.copyItems.length - 1].push({})
      }
    }
  },
  props: {
    searchFormItems: {
      type: Array,
      required: true
    },
    autoChange: {
      type: Boolean,
      default: true
    },
    className: {
      type: String,
      default: 'col'
    }
  },
  methods: {
    ...mapActions([
      'setSearchParams',
      'clearSearchParams'
    ]),
    search (type) {
      const searchParm = this.getSearchParm(type)
      if (type == 'submit') {
        let searchParamsObj = { url: this.$route.path, params: searchParm }
        this.setSearchParams(searchParamsObj)
        this.$emit('search', searchParm)
      }
    },
    getCheckboxVal(val){
      console.log('getCheckboxVal(val)=====>' + val)
      this.checked = val
      this.$emit('changeCheckVal', val)
    },
    getSearchParm (type) {
      let itemLength = this.copyItems.length
      let searchParm = {}
      for (let i = 0; i < itemLength; i++) {
        for (let n = 0; n < this.copyItems[i].length; n++) {
          if (this.copyItems[i][n].type == 'range' && type == 'submit') {
            let key = this.copyItems[i][n].model
            searchParm[key] = []
            if (this.copyItems[i][n].min.trim() !== '' && this.copyItems[i][n].max.trim() !== '') {
              if (Number(this.copyItems[i][n].min) > Number(this.copyItems[i][n].max)) {
                this.msgShow(this, '最小值不能大于最大值')
                return
              } else {
                searchParm[key].push(this.copyItems[i][n].min)
                searchParm[key].push(this.copyItems[i][n].max)
              }
            } else if (this.copyItems[i][n].min.trim() !== '' && this.copyItems[i][n].max.trim() == '') {
              this.msgShow(this, '请填写最大值')
              return
            } else if (this.copyItems[i][n].min.trim() == '' && this.copyItems[i][n].max.trim() !== '') {
              this.msgShow(this, '请填写最小值')
              return
            }
          } else if (this.copyItems[i][n].model && type == 'submit') {
            let key = this.copyItems[i][n].model
            searchParm[key] = this.copyItems[i][n].val
          } else if (type == 'reset') {
            this.copyItems[i][n].val = ''
            if (this.copyItems[i][n].type == 'range') {
              this.copyItems[i][n].min = ''
              this.copyItems[i][n].max = ''
            }
            if (this.copyItems[i][n].model == 'showUpdate') {
              this.copyItems[i][n].val = '1'
            }
          }
        }
      }
      return searchParm
    },
    selectRemoteFocus (item) {
      this.selectActive = item
    },
    selectRemoteBlur () {
      this.selectActive = {}
    },
    async selectRemote (val) {
      const { url, queryKey, list } = this.selectActive
      let params = {
        pageSize: 10,
        uid: this.currentUser.id
      }
      params[queryKey] = val
      let me = this
      try {
        let { data } = await this.apiStreamPost('/proxy/common/post', { url: url, params: params })
        if (data.returnCode === 0) {
          let arr = []
          data.list.map((item) => {
            if (item.status == 1) {
              arr.push(item)
            }
          })
          this.selectActive.list = arr
        } else {
          this.msgShow(this, data.errMsg)
        }
      } catch (e) {
        console.error(e)
        this.msgShow(this)
      }
    },
    querySearchAsync (queryString, cb) {
      let copyItemsIdx = this.selectIdxArr[0]
      let itemsIdx = this.selectIdxArr[1]
      let restaurants = this.copyItems[copyItemsIdx][itemsIdx].list
      var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        cb(results);
      }, 3000 * Math.random());
    },
    createStateFilter (queryString) {
      return (state) => {
        return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    selectIdx (index, idx) {
      this.selectIdxArr = [index, idx]
    },
    async fkDptCreate () {
      let me = this
      try {
        if (this.deptList.length > 0) return false
        let { data } = await this.apiStreamPost('/proxy/common/get', { url: 'setting/dpt/queryCombo' })
        if (data.returnCode === 0) {
          this.deptList = data.list
        } else {
          this.msgShow(this, data.errMsg)
        }
      } catch (e) {
        console.error(e)
        this.msgShow(this)
      }
    },
  }
}
</script>
<style lang="stylus", scoped>
.search-box
  border 1px dashed #ddd
</style>
