import Vue from 'vue'
import Router from 'vue-router'
import iView from 'iview'
import Util from '../libs/util'
import Cookies from 'js-cookie'
import { routers, otherRouter, appRouter } from './router'
import store from '@/store'
import { getToken } from '@/libs/auth'
import { getUserInfo } from '@/api/login'

Vue.use(Router)

// 路由配置
const RouterConfig = {
  // mode: 'history',
  routes: routers
}

export const router = new Router(RouterConfig)

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  Util.title(to.meta.title)
  if (Cookies.get('locking') === '1' && to.name !== 'locking') { // 判断当前是否是锁定状态
    next({
      replace: true,
      name: 'locking'
    })
  } else if (Cookies.get('locking') === '0' && to.name === 'locking') {
    next(false)
  } else {
    if (!getToken() && to.name !== 'login') { // 判断是否已经登录且前往的页面不是登录页,没有token，或者token失效就是没登录，但是这里没有判断token失效
      next({
        name: 'login'
      })
    } else if (!getToken() && to.name === 'login') {
      next()
    } else if (getToken() && to.name === 'login') { // 判断是否已经登录且前往的是登录页
      Util.title()
      next({
        name: 'home_index'
      })
    } else {
      if (!store.getters.username) {
        // 只有token 没有用户信息，那就先去获取用户信息
        getUserInfo(getToken())
          .then(response => {
            const user = response.data.data
            console.log('user', user)
            store.commit('setUserInfo', user)
            // 获取数据后再判断权限
            const curRouterObj = Util.getRouterObjByName([otherRouter, ...appRouter], to.name)
            if (curRouterObj && curRouterObj.roles !== undefined) { // 需要判断权限的路由
              const hasRoles = store.user.roles // 有的角色
              let hasPermission = false
              if (hasRoles) {
                const requireRoles = typeof curRouterObj.roles === 'string' ? [curRouterObj.roles] : curRouterObj.roles

                hasPermission = hasRoles.some(role => requireRoles.indexOf(role) >= 0)
              }
              if (!hasPermission) {
                next({
                  replace: true,
                  name: 'error-403'
                })
              } else {
                Util.toDefaultPage([otherRouter, ...appRouter], to.name, router, next) // 如果在地址栏输入的是一级菜单则默认打开其第一个二级菜单的页面
              }
            } else { // 没有配置权限的路由, 直接通过
              Util.toDefaultPage([...routers], to.name, router, next)
            }
          })
          .catch(error => {
            // 获取失败，则跳转到登录页面
            console.log('error', error)
            next({
              name: 'login'
            })
          })
      } else {
        // 获取数据后再判断权限
        const curRouterObj = Util.getRouterObjByName([otherRouter, ...appRouter], to.name)
        if (curRouterObj && curRouterObj.roles !== undefined) { // 需要判断权限的路由
          const hasRoles = store.user.roles // 有的角色
          let hasPermission = false
          if (hasRoles) {
            const requireRoles = typeof curRouterObj.roles === 'string' ? [curRouterObj.roles] : curRouterObj.roles
            hasPermission = hasRoles.some(role => requireRoles.indexOf(role) >= 0)
          }
          if (!hasPermission) {
            next({
              replace: true,
              name: 'error-403'
            })
          } else {
            Util.toDefaultPage([otherRouter, ...appRouter], to.name, router, next) // 如果在地址栏输入的是一级菜单则默认打开其第一个二级菜单的页面
          }
        } else { // 没有配置权限的路由, 直接通过
          Util.toDefaultPage([...routers], to.name, router, next)
        }
      }
    }
  }
})

router.afterEach((to) => {
  Util.openNewPage(router.app, to.name, to.params, to.query)
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})
