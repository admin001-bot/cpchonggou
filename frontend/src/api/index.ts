import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'

// 创建axios实例
const service: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    // 默认设置 JSON 内容类型
    if (config.data && !config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json'
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data

    // 根据业务状态码判断
    if (res.code !== 0) {
      // 401 未授权 - 不显示错误消息，静默跳转
      if (res.code === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('userInfo')
        // 只在需要认证的页面跳转登录
        const currentPath = window.location.pathname
        const needAuthRoutes = ['/notcount', '/settled', '/week', '/day/', '/bank/']
        const needAuth = needAuthRoutes.some(route => currentPath.startsWith(route))
        if (needAuth) {
          window.location.href = '/login'
        }
        return Promise.reject(new Error(res.message || '未授权'))
      }

      ElMessage.error(res.message || '请求失败')
      return Promise.reject(new Error(res.message || '请求失败'))
    }

    return res
  },
  (error) => {
    // 401 错误 - 不显示错误消息
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      // 只在需要认证的页面跳转登录
      const currentPath = window.location.pathname
      const needAuthRoutes = ['/notcount', '/settled', '/week', '/day/', '/bank/']
      const needAuth = needAuthRoutes.some(route => currentPath.startsWith(route))
      if (needAuth) {
        window.location.href = '/login'
      }
      return Promise.reject(error)
    }

    // 404 错误 - 静默处理（可能是可选接口）
    if (error.response?.status === 404) {
      return Promise.reject(error)
    }

    ElMessage.error(error.message || '网络错误')
    return Promise.reject(error)
  }
)

// 封装请求方法
export const request = {
  get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return service.get(url, config)
  },
  post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return service.post(url, data, config)
  },
  put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return service.put(url, data, config)
  },
  delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return service.delete(url, config)
  },
}

export default service
