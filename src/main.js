// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

// vuex
import store from './store'

// router
import { router } from './router/index'
import {appRouter} from './router/router'

// IView
import iView from 'iview'
import 'iview/dist/styles/iview.css'

// ElementUI
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// 国际化
import VueI18n from 'vue-i18n'
import i18n from './locale'

// 全局过滤器
import * as filters from './libs/filters'

// 模拟数据
import './mock'

Vue.config.productionTip = false
Vue.use(iView)
Vue.use(VueI18n)

Vue.use(Element, {
  size: 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})

// 全局的过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  i18n,
  render: h => h(App),
  data: {
    currentPageName: ''
  },
  mounted() {
    this.currentPageName = this.$route.name
    // 显示打开的页面的列表
    this.$store.commit('setOpenedList')
    this.$store.commit('initCachepage')
    // 权限菜单过滤相关
    this.$store.commit('updateMenulist')
  },
  created() {
    let tagsList = []
    appRouter.map((item) => {
      if (item.children.length <= 1) {
        tagsList.push(item.children[0])
      } else {
        tagsList.push(...item.children)
      }
    })
    this.$store.commit('setTagsList', tagsList)
  }
})
