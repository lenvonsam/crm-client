<template lang="pug">
el-select(v-model="usersChoosed", :loading="dataLoading",:multiple="multiple", filterable, remote, placeholder="请输入昵称", :remote-method="loadAllWxUsers", default-first-option, @change="userChange", :size="size")
  el-option(v-for="(item,idx) in users", :key="idx", :label="item.label", :value="item.value")
</template>

<script>
export default {
  props: {
    value: {
      type: null,
      default: false
    },
    multiple: {
      type: Boolean,
      default: true
    },
    size: {
      type: String,
      default: 'medium'
    },
    defaultValue: {
      type: null,
      default: false
    }
  },
  data () {
    return {
      users: [],
      usersChoosed: null,
      usersValues: [],
      usersInfo: [],
      dataLoading: true
    }
  },
  beforeMount () {
    console.log('select user:>>', this.value)
    this.loadAllWxUsers()
  },
  watch: {
    value: {
      handler (newVal, oldVal) {
        console.log('wx user newval:>>', newVal)
        console.log('default values:>>', this.defaultValue)
        // this.usersChoosed = newVal
        if (this.defaultValue.length === newVal.length && this.multiple) {
          this.usersValues = this.defaultValue
          this.defaultValue.map(itm => {
            const idx = this.users.findIndex(item => item.value === itm.id)
            if (idx < 0) {
              this.users.push({
                label: itm.nickname + '-' + itm.appName,
                value: itm.id
              })
              this.usersInfo.push(itm)
            }
          })
          this.usersChoosed = newVal
        }
      },
      deep: true
    }
  },
  methods: {
    userChange (val) {
      console.log('user val:>>', val)
      // this.usersValues = []
      const me = this
      if (this.multiple) {
        console.log(this.usersInfo)
        val.map(itm => {
          const idx = me.usersInfo.findIndex(item => item.id === itm)
          const valIdx = me.usersValues.findIndex(valItem => valItem.id === itm)
          if (idx >= 0 && valIdx < 0) {
            // me.usersValues.push(JSON.stringify(me.usersInfo[idx]))
            me.usersValues.push(me.usersInfo[idx])
          }
        })
        if (me.usersValues.length !== val.length) {
          const arr = []
          me.usersValues.map(itm => {
            const idx = val.findIndex(id => id === itm.id)
            if (idx >= 0) {
              arr.push(itm)
            }
          })
          me.usersValues = arr
        }
        // debugger
        Object.assign(me.usersInfo, me.usersValues)
      } else {
        const idx = me.usersInfo.findIndex(itm => itm.id === val)
        me.usersValues.push(me.usersInfo[idx])
      }
      console.log('user values:>>', this.usersValues)
      this.$emit('change', this.usersValues)
      this.$emit('input', val)
    },
    async loadAllWxUsers (query) {
      if (query !== '') {
        try {
          this.dataLoading = true
          let { data } = await this.apiStreamPost('/proxy/scp/post', { url: 'wechat/wxUser/list', params: { 'nickname': query } })
          console.log(data)
          this.dataLoading = false
          if (data.return_code === 0) {
            this.users = []
            this.usersInfo = data.list
            data.list.map(itm => {
              this.users.push({
                label: itm.nickname + '-' + itm.appName,
                value: itm.id
              })
            })
            console.log(this.users)
          } else {
            this.users = []
          }
        } catch (e) {
          this.dataLoading = false
          console.error(e.message)
        }
      }
    }
  }
}
</script>

