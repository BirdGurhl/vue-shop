<template>
  <div class='Params'>
    <!-- 导航 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 导航end -->
    <el-card>
      <el-alert title="注意：只允许为第三级分类设置相关参数" type="warning" show-icon></el-alert>
      <!-- 选择商品分类 -->
      <div class="select">
        <span>选择商品分类：</span>
        <el-cascader v-model="selectCatIdArr" :options="SelectCategoriesList" :props="selectProps"
          @change="getParamsList"></el-cascader>
      </div>
      <!-- 选择商品分类end -->

      <!-- 表格标签 -->
      <el-tabs value="many" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <params-table :title="'many'" :SelectCategoriesListModel.sync="selectCatAttributes" :getParamsList="getParamsList" :addBtnAble="addBtnAble" :catid="catid"></params-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <params-table :title="'only'" :SelectCategoriesListModel.sync="selectCatAttributes" :getParamsList="getParamsList"></params-table>
        </el-tab-pane>

      </el-tabs>

      <!-- 表格标签end -->


    </el-card>
  </div>
</template>

<script>
import { getCategories, getParamsList } from '@/api/api'
import ParamsTable from './Params/ParamsTable.vue'
export default {
  name: 'Params',
  data() {
    return {
      SelectCategoriesList: [],
      selectCatIdArr: [],
      selectCatAttributes: [],
      selectProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover',
        checkStrictly: false
      },
      activeName: {
        sel: 'many'
      },
      addBtnAble:false,
      catid:0
    }
  },
  computed: {
  },
  components: {
    ParamsTable,
  },
  created() {
    this.getAllCategories()
  },
  mounted() { },
  methods: {
    delTag(tag) {
      console.log(tag);
    },
    editCategoriesBtn(params) { },
    delCategories(params) { },

    handleClick(tab, event) {
      // 如果点击的是已经在展示中的tab,结束
      if(this.activeName.sel == tab.name) return
      this.activeName.sel = tab.name
      // 获取表格数据
      this.getParamsList()
    },
    // 获取表格数据
    async getParamsList(){
      // 如果还没选择分类
      this.addBtnAble = true
      if (this.selectCatIdArr.length <= 0) return

      let length = this.selectCatIdArr.length
      let id = this.selectCatIdArr[length - 1]
      this.catid = id
      const res = await getParamsList(id, this.activeName)
      if (res.meta.status != 200) {
        return
      }
      // 如果时动态参数,切割分类参数
      if (this.activeName.sel == 'many') {
        res.data.map((item, index, arr) => {
          arr[index].attr_vals = item.attr_vals.trim()
          // 如果以逗号结尾
          if (arr[index].attr_vals.endsWith(',') || arr[index].attr_vals.endsWith(',')) {
            arr[index].attr_vals = arr[index].attr_vals.slice(0, -1)
          }
          arr[index].attr_vals = item.attr_vals.split(/,|，/)
        })
      }
      this.selectCatAttributes = res.data
    },

    async getAllCategories() {
      const res = await getCategories()
      if (res.meta.status != 200) {
        return
      }
      this.SelectCategoriesList = res.data
      if (this.SelectCategoriesList.length > 0) this.setTableIndex(this.SelectCategoriesList);
    },
    // 树形列表index层级，实现方法（可复制直接调用）
    setTableIndex(arr, index) {
      arr.forEach((item, key) => {
        item.index = key + 1;
        if (index) {
          item.index = index + "-" + (key + 1);
        }
        if (item.children) {
          this.setTableIndex(item.children, item.index);
        }
      });
    },
  }
}
</script>
<style lang='less' scoped>
.el-alert {
  margin-bottom: 7px;
}

.select {
  display: flex;
  align-items: center;
}


</style>
