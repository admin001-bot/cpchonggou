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

  // 设置/修改提款密码 - 使用 PHP 后端
  setCoinPwd(params: {
    oldPwd: string
    newPwd: string
    loginPwd?: string
  }): Promise<{ code: number; message: string }> {
    return request.post('/safe/setCoinPwddo', params)
  },

  // 设置/修改提款密码（别名）
  setCoinPassword(params: {
    oldPwd: string
    newPwd: string
    loginPwd?: string
  }): Promise<{ code: number; message: string }> {
    return request.post('/safe/setCoinPwddo', params)
  },

  // 更新用户资料
  updateProfile(data: {
    nickname?: string
    phone?: string
    email?: string
    qq?: string
  }): Promise<{ code: number; message: string }> {
    return request.post('/user/updateProfile', data)
  },

  // 设置真实姓名（只能设置一次）
  setFullName(name: string): Promise<{ code: number; message: string }> {
    return request.post('/user/setFullNamedo', { fullName: name })
  },

  // 修改登录密码 - 使用 PHP 后端
  changePassword(oldPwd: string, newPwd: string): Promise<{ code: number; message: string }> {
    return request.post('/safe/setPasswddo', {
      oldPwd: oldPwd,
      newPwd: newPwd
    })
  },

  // 获取用户银行信息
  getUserBank(): Promise<{ code: number; message: string; data: BankInfo }> {
    return request.get('/user/getBankInfo')
  },

  // 绑定银行卡
  bindBank(data: {
    username: string
    bankId: number
    cardNo: string
    subAddress: string
  }): Promise<{ code: number; message: string }> {
    return request.post('/user/bindBankdo', data)
  },
}

// 银行卡信息接口
export interface BankInfo {
  username?: string
  bankName?: string
  cardNo?: string
  account?: string
  countname?: string
  subAddress?: string
}
