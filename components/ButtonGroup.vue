<template lang="pug">
  el-button-group
    template(v-for="(btn,idx) in btns")
      el-button(:type="getBtnClass(btn, idx)", size="small", @click="btnGroupClick(btn.type)") {{btn.lbl}}
</template>

<script>
  export default {
    props: {
      btns: {
        type: Array,
        required: true
      },
      rIdx: {
        type: Number,
        default: 0
      }
    },
    methods: {
      btnGroupClick (type) {
        this.$emit('groupBtnClick', type)
      },
      getBtnClass (btn, idx) {
        if (btn.class) {
          return btn.class
        } else {
          if (idx === 0)
            return 'primary'
          else if (idx === 1)
            return 'success'
          else if (idx === 2)
            return 'danger'
          else
            return 'default'
        }
      }
    }
  }
</script>

<style lang="stylus", scoped>

</style>
