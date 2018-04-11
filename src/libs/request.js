/**
 * 对 axios 的封装，请求自己的后台使用这个
 * 请求其他地方，需要灵活配置的直接使用 axios
 */
import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from './auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 5000 // request timeout
})

// 请求拦截器
service.interceptors.request.use(request => {
  // Do something before request is sent
  if (store.getters.token) {
    request.headers['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
  }
  return request
}, error => {
  // Do something with request error
  console.log('request interceptor', error) // for debug
  Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code === 'success') {
      return response
    } else if (res.code === 'authentication_error') {
      return Promise.reject(response)
    } else if (res.code === 'authorization_error') {
      return Promise.reject(response)
    } else if (res.code === 'force_offline') {
      return Promise.reject(response)
    } else {
      return Promise.reject(response)
    }
  },
  /**
  * 下面的注释为通过response自定义code来标示请求状态，当code返回如下情况为权限有问题，登出并返回到登录页
  * 如通过xmlhttprequest 状态码标识 逻辑可写在下面error中
  */
  //  const res = response.data;
  //     if (res.code !== 20000) {
  //       Message({
  //         message: res.message,
  //         type: 'error',
  //         duration: 5 * 1000
  //       });
  //       // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
  //       if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
  //         MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
  //           confirmButtonText: '重新登录',
  //           cancelButtonText: '取消',
  //           type: 'warning'
  //         }).then(() => {
  //           store.dispatch('FedLogOut').then(() => {
  //             location.reload();// 为了重新实例化vue-router对象 避免bug
  //           });
  //         })
  //       }
  //       return Promise.reject('error');
  //     } else {
  //       return response.data;
  //     }
  error => {
    console.log('err' + error)// for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  })

export default service
