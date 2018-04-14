import { param2Obj, success } from '@/libs'

const messages = [
  {
    id: 1,
    title: '欢迎登录iView-admin后台管理系统，来了解他的用途吧',
    time: 1507390106000,
    content: '这是您点击的《欢迎登录iView-admin后台管理系统，来了解他的用途吧》的相关内容。',
    state: 0 // 状态 0：未读 1：已读 2：回收站
  },
  {
    id: 2,
    title: '使用iView-admin和iView-ui组件库快速搭建你的后台系统吧',
    time: 1507390105000,
    content: '这是您点击的《使用iView-admin和iView-ui组件库快速搭建你的后台系统吧》的相关内容。',
    state: 0 // 状态 0：未读 1：已读 2：回收站
  },
  {
    id: 3,
    title: '喜欢iView-admin的话，欢迎到github主页给个star吧',
    time: 1507390109000,
    content: '这是您点击的《喜欢iView-admin的话，欢迎到github主页给个star吧》的相关内容。',
    state: 0 // 状态 0：未读 1：已读 2：回收站
  },
  {
    id: 4,
    title: '这是一条您已经读过的消息',
    time: 1507390116000,
    content: '这是您点击的《这是一条您已经读过的消息》的相关内容。',
    state: 1 // 状态 0：未读 1：已读 2：回收站
  },
  {
    id: 5,
    title: '这是一条被删除的消息',
    time: 1507390126000,
    content: '这是您点击的《这是一条被删除的消息》的相关内容。',
    state: 2 // 状态 0：未读 1：已读 2：回收站
  }
]

export default {
  getAllMessage: request => {
    return success(messages)
  },
  getMessageByState: request => {
    const { state } = param2Obj(request.url)
    const result = []
    messages.forEach(message => {
      if (message.state === state) {
        result.push(message)
      }
    })
    return success(result)
  },
  markReaded: request => {
    const index = request.url.lastIndexOf('/')
    const id = request.url.substring(index + 1)
    messages.forEach(message => {
      if (message.id === id) {
        message.state = 1
      }
    })
    return success()
  },
  markDelete: request => {
    const index = request.url.lastIndexOf('/')
    const id = request.url.substring(index + 1)
    messages.forEach(message => {
      if (message.id === id) {
        message.state = 2
      }
    })
    return success()
  },
  reduceState: request => {
    const index = request.url.lastIndexOf('/')
    const id = request.url.substring(index + 1)
    messages.forEach(message => {
      if (message.id === id && message.state === 2) {
        message.state = 1
      }
    })
    return success()
  }
}
