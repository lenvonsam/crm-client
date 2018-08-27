<template lang="pug">
div
  el-table.mt-15(border, :data="salesTableValue_1", :row-class-name="rowClassName")
    el-table-column(:label="tableHead[0].lbl", prop="type", align="center", :width="table_width_1")
    el-table-column(:label="tableHead[1].lbl", prop="data_1", align="center")
      template(slot-scope="scope")
        .relative
          span {{scope.row.data_1}}
          span.text-blue.absolute(v-if="scope.row.data_1Rate > -1") 占比： {{scope.row.data_1Rate}}%
    el-table-column(:label="tableHead[2].lbl", prop="data_2", align="center")
      template(slot-scope="scope")
        .relative
          span {{scope.row.data_2}}
          span.absolute(v-if="scope.row.data_2Rate > -1", :class="scope.row.data_2Rate < scope.row.data_1Rate ? 'text-green' : scope.row.data_2Rate > scope.row.data_1Rate ? 'text-red' : 'text-blue'") 占比： {{scope.row.data_2Rate}}%
    el-table-column(:label="tableHead[3].lbl", prop="rate", align="center", :width="table_width_4")
  //- 销售额
  el-table.mt-15(border, :show-header="showHeader", :data="salesTableValue_2", :row-class-name="rowClassName")
    el-table-column(prop="type", align="center", :width="table_width_1")
    el-table-column(prop="data_1", align="center")
      template(slot-scope="scope")
        .relative
          span {{scope.row.data_1}}
          span.text-blue.absolute(v-if="scope.row.data_1Rate > -1") 占比： {{scope.row.data_1Rate}}%
    el-table-column(prop="data_2", align="center")
      template(slot-scope="scope")
        .relative
          span {{scope.row.data_2}}
          span.absolute(v-if="scope.row.data_2Rate > -1", :class="scope.row.data_2Rate < scope.row.data_1Rate ? 'text-green' : scope.row.data_2Rate > scope.row.data_1Rate ? 'text-red' : 'text-blue'") 占比： {{scope.row.data_2Rate}}%
    el-table-column(prop="rate", align="center", :width="table_width_4")
  //- 型云订单
  el-table.mt-15(border, :show-header="showHeader", :data="salesTableValue_3", :row-class-name="rowClassName")
    el-table-column(prop="type", align="center", :width="table_width_1")
    el-table-column(prop="data_1", align="center")
      template(slot-scope="scope")
        .relative
          span {{scope.row.data_1}}
          span.text-blue.absolute(v-if="scope.row.data_1Rate > -1") 占比： {{scope.row.data_1Rate}}%
    el-table-column(prop="data_2", align="center")
      template(slot-scope="scope")
        .relative
          span {{scope.row.data_2}}
          span.absolute(v-if="scope.row.data_2Rate > -1", :class="scope.row.data_2Rate < scope.row.data_1Rate ? 'text-green' : scope.row.data_2Rate > scope.row.data_1Rate ? 'text-red' : 'text-blue'") 占比： {{scope.row.data_2Rate}}%
    el-table-column(prop="rate", align="center", :width="table_width_4")
  //- 新增客户
  el-table.mt-15(border, :show-header="showHeader", :data="salesTableValue_4", :row-class-name="rowClassName")
    el-table-column(prop="type", align="center", :width="table_width_1")
    el-table-column(prop="data_1", align="center")
      template(slot-scope="scope")
        .relative
          span {{scope.row.data_1}}
          span.text-blue.absolute(v-if="scope.row.data_1Rate > -1") 占比： {{scope.row.data_1Rate}}%
    el-table-column(prop="data_2", align="center")
      template(slot-scope="scope")
        .relative
          span {{scope.row.data_2}}
          span.absolute(v-if="scope.row.data_2Rate > -1", :class="scope.row.data_2Rate < scope.row.data_1Rate ? 'text-green' : scope.row.data_2Rate > scope.row.data_1Rate ? 'text-red' : 'text-blue'") 占比： {{scope.row.data_2Rate}}%
    el-table-column(prop="rate", align="center", :width="table_width_4")
