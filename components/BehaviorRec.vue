<template lang="pug">
  .content
    el-table(:data="behaviorRecVal.tableData")
      el-table-column(type="expand")
        template(slot-scope="props")
          el-form(label-position="left", inline, class="demo-table-expand")
            el-form-item(v-for="expand in behaviorRecVal.tableExpand", :key="expand.prop", :label="expand.label")
              span {{props.row[expand.prop]}}
      el-table-column(v-for="head in behaviorRecVal.tableHead", :key="head.prop", :label="head.label",  :prop="head.prop")
</template>
<script>
export default {
  // props: {
  //   behaviorRecVal: {
  //     type: null,
  //     default: false
  //   }
  // },
  data () {
    return {
      behaviorRecVal: {
        tableHead: [{label: '事件', prop: 'event'}, {label: '操作时间', prop: 'date'}, {label: '来源', prop: 'source'}],
        tableProps: [{label: '商品ID', prop: 'goodsId'}, {label: '订单来源', prop: 'source'}, {label: '订单号', prop: ''}],
        tableData: [
          {event: '生成订单', 
          date: '2018-06-12 16:58:14', 
          source: '电脑端',
          goodsId: '87800'
        }
        ]
      }
    }
  }
}
</script>