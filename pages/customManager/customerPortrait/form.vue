<template lang="pug">
.content
  breadcrumb(:breadItems="breadItems")
  .mt-25.border.padding
    custom-form(:originObj="obj")
</template>

<script>
import breadcrumb from '@/components/Breadcrumb.vue'
import customForm from '@/components/CustomForm.vue'
export default {
  layout: 'main',
  components: {
    breadcrumb,
    customForm
  },
  data () {
    return {
      breadItems: ['客户管理', '客户画像', '客户编辑'],
      obj: null
    }
  },
  methods: {
    async queryAcct () {
      try {
        let { data } = await this.apiStreamPost('/proxy/common/get', {url: 'customerManage/customer/' + this.$route.query.id})
        if (data.returnCode === 0) this.obj = data.obj
      } catch (e) {
        console.error(e)
      }
    }
  },
  mounted() {
    this.pageShow(this)
    this.queryAcct()
  }
}
</script>
<style lang="styl", scoped>
  .label-style
    label
      width: 100%!important
  .avatar-uploader
    width: 200px
    margin: 0 auto
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>