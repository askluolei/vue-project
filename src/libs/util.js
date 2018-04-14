import axios from 'axios'

const env = process.env.NODE_ENV

let util = {

}
util.title = function(title) {
  title = title || 'iView admin'
  window.document.title = title
}

const ajaxUrl = env === 'development'
  ? 'http://127.0.0.1:8888'
  : env === 'production'
    ? 'https://www.url.com'
    : 'https://debug.url.com'

util.ajax = axios.create({
  baseURL: ajaxUrl,
  timeout: 30000
})

util.inOf = function(arr, targetArr) {
  let res = true
  arr.forEach(item => {
    if (targetArr.indexOf(item) < 0) {
      res = false
    }
  })
  return res
}

util.oneOf = function(ele, targetArr) {
  if (targetArr.indexOf(ele) >= 0) {
    return true
  } else {
    return false
  }
}

util.showThisRoute = function(requireRoles, hasRoles) {
  return util.hasPermission(hasRoles, requireRoles)
}

/**
 * 判断用户是否有权限
 * @param {当前用户拥有角色} hasRoles
 * @param {访问组件需要角色} requireRoles
 */
util.hasPermission = function(hasRoles, requireRoles) {
  if (!requireRoles) {
    return true
  }
  return hasRoles.some(role => requireRoles.indexOf(role) >= 0)
}

/**
 * 给定name，获取组件
 * 向下搜寻一层子组件
 */
util.getRouterObjByName = function(routers, name) {
  if (!name || !routers || !routers.length) {
    return null
  }
  let routerObj = null
  for (let item of routers) {
    if (item.name === name) {
      return item
    }
    routerObj = util.getRouterObjByName(item.children, name)
    if (routerObj) {
      return routerObj
    }
  }
  return null
}

/**
 * 返回要设置组件的title
 * 主要是为了实现国际化
 */
util.handleTitle = function(vm, item) {
  if (typeof item.title === 'object') {
    return vm.$t(item.title.i18n)
  } else {
    return item.title
  }
}

/**
 * 功能是设置面包屑那里显示的内容
 * 将要展现的组件名是 name
 */
util.setCurrentPath = function(vm, name) {
  let title = ''
  let isOtherRouter = false
  // 这里是找到要显示的 title（国际化）,和是不是 otherRouter 里面的组件（在BackendLayout 里面展示，但是不在左边菜单栏里面）
  vm.$store.state.app.routers.forEach(item => {
    if (item.children.length === 1) {
      if (item.children[0].name === name) {
        title = util.handleTitle(vm, item)
        if (item.name === 'otherRouter') {
          isOtherRouter = true
        }
      }
    } else {
      item.children.forEach(child => {
        if (child.name === name) {
          title = util.handleTitle(vm, child)
          if (item.name === 'otherRouter') {
            isOtherRouter = true
          }
        }
      })
    }
  })
  // currentPathArr 就是要展示的面包屑里面的数据了
  let currentPathArr = []
  if (name === 'home_index') {
    // 如果是首页，那就只有一个首页 path 为空，代表没有链接（点面包屑那里的title没跳转）
    currentPathArr = [
      {
        title: util.handleTitle(vm, util.getRouterObjByName(vm.$store.state.app.routers, 'home_index')),
        path: '',
        name: 'home_index'
      }
    ]
  } else if ((name.indexOf('_index') >= 0 || isOtherRouter) && name !== 'home_index') {
    // 如果是 otherRouter 或者 名字有 _index(命名规则，并没有规定，如果没准寻这个规则，还是根据 isOtherRouter 来判断就行了)
    // 并且不是首页 后面的条件不需要判断~~，如果是首页，第一个if 就满足了
    // 这里面包屑，除了设置首页（有链接），还加上一个当前组件，但是不给链接
    currentPathArr = [
      {
        title: util.handleTitle(vm, util.getRouterObjByName(vm.$store.state.app.routers, 'home_index')),
        path: '/home',
        name: 'home_index'
      },
      {
        title: title,
        path: '',
        name: name
      }
    ]
  } else {
    // 否则的话，就是点的左边菜单里面的组件了，找到这个组件（父组件）
    let currentPathObj = vm.$store.state.app.routers.filter(item => {
      if (item.children.length <= 1) {
        return item.children[0].name === name
      } else {
        let i = 0
        let childArr = item.children
        let len = childArr.length
        while (i < len) {
          if (childArr[i].name === name) {
            return true
          }
          i++
        }
        return false
      }
    })[0]
    if (currentPathObj.children.length <= 1 && currentPathObj.name === 'home') {
      // 首页
      currentPathArr = [
        {
          title: '首页',
          path: '',
          name: 'home_index'
        }
      ]
    } else if (currentPathObj.children.length <= 1 && currentPathObj.name !== 'home') {
      // 非首页，但是组件下面没有没有子组件或者只有1个子组件（表现就是没有下拉菜单）
      currentPathArr = [
        {
          title: '首页',
          path: '/home',
          name: 'home_index'
        },
        {
          title: currentPathObj.title,
          path: '',
          name: name
        }
      ]
    } else {
      // 有子组件，那面包屑，就有3个，首页，父组件（无链接），子组件
      let childObj = currentPathObj.children.filter((child) => {
        return child.name === name
      })[0]
      currentPathArr = [
        {
          title: '首页',
          path: '/home',
          name: 'home_index'
        },
        {
          title: currentPathObj.title,
          path: '',
          name: currentPathObj.name
        },
        {
          title: childObj.title,
          path: currentPathObj.path + '/' + childObj.path,
          name: name
        }
      ]
    }
  }
  // 设置 store 里面的当前路径
  vm.$store.commit('setCurrentPath', currentPathArr)
  return currentPathArr
}

util.openNewPage = function(vm, name, argu, query) {
  let pageOpenedList = vm.$store.state.app.pageOpenedList
  let openedPageLen = pageOpenedList.length
  let i = 0
  let tagHasOpened = false
  // 如果标签列表里面已经有了，那就替换组件的查询参数和url参数
  while (i < openedPageLen) {
    if (name === pageOpenedList[i].name) { // 页面已经打开
      vm.$store.commit('pageOpenedList', {
        index: i,
        argu: argu,
        query: query
      })
      tagHasOpened = true
      break
    }
    i++
  }
  // 如果没有,这里为啥又从 tagsList 里面取组件了
  if (!tagHasOpened) {
    let tag = vm.$store.state.app.tagsList.filter((item) => {
      if (item.children) {
        return name === item.children[0].name
      } else {
        return name === item.name
      }
    })
    tag = tag[0]
    if (tag) {
      tag = tag.children ? tag.children[0] : tag
      if (argu) {
        tag.argu = argu
      }
      if (query) {
        tag.query = query
      }
      vm.$store.commit('increateTag', tag)
    }
  }
  // 设置当前组件名
  vm.$store.commit('setCurrentPageName', name)
}

util.toDefaultPage = function(routers, name, route, next) {
  let len = routers.length
  let i = 0
  let notHandle = true
  while (i < len) {
    if (routers[i].name === name && routers[i].children && routers[i].redirect === undefined) {
      route.replace({
        name: routers[i].children[0].name
      })
      notHandle = false
      next()
      break
    }
    i++
  }
  if (notHandle) {
    next()
  }
}

util.fullscreenEvent = function(vm) {
  vm.$store.commit('initCachepage')
  // 权限菜单过滤相关
  vm.$store.commit('updateMenulist')
  // 全屏相关
}

export default util
