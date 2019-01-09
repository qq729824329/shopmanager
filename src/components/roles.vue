<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <my-bread level1="权限管理" level2="角色列表"></my-bread>
    <!-- 添加按钮 -->
    <el-row>
      <el-col>
        <el-button class="btn" type="primary" @click="showRolesconfig()">添加角色</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table :data="roles" style="width: 100%" height="398px">
      <el-table-column type="expand" width="140">
        <template slot-scope="scope">
          <el-row>
            <el-col v-if="scope.row.children.length===0">
              <span class="tisi">该角色未分配任何权限</span>
            </el-col>
          </el-row>
          <!-- 展开之后的内容 -->
          <el-row v-for="(item1,i) in scope.row.children" :key="i">
            <el-col :span="4">
              <el-tag
                @close="deleRoles(scope.row, item1)"
                closable
                class="one"
                type="success"
              >{{item1.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <el-row v-for="(item2,i) in item1.children" :key="i">
                <el-col :span="4">
                  <el-tag
                    @close="deleRoles(scope.row, item2)"
                    closable
                    class="two"
                    typr="success"
                  >{{item2.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="20">
                  <el-tag
                    @close="deleRoles(scope.row, item3)"
                    closable
                    type="success"
                    class="three"
                    v-for="(item3,i) in item2.children"
                    :key="i"
                  >{{item3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>

      <el-table-column type="index" label="#" width="140"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="180"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述" width="180"></el-table-column>
      <el-table-column label="操作" width="300">
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
            @click="showDeleconfig(scope.row)"
            type="danger"
            icon="el-icon-delete"
            circle
            plain
            size="mini"
          ></el-button>
          <el-button
            @click="showRightconfig(scope.row)"
            type="success"
            icon="el-icon-check"
            circle
            plain
            size="mini"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加角色对话框 -->
    <el-dialog title="添加角色" :visible.sync="dialogFormVisibleAdd">
      <el-form :model="form">
        <el-form-item label="角色名称" :label-width="formLabelWidth">
          <el-input v-model="form.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" :label-width="formLabelWidth">
          <el-input v-model="form.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="addRoles()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑角色对话框 -->
    <el-dialog title="编辑角色" :visible.sync="dialogFormVisibleEdit">
      <el-form :model="form">
        <el-form-item label="角色名称" :label-width="formLabelWidth">
          <el-input v-model="form.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" :label-width="formLabelWidth">
          <el-input v-model="form.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="editRoles()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配权限对话框
    :default-expanded-keys="[2, 3]" 默认展开
    :default-checked-keys="[5]" 默认选中
    -->
    <el-dialog title="分配权限" :visible.sync="dialogVisibleRight">
      <el-tree
        ref='tree'
        :default-checked-keys="checkedArr"
        default-expand-all
        :data="treeData"
        show-checkbox
        node-key="id"
        :props="defaultProps"
      ></el-tree>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleRight = false">取 消</el-button>
        <el-button type="primary" @click="setRights()">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      roles: [],
      // 删除角色
      formLabelWidth: "100px",
      dialogFormVisibleAdd: false,
      form: {
        roleName: "",
        roleDesc: ""
      },
      // 编辑角色
      dialogFormVisibleEdit: false,
      rolesId: "",
      // 分配权限
      dialogVisibleRight: false,
      // 树状数据
      treeData: [],
      defaultProps: {
        children: "children",
        label: "authName"
      },
      checkedArr: [],
      currRoleId: -1
    };
  },
  created() {
    this.getRolesData();
  },
  methods: {
    async getRolesData() {
      const res = await this.$http.get(`roles`);
      // console.log(res)
      const {
        meta: { msg, status },
        data
      } = res.data;
      if (status === 200) {
        this.roles = data;
        this.$message.success(msg);
      } else {
        this.$message.warning(msg);
      }
    },
    // 展示添加对话框
    showRolesconfig() {
      this.form = {};
      this.dialogFormVisibleAdd = true;
    },
    // 添加角色
    async addRoles() {
      const res = await this.$http.post(`roles`, this.form);
      console.log(res);
      const {
        meta: { msg, status }
      } = res.data;
      if (status === 201) {
        this.$message.success(msg);
        this.dialogFormVisibleAdd = false;
        this.getRolesData();
      } else {
        this.$message.warning(msg);
      }
    },
    // 展示删除角色对话框
    showDeleconfig(user) {
      console.log(user);
      this.$confirm("是否删除此角色?", "仔细想想", {
        confirmButtonText: "想好了",
        cancelButtonText: "再想想",
        type: "warning"
      })
        .then(async () => {
          const res = await this.$http.delete(`roles/${user.id}`);
          // console.log(res)
          const {
            meta: { msg, status }
          } = res.data;
          if (status === 200) {
            this.$message.success(msg);
            this.getRolesData();
          } else {
            this.$message.warning(msg);
          }
        })
        .catch(() => {
          this.$message.info("已取消删除!");
        });
    },
    // 展示编辑角色对话框
    async showEditconfig(user) {
      this.rolesId = user.id;
      this.dialogFormVisibleEdit = true;
      const res = await this.$http.get(`roles/${user.id}`);
      // console.log(res)
      const {
        meta: { msg, status },
        data
      } = res.data;
      if (status === 200) {
        // this.$message.success(msg)
        this.form = data;
      } else {
        this.$message.warning(msg);
      }
    },
    // 编辑角色
    async editRoles() {
      const res = await this.$http.put(`roles/${this.rolesId}`, this.form);
      // console.log(res)
      const {
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        this.dialogFormVisibleEdit = false;
        this.$message.success("修改成功");
        this.getRolesData();
      } else {
        this.$message.warning(msg);
      }
    },
    // 删除角色指定权限
    async deleRoles(roles, rights) {
      // console.log(roles,rights)
      const res = await this.$http.delete(
        `roles/${roles.id}/rights/${rights.id}`
      );
      // console.log(res)
      const {
        meta: { msg, status },
        data
      } = res.data;
      if (status === 200) {
        this.$message.success(msg);
        roles.children = data;
      } else {
        this.$message.warning(msg);
      }
    },
    // 展示分配权限对话框
    async showRightconfig(role) {
      this.currRoleId = role.id
      // console.log(role);
      const res = await this.$http.get(`rights/tree`);
      // console.log(res);
      const {
        meta: { msg, status },
        data
      } = res.data;
      if (status === 200) {
        this.treeData = data;
        // 获取该角色所拥有的权限
        const tempArr = [];
        role.children.forEach(item1 => {
          // tempArr.push(item1.id);
          item1.children.forEach(item2 => {
            // tempArr.push(item2.id);
            item2.children.forEach(item3 => {
              tempArr.push(item3.id);
            });
          });
        });
        this.checkedArr = tempArr
      }
      this.dialogVisibleRight = true;
    },
    // 分配权限
    async setRights () {
      // 全选id
      const arr1 = this.$refs.tree.getCheckedKeys();
      // 半选id
      const arr2 = this.$refs.tree.getHalfCheckedKeys();
      const arr = [...arr1, ...arr2];
      // console.log(arr)
      const res = await this.$http.post(`roles/${this.currRoleId}/rights`, {
        rids: arr.join(',')
      });
      console.log(res)
      const {meta: {msg, status}} = res.data;
      if (status===200) {
        this.$message.success(msg);
        this.dialogVisibleRight = false;
        this.getRolesData();
      } else {
        this.$message.warning(msg);
      }
    }
  }
};
</script>

<style scoped>
.box-card {
  height: 100%;
}
.btn {
  margin-top: 20px;
}
.three {
  margin-left: 10px;
  margin-top: 10px;
}
.one,
.two {
  margin-top: 10px;
}
.tisi {
  color: coral;
}
</style>
