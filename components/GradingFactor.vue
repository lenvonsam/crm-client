<template lang="pug">
.bg-white.p-10
  //- span {{title}}
  .row.bg-white.p-50.flex-center.mt-5
    .col.flex-420
      .mb-15.mt-15(v-for="(itm, idx) in snapData")
        el-tag.mr-10 {{itm.equationName}}
        el-tag.mr-10 =
        el-tag.mr-10 {{itm.name}}
        el-tag.mr-10 ×
        el-input.input-border-radius(value="0", type="number", size="small", clearable, v-model="itm.coefficient")
    .col(v-if="currentAuth.hasUpdate == 1")
      el-button(label="保存", size="small", @click="save") 保存
      el-button(label="重置", size="small", @click="init") 重置 
</template>

<script>
  export default {
    data () {
      return {
        value: '0',
        objectParams: {
          grades: [],
          parentId: '',
          type: '2'
        },
        snapData: []
      }
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
      currentAuth: {
        type: Object,
        require: true
      }
    },
    mounted () {
      this.init()
    },
    methods: {
      save () {
        this.objectParams.grades = []
        this.snapData.map(itm => {
          let str = itm.id + '|' + itm.name + '|' + itm.coefficient
          this.objectParams.grades.push(str)
        })       
        this.cb(this.objectParams)
      },
      init () {
        this.snapData = JSON.parse(JSON.stringify(this.loadDataVal))
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
