<template lang="pug">
.content
  .row.flex-center.bg-f9.pb-10.pt-10.pl-15.box-header.text-gray
    .col.flex-120.avatar
      img(:src="defaultAvatar")
    .col.pl-30.ft-15
      .row.mb-10
        .col.flex-150 部门： 营销一部
        .col.ml-30 客户总数： 25
      .row.mb-10
        .col.flex-150 职位： 业务员
        .col.ml-30 销量总额： 1000吨
      .row.mb-10
        .col.flex-150 姓名： 王佳浩
        .col.ml-30 销售总额： 13000万
    .col
      span.ft-14 最近登录时间：2018-06-07  08:02:15
  .mt-10.bg-f9.pt-5.pl-10.pb-5
    span.text-gray.ft-13 当月时间进度10%，任务完成情况为12%，您的销售目标完成情况良好，请再接再厉！
  .mt-10.bg-f9.pl-15.pt-15.pb-15.pr-15
    .row
      .col.ft-18 目标完成情况
      .col.ft-14.text-right 查看更多数据统计>
    .row.mt-15
      .col
        .row.flex-center
          .col.flex-120.text-right.pr-5
            label 月份：
          .col
            el-date-picker(v-model="sParams.month", type="month", placeholder="请选择月份", size="small")
      .col
        .row.flex-center
          .col.flex-120.text-right.pr-5
            label 业务部门：
          .col
            el-input.full-width(v-model="sParams.dptName", placeholder="请输入业务部门", size="small")
      .col
        .row.flex-center
          .col.flex-120.text-right.pr-5
            label 业务员：
          .col
            el-input.full-width(v-model="sParams.acctName", placeholder="请输入业务员", size="small")
      .col.ml-25
        el-button(size="small", type="primary", @click="search('submit')") 查询
        el-button(size="small", @click="search('reset')") 重置
    .row.mt-35
      .col
        .ft-14.mb-15 线上任务完成情况 
          span.text-red.pl-5 完成率： 10%
        //- pie-chart(:data="pieVal.pieData", :options="pieVal.pieOptions", ref="pieAll")
      .col
        .ft-14.mb-15 线上任务完成情况 
          span.text-red.pl-5 完成率： 10%
        //- pie-chart(:data="pieVal.pieData", :options="pieVal.pieOptions", ref="pieAll")
</template>

<script>
  import { mapState } from 'vuex'
  import pieChart from '@/components/PieChart.js'
  export default {
    layout: 'main',
    data () {
      return {
        avatar: '',
        sParams:{
          month: '',
          dptName: '',
          acctName: ''
        },
        pieVal: {
          pieData: {
            datasets: [{
              data: ['150', '200'],
              backgroundColor: ['#5b9bd5', '#97b9e0']
            }],
            labels: ['已完成','未完成']
          },
          pieOptions: {
            responsive: false,
            title:{
              display: false,
              position: 'top',
              fontSize: 14,
              text:'线上任务完成情况'
            },
            legend: {
              position: 'bottom',
              labels: {
                boxWidth: 10
              }
            }
          }
        }
      }
    },
    components: {
      pieChart
    },
    computed: {
      ...mapState({
        defaultAvatar: state => state.defaultAvatar
      })
    },
    mounted () {
    },
    methods: {
      search (flg) {}
    }
  }
</script>
<style lang="stylus", scoped>
  .avatar{
    width: 120px;
    height: 120px;
    border-radius: 100%;
    overflow: hidden;
    border: 4px #fff solid;
  }
  .avatar img{
    width: 100%;
  }
  .box-header{
    border-radius: 10px;
  }
</style>