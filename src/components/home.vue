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
        <el-menu router unique-opened default-active="2">
          <!-- 1 -->
          <el-submenu :index="''+item1.order" v-for='(item1,i) in menus' :key='i'>
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{item1.authName}}</span>
            </template>

            <el-menu-item :index="item2.path" v-for='(item2,i) in item1.children' :key='i'>
              <i class="el-icon-menu"></i>
              {{item2.authName}}
            </el-menu-item>
          </el-submenu>
          
        </el-menu>
      </el-aside>
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      menus: []
    }
  },
  beforeCreate () {
    if (!localStorage.getItem('token')) {
      this.$message.warning('请先登录')
      this.$router.push({
        name: 'login'
      })
    }
  },
  created () {
    this.getMenus()
  },
  methods: {
    // 退出
    handleLoginout () {
      localStorage.clear()
      this.$router.push({
        name: 'login'
      })
      this.$message.success('退出成功')
    },
    // 获取导航数据
    async getMenus () {
      const res = await this.$http.get('menus')
      // console.log(res)
      const {meta: {msg, status}, data} = res.data
      if (status===200) {
        this.menus = data
      }
    }
  }
}
</script>

<style>
.container {
  height: 100%;
}
.container .header {
  background-color: #b3c0d1;
}
.container .main {
  background-color: #e9e0e0;
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
