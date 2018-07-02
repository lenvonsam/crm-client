<template lang="pug">
.content
  breadcrumb(:breadItems="breadItems")
  el-form.mt-25.border.padding.pt-25(style="max-width: 1200px")
    template(v-for="fm in formItems")
      el-form-item(ref="acctForm")
        .row.flex-center
          .col.flex-100.text-center
            label(v-if="fm[0].required") *
            label {{fm[0].lbl}}
          .col.pr-15
            template(v-if="fm[0].type === 'select'")
              el-select.max-300(v-model="obj[fm[0].key]", style="width: 100%", size="mini")
                el-option(v-for="(opt,idx) in getPageObj(fm[0].selectKey)", :key="idx", :label="opt.label", :value="opt.value")
            template(v-else-if="fm[0].type === 'radio'")
              el-radio(v-for="(r,idx) in fm[0].radios", v-model="obj[fm[0].key]", :label="r.val", :key="idx") {{r.lbl}}
            template(v-else-if="fm[0].type === 'date'")
              el-date-picker.max-300(v-model="obj[fm[0].key]", type="date", size="small", style="width: 100%")
            template(v-else)
              el-input.max-300(size="small", v-model="obj[fm[0].key]")
          template(v-if="fm.length == 2")
            .col.flex-100.text-center
              label {{fm[1].lbl}}
            .col.pr-15
              template(v-if="fm[1].type === 'select'")
                el-select.max-300(v-model="obj[fm[1].key]", style="width: 100%")
                  el-option(v-for="(opt,idx) in getPageObj(fm[1].selectKey)", :key="idx", :label="opt.label", :value="opt.value")
              template(v-else-if="fm[1].type === 'radio'")
                el-radio(v-for="(r,idx) in fm[1].radios", v-model="obj[fm[1].key]", :label="r.val", :key="idx") {{r.lbl}}
              template(v-else-if="fm[1].type === 'date'")
                el-date-picker.max-300(v-model="obj[fm[1].key]", type="date", size="small", style="width: 100%")
              template(v-else)
                el-input.max-300(size="small", v-model="obj[fm[1].key]")
    el-form-item.text-center
      el-button(type="primary", size="medium") 保存
      el-button.ml-60(size="medium") 取消

</template>

<script>
  import breadcrumb from '@/components/Breadcrumb.vue'
  import { mapState } from 'vuex'
  export default {
    layout: 'main',
    components: {
      breadcrumb
    },
    data () {
      return {
        breadItems: ['系统设置', '账号管理'],
        obj: {
          loginAcct: '',
          name: '',
          org: '',
          dpt: '',
          phone: '',
          dataAuth: '',
          status: 1,
          role: '',
          position: '',
          sex: 1,
          national: '',
          edu: '',
          birthday: '',
          inTime: ''
        },
        formItems: [
          [{lbl: '登录账号', key: 'loginAcct', required: true}, {lbl: '姓名', key: 'name', required: true}],
          [{lbl: '手机号', key: 'phone', required: true}, {lbl: '数据权限等级', key: 'dataAuth', type: 'select', selectKey: 'dataAuthOpts'}],
          [{lbl: '职位', key: 'position'}, {lbl: '性别', key: 'sex', type: 'radio', radios: [{lbl: '男', val: 1}, {lbl: '女', val: 2}]}],
          [{lbl: '生日', key: 'birthday', type: 'date'}, {lbl: '入职时间', type: 'date', key: 'inTime'}]
        ]
      }
    },
    beforeMount () {
      console.log(this.$route)
      if (this.$route.query.type && this.$route.query.type === 'new') {
        this.breadItems.push('新增账号')
      } else {
        this.breadItems.push('编辑账号')
      }
    },
    computed: {
      ...mapState({
        dataAuthOpts: state => state.dataAuthOpts
      })
    },
    methods: {
      getPageObj (key) {
        return this[key]
      }
    }
  }
</script>
