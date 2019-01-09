import Vue from 'vue'
import Router from 'vue-router'
import {Message} from 'element-ui'

const Login= () => import ('@/components/login.vue') 
const Home= () => import ('@/components/home.vue') 
const Users= () => import ('@/components/Users.vue') 
const Rights= () => import ('@/components/rights.vue') 
const Roles= () => import ('@/components/roles.vue') 
const Goodslist= () => import ('@/components/goodslist.vue') 
const Goodsadd= () => import ('@/components/goodsadd.vue') 
const Params= () => import ('@/components/params.vue') 
const Goodscate= () => import ('@/components/goodscate.vue') 
const Order= () => import ('@/components/order.vue') 
const Reports= () => import ('@/components/reports.vue') 
Vue.use(Router)

const router = new Router({
  routes: [
    {
      name: 'home',
      path: '/',
      component: Home,
      children: [{
        name: 'users',
        path: '/users',
        component: Users
      },{
        name: 'rights',
        path: '/rights',
        component: Rights
      },{
        name: 'roles',
        path: '/roles',
        component: Roles
      },{
        name: 'goods',
        path: '/goods',
        component: Goodslist
      },{
        name: 'goodsadd',
        path: '/goodsadd',
        component: Goodsadd
      },{
        name: 'params',
        path: '/params',
        component: Params
      },{
        name: 'categories',
        path: '/categories',
        component: Goodscate
      },{
        name: 'orders',
        path: '/orders',
        component: Order
      },{
        name: 'reports',
        path: '/reports',
        component: Reports
      }]
    },
    {
      name: 'login',
      path: '/login',
      component: Login
    }
  ]
})

// 路由拦截
router.beforeEach((to, from, next) => {
  // 如果去的是登录，那么就下一步
  if (to.name === 'login') {
    next()
  } else {
    // 如果去的不是登录 检查是否有token，没有的话让它去登录
    if (!localStorage.getItem('token')) {
      // 提示去登录
      Message.warning('请先登录')
      router.push({
        name: 'login'
      })
    } else {
      // 有token，下一步
      next()
    }
  }
 
})

export default router