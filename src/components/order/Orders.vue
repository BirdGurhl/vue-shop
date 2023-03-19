<template>
  <div class='Orders'>
    <!-- 导航 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 导航end -->
    <!-- 内容区 -->
    <!-- 头部搜索 -->
    <el-row :gutter="20">
      <el-col :span="10">
        <el-input placeholder="请输入内容" v-model="inputVal" @keyup.enter.native="getOrders" clearable>
          <el-button slot="append" icon="el-icon-search" @click="getOrders(inputVal)"></el-button>
        </el-input>
      </el-col>
    </el-row>
    <!-- 头部搜索end -->

    <!-- 表格数据 -->
    <el-table :data="orderList" border stripe :row-class-name="tableRowClassName" row-key="order_id">
      <el-table-column type="index" label="#" fixed="left"></el-table-column>
      <el-table-column prop="order_number" label="订单编号" show-overflow-tooltip></el-table-column>
      <el-table-column prop="order_price" label="订单价格(元)" width="80"></el-table-column>
      <el-table-column label="是否付款" width="100">
        <template v-slot="scope">
          <el-tag v-if="scope.row.order_pay == '0'" type="danger">未支付</el-tag>
          <el-tag v-else-if="scope.row.order_pay == '1'" type="success">支付宝</el-tag>
          <el-tag v-else-if="scope.row.order_pay == '2'" type="success">微信</el-tag>
          <el-tag v-else-if="scope.row.order_pay == '3'" type="success">银行卡</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="is_send" label="是否发货" width="70"></el-table-column>
      <el-table-column label="下单时间" width="150">
        <template v-slot="scope">
          {{ scope.row.update_time | dateFormat }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150">
        <template v-slot="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="editBtn(scope.row, scope.$index)"></el-button>
          <el-button type="success" icon="el-icon-location" size="mini" @click="editKuaidi(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 表格数据end -->
    <!-- 分页区 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum"
      :page-sizes="[10, 20, 50, 100]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 分页区end -->

    <el-dialog title="修改地址" :visible.sync="dialogVisible" width="500px" @close="closeDialog">
      <el-form :model="formData" :rules="rules" ref="formData" label-width="100px">
        <el-form-item label="省市区/县" prop="city">
          <el-cascader v-model="formData.city" :options="cityData" :props="{ expandTrigger: 'hover' }"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address">
          <el-input v-model="formData.address"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="editAddress">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="物流进度" :visible.sync="kuadiAialogVisible" width="500px" @close="kuadiAialogVisible = false">
      <el-timeline :reverse="true">
        <el-timeline-item v-for="(activity, index) in kuaidiData" :key="index" :timestamp="activity.time">
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>

  </div>
</template>

<script>
// 省市区数据
import cityData from '@/utils/citydata.js'
// 物流数据（物流数据接口失效，用静态数据）
import kuaidiData from './kuaidiData.js'
import { getOrders, getKuaidi } from '@/api/api'
export default {
  name: 'Orders',
  data() {
    return {
      inputVal: '',
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 20
      },
      total: 0,
      orderList: [],
      dialogVisible: false,
      formData: {
        city: [],
        address: ''
      },
      rules: {
        city: { required: true, message: '请输入', trigger: 'blur' },
        address: { required: true, message: '请输入', trigger: 'blur' }
      },
      cityData: cityData,
      editIndex: 0,
      kuaidiData: kuaidiData,
      kuadiAialogVisible: false
    }
  },
  computed: {},
  components: {},
  created() {
    this.getOrders()
  },
  mounted() { },
  methods: {
    editKuaidi(row) {
      // this.getKuaidi()

      this.kuadiAialogVisible = true
    },
    closeDialog() {
      this.dialogVisible = false
      this.$refs['formData'].resetFields()
      this.formData = { city: [], address: '' }
    },
    editAddress() {
      // 没有修改地址的接口，改不了后台数据
      this.$refs['formData'].validate(check => {
        if (!check) return
        let address = this.formData.city.join('/') + '/' + this.formData.address
        this.orderList[this.editIndex].consignee_addr = address
        this.$message.success('成功')
        this.dialogVisible = false
      })

    },
    editBtn(row, index) {
      this.editInde = index
      let arr = row.consignee_addr.split('/')
      this.formData.city = arr.slice(0, arr.length - 1)
      this.formData.address = arr.slice(-1).toString()
      this.dialogVisible = true
    },
    // 每页显示条目数量改变时调用
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrders()
    },
    // 当前页码改变时调用
    handleCurrentChange(currentPage) {
      this.queryInfo.pagenum = currentPage
      this.getOrders()
    },
    tableRowClassName({ row, rowIndex }) {
      // 未付款
      if (row.order_pay === 0) {
        return 'warning-row';
      }
      return '';
    },
    async getKuaidi() {
      const res = await getKuaidi()
      if (res.meta.status != 200) return
    },
    async getOrders(inputVal) {
      this.queryInfo.query = inputVal || ''
      const res = await getOrders(this.queryInfo)
      if (res.meta.status != 200) return
      this.orderList = res.data.goods
      this.total = res.data.total
      console.log(res);
      console.log(res.data.goods[0].order_pay == '0');
    }
  }
}
</script>
<style lang='less' scoped>
.el-row {
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
}

/deep/ .el-cascader {
  width: 100%;
}

.el-table {
  width: 100%;

  /deep/ .warning-row {
    background: oldlace !important;
    ;
  }

  /deep/ .error-row {
    background: #f56c6c;
  }
}


.el-dialog__body {
  text-align: left;
}
</style>
