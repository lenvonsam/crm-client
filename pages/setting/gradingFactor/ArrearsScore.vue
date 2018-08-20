<template lang="pug">
.bg-white.p-10
  .row
    //- .col 欠款得分=score[欠款金额]
    //- .col.text-right
    //-   el-button(size="small", type="primary", @click="addAmountOwed") 新增欠款金额区间
    el-button(size="small", type="primary", @click="addAmountOwed") 新增欠款金额区间
  .mt-10
    el-table(border, :data="tableValue.tableData")
      template(v-for="head in tableValue.tableHead")
        el-table-column(:label="head.lbl", :prop="head.prop", :width="head.width? head.width : 'auto'")
          template(slot-scope="scope")
            el-input(v-model="scope.row[head.prop]", v-if="head.prop === 'score'")
            template(v-else-if="head.prop === 'amount'")
              .row.flex-center(v-if="scope.row['max'] !== ''")
                .col.text-right.pr-10 {{scope.row['min']}} < money ≤
                .col 
                  el-input(v-model="scope.row['max']", @change="amountOwedChange(scope)")
              .text-center(v-else) money > {{scope.row['min']}}
            template(v-else-if="scope.$index == (tableValue.tableData.length - 2)")
              el-button(type="text", class="default", @click="delBtn(scope.$index, scope.row)") 删除
  .mt-10.text-center
    el-button(type="primary", size="small", @click="save") 保存
    el-button(size="small", @click="reset") 重置
</template>
<script>
  import basicTable from '@/components/BasicTable.vue'
  export default {
    components: {
      basicTable
    },
    props: {
      cb: {
        type: Function,
        require: true
      },
      loadDataVal: {
        type: Array,
        default: null
      },
      del: {
        type: Function,
        required: true
      }
    },
    data () {
      return {
        tableValue: {
          tableHead: [
            {lbl: '欠款金额（元）', prop: 'amount'},
            {lbl: 'score', prop: 'score'},
            {lbl: '', width:'50px'}],
          page: true,
          hasCbx: false,
          edit: true,
          tableData: []
        },
        loading: false,
        resetData: [],
        objectParams: {
          grades: [],
          parentId: '',
          type: '1'
        }
      }
    },
    mounted () {
      // this.objectParams.parentId = this.loadDataVal[0].parentId
      this.loadDataVal.map(itm => {
        let nameArr = itm.name.split(',')
        let obj = {}
        obj.min = nameArr[0]
        obj.max = nameArr[1] ? nameArr[1] : ''
        obj.score = itm.coefficient
        obj.id = itm.id
        this.tableValue.tableData.push(obj)
      })
      this.resetData = JSON.parse(JSON.stringify(this.tableValue.tableData))

    },
    methods: {
      save () {
        this.objectParams.grades = []
        let num = this.tableValue.tableData.length
        let data = this.tableValue.tableData
        for(let i = 0; i< num; i++){
          let dataStr = ''
          if(data[i].max !== ''){
            dataStr = data[i].min + ',' + data[i].max + '|' + data[i].score + '|' + i
          } else {
            dataStr = data[i].min + '|' + data[i].score + '|' + i
          }
          this.objectParams.grades.push(dataStr)
        }
        this.objectParams.parentId = this.loadDataVal.parentId
        this.cb(this.objectParams)
      },
      reset () {
        this.tableValue.tableData = JSON.parse(JSON.stringify(this.resetData))
      },
      amountOwedChange (scope) {
        let idx = scope.$index
        if (Number(scope.row.min) >= Number(scope.row.max)) {
          this.msgShow(this, '最大值不能小于最小值')
          this.tableValue.tableData[idx].max = Number(this.tableValue.tableData[idx].min) + 1
          return
        }
        this.tableValue.tableData[idx + 1].min = scope.row.max
        // console.log(this.tableValue.tableData[idx + 1].min)
      },
      addAmountOwed () {
        let idx = 0
        if (this.tableValue.tableData.length > 1) {
          idx = this.tableValue.tableData.length - 2
          let object = {
            min:  this.tableValue.tableData[idx].max,
            max:  Number(this.tableValue.tableData[idx].max) + 1,
            score: '0'
          }
          this.tableValue.tableData.splice(idx + 1, 0, object)
        } else {
          idx = this.tableValue.tableData.length - 1
          let object = {
            min:  this.tableValue.tableData[idx].max ? this.tableValue.tableData[idx].max : '0',
            max:  Number(this.tableValue.tableData[idx].max) + 1,
            score: '0'
          }
          this.tableValue.tableData.splice(idx, 0, object)
        }
        
      },
      delBtn (idx, row) {
        this.del(row.id)
      }
    }
  }
</script>

<style lang="stylus", scoped>
  .input-border-radius{
    border-radius: 3px!important;
    width: 100px;
  }
</style>
