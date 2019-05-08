<template lang="pug">
  .content
    breadcrumb(:breadItems="breadItems")
    .mt-5
      el-tabs(type="border-card", v-model="tabIdx", @tab-click="handleClick")
        el-tab-pane(:label="item.label", v-for="item in tabs", :key="item.id", :name="item.id")
          real-time(:idStr="item.id", :legendData="item.legendData", :id="item.id", :style="{width: '100%', height: '800px'}", v-if="tabIdx == item.id")
          //- .mt-5
          //-   basic-table(:tableValue="tableValue", :currentPage="currentPage", :pageSize="pageSize", :total="totalCount", @chooseData="selectData", @pageChange="tableChange", :loading="loading", ref="table", @tableRowEdit="rowEdit", @tableRowDel="rowDel")
</template>
<script>
import breadcrumb from '@/components/Breadcrumb.vue'
import realTime from '@/pages/salesManage/futures/realTime'
import basicTable from '@/components/BasicTable.vue'
export default {
  layout: 'main',
  data () {
    return {
      breadItems: ['期货管理'],
      tabIdx: 'myCharts0',
      tabs: [{
          id: 'myCharts0', 
          label: '螺纹钢',
          legendData: [
            {name: '螺纹钢连续', code: 0},
            // {name: '螺纹钢1910', code: 'RB1910'},
            // {name: '螺纹钢2001', code: 'RB2001'},
            // {name: '螺纹钢1905', code: 'RB1905'},
          ]
        },{
          id: 'myCharts1', 
          label: '热卷', 
          legendData:[
            {name: '热卷连续', code: 1}
          ]
        },{
          id: 'myCharts2', 
          label: '铁矿', 
          legendData:[
            {name: '铁矿连续', code: 2}, 
            // {name: '铁矿石1909', code: 'I1909'}, 
            // {name:'铁矿石2001', code: 'I2001'},
            // {name: '铁矿石1907', code: 'I1907'},
            // {name: '铁矿石1906', code: 'I1906'}
          ]
        },{
         id: 'myCharts3', 
         label: '焦炭', 
         legendData:[
           {name: '焦炭连续', code: 3}
         ]
        }
      ],
      tableValue: {
        tableData: [],
          hasCbx: true,
          rowClassName: true,
          tableHead: [{
            lbl: '名称',
            prop: 'name',
            width: 100
          }]
      }
    }
  },
  components: {
    realTime,
    basicTable,
    breadcrumb
  },
  mounted () {},
  methods: {
    handleClick(tab, event) {
      this.tabIdx = tab.name
    }
  }
}
</script>

