import Vue from 'vue'
import axios from 'axios'
import store from '@/store'
import notification from 'ant-design-vue/es/notification'
import { VueAxios } from './axios'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import config from '@/config/defaultSettings'
// 创建 axios 实例
const service = axios.create({
  baseURL: config.BASE_URL, // api base_url
  timeout: 6000 // 请求超时时间
})

const err = (error) => {
  if (error.response) {
    const data = error.response.data
    const token = Vue.ls.get(ACCESS_TOKEN)
    if (error.response.status === 403) {
      notification.error({
        message: '禁止访问',
        description: data.message
      })
    }
    if (error.response.status === 401 && !(data.result && data.result.isLogin)) {
      notification.error({
        message: '权限错误',
        description: '认证授权失败'
      })
      if (token) {
        store.dispatch('Logout').then(() => {
          setTimeout(() => {
            window.location.reload()
          }, 1500)
        })
      }
    }
    if (error.response.status === 422) {
      notification.error({
        message: '请求错误',
        description: '请求格式错误'
      })
    }
    if (error.response.status === 405) {
      notification.error({
        message: '请求错误',
        description: '请求方式错误'
      })
    }
    if (error.response.status === 404) {
      notification.error({
        message: '请求错误',
        description: '资源不存在'
      })
    }
    if (error.response.status === 612) {
      notification.error({
        message: '请求错误',
        description: '指定资源不存在或已被删除'
      })
    }
    if (error.response.status === 500) {
      notification.error({
        message: '服务端错误',
        description: '服务器出错'
      })
    }
    if (error.response.status === 599) {
      notification.error({
        message: '服务端错误',
        description: '服务端操作失败'
      })
    }
  }
  return Promise.reject(error)
}

// request interceptor
service.interceptors.request.use(config => {
  const token = Vue.ls.get(ACCESS_TOKEN)
  if (token) {
    config.headers['Access-Token'] = token // 让每个请求携带自定义 token 请根据实际情况自行修改
  }
  return config
}, err)

// response interceptor
service.interceptors.response.use((response) => {
  if (response.data.message && response.data.code === 200) {
    notification.success({
      message: '成功',
      description: response.data.message
    })
  }
  return response.data
}, err)

const installer = {
  vm: {},
  install (Vue) {
    Vue.use(VueAxios, service)
  }
}

export {
  installer as VueAxios,
  service as axios
}
