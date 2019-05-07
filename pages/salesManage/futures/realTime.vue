<template lang="pug"></template>
<script>
import echarts from 'echarts'
import { setInterval } from 'timers'
// let echarts = require('echarts/lib/echarts')
// // 引入柱状图组件
// require('echarts/lib/chart/candlestick')
// // 引入提示框和title组件
// require('echarts/lib/component/tooltip')
// require('echarts/lib/component/title')
// require('echarts/lib/component/Legend')
// require('echarts/lib/component/axis')
// require('echarts/lib/component/axisPointer')
// require('echarts/lib/component/brush')
// require('echarts/lib/component/calendar')
// require('echarts/lib/component/dataZoom')
// require('echarts/lib/component/geo')
// require('echarts/lib/component/helper')
// require('echarts/lib/component/timeline')
// require('echarts/lib/component/toolbox')
// require('echarts/lib/component/visualMap')
// require('echarts/lib/component/markArea')
// require('echarts/lib/component/markLine')
//require('echarts/lib/component/markPoint')

export default {
  data () {
    return {
      newDate: [],
      myChart: '',
      option: {
        backgroundColor: '#21202D',
        legend: {
          data: [],
          inactiveColor: '#666',
          textStyle: {
            color: '#fff'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            animation: false,
            type: 'cross',
            lineStyle: {
              color: '#376df4',
              width: 2,
              opacity: 1
            }
          }
        },
        xAxis: {
          type: 'category',
          data: [],
          axisLine: { lineStyle: { color: '#8392A5' } }
        },
        yAxis: {
          scale: true,
          axisLine: { lineStyle: { color: '#8392A5' } },
          splitLine: { show: false }
        },
        grid: {
          show: false,
          top: 40,
          bottom: 40,
          x: '7%', 
          y: '5%', 
          // width: '80%', 
          // height: '80%'
        },
        dataZoom: [{
          textStyle: {
            color: '#8392A5'
          },
          handleIcon: 'M10.7',
          handleSize: '100%',
          dataBackground: {
            areaStyle: {
              color: '#8392A5'
            },
            lineStyle: {
              opacity: 0.9,
              color: '#8392A5'
            }
          },
          handleStyle: {
            color: '#fff',
            shadowBlur: 3,
            shadowColor: 'rgba(0, 0, 0, 0.9)',
            shadowOffsetX: 2,
            shadowOffsetY: 2
          }
        }, {
          type: 'inside'
        }],
        animation: false,
        series: []
      },
      params: []
    }
  },
  props: {
    idStr: {
      type: String,
      default: ''
    },
    legendData: {
      type: Array,
      require: true
    }
  },
  mounted () {    
    let me = this
    this.option.legend.data = this.legendData
    let seriesObj = {
      name: me.legendData[0].name,
      type: 'line',
      data: [],
      smooth: true,  
      showSymbol: false,     
      lineStyle: {normal: {
        width: 1
      }}
    }
    me.option.series.push(seriesObj)
    me.myChart = echarts.init(document.getElementById(me.idStr))
    me.myChart.setOption(me.option, true)
    me.realTimeData()
    setInterval(() => {
      me.realTimeData()
    }, 60000)
  },
  methods: {
    async realTimeData () {
      try {
        let { data } = await this.apiStreamPost('/proxy/common/post', {url: 'salesManage/sinaFutures', params: {type: this.legendData[0].code}})              
        let list = data.list
        let resData = []
        let option = this.myChart.getOption()
        for (let i=0; i<data.total; i++) {          
          let timeArr = list[i]['datetime'].split('')
          let dateTime = timeArr[0] + timeArr[1] + ':' + timeArr[2] + timeArr[3] + ':' + timeArr[4] + timeArr[5]
          this.newDate.push(dateTime)
          resData.push(list[i]['latestPrice'])
        }
        option.series[0].data = resData
        // K线图
        // if (list.length > 1) {
        //   let prev = option.series[1].data[option.series[1].data.length - 1]
        //   option.series[0].data.push([prev, list[1][8], list[1][4], list[1][3]]) 
        // }
        option.xAxis[0].data = this.newDate
        this.myChart.setOption(option)
      } catch (e) {
        console.error(e)
        this.msgShow(this)
      }
    },
    calculateMA (dayCount, data) {
      var result = [];
      for (var i = 0, len = data.length; i < len; i++) {
        if (i < dayCount) {
            result.push('-');
            continue;
        }
        var sum = 0;
        for (var j = 0; j < dayCount; j++) {
            sum += data[i - j][1];
        }
        result.push(sum / dayCount);
      }
      return result;
    }
  }
}
</script>