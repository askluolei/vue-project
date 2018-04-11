
import BackendLayout from '@/components/layout/backend/BackendLayout'

// 不作为Main组件的子页面展示的页面单独写，如下

export const loginRouter = {
  path: '/login',
  name: 'login',
  title: '测试',
  meta: {
    title: 'login - 登录'
  },
  component: () => import('@/components/layout/login/LoginLayout')
}

export const page404 = {
  path: '/*',
  name: 'error-404',
  meta: {
    title: '404-页面不存在'
  },
  component: () => import('@/views/error-page/404.vue')
}

export const page500 = {
  path: '/500',
  meta: {
    title: '500-服务端错误'
  },
  name: 'error-500',
  component: () => import('@/views/error-page/500.vue')
}

export const locking = {
  path: '/locking',
  name: 'locking',
  component: () => import('@/components/layout/backend/lockscreen/locking-page.vue')
}

export const page403 = {
  path: '/403',
  meta: {
    title: '403-权限不足'
  },
  name: 'error-403',
  component: () => import('@/views/error-page/403.vue')
}

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
  path: '/',
  name: 'otherRouter',
  redirect: '/home',
  component: BackendLayout,
  children: [
    { path: 'home', title: {i18n: 'home'}, name: 'home_index', component: () => import('@/views/home/index.vue') },
    { path: 'message', title: '消息中心', name: 'message_index', component: () => import('@/views/message/index.vue') }
  ]
}

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
  {
    path: '/access',
    icon: 'key',
    name: 'access',
    title: '权限管理',
    component: BackendLayout,
    children: [
      { path: 'index', title: '权限管理', name: 'access_index', component: () => import('@/views/access/index.vue') }
    ]
  },
  {
    path: '/access-test',
    icon: 'lock-combination',
    title: '权限测试页',
    name: 'accesstest',
    roles: ['admin'],
    component: BackendLayout,
    children: [
      { path: 'index', title: '权限测试页', name: 'accesstest_index', access: 0, component: () => import('@/views/access/test.vue') }
    ]
  },
  {
    path: '/component',
    icon: 'social-buffer',
    name: 'component',
    title: '组件',
    component: BackendLayout,
    children: [
      {
        path: 'md-editor',
        icon: 'pound',
        name: 'md-editor',
        title: 'Markdown编辑器',
        component: () => import('@/views/markdown-editor/index.vue')
      }
    ]
  },
  {
    path: '/error-page',
    icon: 'android-sad',
    title: '错误页面',
    name: 'errorpage',
    component: BackendLayout,
    children: [
      { path: 'index', title: '错误页面', name: 'errorpage_index', component: () => import('@/views/error-page/index.vue') }
    ]
  }
]

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
  // helloRouter,
  loginRouter,
  otherRouter,
  locking,
  ...appRouter,
  page500,
  page403,
  page404
]
