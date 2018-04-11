import request from '@/libs/request'

export function login(data) {
  return request({
    url: '/api/login',
    method: 'post',
    data
  })
}

export function getUserInfo(token) {
  const params = {
    token
  }
  return request({
    url: '/api/user',
    method: 'get',
    params
  })
}
