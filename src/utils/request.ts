import axios from 'axios'
import { useRouter } from 'vue-router'
import { ElNotification, ElMessageBox } from 'element-plus'
import { useStore } from 'vuex'
import { getToken } from '@/utils/auth'
import Config from '@/config'
const router = useRouter()
const store = useStore()

// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // api 的 base_url
  timeout: Config.timeout // 请求超时时间
})

// request拦截器
service.interceptors.request.use(function (config: any) {
  if (getToken()) {
    config.headers.Authorization = 'Bearer ' + getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
  }
  config.headers['Content-Type'] = 'application/json'
  return config
}, function (error) {
  // 对请求错误做些什么
  console.log(error) // for debug
  return Promise.reject(error)
})

// response 拦截器
service.interceptors.response.use(function (response: any) {
  const code = response.status
  const data = response.data
  if (code < 200 || code > 300) {
    ElNotification.error({ title: response.message })
    return Promise.reject(new Error('error'))
  } else if (typeof data.code === 'number' && data.code !== 200) { // 兼容提示
    if (data.code === 401) {
      location.reload() // 为了重新实例化vue-router对象 避免bug
      return Promise.reject(new Error('error'))
    }
    ElNotification.error({ title: data.msg })
    return data
  } else if (response.config.responseType === 'arraybuffer' || response.config.responseType === 'blob') {
    /*
      只要responseType是arraybuffer或者blob的文件流形式的后端接口，均用window.open方式进行下载
      设置在写接口处，例：'responseType':"arraybuffer" 或 'responseType':"blob"
    */
    const url = `${process.env.VUE_APP_BASE_API}/${response.config.url}`
    const iframe = document.createElement('iframe')
    iframe.src = url
    iframe.style.display = 'none'
    document.body.appendChild(iframe)
  } else {
    return data
  }
}, function (error) {
  let code = 0
  try {
    code = error.response.data.status
  } catch (e) {
    if (error.toString().indexOf('Error: timeout') !== -1) {
      ElNotification.error({
        title: '网络请求超时',
        duration: 2500
      })
      return Promise.reject(error)
    }
    if (error.toString().indexOf('Error: Network Error') !== -1) {
      ElNotification.error({ title: '网络请求错误', duration: 2500 })
      return Promise.reject(error)
    }
  }
  if (code === 401) {
    ElMessageBox.confirm(
      '登录状态已过期，您可以继续留在该页面，或者重新登录',
      '系统提示',
      {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }
    ).then(() => {
      store.dispatch('LogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      }).catch(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    })
  } else if (code === 403) {
    router.push({ path: '/401' })
  } else {
    const errorMsg = error.response.data.message
    if (errorMsg !== undefined) {
      ElNotification.error({ title: errorMsg, duration: 2500 })
    }
  }
  return Promise.reject(error)
})

export default service
