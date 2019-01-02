<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框+确认按钮 -->
    <el-row>
      <el-col>
        <el-input placeholder="请输入内容" v-model="query" class="input-with-select">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button type="primary">添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table :data="tableData" style="width: 100%" height="398px">
      <el-table-column prop="id" label="ID" width="80"></el-table-column>
      <el-table-column prop="username" label="姓名" width="100"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话" width="120"></el-table-column>
      <el-table-column label="创建日期" width="180">
        <template slot-scope="scope">{{scope.row.create_time | fmtDate}}</template>
      </el-table-column>
      <el-table-column label="用户状态" width="140">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle plain size="mini"></el-button>
          <el-button type="danger" icon="el-icon-delete" circle plain size="mini"></el-button>
          <el-button type="success" icon="el-icon-check" circle plain size="mini"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="2"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      background
    ></el-pagination>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      query: '',
      tableData: [],
      pagenum: 1,
      pagesize: 2,
      total: -1
    }
  },
  created () {
    this.getTableData()
  },
  methods: {
    // 获取用户数据
    async getTableData () {
      // 设置请求头,设置token
      const AUTH_TOKEN = localStorage.getItem('token')
      this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN
      const res = await this.$http.get(
        `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${
          this.pagesize
        }`
      )
      // console.log(res);
      const {
        meta: { status, msg },
        data: { total, users }
      } = res.data
      if (status === 200) {
        this.tableData = users
        console.log(this.tableData)

        this.total = total
        this.$message.success(msg)
      } else {
        this.$message.warning(msg)
      }
    },
    // 分页相关方法
    // 点击每页条数时,触发此方法
    handleSizeChange (val) {
      this.pagenum = 1
      this.pagesize = val
      this.getTableData()
      // console.log(`每页 ${val} 条`);
    },
    // 点击页码时,触发此方法
    handleCurrentChange (val) {
      this.pagenum = val
      this.getTableData()
      // console.log(`当前页: ${val}`);
    }
  }
}
</script>

<style>
.box-card {
  height: 524px;
}
.input-with-select {
  width: 400px;
  margin-top: 20px;
}
</style>
