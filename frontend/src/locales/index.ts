// 多语言配置
// 默认语言: 中文繁体 (zh-TW)

export type Locale = 'zh-TW' | 'zh-CN' | 'en'

export const messages: Record<Locale, Record<string, string>> = {
  'zh-TW': {
    // 通用
    'common.login': '登入',
    'common.register': '註冊',
    'common.logout': '退出',
    'common.guest': '試玩',
    'common.home': '首頁',
    'common.game': '遊戲',
    'common.service': '客服',
    'common.mine': '我的',

    // 首页
    'home.deposit': '存/取款',
    'home.records': '投註記錄',
    'home.help': '幫助中心',
    'home.onlineService': '在線客服',

    // 游戏名称
    'game.55': '幸運飛艇',
    'game.50': '北京賽車',
    'game.122': '五分時時彩',
    'game.52': '極速飛艇',
    'game.66': 'PC蛋蛋',
    'game.100': '極速分分彩',
    'game.72': '極速賽車',
    'game.113': '極速六合彩',

    // 游戏页面
    'game.period': '期',
    'game.openTime': '開獎',
    'game.closeTime': '封盤',
    'game.closed': '已封盤',
    'game.notOpen': '未開盤',
    'game.bet': '下注',
    'game.reset': '重置',
    'game.selectedBets': '選取',
    'game.betsUnit': '注',
    'game.enterAmount': '輸入金額',
    'game.currentPeriod': '當前期',
    'game.systemMenu': '系統選單',
    'game.returnLobby': '返回大廳',
    'game.comingSoon': '功能開發中',
    'game.betList': '下注清單',
    'game.totalBets': '總注數',
    'game.totalAmount': '總金額',
    'game.cancel': '取消',
    'game.confirm': '確認',
    'game.selectPlay': '請選擇玩法',

    // 玩法
    'play.LM': '兩面',
    'play.HE': '冠亞和',
    'play.RANK': '名次',

    // 用户
    'user.username': '用戶名',
    'user.password': '密碼',
    'user.confirmPassword': '確認密碼',
    'user.phone': '手機號',
    'user.realname': '真實姓名',
  },

  'zh-CN': {
    // 通用
    'common.login': '登录',
    'common.register': '注册',
    'common.logout': '退出',
    'common.guest': '试玩',
    'common.home': '首页',
    'common.game': '游戏',
    'common.service': '客服',
    'common.mine': '我的',

    // 首页
    'home.deposit': '存/取款',
    'home.records': '投注记录',
    'home.help': '帮助中心',
    'home.onlineService': '在线客服',

    // 游戏名称
    'game.55': '幸运飞艇',
    'game.50': '北京赛车',
    'game.122': '五分时时彩',
    'game.52': '极速飞艇',
    'game.66': 'PC蛋蛋',
    'game.100': '极速分分彩',
    'game.72': '极速赛车',
    'game.113': '极速六合彩',

    // 游戏页面
    'game.period': '期',
    'game.openTime': '开奖',
    'game.closeTime': '封盘',
    'game.closed': '已封盘',
    'game.notOpen': '未开盘',
    'game.bet': '下注',
    'game.reset': '重置',
    'game.selectedBets': '选取',
    'game.betsUnit': '注',
    'game.enterAmount': '输入金额',
    'game.currentPeriod': '当前期',
    'game.systemMenu': '系统选单',
    'game.returnLobby': '返回大厅',
    'game.comingSoon': '功能开发中',
    'game.betList': '下注清单',
    'game.totalBets': '总注数',
    'game.totalAmount': '总金额',
    'game.cancel': '取消',
    'game.confirm': '确认',
    'game.selectPlay': '请选择玩法',

    // 玩法
    'play.LM': '两面',
    'play.HE': '冠亚和',
    'play.RANK': '名次',

    // 用户
    'user.username': '用户名',
    'user.password': '密码',
    'user.confirmPassword': '确认密码',
    'user.phone': '手机号',
    'user.realname': '真实姓名',
  },

  'en': {
    // Common
    'common.login': 'Login',
    'common.register': 'Register',
    'common.logout': 'Logout',
    'common.guest': 'Demo',
    'common.home': 'Home',
    'common.game': 'Game',
    'common.service': 'Service',
    'common.mine': 'Mine',

    // Home
    'home.deposit': 'Deposit',
    'home.records': 'Records',
    'home.help': 'Help',
    'home.onlineService': 'Support',

    // Game names
    'game.55': 'Lucky Airship',
    'game.50': 'Beijing Racing',
    'game.122': '5-Min Lottery',
    'game.52': 'Speed Airship',
    'game.66': 'PC Egg',
    'game.100': 'Speed Lottery',
    'game.72': 'Speed Racing',
    'game.113': 'Speed Lotto',

    // Game page
    'game.period': 'Period',
    'game.openTime': 'Draw',
    'game.closeTime': 'Close',
    'game.closed': 'Closed',
    'game.notOpen': 'Not Open',
    'game.bet': 'Bet',
    'game.reset': 'Reset',
    'game.selectedBets': 'Selected',
    'game.betsUnit': 'Bets',
    'game.enterAmount': 'Enter Amount',
    'game.currentPeriod': 'Current',
    'game.systemMenu': 'System Menu',
    'game.returnLobby': 'Return to Lobby',
    'game.comingSoon': 'Coming Soon',
    'game.betList': 'Bet List',
    'game.totalBets': 'Total Bets',
    'game.totalAmount': 'Total Amount',
    'game.cancel': 'Cancel',
    'game.confirm': 'Confirm',
    'game.selectPlay': 'Please select play',

    // Play types
    'play.LM': 'Two Sides',
    'play.HE': 'Top 2 Sum',
    'play.RANK': 'Ranking',

    // User
    'user.username': 'Username',
    'user.password': 'Password',
    'user.confirmPassword': 'Confirm Password',
    'user.phone': 'Phone',
    'user.realname': 'Real Name',
  },
}

// 获取当前语言
export function getCurrentLocale(): Locale {
  const stored = localStorage.getItem('locale')
  if (stored && (stored === 'zh-TW' || stored === 'zh-CN' || stored === 'en')) {
    return stored
  }
  return 'zh-TW' // 默认中文繁体
}

// 设置语言
export function setLocale(locale: Locale): void {
  localStorage.setItem('locale', locale)
}

// 翻译函数
export function t(key: string): string {
  const locale = getCurrentLocale()
  return messages[locale][key] || key
}
