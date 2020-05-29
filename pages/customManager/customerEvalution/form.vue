<template lang="pug">
.content(v-loading="loadingF")
  update-form(:originObj="obj", v-if="load")
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
      obj: {},
      load: false,
      loadingF: true
    }
  },
  methods: {

  },
  mounted () {
    this.obj.id = this.$route.query.id
    this.loadClientEvalData()
  },
  methods: {
    async loadClientEvalData () {
      try {
        let { data } = await this.apiStreamPost('/proxy/common/get', { url: 'customerManage/evaluation/' + this.$route.query.id })
        if (data.returnCode === 0) {
          this.load = true
          this.loadingF = false
          this.obj = data
        } else {
          this.load = true
          this.loadingF = false
          this.msgShow(this, data.errMsg)
        }
      } catch (e) {
        this.msgShow(this, e.message || '网络异常')
      }
    }
  }
}
</script>
<style lang="styl", scoped>
</style>