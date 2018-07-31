<template lang="pug">
div
  img.thumb(:style="{width: width + 'px', height: height + 'px'}", :src="imgUrl", @click="zoomImg")
  el-dialog(title="图片预览", :visible.sync="imgShow", @close="imgShow = false", center, custom-class="zoom-img")
    img(:src="imgUrl")

</template>

<script>
  export default {
    props: {
      width: {
        type: Number,
        default: 100
      },
      height: {
        type: Number,
        default: 100
      },
      enlarge: {
        type: Boolean,
        default: true
      },
      url: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
        imgShow: false,
        imgUrl: ''
      }
    },
    beforeMount () {
      this.$nextTick(() => {
        this.imgUrl = this.url
      })
    },
    watch: {
      url (newVal, oldVal) {
        this.imgUrl = newVal
      }
    },
    methods: {
      zoomImg () {
        if (this.enlarge) {
          this.imgShow = true
        }
      }
    }
  }
</script>

<style lang="stylus", scoped>
.profile-avatar
  img.thumb
    width 100px
    height 100px
    border-radius 50% !important
    border 1px solid #ddd
  &:hover
    cursor pointer
</style>
