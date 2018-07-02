<template lang="pug">
  .content
    breadcrumb(:breadItems="breadItems")
    .pt-15
      el-button(type="primary", size="small", icon="el-icon-plus", @click="addCustomer") 添加潜在客户
    .pt-15
      el-row
        el-form(ref="form", label-width="120px", label-position="right")
          el-col(:span="18")
            el-row
                el-col(:span="8")
                  el-form-item(label="公司名称")
                    el-input.width-input-250(size="small", clearable)
                el-col(:span="8")
                  el-form-item(label="联系人名称", clearable)
                    el-input.width-input-250(size="small")
                el-col(:span="8")                  
                  el-form-item(label="联系方式")
                    el-input.width-input-250(size="small", clearable)
            el-row              
                el-col(:span="8")    
                  el-form-item(label="添加日期")
                    el-date-picker.width-input-250(size="small", v-model="query.date")
                el-col(:span="8")    
                  el-form-item(label="业务部门")
                    //- el-input.full-width
                    el-autocomplete.width-input-250(size="small", v-model="query.fkDptIdVal", :fetch-suggestions="fkDptSearchAsync", placeholder="请输入业务部门", @select="handleSelect")
                el-col(:span="8")
                  el-form-item(label="业务员")
                    el-autocomplete.width-input-250(size="small", v-model="query.fkAcctIdVal", :fetch-suggestions="fkAcctSearchAsync", placeholder="请输入业务员", @select="handleSelect")
                    //- el-input.full-width
          el-col(:span="4")
            el-button(type="primary", size="small") 查询
            el-button(size="small") 重置
    div
      el-button(type="primary", size="small", icon="iconfont icon-exchange") 转化为正式客户
    .pt-15
      basic-table(:tableValue="tableValue")
</template>

<script>
  import breadcrumb from '@/components/Breadcrumb.vue'
  import basicTable from '@/components/BasicTable.vue'
  export default {
    layout: 'main',
    data() {
      return {
        breadItems: ['客户管理', '潜在客户'],
        /*form: [{label: '公司名称', model: 'compName', type:'text'},{label: '联系人名称', model: 'contactName', type:'text'},
        {label: '联系方式', model: 'contact', type:'text'},{label: '添加日期', model: 'addDate', type:'date'},{label: '业务部门', model: 'fkDpt', type:'text'},{label: '业务员', model: 'fkAcctName', type:'text'}],*/
        tableValue: {
          tableData: [{
            id: 1,
            date: '2018-02-23',
            comp: 'xxxx公司'
          }, {
            id: 2,
            date: '2018-03-10',
            comp: 'yyyy公司'
          }],
          hasCbx: false,
          tableHead: [{
            lbl: '序号',
            prop: 'id',
            sort: true
          }, {
            lbl: '时间',
            prop: 'date',
            type: 'date',
            width: 120
          }, {
            lbl: '公司名称',
            type: 'link',
            prop: 'comp',
            linkUrl: '/customManager/potentialCustom/detail',
            sort: true
          }, {
            type: 'action',
            actionBtns: [{
              lbl: '编辑',
              type: 'edit'
            }]
          }]
        },
        query: {
          fkDptId: [],
          fkDptIdVal: '',
          fkAcctId: [],
          fkAcctIdVal: '',
          date: ''
        }
      }
    },
    components: {
      breadcrumb,
      basicTable
    },
    mounted() {
      this.query.fkDptId = this.fkDptLoadAll();
      this.query.fkAcctId = this.fkAcctLoadAll();
    },
    methods: {
      addCustomer () {
        console.log('123')
        this.$router.push({path: '/customManager/potentialCustom/form'})
      },
      fkDptLoadAll() {
        return [
          {'id':'001', 'value':'财务'},
          {'id':'002', 'value':'销售'},
          {'id':'003', 'value':'电商'}
        ];
      },
      fkAcctLoadAll() {
        return [
          {'id':'001', 'value':'ZHJM'},
          {'id':'002', 'value':'CZK'},
          {'id':'003', 'value':'CTH'}
        ];
      },
      fkDptSearchAsync(queryString, cb) {
        var restaurants = this.fkDptId;
        this.querySearch(queryString, cb, restaurants)
      },
      fkAcctSearchAsync(queryString, cb) {
        var restaurants = this.fkAcctId;
        this.querySearch(queryString, cb, restaurants)
      },
      querySearch(queryString, cb, restaurants) {
        // var restaurants = this.fkDptId;
        var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          cb(results);
        }, 3000 * Math.random());
      },
      createStateFilter(queryString) {
        return (state) => {
          return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      handleSelect (item) {
        console.log(item)
      }
    }
  }
</script>
<style lang="styl", scoped>
  .width-input-250
    width: 250px
</style>