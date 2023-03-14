<template>
  <el-container>
    <!-- 头部 -->
    <el-header>
      <span><i class="el-icon-platform-eleme"></i>电商后台管理系统</span>
      <el-button type="info" @click="logout">退出登录</el-button>
    </el-header>
    <!-- 头部end -->

    <el-container>
      <!-- 左侧导航栏 -->
      <el-aside :width="asideWidth">
        <div class="collapse el-icon-caret-left" @click="isCollapse = !isCollapse"></div>
        <el-menu background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" unique-opened :default-active="$route.path.slice(1)"
          :collapse="isCollapse" :collapse-transition="false" router>
          <el-submenu v-for="menu in menuList" :key="menu.id" :index="menu.id.toString()">
            <template slot="title">
              <i :class="menuIconList[menu.id]"></i>
              <span>{{ menu.authName }}</span>
            </template>
            <el-menu-item v-for="subMenu in menu.children" :key="subMenu.id" :index="subMenu.path">
              <span slot="title">{{ subMenu.authName }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 左侧导航栏end -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
// @ is an alias to /src
import { getMenuList } from '@/api/api'
export default {
  name: 'HomeView',
  data() {
    return {
      menuList: [],
      menuIconList: {
        125: 'el-icon-user-solid',
        103: 'el-icon-lock',
        101: 'el-icon-s-goods',
        102: 'el-icon-s-order',
        145: 'el-icon-s-marketing',
      },
      isCollapse: false,
    }
  },
  computed: {
    asideWidth() {
      return this.isCollapse ? '60px' : '200px'
    },
  },
  components: {
  },
  created() {
    this.getMenuList()
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList() {
      const res = await getMenuList()
      if (res.meta.status != 200) {
        return this.$message.error(res.meta.msg)
      }
      this.menuList = res.data
      // console.log(res);
    }
  }
}
</script>

<style lang="less" scoped>
.el-container {
  color: white;
  height: 100%;
}

.el-header {
  background-color: #606266;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 20px;
  line-height: 60px;

  i {
    padding-right: 5px;
    font-size: 30px;
    vertical-align: middle;
  }
}

.el-aside {
  background-color: #545c64;
  height: 100%;

  .el-icon-caret-left {
    width: 100%;
    line-height: 30px;
    // font-size: 30px;
    cursor: pointer;
    box-sizing: border-box;
  }

  .el-icon-caret-left:hover {
    background-color: rgb(67, 74, 80);
    opacity: 0.8;
  }
}

.el-main {
  background-color: #EBEEF5;
  color: black;
}
</style>
