<template lang="pug">
.content
  update-form(:originObj="obj")
</template>

<script>
import updateForm from '@/components/UpdateForm.vue'
export default {
  layout: 'main',
  components: {
    updateForm
  },
  data () {
    return {
      obj: {}
    }
  },
  methods: {
    
  },
  mounted() {     
    this.obj.id = this.$route.query.id
    this.loadClientEvalData()
  },
  methods:{
    async loadClientEvalData () {
      let { data } = await this.apiStreamPost('/proxy/common/get', { url: 'customerManage/evaluation/'+this.$route.query.id })
      if (data.returnCode === 0) {
        //console.log('根据id获得客户评估详情------->' +JSON.stringify(data))  
        this.obj = data
      }
    },
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