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

// 即时注单项
export interface NotCountItem {
  gameId: number
  name: string
  count: number
  money: number
}

// 注单明细项
export interface BetDetailItem {
  id: number
  userId: number
  userName: string
  playId: number
  playCateId: number
  playName: string
  odds: number
  rebate: number
  addTime: string
  turnNum: string
  gameId: number
  status: number
  money: number
  resultMoney: number
  orderNo: string
  lotteryNo: string
  openTime: string
  betInfo: string
}

// 今日已结项
export interface SettledItem {
  turnNum: string
  detail: string
  money: number
  resultMoney: number
  rebate: number
}

// 周记录项
export interface WeekRecordItem {
  statDate: string
  week: string
  betCount: number
  rewardRebate: number
}

// 日记录项
export interface DayRecordItem {
  gameId: number
  name: string
  count: number
  money: number
  win: number
}

// 注单API
export const betApi = {
  // 获取即时注单统计
  getNotCount(): Promise<{ code: number; message: string; data: NotCountItem[] }> {
    return request.get('/bet/notCount')
  },

  // 获取即时注单明细
  getNotCountDetail(gameId?: number): Promise<{
    code: number
    message: string
    data: BetDetailItem[]
    otherData: { totalBetMoney: number; totalResultMoney: number }
  }> {
    const params: any = {}
    if (gameId) params.gameId = gameId
    return request.get('/bet/notCountDetail', { params })
  },

  // 获取今日已结
  getBetBills(page?: number, rows?: number, gameId?: number): Promise<{
    code: number
    message: string
    data: SettledItem[]
    totalCount: number
    otherData: { totalBetMoney: number; totalResultMoney: number }
  }> {
    const params: any = {}
    if (page) params.page = page
    if (rows) params.rows = rows
    if (gameId) params.gameId = gameId
    return request.get('/bet/bills', { params })
  },

  // 获取下注记录统计
  getStatBets(startDate?: string, endDate?: string): Promise<{
    code: number
    message: string
    data: WeekRecordItem[]
  }> {
    const params: any = {}
    if (startDate) params.startDate = startDate
    if (endDate) params.endDate = endDate
    return request.get('/bet/statBets', { params })
  },

  // 获取某天各游戏统计
  getTotalStatBets(date?: string): Promise<{
    code: number
    message: string
    data: DayRecordItem[]
  }> {
    const params: any = {}
    if (date) params.date = date
    return request.get('/bet/totalStatBets', { params })
  },

  // 获取用户某天投注明细
  getUserBets(gameId?: number, date?: string): Promise<{
    code: number
    message: string
    data: BetDetailItem[]
    otherData: { totalBetMoney: number; totalResultMoney: number }
  }> {
    const params: any = {}
    if (gameId) params.gameId = gameId
    if (date) params.date = date
    return request.get('/bet/userBets', { params })
  },

  // 获取游戏数据（未结算金额、今日输赢）
  getLotteryData(gameId?: number): Promise<{
    code: number
    message: string
    data: {
      balance: number
      unbalancedMoney: number
      totalTotalMoney: number
    }
  }> {
    const params: any = {}
    if (gameId) params.gameId = gameId
    return request.get('/bet/lotteryData', { params })
  }
}
