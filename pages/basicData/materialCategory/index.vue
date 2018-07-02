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
  import basicCodePrompt from '@/components/basicCodePrompt.vue'
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
        breadItems: ['基础数据', '物资品类'],
        btnGroups: [{
          lbl: '启用',
          type: 'start'
        }, {
          lbl: '停用',
          type: 'stop'
        }, {
          lbl: '新增物资品类',
          type: 'add'
        }],
        searchFormItems: [
          {label: '品类代码', model: 'id', type: 'text', placeholder: '请输入品类代码', val: ''},
          {label: '品类名称', model: 'name', type: 'text', placeholder: '请输入品类名称', val: ''}
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
            lbl: '物资品类代码',
            prop: 'id'
          }, {
            lbl: '物资品类名称',
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
          title: '新增物资品类',
          items: [{label: '物资品类', model: 'busiRelation', type: 'text', placeholder: '请输入物资品类', val: ''}]
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