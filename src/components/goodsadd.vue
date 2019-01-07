<template>
  <el-card class="card">
    <my-bread level1="商品管理" level2="商品列表"></my-bread>
    <!-- 提示 -->
    <el-alert class="alert" title="添加商品" type="info" center :closable="false" show-icon></el-alert>
    <!-- 步骤条 -->
    <el-steps :active="1*active" align-center>
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>
    <!-- 左侧导航 -->
    <el-form class="form" :model="form" label-position="top">
      <el-tabs @tab-click="changeTab()" tab-position="left" v-model="active">
        <el-tab-pane name="1" label="基本信息">
          <el-form-item label="商品名称">
            <el-input v-model="form.goods_name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="form.goods_price" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="form.goods_weight" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="form.goods_number" autocomplete="off"></el-input>
          </el-form-item>

          <!-- 级联选择器
          1.options 数据源
          2.v-model [被选中的label的value值]
          3.props={} 配置选项
          4.@change 选择发生改变时触发事件
          -->
          <el-form-item label="商品分类">
            <el-cascader
              clearable
              expand-trigger="hover"
              :options="options"
              v-model="selectedOptions"
              :props="defaultPorp"
              @change="handleChange"
            ></el-cascader>
          </el-form-item>
        </el-tab-pane>

        <el-tab-pane name="2" label="商品参数">
          <el-form-item :label="item1.attr_name" v-for="(item1,i) in arrDy" :key="item1.attr_id">
            <el-checkbox-group v-model="item1.attr_vals">
              <el-checkbox border v-for="(item2,i) in item1.attr_vals" :key="i" :label="item2"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="3" label="商品属性">
          <el-form-item :label="item.attr_name" v-for="(item,i) in arrStatic" :key="item.attr_id">
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="4" label="商品图片">
          <!-- 
            action: 上传图片的地址
            headers: 设置请求头部
            on-remove: 移除图片钩子函数
            on-success: 上传成功钩子函数
          -->
          <el-form-item>
            <el-upload
              action="http://localhost:8888/api/private/v1/upload"
              :headers='headers'
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="5" label="商品内容">
          <el-button type='primary' @click='addGoods()'>添加商品</el-button>
          <quill-editor v-model="form.goods_introduce">

          </quill-editor>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </el-card>
</template>

<script>
// 局部导入富文本编辑器
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'
export default {
  components: {
    quillEditor
  },
  data() {
    return {
      active: "1",
      form: {
        goods_name: "",
        goods_price: "",
        goods_weight: "",
        goods_number: "",
        goods_introduce: "",
        goods_cat: "",
        pics: [],
        attrs: []
      },
      // 级联选择器需要的数据
      options: [],
      selectedOptions: [1, 3, 6],
      defaultPorp: {
        label: "cat_name",
        value: "cat_id",
        children: "children"
      },
      // 动态参数数组
      arrDy: [],
      // 静态参数数组
      arrStatic: [],
      // checkList: []
      headers: {
        Authorization: localStorage.getItem("token")
      }
    };
  },
  created() {
    this.getGoodsCate();
  },
  methods: {
    // 获取商品分类
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
    // 选择参数时触发
    handleChange() {},
    // 点击tab时触发
    async changeTab() {
      // 判断点击的是否是第二个
      if (this.active === "2") {
        // 判断三级分类有没有
        if (this.selectedOptions.length === 3) {
          // 获取动态参数数据
          const res = await this.$http.get(
            `categories/${this.selectedOptions[2]}/attributes?sel=many`
          );
          // console.log(res)
          const {
            meta: { msg, status },
            data
          } = res.data;
          if (status === 200) {
            this.arrDy = data;
            // 遍历数据,将数据里面的attr_vals对象(字符串转为数组)
            this.arrDy.forEach(element => {
              element.attr_vals =
                element.attr_vals.trim().length === 0
                  ? []
                  : element.attr_vals.trim().split(",");
            });
          }
        } else {
          this.$message.warning("请先选择三级分类");
        }
      }
      // 判断点击的是否是第三个
      if (this.active === "3") {
        // 判断三级分类有没有
        if (this.selectedOptions.length === 3) {
          // 获取静态参数数据
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
        } else {
          this.$message.warning("请先选择三级分类");
        }
      }
    },
    // 图片移除事件
    handleRemove (file) {
      // console.log('移除成功---');
       // 数据处理:移除成功的图片的临时路径
      const index = this.form.pics.findIndex((item)=> {
        return item.pics === file.response.data.tmp_path
      })
      this.form.pics.splice(index,1)
      // console.log(this.form.pics)
    },
    // 图片上传成功事件
    handleSuccess (response) {
      // console.log('上传成功---');
      // 数据处理:上传成功的图片的临时路径
      this.form.pics.push({
        pic: response.data.tmp_path
      });
      // console.log(this.form.pics)
    },
    // 添加商品
    async addGoods () {
      // 数据处理:商品分类,数组转为逗号分隔的字符串
      this.form.goods_cat = this.selectedOptions.join(',')
      // 数据处理:商品属性
      // 动态参数数组
      const arr1 = this.arrDy
      const arr1New = arr1.map((item)=> {
        return {attr_id:item.attr_id, attr_value:item.attr_vals}
      })
      // console.log(arr1New)
      // 静态参数数组
      const arr2 = this.arrStatic
      const arr2New = arr2.map((item)=> {
        return {attr_id:item.attr_id, attr_value:item.attr_vals}
      })
      // console.log(arr2New)
      const arr = [...arr1New,...arr2New]
      this.form.attrs = arr
      const res = await this.$http.post(`goods`, this.form)
      // console.log(res)
      const {meta:{msg,status}} = res.data
      if (status===201) {
        this.$message.success(msg)
        this.$router.push({
          name: 'goods'
        })
      } else {
        this.$message.warning(msg)
      }
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
.form {
  height: 380px;
  overflow: auto;
}
.ql-editor {
  min-height: 200px;
}
</style>
