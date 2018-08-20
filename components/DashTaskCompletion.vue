<template lang="pug">
div
  .row.mt-15
    basic-table.full-width(:tableValue="taskTableValue_1", :loading="loading")
  .row.mt-15
    basic-table.full-width(:tableValue="taskTableValue_2", :loading="loading")
  .row.mt-15
    basic-table.full-width(:tableValue="taskTableValue_3", :loading="loading")
</template>
<script>
  import basicTable from '@/components/BasicTable.vue'
  export default {
    layout: 'main',
    components: {
      basicTable
    },
    props: {
      taskData: {
        type: Array,
        default: null
      }
    },
    data () {
      return {
        taskTableValue_1: {
          tableData: [],
          hasCbx: false,
          rowClassName: false,
          edit: false,
          page: true,
          tableHead: [{
            lbl: '类别',
            prop: 'type',
            align: 'center'
          }, {
            lbl: '销量（吨）',
            prop: 'salesVolume',
            align: 'center'
          }, {
            lbl: '任务量（吨）',
            prop: 'taskVolume',
            align: 'center'
          }, {
            lbl: '完成率',
            prop: 'completionRate',
            align: 'center'
          }]
        },
        taskTableValue_2: {
          tableData: [],
          hasCbx: false,
          rowClassName: false,
          edit: false,
          page: true,
          tableHead: [{
            lbl: '类别',
            prop: 'type',
            align: 'center'
          }, {
            lbl: '实际高卖（元）',
            prop: 'actuallyHighSelling',
            align: 'center'
          }, {
            lbl: '高卖任务（元）',
            prop: 'highSalesTask',
            align: 'center'
          }, {
            lbl: '完成率',
            prop: 'completionRate',
            align: 'center'
          }]
        },
        taskTableValue_3: {
          tableData: [],
          hasCbx: false,
          rowClassName: false,
          edit: false,
          page: true,
          tableHead: [{
            lbl: '类别',
            prop: 'type',
            align: 'center'
          }, {
            lbl: '数量（个）',
            prop: 'num',
            align: 'center'
          }, {
            lbl: '任务量（个）',
            prop: 'taskVolume',
            align: 'center'
          }, {
            lbl: '完成率',
            prop: 'completionRate',
            align: 'center'
          }]
        },
        loading: false,
        lend: 2
      }
    },
    mounted () {
      this.taskTableValue_1.tableData = [{
        type: '全部', 
        salesVolume: this.taskData[0], 
        taskVolume: this.taskData[7], 
        completionRate: (this.taskData[7]) ? ((this.taskData[0]/this.taskData[7])*100).toFixed(this.lend) + '%' : ''
      }, {
        type: '线上', 
        salesVolume: this.taskData[1], 
        taskVolume: this.taskData[8], 
        completionRate: (this.taskData[8]) ? ((this.taskData[1]/this.taskData[8])*100).toFixed(this.lend) + '%' : ''
      }, {
        type: '线下', 
        salesVolume: this.taskData[2], 
        taskVolume: this.taskData[9], 
        completionRate: this.taskData[9] ? ((this.taskData[2]/this.taskData[9])*100).toFixed(this.lend) + '%' : ''
      }, {
        type: '板材', 
        salesVolume: this.taskData[3], 
        taskVolume: this.taskData[10], 
        completionRate: (this.taskData[10]) ? ((this.taskData[3]/this.taskData[10])*100).toFixed(this.lend) + '%' : ''
      }]
      this.taskTableValue_2.tableData = [{
        type: '高卖', 
        actuallyHighSelling: this.taskData[4], 
        highSalesTask: this.taskData[11], 
        completionRate: (this.taskData[11]) ? ((this.taskData[4]/this.taskData[11])*100).toFixed(this.lend) + '%' : ''
      }]
      this.taskTableValue_3.tableData = [{
        type: '新客户', 
        num: this.taskData[5], 
        taskVolume: this.taskData[12], 
        completionRate: (this.taskData[12]) ? ((this.taskData[5]/this.taskData[12])*100).toFixed(this.lend) + '%' : ''
      }, {
        type: '二次开发', 
        num: this.taskData[6], 
        taskVolume: this.taskData[13], 
        completionRate: (this.taskData[13]) ? ((this.taskData[6]/this.taskData[13])*100).toFixed(this.lend) + '%' : ''
      }]
    }
  }
</script>
<style>
  .el-tag-btn{
    width: 80px;
    text-align: center;
    cursor: pointer;
  }
</style>