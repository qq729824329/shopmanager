<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <my-bread level1="权限管理" level2="权限列表"></my-bread>
    <!-- 表格 -->
    <el-table :data="roles" style="width: 100%" height="490px">
      <el-table-column type="index" label="#" width="80"></el-table-column>
      <el-table-column prop="authName" label="权限名称" width="200"></el-table-column>
      <el-table-column prop="path" label="路径" width="200"></el-table-column>
      <el-table-column prop="level" label="层级" width="200">
        <template slot-scope="scope">
          <span v-if="scope.row.level==='0'">一级</span>
          <span v-if="scope.row.level==='1'">二级</span>
          <span v-if="scope.row.level==='2'">三级</span>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      roles: []
    }
  },
  created() {
    this.getRights();
  },
  methods: {
    async getRights() {
      const res = await this.$http.get(`rights/list`);
      console.log(res);
      const {meta:{msg, status}, data} = res.data
      if (status===200) {
        this.$message.success(msg)
        this.roles = data
      }
    }
  }
};
</script>

<style scoped>
.box-card {
  height: 100%;
}
</style>
