<template>
  <div class='Rights'>
    <!-- 导航 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 导航end -->

    <!-- 表格数据 -->
    <el-card>
      <el-table :data="rightList" style="width: 100%" border stripe>
        <el-table-column type="index" label="#" fixed="left"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column label="权限等级">
          <template v-slot="scope">
            <el-tag v-if="scope.row.level == '0'">一级</el-tag>
            <el-tag v-else-if="scope.row.level == '1'" type="success">二级</el-tag>
            <el-tag v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 表格数据end -->
  </div>
</template>

<script>
import { getRightList } from '@/api/api';
export default {
  name: 'Rights',
  data() {
    return {
      rightList: [],

    }
  },
  computed: {},
  components: {},
  created() {
    this.getRightList()
  },
  mounted() { },
  methods: {
    async getRightList() {
      const res = await getRightList('list')
      if (res.meta.status != 200) {
        return
      }
      this.rightList = res.data
      console.log(this.rightList);
    }
  }
}
</script>
<style lang='less' scoped></style>
