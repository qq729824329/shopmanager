<template>
  <el-card class="card">
    <my-bread level1="商品管理" level2="分类参数"></my-bread>
    <el-alert class="alert" title="注意:只允许为第三级分类设置参数" type="warning" :closable="false" show-icon></el-alert>
    <!-- 联级选择器 -->
    <el-form class="form" :model="form" label-position="left">
      <el-form-item label="请选择商品分类">
        <el-cascader
          :show-all-levels="false"
          clearable
          expand-trigger="hover"
          :options="options"
          v-model="selectedOptions"
          :props="defaultPorp"
          @change="changeSelectoption()"
        ></el-cascader>
      </el-form-item>
    </el-form>
    <!-- tabsn标签页 -->
    <el-tabs v-model="active" type="card" @tab-click="changeTab()">
      <el-tab-pane name="1" label="动态参数">
        <!-- 按钮 -->
        <el-button :disabled="selectedOptions.length===0" type="success" size="mini">设置动态参数</el-button>
        <!-- 表格 -->
        <el-table height="300px" stripe v-loading="loading" :data="arrDy" style="width: 100%">
          <!-- 展开项 -->
          <el-table-column type="expand" width="200">
            <template slot-scope="scope">
              <el-tag
                :key="i"
                v-for="(item,i) in scope.row.attr_vals"
                closable
                :disable-transitions="false"
                @close="handleClose(scope.row,item)"
              >{{item}}</el-tag>
              <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(scope.row)"
                @blur="handleInputConfirm(scope.row)"
              ></el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput">新增</el-button>
            </template>
          </el-table-column>
          <el-table-column type="index" label="#" width="200"></el-table-column>
          <el-table-column prop="attr_name" label="属性名称" width="200"></el-table-column>
          <el-table-column label="操作" width="350">
            <template slot-scope="scope">
              <el-button plain size="mini" type="primary" icon="el-icon-edit" circle></el-button>
              <el-button plain size="mini" type="danger" icon="el-icon-delete" circle></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane name="2" label="静态参数">
        <!-- 按钮 -->
        <el-button :disabled="selectedOptions.length===0" type="success" size="mini">设置静态参数</el-button>
        <!-- 表格 -->
        <el-table height="250" stripe v-loading="loading" :data="arrStatic" style="width: 100%">
          <el-table-column type="index" label="#" width="200"></el-table-column>
          <el-table-column prop="attr_name" label="属性名称" width="200"></el-table-column>
          <el-table-column prop="attr_vals" label="属性值" width="200"></el-table-column>
          <el-table-column label="操作" width="350">
            <template slot-scope="scope">
              <el-button plain size="mini" type="primary" icon="el-icon-edit" circle></el-button>
              <el-button plain size="mini" type="danger" icon="el-icon-delete" circle></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      form: {},
      options: [],
      selectedOptions: [],
      defaultPorp: {
        label: "cat_name",
        value: "cat_id",
        children: "children"
      },
      active: "1",
      arrDy: [],
      arrStatic: [],
      // 动态编辑tab数据
      inputVisible: false,
      inputValue: ""
    };
  },
  created() {
    this.getGoodsCate();
  },
  methods: {
    // 联动选择器
    async getGoodsCate() {
      const res = await this.$http.get(`categories?type=3`);
      // console.log(res)
      const {
        meta: { msg, status },
        data
      } = res.data;
      if (status === 200) {
        this.options = data;
      }
    },
    // 选择级联选择器时触发事件
    changeSelectoption() {
      // 判断是否是三级和是否是第一个tabs
      if (this.selectedOptions.length === 3 && this.active === "1") {
        // 获取动态参数
        this.getDyparams();
      }
      if (this.selectedOptions.length === 3 && this.active === "2") {
        // 获取动态参数
        this.getStaticparams();
      }
    },
    // 获取动态参数
    async getDyparams() {
      this.loading = true;
      const res = await this.$http.get(
        `categories/${this.selectedOptions[2]}/attributes?sel=many`
      );
      // console.log(res);
      const {
        meta: { msg, status },
        data
      } = res.data;
      if (status === 200) {
        this.loading = false;
        this.arrDy = data;
        // 遍历数据,将数据里面的attr_vals对象(字符串转为数组)
        this.arrDy.forEach(element => {
          element.attr_vals =
            element.attr_vals.trim().length === 0
              ? []
              : element.attr_vals.trim().split(",");
        });
      }
    },
    // 获取静态参数
    async getStaticparams() {
      const res = await this.$http.get(
        `categories/${this.selectedOptions[2]}/attributes?sel=only`
      );
      const {
        meta: { msg, status },
        data
      } = res.data;
      if (status === 200) {
        this.arrStatic = data;
        // console.log(this.arrStatic)
      }
    },
    // 点击tabs时触发事件
    changeTab() {
      // 判断是否是三级和是否是第一个tabs
      if (this.selectedOptions.length === 3 && this.active === "1") {
        // 获取动态参数
        this.getDyparams();
      }
      if (this.selectedOptions.length === 3 && this.active === "2") {
        // 获取动态参数
        this.getStaticparams();
      }
    },
    // 展开栏里面的事件
    // 删除参数
    async handleClose(attr, item) {
      attr.attr_vals.splice(attr.attr_vals.indexOf(item), 1);
      const putData = {
        attr_name: attr.attr_name,
        attr_sel: attr.attr_sel,
        attr_vals: attr.attr_vals.join(",")
      };
      const res = await this.$http.put(
        `categories/${this.selectedOptions[2]}/attributes/${attr.attr_id}`,
        putData
      );
      // console.log(res)
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 添加参数
    async handleInputConfirm(attr) {
      let inputValue = this.inputValue;
      if (inputValue) {
        attr.attr_vals.push(inputValue);
        const putData = {
          attr_name: attr.attr_name,
          attr_sel: attr.attr_sel,
          attr_vals: attr.attr_vals.join(",")
        };
        const res = await this.$http.put(
          `categories/${this.selectedOptions[2]}/attributes/${attr.attr_id}`,
          putData
        );
        console.log(res);
      }
      this.inputVisible = false;
      this.inputValue = "";
    }
  }
};
</script>

<style>
.card {
  height: 100%;
}
.alert {
  margin: 20px 0;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
