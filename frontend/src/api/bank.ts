import request from './index'

// 银行卡信息响应
export interface BankInfo {
  account: string
  countName: string
  username: string
  realName: string
  bankName?: string
}

// 绑定地址请求
export interface BindAddressRequest {
  bankId: number
  cardNo: string
  subAddress: string
}

// 提款配置响应
export interface WithdrawConfig {
  minMoney: number
  maxMoney: number
  cashFromTime: string
  cashToTime: string
  cashMinAmount: number
}

// 提款请求
export interface WithdrawRequest {
  amount: string
  coinPwd: string
}

// 提款响应
export interface WithdrawResponse {
  id: number
  amount: number
  state: number
  addTime: number
  message: string
}

/**
 * 获取用户银行卡信息
 */
export function getBankInfo() {
  return request<any, BankInfo>({
    url: '/bank/info',
    method: 'get'
  })
}

/**
 * 绑定提款地址
 */
export function bindAddress(data: BindAddressRequest) {
  return request.post('/bank/bindAddress', data)
}

/**
 * 获取提款配置
 */
export function getWithdrawConfig() {
  return request<any, WithdrawConfig>({
    url: '/bank/withdrawConfig',
    method: 'get'
  })
}

/**
 * 提交提款申请
 */
export function withdraw(data: WithdrawRequest) {
  return request.post('/bank/withdraw', data)
}

// 提款记录响应
export interface WithdrawRecord {
  id: number
  userId: number
  applyMoney: number
  orderNo: string
  applyTime: string
  reason: string
  checkStatus: number
  bankName: string
  bankCard: string
  bankAccount: string
}

// 存款记录响应
export interface DepositRecord {
  id: number
  userId: number
  userName: string
  accountMoney: number
  rechMoney: number
  orderNo: string
  addTime: string
  status: number
  rechTime: string
  remark: string
  rechName: string
  rechType: string
}

// 记录列表响应
export interface RecordsResponse {
  data: WithdrawRecord[] | DepositRecord[]
  totalCount: number
  otherData: any
}

// 记录列表请求参数
export interface RecordsParams {
  page?: number
  rows?: number
  startDate?: string
  endDate?: string
  status?: string
}

/**
 * 获取提款记录列表
 */
export function getWithdrawRecords(params?: RecordsParams) {
  return request<any, RecordsResponse>({
    url: '/bank/records',
    method: 'get',
    params
  })
}

/**
 * 获取存款记录列表
 */
export function getDepositRecords(params?: RecordsParams) {
  return request<any, RecordsResponse>({
    url: '/bank/depositRecords',
    method: 'get',
    params
  })
}

// 统一导出 bankApi 对象
export const bankApi = {
  getBankInfo,
  getWithdrawConfig,
  withdraw,
  bindAddress,
  getWithdrawRecords,
  getDepositRecords
}
