import Mock from 'mockjs'
import loginAPI from './login'

// Mock.setup({
//   timeout: '350-600'
// })

// 登录相关
Mock.mock(/\/api\/login/, 'post', loginAPI.login)
Mock.mock(/\/api\/user/, 'get', loginAPI.getUserInfo)
