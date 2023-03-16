<template>
  <div class='categories'>
    <!-- 导航 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 导航end -->
    <el-card>

      <div slot="header" class="addBtn">
        <el-button type="primary" size="small" @click="showAddDialog">添加分类</el-button>
      </div>
      <!-- 弹出框 -->
      <el-dialog title="添加分类" :visible.sync="dialogVisible" width="500px" @close="closeDialog">
        <el-form :model="selectCategoriesInfo" :rules="rules" ref="formData" label-width="80px">
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="selectCategoriesInfo.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父类名称">
            <el-cascader v-model="selectCategoriesInfo.cat_pid" :options="SelectCategoriesList"
              :props="selectProps"></el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="closeDialog">取 消</el-button>
          <el-button type="primary" @click="addCategories">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 弹出框end -->
      <el-table :data="categoriesList" style="width: 100%" border stripe row-key="cat_id"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
        <el-table-column type="index" label="#" width="60px">
          <template slot-scope="scope">
            <span>{{ scope.row.index }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="cat_name" label="分类名称">
        </el-table-column>
        <!-- <template v-slot="scope">
            <el-tree :data="[scope.row]" :props="treeProps" ></el-tree>
          </template> -->
        <el-table-column label="是否有效">
          <template v-slot="scope">
            <i class="el-icon-error" v-if="scope.row.cat_deleted"></i>
            <i class="el-icon-success" v-else></i>
          </template>
        </el-table-column>
        <el-table-column label="排序">
          <template v-slot="scope">
            <el-tag v-if="scope.row.cat_level == '0'">一级</el-tag>
            <el-tag v-else-if="scope.row.cat_level == '1'" type="success">二级</el-tag>
            <el-tag v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editCategoriesBtn(scope.row)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="delCategories(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 编辑分类信息弹出框 -->
      <Dialog :title="'编辑分类'" :dialogVisibleModel.sync="editDialogVisible" :formDataModel.sync="editCatInfo"
        :callback="editCat"></Dialog>
      <!-- 编辑分类信息弹出框end -->
      <!-- 分页区 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum" :page-sizes="[5, 10, 20, 50]" :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
      <!-- 分页区end -->
    </el-card>
  </div>
</template>

<script>
import { getCategories, addCategories, delCategories, editCategories } from '@/api/api';
import Dialog from '../user/Dialog.vue';
export default {
  name: 'Categories',
  data() {
    return {
      categoriesList: [],
      queryInfo: {
        type: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      treeProps: {
        children: 'children',
        label: 'cat_name'
      },
      dialogVisible: false,
      rules: {
        cat_name: { required: true, message: '请输入分类名称', trigger: 'blur' },
      },
      selectCategoriesInfo: {
        cat_pid: [],
        cat_level: '',
        cat_name: '',
      },
      SelectCategoriesList: [],
      selectProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover',
        checkStrictly: true
      },
      editDialogVisible: false,
      editCatInfo: {
        cat_id: '',
        cat_name: ''
      }
    }
  },
  computed: {},
  components: {
    Dialog,
  },
  created() {
    this.getAllCategories()
  },
  mounted() { },
  methods: {
    editCategoriesBtn(cat) {
      Object.assign(this.editCatInfo, cat)
      console.log('编辑', this.editCatInfo);
      this.editDialogVisible = true
      console.log(this.editDialogVisible);

    },
    async editCat() {
      const res = await editCategories(this.editCatInfo.cat_id, this.editCatInfo.cat_name)
      if (res.meta.status != 200) {
        return
      }
      this.$message.success('成功！')
      this.getAllCategories()
    },
    async delCategories(cat) {
      const res = await delCategories(cat.cat_id)
      if (res.meta.status != 200) {
        return
      }
      this.$message.success('成功！')
      this.getAllCategories()
    },
    addCategories() {
      let length = this.selectCategoriesInfo.cat_pid.length
      this.selectCategoriesInfo.cat_level = length
      this.selectCategoriesInfo.cat_pid = length == 0 ? 0 : this.selectCategoriesInfo.cat_pid[length - 1]
      this.$refs['formData'].validate(async check => {
        if (!check) return
        const res = await addCategories(this.selectCategoriesInfo)
        if (res.meta.status != 201) {
          return
        }
        this.dialogVisible = false
        this.$message.success('成功！')
        this.getAllCategories()
      })

    },
    closeDialog() {
      this.dialogVisible = false
      this.$refs['formData'].resetFields()
      this.selectCategoriesInfo.cat_name = ''
      this.selectCategoriesInfo.cat_pid = []
    },
    showAddDialog() {
      this.getSelectCategories()
      this.dialogVisible = true
    },

    async getSelectCategories() {
      const res = await getCategories({ type: 2 })
      if (res.meta.status != 200) {
        return
      }
      this.SelectCategoriesList = res.data
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
    // 每页显示条目数量改变时调用
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getAllCategories()
    },
    // 当前页码改变时调用
    handleCurrentChange(currentPage) {
      this.queryInfo.pagenum = currentPage
      this.getAllCategories()
    },
    async getAllCategories() {
      const res = await getCategories(this.queryInfo)
      if (res.meta.status != 200) {
        return
      }
      this.categoriesList = res.data.result
      this.total = res.data.total
      if (this.categoriesList.length > 0) this.setTableIndex(this.categoriesList);
    }
  }
}
</script>
<style lang='less' scoped>
.addBtn {
  display: flex;
  justify-content: start;
}

.el-icon-success {
  color: rgb(12, 232, 89);
}

.el-icon-error {
  color: red;
}

.el-cascader {
  width: 100%;
}
</style>
