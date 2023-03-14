<template>
  <div class='Users-container'>
    <!-- 导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 导航end -->

    <!-- 内容区 -->
    <!-- 头部搜索 -->
    <el-row :gutter="20">
      <el-col :span="10">
        <el-input placeholder="请输入内容" v-model="inputVal" @keyup.enter.native="getUsersList" clearable>
          <el-button slot="append" icon="el-icon-search" @click="getUsersList(inputVal)"></el-button>
        </el-input>
      </el-col>
      <el-col :span="3">
        <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 添加用户弹出框 -->
    <Dialog :title="'添加用户'" :dialogVisibleModel.sync="addDialogVisible" :formDataModel.sync="UserInfo"
      :callback="addUser"></Dialog>
    <!-- 添加用户弹出框 -->
    <!-- 头部搜索end -->

    <!-- 表格数据 -->
    <el-table :data="userList" style="width: 100%" border stripe>
      <el-table-column type="index" label="#" fixed="left"></el-table-column>
      <el-table-column prop="username" label="姓名"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column prop="role_name" label="角色"></el-table-column>
      <el-table-column label="状态">
        <template v-slot="scope">
          <el-switch v-model="scope.row.mg_state" @change="userStageChange(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template v-slot="scope">
          <el-tooltip effect="dark" content="修改" placement="top">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="changeUserBtn(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip effect="dark" content="删除" placement="top">
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip effect="dark" content="分配角色" placement="top">
            <el-button type="warning" icon="el-icon-s-tools" size="mini"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <Dialog :title="'修改用户信息'" :dialogVisibleModel.sync="editDialogVisible" :formDataModel.sync="UserInfo"
      :callback="changeUserInfo"></Dialog>
    <!-- 表格数据end -->


    <!-- 分页区 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum"
      :page-sizes="[5, 10, 20, 50]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 分页区end -->
    <!-- 内容区end -->
  </div>
</template>

<script>
import { addUser, userStageChange, getUsersList, userInfoChange, delUser } from '@/api/api'
import Dialog from './Dialog.vue'
export default {
  name: 'Users',
  data() {
    return {
      inputVal: '',
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      userList: [],
      total: 0,
      addDialogVisible: false,
      editDialogVisible: false,
      UserInfo: {
        username: '',
        password: '',
        email: '',
        mobile: '',
      },
    }
  },
  computed: {},
  components: {
    Dialog,
  },
  created() {
    this.getUsersList()
  },
  mounted() { },
  methods: {
    deleteUser(user) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await delUser(user)
        if (res.meta.status != 200) {
          return
        }
        this.$message.success('删除成功')
        this.getUsersList();
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    changeUserBtn(user) {
      this.editDialogVisible = true
      Object.assign(this.UserInfo, user)
    },
    async changeUserInfo() {
      const res = await userInfoChange(this.UserInfo)
      if (res.meta.status != 200) {
        return
      }
      this.$message.success('修改成功')
      this.editDialogVisible = false
      this.getUsersList();
    },
    async addUser() {
      const res = await addUser(this.UserInfo)
      if (res.meta.status != 200) {
        return
      }
      this.$message.success('添加成功')
      this.addDialogVisible = false
      this.getUsersList();
    },
    // 每页显示条目数量改变时调用
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUsersList()
    },
    // 当前页码改变时调用
    handleCurrentChange(currentPage) {
      this.queryInfo.pagenum = currentPage
      this.getUsersList()
    },
    // 修改用户状态
    async userStageChange(user) {
      const res = await userStageChange(user)
      if (res.meta.status != 200) {
        // 同时把用户状态修改回来
        this.userList.some((val, index, arr) => {
          if (val.id == user.id) {
            arr[index].mg_state = !arr[index].mg_state
            return true
          }
          return false
        })
        return this.$message.error('修改失败')
      }
      this.$message.success('修改成功')
    },
    async getUsersList(inputVal) {
      // const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      this.queryInfo.query = inputVal || ''
      const res = await getUsersList(this.queryInfo)
      if (res.meta.status != 200) {
        return this.$message.error('获取用户列表失败')
      }
      this.userList = res.data.users
      this.total = res.data.total
    },

  }
}
</script>
<style lang='less' scoped>
.el-breadcrumb {
  margin-bottom: 15px;
}

.el-row {
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
}
</style>
