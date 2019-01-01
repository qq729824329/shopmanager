<template>
  <div id="warp">
    <el-form class="form" label-position="top" label-width="80px" :model="formData">
      <h2>用户登录</h2>
      <el-form-item label="用户名">
        <el-input v-model="formData.username"></el-input>
      </el-form-item>
      <el-form-item label="密  码">
        <el-input v-model="formData.password"></el-input>
      </el-form-item>
      <el-button class="btn" type="primary" @click="handleLogin()">登陆</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      formData: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    // 登录请求
    async handleLogin () {
      const res = await this.$http.post('login', this.formData)
      console.log(res)
      const {
        data: {
          meta: { msg, status },
          data
        }
      } = res
      if (status === 200) {
        localStorage.setItem('token', data.token)
        this.$message(msg)
        this.$router.push({
          name: 'home'
        })
      } else {
        this.$message.warning(msg)
      }
    }
  }
}
</script>

<style>
#warp {
  height: 100%;
  background-color: #324152;
  display: flex;
  justify-content: center;
  align-items: center;
}
#warp .form {
  background-color: #fff;
  border-radius: 10px;
  width: 400px;
  padding: 30px;
}
#warp .form .btn {
  width: 100%;
}
</style>
