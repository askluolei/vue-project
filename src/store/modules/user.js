import { removeToken } from '@/libs/auth'

const user = {
  state: {
    username: '',
    nickname: '',
    roles: [],
    authorities: [],
    introduction: '',
    imageUrl: '',
    company: '',
    department: '',
    cellphone: ''
  },
  mutations: {
    setUserInfo(state, user) {
      state.username = user.username
      state.nickname = user.nickname || user.username
      state.roles = user.roles || []
      state.authorities = user.authorities || []
      state.introduction = user.introduction
      state.imageUrl = user.imageUrl
      state.company = user.company
      state.department = user.department
      state.cellphone = user.cellphone
    },
    setNickName(state, nickname) {
      if (nickname) {
        state.nickname = nickname
      }
    },
    setCellphone(state, cellphone) {
      if (cellphone) {
        state.cellphone = cellphone
      }
    },
    setRole(state, roles) {
      state.roles = roles || []
    },
    logout(state, vm) {
      // 恢复默认样式,这个没做
      let themeLink = document.querySelector('link[name="theme"]')
      if (themeLink) {
        themeLink.setAttribute('href', '')
      }

      // 清空打开的页面等数据，但是保存主题数据
      let theme = ''
      if (localStorage.theme) {
        theme = localStorage.theme
      }
      localStorage.clear()
      if (theme) {
        localStorage.theme = theme
      }
      // 删除token
      removeToken()
      // 重置数据
      state.username = ''
      state.nickname = ''
      state.roles = []
      state.authorities = []
      state.introduction = ''
      state.imageUrl = ''
    }
  }
}

export default user
