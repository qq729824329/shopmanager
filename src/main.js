// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ELEMENT from 'element-ui'
import Http from '@/plugins/http'
import MyBread from '@/common/MyBread.vue'
import moment from 'moment'
// link的src不需要单独配置->在main.js中 把之前引入.css文件的代码删除掉
// import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/index.css'
import router from './router'

Vue.use(Http)
Vue.use(ELEMENT)

Vue.config.productionTip = false

// 自定义全局组件,面包屑
Vue.component(MyBread.name, MyBread)

// 过滤器,处理时间格式
Vue.filter('fmtDate', (v) => {
  return moment(v).format('YYYY-MM-DD')
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
