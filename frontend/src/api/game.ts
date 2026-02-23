import request from './index'

// 游戏信息
export interface GameInfo {
  id: number
  name: string
  title: string
  enable: number
}

// 下一期数据（与PHP格式一致）
export interface NextIssueData {
  issue: string         // 当前期号
  endtime: string       // 封盘时间 "2006-01-02 15:04:05"
  lotteryTime: string   // 开奖时间
  preIssue: string      // 上期期号
  preNum: string        // 上期开奖号码
  serverTime: string    // 服务器时间
  gameId: number
}

// 当前开奖数据
export interface CurIssueData {
  issue: string    // 期号
  nums: string     // 开奖号码
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

  // 获取下一期数据（与PHP格式一致）
  getNextIssue(gameId?: number): Promise<{ code: number; message: string; data: NextIssueData }> {
    const params: any = {}
    if (gameId) params.gameId = gameId
    return request.get('/game/nextIssue', { params })
  },

  // 获取当前开奖号码
  getCurIssue(gameId?: number): Promise<{ code: number; message: string; data: CurIssueData }> {
    const params: any = {}
    if (gameId) params.gameId = gameId
    return request.get('/game/curIssue', { params })
  },

  // 获取开奖历史
  getHistory(gameId?: number): Promise<{ code: number; message: string; data: HistoryItem[] }> {
    const params: any = {}
    if (gameId) params.gameId = gameId
    return request.get('/game/history', { params })
  },

  // 获取玩法赔率
  getPlays(gameId?: number, panId?: number): Promise<{ code: number; message: string; data: Record<string, PlayInfo> }> {
    const params: any = {}
    if (gameId) params.gameId = gameId
    if (panId) params.panId = panId
    return request.get('/game/plays', { params })
  },

  // 投注
  placeBet(params: BetParams): Promise<{ code: number; message: string; data: any }> {
    return request.post('/game/bet', params)
  }
}
