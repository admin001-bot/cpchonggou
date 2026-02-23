import { request } from './index'

// 游戏相关API

// 游戏信息
export interface GameInfo {
  id: number
  name: string
  title: string
  enable: number
}

// 期号信息
export interface IssueInfo {
  issue: string
  preIssue: string
  startTime: number
  endTime: number
  lotteryTime: number
  serverTime: number
  status: number // -1:未开盘 0:已封盘 1:销售中
}

// 开奖历史
export interface HistoryItem {
  issue: string
  numbers: number[]
  time: number
}

// 玩法信息
export interface PlayInfo {
  id: number
  gameId: number
  playCateId: number
  name: string
  alias: string
  odds: number
  rebate: number
  minMoney: number
  maxMoney: number
  maxTurnMoney: number
}

// 投注请求
export interface BetParams {
  gameId: number
  issue: string
  betData: any
  totalNum: number
  totalMoney: number
}

// 游戏API
export const gameApi = {
  // 获取游戏列表
  getGameList(): Promise<{ code: number; message: string; data: GameInfo[] }> {
    return request.get('/game/list')
  },

  // 获取当前期号
  getCurrentIssue(gameId?: number): Promise<{ code: number; message: string; data: IssueInfo }> {
    const params: any = {}
    if (gameId) params.gameId = gameId
    return request.get('/game/issue', { params })
  },

  // 获取下一期期号
  getNextIssue(gameId?: number): Promise<{ code: number; message: string; data: IssueInfo }> {
    const params: any = {}
    if (gameId) params.gameId = gameId
    return request.get('/game/nextIssue', { params })
  },

  // 获取开奖历史
  getHistory(gameId?: number, limit?: number): Promise<{ code: number; message: string; data: HistoryItem[] }> {
    const params: any = {}
    if (gameId) params.gameId = gameId
    if (limit) params.limit = limit
    return request.get('/game/history', { params })
  },

  // 获取玩法赔率
  getPlays(gameId?: number): Promise<{ code: number; message: string; data: Record<string, PlayInfo> }> {
    const params: any = {}
    if (gameId) params.gameId = gameId
    return request.get('/game/plays', { params })
  },

  // 投注
  placeBet(params: BetParams): Promise<{ code: number; message: string; data: any }> {
    return request.post('/game/bet', params)
  },
}
