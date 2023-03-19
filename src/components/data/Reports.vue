<template>
  <div class='Reports'>
    <!-- 导航 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 导航end -->
    <el-card>
      <div ref="myChart" style="width: 600px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import { getReportData } from '@/api/api'
import _ from 'lodash';
export default {
  name: 'Reports',
  data() {
    return {
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  computed: {},
  components: {},
  created() {
  },
  mounted() {
    this.getReportData()
  },
  methods: {
    async getReportData() {
      const res = await getReportData()
      if (res.meta.status != 200) return
      // 深拷贝
      var myChart = echarts.init(this.$refs['myChart']);
      const result = _.merge(res.data,this.options)
      myChart.setOption(result)
      // this.options = 
    }
  }
}
</script>
<style lang='less' scoped></style>
