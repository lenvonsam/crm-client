<template lang="pug">
.prompt-box.full-width
  .mask.full-width
    .prompt-content.text-center.pb-20
      .prompt-title.border-bottom-line.ft-16 {{prompt.title}}
      el-form.pt-20(ref="form", label-width="100px", label-position="right")
        el-form-item(v-for="item in prompt.items", :key="item.model", :label="item.label")
          el-input.pr-30(:v-model="item.model", v-if="item.type == 'text'", :placeholder="item.placeholder", size="small", :value="item.val")
      el-button(size="small", type="primary", @click="cb('save')") 保存
      el-button(size="small", @click="cb('cancel')") 取消
</template>
<script>
  export default {
    props: {
      prompt: {
        type: Object,
        required: true
      },
      cb: {
        type: Function,
        required: true
      }
    }
  }
</script>
<style lang="stylus", scoped>
  .prompt-box
    position: absolute
    left: 0
    top: 0
    z-index: 999
  .prompt-title
    padding: 20px 0
  .prompt-content
    border-radius: 5px
    width: 370px
    margin: 0 auto
    background: #fff
  .mask
    height: 100vh
    padding-top: 200px
    background: rgba(0,0,0,.3)
</style>
