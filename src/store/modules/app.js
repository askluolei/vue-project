import {otherRouter, appRouter} from '@/router/router'
import Util from '@/libs/util'
import Vue from 'vue'
import store from '@/store'

const app = {
  state: {
    // 缓存的组件名,结合 keep-alive，性能优化
    cachePage: [],
    lang: 'zh',
    isFullScreen: false,
    openedSubmenuArr: [], // 要展开的菜单数组,作用就是当打开其他下拉列表的时候，之前展示的列表还在~~
    menuTheme: 'dark', // 主题
    themeColor: '',
    // 标签列表
    pageOpenedList: [{
      title: '首页',
      path: '',
      name: 'home_index'
    }],
    // 当前打开的组件名
    currentPageName: '',
    // 面包屑数组
    currentPath: [
      {
        title: '首页',
        path: '',
        name: 'home_index'
      }
    ], 
    // 左边菜单列表
    menuList: [],
    // 使用后台布局的 组件
    routers: [
      otherRouter,
      ...appRouter
    ],
    // 需要跟踪的标签列表，如果不在这个列表里面，那么，就算点开了组件，也不会出现在 pageOpenedList 里面
    tagsList: [...otherRouter.children],
    // 未读消息数量
    messageCount: 0,
    // 不缓存的文件名
    dontCache: ['text-editor', 'artical-publish'] // 在这里定义你不想要缓存的页面的name属性值(参见路由配置router.js)
  },
  mutations: {
    // 添加标签列表，这里的标签列表不是展示的列表，而是在这里存在的组件，才有可能在展示的标签列表里面展示
    setTagsList(state, list) {
      state.tagsList.push(...list)
    },
    /**
     * 更新菜单列表
     * 根据用户的权限(角色)来生成列表
     */
    updateMenulist(state) {
      let hasRoles = store.state.user.roles
      let menuList = []
      appRouter.forEach((item, index) => {
        if (item.roles !== undefined && item.roles.length > 0) {
          if (Util.hasPermission(hasRoles, item.roles)) {
            if (item.children.length === 1) {
              menuList.push(item)
            } else {
              let len = menuList.push(item)
              let childrenArr = []
              childrenArr = item.children.filter(child => {
                if (child.roles !== undefined && child.roles.length > 0) {
                  if (Util.hasPermission(hasRoles, child.roles)) {
                    return child
                  }
                } else {
                  return child
                }
              })
              menuList[len - 1].children = childrenArr
            }
          }
        } else {
          if (item.children.length === 1) {
            menuList.push(item)
          } else {
            let len = menuList.push(item)
            let childrenArr = []
            childrenArr = item.children.filter(child => {
              if (child.roles !== undefined && child.roles.length > 0) {
                if (Util.hasPermission(hasRoles, child.roles)) {
                  return child
                }
              } else {
                return child
              }
            })
            if (childrenArr === undefined || childrenArr.length === 0) {
              menuList.splice(len - 1, 1)
            } else {
              let handledItem = JSON.parse(JSON.stringify(menuList[len - 1]))
              handledItem.children = childrenArr
              menuList.splice(len - 1, 1, handledItem)
            }
          }
        }
      })
      state.menuList = menuList
    },
    changeMenuTheme(state, theme) {
      state.menuTheme = theme
    },
    changeMainTheme(state, mainTheme) {
      state.themeColor = mainTheme
    },
    // 添加打开的子目录列表
    addOpenSubmenu(state, name) {
      let hasThisName = false
      let isEmpty = false
      if (name.length === 0) {
        isEmpty = true
      }
      if (state.openedSubmenuArr.indexOf(name) > -1) {
        hasThisName = true
      }
      if (!hasThisName && !isEmpty) {
        state.openedSubmenuArr.push(name)
      }
    },
    closePage(state, name) {
      state.cachePage.forEach((item, index) => {
        if (item === name) {
          state.cachePage.splice(index, 1)
        }
      })
    },
    /**
     * 初始化缓存的页面
     */
    initCachepage(state) {
      if (localStorage.cachePage) {
        state.cachePage = JSON.parse(localStorage.cachePage)
      }
    },
    removeTag(state, name) {
      state.pageOpenedList.map((item, index) => {
        if (item.name === name) {
          state.pageOpenedList.splice(index, 1)
        }
      })
    },
    // 这里是添加组件参数，如果标签已经存在，那就不新加了，但是里面的组件参数替换成最新一次的
    pageOpenedList(state, get) {
      let openedPage = state.pageOpenedList[get.index]
      if (get.argu) {
        openedPage.argu = get.argu
      }
      if (get.query) {
        openedPage.query = get.query
      }
      state.pageOpenedList.splice(get.index, 1, openedPage)
      localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList)
    },
    clearAllTags(state) {
      state.pageOpenedList.splice(1)
      state.cachePage.length = 0
      localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList)
    },
    clearOtherTags(state, vm) {
      let currentName = vm.$route.name
      let currentIndex = 0
      state.pageOpenedList.forEach((item, index) => {
        if (item.name === currentName) {
          currentIndex = index
        }
      })
      if (currentIndex === 0) {
        state.pageOpenedList.splice(1)
      } else {
        state.pageOpenedList.splice(currentIndex + 1)
        state.pageOpenedList.splice(1, currentIndex - 1)
      }
      let newCachepage = state.cachePage.filter(item => {
        return item === currentName
      })
      state.cachePage = newCachepage
      localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList)
    },
    /**
     * 设置当前打开的页面列表（就是上面的标签，每次会存在localStorage，里面，这样下次打开还有记录）
     */
    setOpenedList(state) {
      state.pageOpenedList = localStorage.pageOpenedList ? JSON.parse(localStorage.pageOpenedList) : [otherRouter.children[0]]
    },
    /**
     * 设置当前组件路径，面包屑菜单用这个值
     */
    setCurrentPath(state, pathArr) {
      state.currentPath = pathArr
    },
    setCurrentPageName(state, name) {
      state.currentPageName = name
    },
    switchLang(state, lang) {
      state.lang = lang
      Vue.config.lang = lang
    },
    clearOpenedSubmenu(state) {
      state.openedSubmenuArr.length = 0
    },
    setMessageCount(state, count) {
      state.messageCount = count
    },
    // 新增标签
    increateTag(state, tagObj) {
      // 缓存组件名
      if (!Util.oneOf(tagObj.name, state.dontCache)) {
        state.cachePage.push(tagObj.name)
        localStorage.cachePage = JSON.stringify(state.cachePage)
      }
      // 标签列表里面添加一个
      state.pageOpenedList.push(tagObj)
      localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList)
    }
  }
}

export default app
