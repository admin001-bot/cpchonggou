import { request } from './index'

// 用户相关API

// 注册请求参数
export interface RegisterParams {
  username: string
  password: string
  phone: string
  name?: string
  parentId?: number
}

// 注册响应
export interface RegisterResponse {
  uid: number
  username: string
}

// 登录请求参数
export interface LoginParams {
  username: string
  password: string
}

// 登录响应
export interface LoginResponse {
  token: string
  user: UserInfo
}

// 用户信息
export interface UserInfo {
  uid: number
  username: string
  nickname: string
  coin: number
  grade: number
  type: number
}

// 用户信息 (与PHP一致)
export interface InitData {
  token: string
  uid: number
  username: string
  nickname: string
  coin: string
  email: string
  name: string
  phone: string
  testFlag: number
  hasFundPwd: boolean
  fanDian: number
  serverTime: number
}

// 用户API
export const userApi = {
  // 注册
  register(params: RegisterParams): Promise<{ code: number; message: string; data: RegisterResponse }> {
    return request.post('/user/register', params)
  },

  // 登录
  login(params: LoginParams): Promise<{ code: number; message: string; data: any }> {
    return request.post('/user/login', params)
  },

  // 初始化 - 类似PHP的/api/init
  init(): Promise<{ code: number; message: string; data: InitData }> {
    return request.get('init')
  },

  // 获取用户信息
  getUserInfo(): Promise<{ code: number; message: string; data: UserInfo }> {
    return request.get('/user/info')
  },

  // 获取用户信息 (别名)
  getInfo(): Promise<{ code: number; message: string; data: UserInfo }> {
    return request.get('/user/info')
  },

  // 退出登录
  logout(): Promise<{ code: number; message: string }> {
    return request.post('/user/logout')
  },
}
