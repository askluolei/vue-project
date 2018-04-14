import request from '@/libs/request'

export function login(data) {
  return request({
    url: '/api/login',
    method: 'post',
    data
  })
}

export function getUserInfo(token) {
  return request({
    url: '/api/user',
    method: 'get',
    params: {
      token
    }
  })
}

export function modifyUserInfo(data) {
  return request({
    url: '/user/modify',
    method: 'put',
    data
  })
}

export function modifyPassword(data) {
  return request({
    url: '/user/pass',
    method: 'put',
    data
  })
}

export function getSMScode() {
  return request({
    url: '/cellphone/code',
    method: 'get'
  })
}

export function validateSMScode(data) {
  return request({
    url: '/cellphone/check',
    method: 'post',
    data
  })
}
