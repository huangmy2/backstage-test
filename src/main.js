// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import store from './store'
import { getName } from '@/utils/auth'
import ElementUI from 'element-ui'
import router from './router'
import axios from 'axios'
import '../theme/index.css'
import less from 'less'
import './icons'

const whiteList = ['/login']
router.beforeEach(async (to, from, next) => {
  const hasToken = getName()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
    } else {
      const hasGetUserInfo = store.getters.name
      if (hasGetUserInfo) {
        next()
      } else {
        try {
          next()
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          // Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
        }
      }
    }
  } else {
    /* has no token */

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
    }
  }
})

// 创建axios实例
axios.defaults.withCredentials = true
let baseAxiosUrl = (location.hostname.indexOf('test') > -1 || location.hostname.indexOf('host') > -1) ? 'http://test-admin-dstock.dongqiudi.net' : (location.hostname.indexOf('beta') > -1 ? 'https://beta-admin-dstock.doujinchaogu.com' : 'https://admin.doujinchaogu.com')
let instance = axios.create({
  baseURL: baseAxiosUrl,
  withCredentials: true
})
// 添加请求拦截器
instance.interceptors.request.use(function (config) {
  config.headers['Authorization'] = sessionStorage.getItem('usertoken') || ''
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

Vue.prototype.$axios = instance

// 打开新的标签页
Vue.prototype.$goToNewBlank = function (vm, routeParams) {
  const routeUrl = vm.$router.resolve(routeParams)
  window.open(routeUrl.href, '_blank')
}

// axios.defaults.withCredentials = true
Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(less)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
