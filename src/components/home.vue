<template>
  <el-container class="container">
    <el-header class="header">
      <el-row>
        <el-col :span="3">
          <div class="grid-content bg-purple">
            <img src="@/assets/logo.png" alt="哇,图片飞了">
          </div>
        </el-col>
        <el-col :span="20" class="middle">
          <h2>电 商 管 理 平 台</h2>
        </el-col>
        <el-col :span="1" class="loginout">
          <a href @click.prevent='handleLoginout()'>退出</a>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside width="200px" class="aside">
        <el-menu unique-opened default-active="2">
          <!-- 1 -->
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>用户管理</span>
            </template>

            <el-menu-item index="1-3">
              <i class="el-icon-menu"></i>
              用户列表
            </el-menu-item>
          </el-submenu>
          <!-- 2 -->
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>权限管理</span>
            </template>

            <el-menu-item index="1-3">
              <i class="el-icon-menu"></i>
              角色列表
            </el-menu-item>
            <el-menu-item index="1-4">
              <i class="el-icon-menu"></i>
              权限列表
            </el-menu-item>
          </el-submenu>
          <!-- 3 -->
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>商品管理</span>
            </template>

            <el-menu-item index="1-3">
              <i class="el-icon-menu"></i>
              商品列表
            </el-menu-item>
            <el-menu-item index="1-4">
              <i class="el-icon-menu"></i>
              分类参数
            </el-menu-item>
            <el-menu-item index="1-5">
              <i class="el-icon-menu"></i>
              商品分类
            </el-menu-item>
          </el-submenu>
          <!-- 4 -->
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>订单管理</span>
            </template>

            <el-menu-item index="1-3">
              <i class="el-icon-menu"></i>
              订单列表
            </el-menu-item>
          </el-submenu>
          <!-- 5 -->
          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>数据统计</span>
            </template>

            <el-menu-item index="1-3">
              <i class="el-icon-menu"></i>
              数据报表
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main class="main">Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  beforeCreate() {
    if (!localStorage.getItem('token')) {
      this.$message.warning('请先登录');
      this.$router.push({
        name: 'login'
      })
    }
  },
  methods: {
    handleLoginout() {
      localStorage.clear();
      this.$router.push({
        name: 'login'
      });
      this.$message.success('退出成功');
    }
  },
}
</script>

<style>
.container {
  height: 100%;
  /* background-color: red; */
}
.container .header {
  background-color: #b3c0d1;
}
.container .aside {
  /* background-color: blue; */
}
.container .main {
  /* background-color: pink; */
}
.middle {
  text-align: center;
  line-height: 100%;
  color: #fff;
}
.loginout a {
  line-height: 4;
  text-decoration: none;
  color: blue;
}
</style>