</template>
<script>
  export default {
    layout: 'main',
    props: {
      taskData: {
        type: Array,
        default: null
      },
      dateType: {
        type: String,
        default: '0'
      }
    },
    data () {
      return {
        salesTableValue_1: [
          {type:'销量（吨）',data_1:'80', data_2: '100', rate: '25%'},
          {type:'线上销量（吨）',data_1:'40', data_2: '60', rate: '50%'},
          {type:'线下销量（吨）',data_1:'40', data_2: '40', rate: '0%'}
        ],
        salesTableValue_2: [
          {type:'销售额（元）',data_1:'40000', data_2: '50000', rate: '25%'},
          {type:'线上销售额（元）',data_1:'20000', data_2: '30000', rate: '50%'},
          {type:'线下销售额（元）',data_1:'20000', data_2: '20000', rate: '0%'}
        ],
        salesTableValue_3: [
          {type:'型云订单总数',data_1:'80', data_2: '100', rate: '25%'},
          {type:'PC订单',data_1:'65', data_2: '80', rate: '23.08%'},
          {type:'移动端订单',data_1:'15', data_2: '20', rate: '66.67%'},
          {type:'违约订单',data_1:'10', data_2: '15', rate: '50%'},
          {type:'进行中订单',data_1:'10', data_2: '15', rate: '50%'}
        ],
        salesTableValue_4: [
          {type:'新增客户',data_1:'5', data_2: '5', rate: '0%'},
          {type:'新客户',data_1:'1', data_2: '2', rate: '50%'},
          {type:'二次开发',data_1:'4', data_2: '3', rate: '-25%'},
          {type:'型云新审核',data_1:'0', data_2: '1', rate: '--'}
        ],
        tableHead_1: [{lbl: '类别', prop: 'type'}, {lbl: '前日', prop: 'data_1'}, {lbl: '昨日', prop: 'data_2'}, {lbl: '日均同比增长', prop: 'rate'}],
        tableHead_2: [{lbl: '类别', prop: 'type'}, {lbl: '上周', prop: 'data_1'}, {lbl: '本周', prop: 'data_2'}, {lbl: '日均同比增长', prop: 'rate'}],
        tableHead_3: [{lbl: '类别', prop: 'type'}, {lbl: '上月', prop: 'data_1'}, {lbl: '本月', prop: 'data_2'}, {lbl: '日均同比增长', prop: 'rate'}],
        tableHead_4: [{lbl: '类别', prop: 'type'}, {lbl: '上季度', prop: 'data_1'}, {lbl: '本季度', prop: 'data_2'}, {lbl: '日均同比增长', prop: 'rate'}],
        tableHead_5: [{lbl: '类别', prop: 'type'}, {lbl: '上年度', prop: 'data_1'}, {lbl: '本年度', prop: 'data_2'}, {lbl: '日均同比增长', prop: 'rate'}],
        tableHead: [{lbl: '类别', prop: 'type'}, {lbl: '前日', prop: 'data_1'}, {lbl: '昨日', prop: 'data_2'}, {lbl: '日均同比增长', prop: 'rate'}],
        showHeader: false,
        tagHave: 0,
        table_width_1: '200px',
        table_width_4: '150px'
      }
    },
    mounted () {
      this.tableHead = (this.dateType == '0') ? this.tableHead_1 : (this.dateType == '1') ? this.tableHead_2 : (this.dateType == '2') ? this.tableHead_3 : (this.dateType == '3') ? this.tableHead_4 : this.tableHead_5
      let dataArr = this.taskData
      this.salesTableValue_1 = [
          {type:'销量（吨）', data_1: dataArr[0], data_2: dataArr[15], rate: ''},
          {type:'线上销量（吨）', data_1: dataArr[1], data_2: dataArr[16], rate: ''},
          {type:'线下销量（吨）', data_1: dataArr[2], data_2: dataArr[17], rate: ''}
        ]
      this.salesTableValue_2 = [
        {type:'销售额（元）',data_1: dataArr[3], data_2: dataArr[18], rate: ''},
        {type:'线上销售额（元）',data_1: dataArr[4], data_2: dataArr[19], rate: ''},
        {type:'线下销售额（元）',data_1: dataArr[5], data_2: dataArr[20], rate: ''}
      ]
     this.salesTableValue_3 = [
        {type:'型云订单总数',data_1: dataArr[6], data_2: dataArr[21], rate: ''},
        {type:'PC订单',data_1: dataArr[7], data_2: dataArr[22], rate: ''},
        {type:'移动端订单',data_1: dataArr[8], data_2: dataArr[23], rate: ''},
        {type:'违约订单',data_1: dataArr[9], data_2: dataArr[24], rate: ''},
        {type:'进行中订单',data_1: dataArr[10], data_2: dataArr[25], rate: ''}
      ]
      this.salesTableValue_4 = [
        {type:'新增客户',data_1: dataArr[11], data_2: dataArr[26], rate: ''},
        {type:'新客户',data_1: dataArr[12], data_2: dataArr[27], rate: ''},
        {type:'二次开发',data_1: dataArr[14], data_2: dataArr[29], rate: ''},
        {type:'型云新审核',data_1: dataArr[13], data_2: dataArr[28], rate: ''}
      ]
      this.getRate()
    },
    methods: {
      getRate () {
        for (let n = 1; n < 5; n++) {
          let tableNam = this[`salesTableValue_${n}`]
          let myDate = new Date()
          let numDays = 0
          let prevNumDays = 0
          let year = myDate.getFullYear()
          if (this.dateType == '1') { // 本周时间
            numDays = myDate.getDay() -1
            prevNumDays = 7
          } else if (this.dateType == '2') {// 本月时间 上月时间
            numDays = myDate.getDate() - 1
            prevNumDays = this.getDaysInOneMonth(year, myDate.getMonth())
          } else if (this.dateType == '3') {// 本季度 上季度时间
            let month = myDate.getMonth() + 1
            let quarter = (month <= 3) ? [1, 2, 3] : (month <= 6) ? [4, 5, 6] : (month <= 9) ? [7, 8, 9] : [10, 11, 12]
            numDays = this.getDaysQuarter(year, quarter, month) - 1
            prevNumDays = this.getDaysInOneQuarter(year, quarter)
          } else if (this.dateType == '4') {// 本年度 上年度实际
            numDays = this.getDaysYear(year) - 1
            prevNumDays = (this.isLeapYear(year)) ? 366 : 365
          }
          if (this.dateType == '0') { // 今日总量日均同比增长计算
            tableNam[0].rate = (Number(tableNam[0].data_1) == 0) ? '0%' : ((Number(tableNam[0].data_1) - Number(tableNam[0].data_2)) / Number(tableNam[0].data_1) *100).toFixed(2) + '%'
          } else {
            // tableNam[0].rate = (Number(tableNam[0].data_2) == 0) ? '0%' :  ((1-(Number(tableNam[0].data_1) / prevNumDays) / (Number(tableNam[0].data_2) / numDays)) * 100).toFixed(2) + '%'
            const lastAvrg = Number(tableNam[0].data_1) / prevNumDays
              // 本月
            const currtAvrg = Number(tableNam[0].data_2) / numDays
            tableNam[0].rate = (Number(tableNam[0].data_2) == 0) ? '0%' :  (((currtAvrg - lastAvrg) / currtAvrg) * 100).toFixed(2) + '%'
          }
          for (let i=1; i<tableNam.length; i++) {
            tableNam[i].data_1Rate = ((Number(tableNam[i].data_1) / Number(tableNam[0].data_1)) * 100).toFixed(2)
            tableNam[i].data_2Rate = ((Number(tableNam[i].data_2) / Number(tableNam[0].data_2)) *100).toFixed(2)
            if (this.dateType == '0') {
              // 今日
              tableNam[i].rate = (Number(tableNam[i].data_2) == 0) ? '0%' : ((Number(tableNam[i].data_1) - Number(tableNam[i].data_2)) / Number(tableNam[i].data_2) *100).toFixed(2) + '%'
            } else {
              // 非今日
              // 上月
              const lastAvrg = Number(tableNam[i].data_1) / prevNumDays
              // 本月
              const currtAvrg = Number(tableNam[i].data_2) / numDays
              tableNam[i].rate = (Number(tableNam[i].data_2) == 0) ? '0%' :  (((lastAvrg - currtAvrg) / currtAvrg) * 100).toFixed(2) + '%'
            }
          }
        }
      },
      getDaysInOneMonth(year, month){
        let d = new Date(year, month, 0)
        month = parseInt(month, 10)
        return d.getDate()
      },
      getDaysInOneQuarter (year, quarter) {
        let days = 0
        quarter.map(itm => {
          days += this.getDaysInOneMonth(year, itm)
          console.log(itm)
        })
        return days
      },
      getDaysYear (year) {
        let days = 0
        let d = new Date()
        for (let i=0; i < d.getMonth(); i++) {
          days += this.getDaysInOneMonth(year, i)
        }
        days += d.getDate()
        return days
      },
      isLeapYear(year) {
        return (year % 4 == 0) && (year % 100 != 0 || year % 400 == 0)
      },
      getDaysQuarter (year, quarter, month) {
        let days = 0
        let d = new Date()
        quarter.map(itm => {
          if (itm < month) {
            days += this.getDaysInOneMonth(year, itm)
          } else if (itm == month) {
            days += d.getDate()
          }
        })
        return days
      },
      rowClassName (row, rowIndex) {
        if (row.rowIndex == 0) {
          return 'ft-bold'
        }
      },
      tagHandler (idx) {
        this.tagHave = idx
      }
    }
  }
</script>
<style>
  .el-tag-btn{
    width: 80px;
    text-align: center;
    cursor: pointer;
  }
  .relative{
    position: relative;
  }
  .absolute{
    position: absolute;
    right: 15px;
    top: 0px;
    font-size: 12px;
  }
</style>