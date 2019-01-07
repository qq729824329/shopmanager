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
        ></el-cascader>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      form: {},
      options: [],
      selectedOptions: [],
      defaultPorp: {
        label: "cat_name",
        value: "cat_id",
        children: "children"
      },
    };
  },
  created() {
    this.getGoodsCate();
  },
  methods: {
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
</style>
