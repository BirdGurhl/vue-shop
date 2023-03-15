<template>
  <div class='Roles'>
    <!-- 导航 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 导航end -->
    <!-- 表格数据 -->
    <el-card>
      <div slot="header" class="addBtn">
        <el-button type="primary" size="small" @click="DialogVisible = true">添加角色</el-button>
      </div>
      <el-table :data="roleList" style="width: 100%" border stripe>
        <el-table-column type="expand">
          <template v-slot="scope">
            <!-- 一级权限 -->
            <el-row v-for="right1 in scope.row.children" :key="right1.id">
              <el-col :span="6">
                <el-tag closable :disable-transitions="false" @close="delRight(scope.row, right1.id)">{{ right1.authName
                }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级权限 -->
              <el-col :span="18">
                <el-row v-for="right2 in right1.children" :key="right2.id">
                  <el-col :span="8">
                    <el-tag type="success" closable :disable-transitions="false"
                      @close="delRight(scope.row, right2.id)">{{ right2.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="16">
                    <el-tag v-for="right3 in right2.children" :key="right3.id" type="warning" closable
                      :disable-transitions="false" @close="delRight(scope.row, right3.id)">{{ right3.authName }}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="250" align="center">
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="changeBtn(scope.row)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="delRole(scope.row)"></el-button>
            <el-button type="warning" icon="el-icon-s-tools" size="mini" @click="assignBtn(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 表格数据end -->
    <!-- 添加角色弹出框 -->
    <Dialog :title="'添加角色'" :dialogVisibleModel.sync="DialogVisible" :formDataModel.sync="roleInfo" :callback="addRole">
    </Dialog>
    <!-- 添加角色弹出框 -->
    <!-- 编辑角色信息弹出框 -->
    <Dialog :title="'编辑角色信息'" :dialogVisibleModel.sync="DialogVisible" :formDataModel.sync="roleInfo"
      :callback="roleInfoChange"></Dialog>
    <!-- 编辑角色信息弹出框end -->
    <!-- 分权权限弹出框 -->

    <el-dialog :title="roleInfo.roleName" :visible.sync="roleRightSDialogVisible" width="500px">
      <el-tree :data="allRightList" show-checkbox default-expand-all node-key="id" :default-checked-keys="roleRightIDList"
        ref="elTree" :props="treeProps">
      </el-tree>
      <span slot="footer">
        <el-button @click="roleRightSDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="assignRight">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分权权限弹出框end -->
  </div>
</template>

<script>
import { getRoleList, addRole, roleInfoChange, delRole, delRight, getRightList, assignRight } from '@/api/api';
import Dialog from '../user/Dialog.vue';
export default {
  name: 'Roles',
  data() {
    return {
      roleList: [],
      allRightList: [],
      roleRightIDList: [],
      treeProps: {
        children: 'children',
        label: 'authName'
      },
      roleInfo: {
        roleName: '',
        roleDesc: ''
      },
      DialogVisible: false,
      roleRightSDialogVisible: false,
      title: '',
    }
  },
  computed: {},
  components: {
    Dialog,
  },
  created() {
    this.getRoleList()
    this.getRightList()
  },
  mounted() { },
  methods: {
    async assignRight() {
      let rids = [...this.$refs.elTree.getCheckedKeys(), ...this.$refs.elTree.getHalfCheckedKeys()]
      const res = await assignRight(this.roleInfo.id, rids.join(','))
      if (res.meta.status != 200) {
        return
      }
      this.$message.success('成功')
      this.roleRightSDialogVisible = false
      this.getRoleList()
    },
    // 通过递归遍历获取选中角色身上所有的三级权限id，分配权限窗口中默认选中这些权限
    getRoleRightID(rights, arr) {
      if (!rights.children) {
        arr.push(rights.id)
        return
      }
      // for (const right of rights.children) {
      //   this.getRoleRightID(right,arr)
      // }
      rights.children.forEach(element => {
        this.getRoleRightID(element, arr)
      });
    },
    assignBtn(role) {
      Object.assign(this.roleInfo, role)
      // 先清空选中角色权限id 数组
      this.roleRightIDList.splice(0)
      // 获取选中角色权限id 数组
      this.getRoleRightID(role, this.roleRightIDList)
      // 重新设置默认选中的权限
      this.$nextTick(() => {
        this.$refs.elTree.setCheckedKeys(this.roleRightIDList)
      })

      this.roleRightSDialogVisible = true

    },
    delRight(role, rightID) {
      this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await delRight(role.id, rightID)
        if (res.meta.status != 200) {
          return
        }
        role.children = res.data
        this.$message.success('删除成功')
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    delRole(role) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await delRole(role)
        if (res.meta.status != 200) {
          return
        }
        this.$message.success('删除成功')
        this.getRoleList()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    changeBtn(role) {
      Object.assign(this.roleInfo, role)
      this.DialogVisible = true
    },
    async roleInfoChange() {
      const res = await roleInfoChange(this.roleInfo)
      if (res.meta.status != 200) {
        return
      }

      this.$message.success('修改成功')
      this.getRoleList()
    },
    async addRole() {
      const res = await addRole(this.roleInfo)
      console.log(res);
      if (res.meta.status != 201) {
        return
      }
      this.$message.success('添加成功')
      this.getRoleList()
    },
    async getRoleList() {
      const res = await getRoleList()
      if (res.meta.status != 200) {
        return
      }
      this.roleList = res.data
    },
    async getRightList() {
      const res = await getRightList('tree')
      if (res.meta.status != 200) {
        return
      }
      this.allRightList = res.data
    }
  }
}
</script>
<style lang='less' scoped>
.addBtn {
  display: flex;
  justify-content: start;
}

// .el-row {
//   box-sizing: border-box;
// }
.el-row {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #eee;
}

.el-row:first-of-type {
  border-top: 1px solid #eee;
}

.el-tag {
  margin: 7px;
}
</style>
