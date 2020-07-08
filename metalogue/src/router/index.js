import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import { auth } from '../firebase.js'

import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import GetStore from '../views/GetStore.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(VueRouter)
Vue.use(BootstrapVue)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      authReq: true
    }
  },
  {
    path: '/about',
    name: 'About',
    component: About,
    meta: {
      authReq: false
    }
  },
  {
    path: '/getstore',
    name: 'GetStore',
    component: GetStore,
    meta: {
      authReq: true
    }
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      authReq: false
    }
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
    meta: {
      authReq: false
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const authReq = to.matched.some(x => x.meta.authReq)
  if (authReq && (!auth.currentUser || auth.currentUser === null)) {
    next('login')
  } else {
    next()
  }
})

export default router
