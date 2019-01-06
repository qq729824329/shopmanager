import Vue from 'vue'
import Router from 'vue-router'
import {Message} from 'element-ui'

import Login from '@/components/login.vue'
import Home from '@/components/home.vue'
import Users from '@/components/Users.vue'
import Rights from '@/components/rights.vue'
import Roles from '@/components/roles.vue'

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