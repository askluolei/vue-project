import { param2Obj, success, fail, authenticationError } from '@/libs'

const accessToken = 'access token'

const userMap = {
  admin: {
    username: 'admin',
    nickname: '管理员大叔',
    password: 'admin',
    roles: ['admin'],
    authorities: ['p1', 'p2', 'p3', 'p5'],
    introduction: '我是超级管理员',
    imageUrl: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin',
    company: '虚拟公司',
    department: '管理部门',
    cellphone: '17712345678'
  },
  user: {
    username: 'user',
    nickname: '无权用户',
    password: 'user',
    roles: ['user'],
    authorities: ['p1', 'p4'],
    introduction: '我是普通用户',
    imageUrl: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal User',
    company: '虚拟公司',
    department: '可视化部门',
    cellphone: '17712345679'
  }
}

export default {
  // 登录
  login: request => {
    const { username, password } = JSON.parse(request.body)
    if (userMap[username] && userMap[username].password === password) {
      return success({
        accessToken: username + '_' + accessToken
      })
    } else {
      return authenticationError()
    }
  },
  // 获取用户信息
  getUserInfo: request => {
    const { token } = param2Obj(request.url)
    const index = token.indexOf('_')
    const username = token.substring(0, index)
    if (userMap[username]) {
      return success(userMap[username])
    } else {
      return fail()
    }
  },
  // 获取短信验证码
  getSMScode: request => {
    console.log('getSMScode')
    return success()
  },
  // 校验短信验证码
  validateSMScode: request => {
    console.log('validateSMScode')
    const { securityCode }  = JSON.parse(request.body)
    if (securityCode.startsWith('1')) {
      return success()
    } else {
      return fail()
    }
  },
  // 修改用户信息
  modifyUserInfo: request => {
    console.log('modifyUserInfo')
    const { username, name, cellphone }  = JSON.parse(request.body)
    const user = userMap[username]
    debugger
    if (user) {
      if (name) {
        user.nickname = name
      }
      if (cellphone) {
        user.cellphone = cellphone
      }
    }
    return success()
  },
  // 修改密码
  modifyPassword: request => {
    console.log('modifyPassword')
    const { username, oldPass, newPass, rePass }  = JSON.parse(request.body)
    const user = userMap[username]
    if (user && oldPass && newPass && user.password === oldPass && newPass === rePass) {
      user.password = rePass
      return success()
    } else {
      return fail()
    }
  }
}
