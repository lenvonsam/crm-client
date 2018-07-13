<template lang="pug">
  div
    el-upload.crm-simple-upload(:action="fileUploadUrl", :before-upload="beforePicUpload",name="upfile", :data="{'action': action}", :on-success="uploadSuccess")
      slot
</template>

<script>
  import { mapState } from 'vuex'
  export default {
    props: {
      value: {
        required: true
      },
      action: {
        type: String,
        default: 'avatar'
      }
    },
    computed: {
      ...mapState({
        fileUploadUrl: state => state.fileUploadUrl
      })
    },
    methods: {
      beforePicUpload (file) {
        var imgType = file.type === 'image/png' || file.type === 'image/jpeg'
        var imgSize = file.size / 1000000 <= 2
        if (!imgType) {
          this.$message.error('上传图片格式错误!')
        }
        if (!imgSize) {
          this.$message.error('上传图片大不能超过2M!')
        }
        return imgType && imgSize
      },
      uploadSuccess (resp, file, fileList) {
        this.$emit('input', file.response.url)
        this.$message.success('图片上传成功')
      }
    }

  }
</script>

<style style="stylus" scoped>

</style>
