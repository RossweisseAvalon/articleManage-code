import router from '@/router'
import { useUserStore } from '@/stores'
import axios from 'axios'

const baseURL = 'http://big-event-vue-api-t.itheima.net'
const instance = axios.create({
  baseURL,
  timeout: 5000,
})

// 添加请求拦截器
instance.interceptors.request.use((config) => {
  // 携带token
  const userStore = useUserStore()
  if (userStore.token) {
    config.headers.Authorization = userStore.token
  }
  return config
}, (error) => {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
instance.interceptors.response.use((response) => {
  if (response.data.code === 0) {
    return response
  }
  // 处理失败，给错误提示，抛出错误
  ElMessage.error(response.data.message || '服务异常')
  return Promise.reject(response.data)
}, (error) => {
  // 错误的特殊情况，401 => 权限不足 或 token过期 => 拦截到登录
  if (error.response?.status === 401) {
    router.push('/login')
  }
  
  // 错误的默认情况
  ElMessage.error(error.message || '服务异常')
  return Promise.reject(error)
})

export default instance
export { baseURL }