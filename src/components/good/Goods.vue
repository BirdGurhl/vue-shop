<template>
  <div class='Goods'>
    <!-- 导航 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 导航end -->

    <!-- 内容区 -->
    <!-- 头部搜索 -->
    <el-row :gutter="20">
      <el-col :span="10">
        <el-autocomplete class="inline-input" v-model="inputVal" value-key="goods_name" :fetch-suggestions="querySearch"
          placeholder="请输入内容" @select="getGoodsList(inputVal)">
          <el-button slot="append" icon="el-icon-search" @click="getGoodsList(inputVal)"></el-button>
        </el-autocomplete>
      </el-col>
      <el-col :span="3">
        <el-button type="primary" @click="addUserBtn">添加商品</el-button>
      </el-col>
    </el-row>
    <!-- 添加用户弹出框 -->
    <!-- <Dialog :title="'添加商品'" :dialogVisibleModel.sync="addDialogVisible" :formDataModel.sync="UserInfo"
      :callback="addUser"></Dialog> -->
    <!-- 添加用户弹出框 -->
    <!-- 头部搜索end -->

    <!-- 表格数据 -->
    <el-table :data="goodList" border stripe :row-class-name="tableRowClassName" row-key="goods_id">
      <el-table-column type="index" label="#" fixed="left"></el-table-column>
      <el-table-column prop="goods_name" label="商品名称" show-overflow-tooltip></el-table-column>
      <el-table-column prop="goods_price" label="商品价格(元)"></el-table-column>
      <el-table-column prop="goods_weight" label="商品重量"></el-table-column>
      <el-table-column label="创建时间">
        <template v-slot="scope">
          {{ scope.row.add_time | dateFormat }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template v-slot="scope">
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="delGoods(scope.row)"></el-button>
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="editGoodBtn(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 表格数据end -->
    <!-- 修改用户信息弹出框 -->
    <!-- <Dialog :title="'修改用户信息'" :dialogVisibleModel.sync="editDialogVisible" :formDataModel.sync="UserInfo"
      :callback="changeUserInfo"></Dialog> -->
    <!-- 修改用户信息弹出框end -->



    <!-- 分页区 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum"
      :page-sizes="[20, 50, 100, 200]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 分页区end -->
    <!-- 内容区end -->
  </div>
</template>

<script>
import { getGoods, delGoods } from '@/api/api'
export default {
  name: 'Goods',
  data() {
    return {
      inputVal: '',
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 50
      },
      total: 0,
      goodList: []
    }
  },
  filters: {
    dateFormat(date) {
      const dt = new Date(date)
      const y = dt.getFullYear()
      const m = (dt.getMonth() + 1 + '').padStart(2, '0')
      const d = (dt.getDate() + '').padStart(2, '0')
      const hh = (dt.getHours() + '').padStart(2, '0')
      const mm = (dt.getMinutes() + '').padStart(2, '0')
      const ss = (dt.getSeconds() + '').padStart(2, '0')
      return `${y}-${m}-${d} ${hh}:${mm}`
    }
  },
  computed: {},
  components: {},
  created() {
    this.getGoodsList()
  },
  mounted() { },
  methods: {
    addUserBtn() {
      this.$router.push('/addgood')
     },
    editGoodBtn(row) {
      console.log(row);
    },
    // 删除商品
    delGoods(row) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await delGoods(row.goods_id)
        if (res.meta.status != 200) {
          return
        }
        this.$message.success('删除成功')
        this.getGoodsList();
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    tableRowClassName({ row, rowIndex }) {
      // 未通过
      if (row.goods_state === 0) {
        return 'error-row';
      } else if (row.goods_state === 1) {
        // 审核中
        return 'warning-row';
      }
      return '';
    },
    // 每页显示条目数量改变时调用
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    // 当前页码改变时调用
    handleCurrentChange(currentPage) {
      this.queryInfo.pagenum = currentPage
      this.getGoodsList()
    },
    querySearch(queryString, cb) {
      let results = []
      if (queryString) {
        results = this.goodList.filter(good => {
          return (good.goods_name.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        })
      } else {
        results = this.goodList
      }
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    async getGoodsList(inputVal) {
      this.queryInfo.query = inputVal || ''
      const res = await getGoods(this.queryInfo)
      if (res.meta.status != 200) return
      this.goodList = res.data.goods
      this.total = res.data.total
    },
  }
}
</script>
<style lang='less' scoped>
.el-autocomplete {
    width: 100%;
}
.el-breadcrumb {
  margin-bottom: 15px;
}


.el-row {
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
}

.el-table {
  width: 100%;

  .warning-row {
    background: oldlace;
  }

  .error-row {
    background: #f56c6c;
  }
}
</style>
