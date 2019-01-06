<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <my-bread level1='用户管理' level2='用户列表'></my-bread>
    <!-- 搜索框+添加按钮 -->
    <el-row>
      <el-col>
        <el-input
          clearable
          @clear="getAllUsers()"
          placeholder="请输入内容"
          v-model="query"
          class="input-with-select"
        >
          <el-button @click="searchUser()" slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button type="primary" @click="showDiaAdd()">添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table :data="tableData" style="width: 100%" height="398px">
      <el-table-column prop="id" label="#" width="80"></el-table-column>
      <el-table-column prop="username" label="姓名" width="100"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话" width="120"></el-table-column>
      <el-table-column label="创建日期" width="180">
        <template slot-scope="scope">{{scope.row.create_time | fmtDate}}</template>
      </el-table-column>
      <el-table-column label="用户状态" width="140">
        <template slot-scope="scope">
          <el-switch
            @change="changeState(scope.row)"
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button
            @click="showEditconfig(scope.row)"
            type="primary"
            icon="el-icon-edit"
            circle
            plain
            size="mini"
          ></el-button>
          <el-button
            @click="showDeleConfig(scope.row)"
            type="danger"
            icon="el-icon-delete"
            circle
            plain
            size="mini"
          ></el-button>
          <el-button
            @click="showStateConfig(scope.row)"
            type="success"
            icon="el-icon-check"
            circle
            plain
            size="mini"
          ></el-button>
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
    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
      <el-form :model="form">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="addUser()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑用户对话框 -->
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit">
      <el-form :model="form">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input disabled v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="editUser()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 用户权限对话框 -->
    <el-dialog title="分配角色" :visible.sync="dialogFormVisibleState">
      <el-form :model="form">
        <el-form-item label="用户名" :label-width="formLabelWidth">{{currUsername}}</el-form-item>
        <el-form-item label="角色" :label-width="formLabelWidth">
          <el-select v-model="currRoleId">
            <el-option disabled label="请选择" :value="-1"></el-option>

            <el-option v-for="(v,i) in rolse" :key="i" :label="v.roleName" :value="v.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleState = false">取 消</el-button>
        <el-button type="primary" @click="setRole()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      // 表格数据来源
      query: "",
      tableData: [],
      pagenum: 1,
      pagesize: 2,
      total: -1,
      // 添加用户对话框
      dialogFormVisibleAdd: false,
      form: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      formLabelWidth: "100px",
      // 编辑用户对话框
      dialogFormVisibleEdit: false,
      dialogFormVisibleState: false,
      currRoleId: -1,
      rolse: [],
      currUsername: "",
      currUserId: -1
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    // 获取用户数据
    async getTableData() {
      // 设置请求头,设置token
      // const AUTH_TOKEN = localStorage.getItem("token");
      // this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;
      const res = await this.$http.get(
        `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${
          this.pagesize
        }`
      );
      // console.log(res);
      const {
        meta: { status, msg },
        data: { total, users }
      } = res.data;
      if (status === 200) {
        this.tableData = users;
        // console.log(this.tableData);

        this.total = total;
        this.$message.success(msg);
      } else {
        this.$message.warning(msg);
      }
    },
    // 分页相关方法
    // 点击每页条数时,触发此方法
    handleSizeChange(val) {
      this.pagenum = 1;
      this.pagesize = val;
      this.getTableData();
      // console.log(`每页 ${val} 条`);
    },
    // 点击页码时,触发此方法
    handleCurrentChange(val) {
      this.pagenum = val;
      this.getTableData();
      // console.log(`当前页: ${val}`);
    },
    // 搜索用户数据
    searchUser() {
      this.getTableData();
    },
    // 点击清空X,获取所有列表数据
    getAllUsers() {
      this.pagenum = 1;
      this.getTableData();
    },
    // 展示添加用户对话框
    showDiaAdd() {
      // 清空表单数据
      this.form = {};
      this.dialogFormVisibleAdd = true;
    },
    // 添加新用户
    async addUser() {
      // 1.发送请求
      const res = await this.$http.post("users", this.form);
      // console.log(res)
      const {
        meta: { msg, status }
      } = res.data;
      if (status === 201) {
        this.$message.success(msg);
        // 2.关闭对话框
        this.dialogFormVisibleAdd = false;
        // 3.刷新数据
        this.pagenum = 1;
        this.getTableData();
      } else {
        this.$message.error(msg);
      }
    },
    // 展示删除用户对话框
    showDeleConfig(user) {
      this.$confirm("是否删除此用户?", "想好了", {
        confirmButtonText: "不想了",
        cancelButtonText: "再想想",
        type: "warning"
      })
        .then(async () => {
          const res = await this.$http.delete(`users/${user.id}`);
          const {
            meta: { msg, status }
          } = res.data;
          if (status === 200) {
            this.$message.success(msg);
            this.pagenum = 1;
            this.getTableData();
          } else {
            this.$message.warning(msg);
          }
        })
        .catch(() => {
          this.$message.info("已取消删除!");
        });
    },
    // 展示编辑用户对话框
    async showEditconfig(user) {
      this.dialogFormVisibleEdit = true;
      const res = await this.$http.get(`users/${user.id}`);
      // console.log(res)
      const {
        meta: { msg, status },
        data
      } = res.data;
      if (status === 200) {
        this.form = data;
      }
    },
    // 编辑用户
    async editUser() {
      const res = await this.$http.put(`users/${this.form.id}`, this.form);
      // console.log(res)
      const {
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        this.dialogFormVisibleEdit = false;
        this.$message.success(msg);
        this.pagenum = 1;
        this.getTableData();
      } else {
        this.$message.warning(msg);
      }
    },
    // 改变用户状态
    async changeState(user) {
      // console.log(user)
      const res = await this.$http.put(
        `users/${user.id}/state/${user.mg_state}`
      );
      const {
        meta: { msg, status }
      } = res.data;
      if (status === 200) return this.$message.success(msg);
      this.$message.warning(msg);
    },
    // 展示用户权限
    async showStateConfig(user) {
      this.currUsername = user.username;
      this.currUserId = user.id;
      // 展示对话框
      this.dialogFormVisibleState = true;
      // 获取角色数据
      const res = await this.$http.get("roles");
      var {
        meta: { msg, status },
        data
      } = res.data;
      if (status === 200) {
        this.rolse = data;
      } else {
        this.$message.warning(msg);
      }
      // 根据用户id查角色名称
      const res2 = await this.$http.get(`users/${user.id}`);
      // console.log(res2.data)
      var {
        meta: { msg, status },
        data: { rid }
      } = res2.data;
      if (status === 200) {
        this.currRoleId = rid;
      } else {
        this.$message.warning(msg);
      }
    },
    // 修改用户角色
    async setRole() {
      const res = await this.$http.put(`users/${this.currUserId}/role`, {
        rid: this.currRoleId
      });
      // console.log(res)
      const {
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        this.dialogFormVisibleState = false;
      } else {
        this.$message.warning(msg);
      }
    }
  }
};
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
