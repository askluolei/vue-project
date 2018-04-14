import request from '@/libs/request'

export function getUnReadMessageCount () {
  return request({
    url: '/api/message/unread',
    method: 'get'
  })
}

export function getAllMessage () {
  return request({
    url: '/api/messages',
    method: 'get'
  })
}

export function getMessageByState (state) {
  return request({
    url: '/api/message',
    method: 'get',
    params: {
      state
    }
  })
}

export function markReaded (id) {
  return request({
    url: '/api/message/read/' + id,
    method: 'put'
  })
}

export function markDelete (id) {
  return request({
    url: '/api/message/delete/' + id,
    method: 'put'
  })
}

export function reduceState (id) {
  return request({
    url: '/api/message/reduce/' + id,
    method: 'put'
  })
}
