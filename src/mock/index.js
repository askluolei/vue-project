import Mock from 'mockjs'
import loginAPI from './login'
import MessageAPI from './message'

// 随机延时
// Mock.setup({
//   timeout: '350-600'
// })

/**
 * 正则表达式，或者说url，不能有连续两个重复的
 * 譬如
 * /a/b/c
 * /a/b/d
 */

// 登录相关
Mock.mock(/\/api\/login/, 'post', loginAPI.login) // 登录
Mock.mock(/\/api\/user/, 'get', loginAPI.getUserInfo) // 获取登录用户信息
Mock.mock(/\/user\/modify/, 'put', loginAPI.modifyUserInfo)
Mock.mock(/\/user\/pass/, 'put', loginAPI.modifyPassword)

Mock.mock(/\/cellphone\/code/, 'get', loginAPI.getSMScode)
Mock.mock(/\/cellphone\/check/, 'post', loginAPI.validateSMScode)


// 消息相关
Mock.mock(/\/api\/messages/, 'get', MessageAPI.getAllMessage)
Mock.mock(/\/api\/message\?\.*/, 'get', MessageAPI.getMessageByState)
Mock.mock(/\/api\/message\/read\/\d+/, 'put', MessageAPI.markReaded)
Mock.mock(/\/api\/message\/delete\/\d+/, 'put', MessageAPI.markDelete)
Mock.mock(/\/api\/message\/reduce\/\d+/, 'put', MessageAPI.reduceState)

export default Mock