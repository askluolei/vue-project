import { param2Obj, success, fail, authenticationError } from '@/libs'

const accessToken = 'access token'

const userMap = {
  admin: {
    username: 'admin',
    password: 'admin',
    roles: ['admin'],
    authorities: ['p1', 'p2', 'p3', 'p5'],
    introduction: '我是超级管理员',
    imageUrl: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin'
  },
  user: {
    username: 'user',
    password: 'user',
    roles: ['user'],
    authorities: ['p1', 'p4'],
    introduction: '我是普通用户',
    imageUrl: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal User'
  }
}

export default {
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
  getUserInfo: request => {
    const { token } = param2Obj(request.url)
    const index = token.indexOf('_')
    const username = token.substring(0, index)
    if (userMap[username]) {
      return success(userMap[username])
    } else {
      return fail()
    }
  }
}
