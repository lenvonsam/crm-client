<template lang="pug">
  div
    el-upload(:action="fileUploadUrl",list-type="picture-card", :on-preview="handlePictureCardPreview",:before-upload="beforePicUpload",name="upfile", :data="{'action': action}", :on-success="uploadSuccess", :on-remove="handlePictureRemove", multiple, :file-list="picList")
      i.el-icon-plus
      .el-upload__tip(slot="tip") 只能上传jpg/png文件，且不超过2M,图片长宽建议{{picAdvice}}
    el-dialog(:visible.sync="dialogVisible", size="tiny", :append-to-body="isChild")
      img(width="100%", :src="dialogImageUrl")
</template>

<script>
  import { mapState } from 'vuex'
  export default {
    props: {
      value: {
        required: true
      },
      isChild: {
        type: Boolean,
        default: false
      },
      picAdvice: {
        type: String,
        default: '120 * 120'
      },
      action: {
        type: String,
        default: 'uploadimage'
      }
    },
    data () {
      return {
        dialogImageUrl: '',
        dialogVisible: false,
        picList: []
      }
    },
    computed: {
      ...mapState({
        fileUploadUrl: state => state.fileUploadUrl
      })
    },
    beforeMount () {
      console.log('beforeMount>>>' + this.value)
      if (this.value) {
        let arr = newVal.split(',')
        this.dialogImageUrl = arr[0]
        const me = this
        let tempList = []
        for (let k = 0; k < arr.length; k++) {
          tempList.push({name: k + '.jpg', url: arr[k], response: {url: arr[k]}})
        }
        console.log('tempList:>>')
        console.log(tempList)
        me.picList = tempList
      }
    },
    watch: {
      value (newVal, oldVal) {
        console.log(newVal)
        if (oldVal === '') {
          let arr = newVal.split(',')
          this.dialogImageUrl = arr[0]
          const me = this
          let tempList = []
          for (let k = 0; k < arr.length; k++) {
            tempList.push({name: k + '.jpg', url: arr[k], response: {url: arr[k]}})
          }
          console.log('tempList:>>')
          console.log(tempList)
          me.picList = tempList
        }
      }
    },
    methods: {
      handlePictureCardPreview (file) {
        console.log('preview url')
        console.log(file)
        this.dialogImageUrl = file.url
        this.dialogVisible = true
      },
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
        console.log(file)
        console.log(fileList)
        this.$emit('input', fileList.map(file => file.response.url).join(','))
      },
      handlePictureRemove (file, fileList) {
        this.$emit('input', fileList.map(file => file.response.url).join(','))
      }
    }
  }
</script>

<style lang="stylus", scoped>

</style>
