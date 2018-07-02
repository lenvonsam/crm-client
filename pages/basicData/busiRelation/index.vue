<template lang="pug">
  .content
    breadcrumb(:breadItems="breadItems")
    .pt-15
      button-group(:btns="btnGroups", v-on:groupBtnClick="groupBtnClick")
    basic-code-search.mt-20(:searchFormItems="searchFormItems")
    .mt-15
      basic-table(:tableValue="tableValue")
    basic-code-prompt(:prompt="prompt", v-if="promptShow", :cb='promptBtn')
</template>

<script>
  import breadcrumb from '@/components/Breadcrumb.vue'
  import basicTable from '@/components/BasicTable.vue'
  import basicCodeSearch from '@/components/BasicCodeSearch.vue'
  import buttonGroup from '@/components/ButtonGroup.vue'
  import basicCodePrompt from '@/components/BasicCodePrompt.vue'
  export default {
    layout: 'main',
    components: {
      breadcrumb,
      basicTable,
      basicCodeSearch,
      buttonGroup,
      basicCodePrompt
    },
    data () {
      return {
        breadItems: ['基础数据', '业务关系'],
        btnGroups: [{
          lbl: '启用',
          type: 'start'
        }, {
          lbl: '停用',
          type: 'stop'
        }, {
          lbl: '新增所处行业',
          type: 'add'
        }],
        searchFormItems: [
          {label: '关系代码', model: 'id', type: 'text', placeholder: '请输入关系代码', val: ''},
          {label: '关系名称', model: 'name', type: 'text', placeholder: '请输入关系名称', val: ''}
        ],
        tableValue: {
          tableData: [{
            id: 1,
            name: '测试',
            updata_at: '2018-07-02',
            create_at: '2018-07-02',
            status: 1
          }],
          hasCbx: true,
          tableHead: [{
            lbl: '所处行业代码',
            prop: 'id'
          }, {
            lbl: '所处行业',
            prop: 'name'
          }, {
            lbl: '状态',
            prop: 'status'
          }, {
            type: 'action',
            actionBtns: [{
              lbl: '编辑',
              type: 'edit'
            }, {
              lbl: '删除',
              type: 'delete'
            },{
              lbl: '停用',
              type: 'stop'
            }]
          }]
        },
        prompt: {
          title: '新增业务关系',
          items: [{label: '业务关系', model: 'busiRelation', type: 'text', placeholder: '请输入业务关系', val: ''}]
        },
        promptShow: false
      }
    },
    methods: {
      groupBtnClick (type) {
        (type == 'add')? this.promptShow = true : this.promptShow = false
      },
      promptBtn (cb) {
        this.promptShow = false
      }
    }
  }
</script>