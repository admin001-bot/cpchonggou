// 游戏配置 - 从PHP版本config.js迁移
// 号码球样式类型
export type BallStyleType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

// 游戏配置接口
export interface GameConfig {
  id: number
  name: string
  template: string
  numStyle?: {
    lottery: BallStyleType
    history: BallStyleType
  }
  group: string
}

// 玩法分组配置接口
export interface GroupPane {
  name: string
  code: string
  tpl: string
  multiple?: boolean
}

// 玩法分组配置
export const groupConfig: Record<string, GroupPane[]> = {
  group1: [
    { name: '兩面', code: 'LM', tpl: 'lm' },
    { name: '冠亞和', code: 'HE', tpl: 'he' },
    { name: '1-5名', code: '1-5', tpl: '1-5' },
    { name: '6-10名', code: '6-10', tpl: '6-10' },
    { name: '番灘', code: 'FANTAN', tpl: 'fantan' }
  ],
  group2: [
    { name: '兩面', code: 'LM', tpl: 'lm' },
    { name: '1-5球', code: 'ALL', tpl: 'all' },
    { name: '前中後', code: 'QZH', tpl: 'qzh' },
    { name: '龍虎鬥', code: 'LONGHU', tpl: 'longhu' },
    { name: '番灘', code: 'FANTAN', tpl: 'fantan' },
    { name: '百家樂', code: 'BAIJIALE', tpl: 'baijiale' }
  ],
  group3: [
    { name: '兩面', code: 'LM', tpl: 'lm' },
    { name: '第一球', code: 'Q1', tpl: '1' },
    { name: '第二球', code: 'Q2', tpl: '2' },
    { name: '第三球', code: 'Q3', tpl: '3' },
    { name: '第四球', code: 'Q4', tpl: '4' },
    { name: '第五球', code: 'Q5', tpl: '5' },
    { name: '第六球', code: 'Q6', tpl: '6' },
    { name: '第七球', code: 'Q7', tpl: '7' },
    { name: '第八球', code: 'Q8', tpl: '8' },
    { name: '連碼', code: 'LMA', tpl: 'lma', multiple: false }
  ],
  group4: [
    { name: '兩面', code: 'LM', tpl: 'lm' },
    { name: '第一球', code: 'HE', tpl: '1' },
    { name: '第二球', code: 'Q1', tpl: '2' },
    { name: '第三球', code: 'Q3', tpl: '3' },
    { name: '第四球', code: 'Q4', tpl: '4' },
    { name: '第五球', code: 'Q5', tpl: '5' },
    { name: '連碼', code: 'LMA', tpl: 'lma', multiple: false }
  ],
  group5: [
    { name: '兩面', code: 'LM', tpl: 'lm' },
    { name: '五行', code: 'WX', tpl: 'wx' },
    { name: '正碼', code: 'ZM', tpl: 'zm' }
  ],
  group6: [
    { name: '三軍', code: 'SJ', tpl: 'sj' },
    { name: '圍骰', code: 'WS', tpl: 'ws' },
    { name: '點數', code: 'DS', tpl: 'ds' },
    { name: '長牌', code: 'CP', tpl: 'cp' },
    { name: '短牌', code: 'DP', tpl: 'dp' }
  ],
  group7: [
    { name: '特碼', code: 'TM', tpl: 'tm', multiple: false },
    { name: '兩面', code: 'LM', tpl: 'lm', multiple: false },
    { name: '正碼', code: 'ZM', tpl: 'zm', multiple: false },
    { name: '正碼1-6', code: 'ZM1-6', tpl: 'zm1-6' },
    { name: '正特', code: 'ZT', tpl: 'zt', multiple: false },
    { name: '連碼', code: 'LMA', tpl: 'lma', multiple: false },
    { name: '色波', code: 'SB', tpl: 'sb', multiple: false },
    { name: '頭尾數', code: 'TWS', tpl: 'tws', multiple: false },
    { name: '總肖', code: 'ZOX', tpl: 'zox', multiple: false },
    { name: '一肖一尾', code: 'YX', tpl: 'yx', multiple: false },
    { name: '特肖', code: 'TX', tpl: 'tx', multiple: false },
    { name: '連肖', code: 'LX', tpl: 'lx', multiple: false },
    { name: '合肖', code: 'HX', tpl: 'hx', multiple: false },
    { name: '連尾', code: 'LW', tpl: 'lw', multiple: false },
    { name: '正肖', code: 'ZX', tpl: 'zx', multiple: false },
    { name: '五行', code: 'WX', tpl: 'wx', multiple: false },
    { name: '自選不中', code: 'ZXBZ', tpl: 'zxbz', multiple: false }
  ],
  group8: [
    { name: '混合', code: 'HH', tpl: 'hh' },
    { name: '特碼', code: 'TM', tpl: 'tm' }
  ],
  group9: [
    { name: '加倍', code: 'FB', tpl: 'fb', multiple: false },
    { name: '平倍', code: 'PB', tpl: 'pb', multiple: false }
  ],
  group10: [
    { name: '兩面', code: 'LM', tpl: 'lm' },
    { name: '第一球', code: 'Q1', tpl: '1' },
    { name: '第二球', code: 'Q2', tpl: '2' },
    { name: '第三球', code: 'Q3', tpl: '3' },
    { name: '第四球', code: 'Q4', tpl: '4' },
    { name: '第五球', code: 'Q5', tpl: '5' },
    { name: '第六球', code: 'Q6', tpl: '6' },
    { name: '第七球', code: 'Q7', tpl: '7' }
  ]
}

// 游戏配置
export const lotteryConfig: Record<number, GameConfig> = {
  80: {
    id: 80,
    name: '體彩七星彩',
    template: 'qxc',
    group: 'group10'
  },
  58: {
    id: 58,
    name: 'PK10牛牛',
    template: 'pk10nn',
    numStyle: { lottery: 6, history: 8 },
    group: 'group9'
  },
  59: {
    id: 59,
    name: '秒速PK10牛牛',
    template: 'nn',
    numStyle: { lottery: 6, history: 8 },
    group: 'group9'
  },
  50: {
    id: 50,
    name: '北京賽車',
    template: 'pk10',
    numStyle: { lottery: 6, history: 8 },
    group: 'group1'
  },
  51: {
    id: 51,
    name: '澳洲幸運10',
    template: 'lcpk10',
    numStyle: { lottery: 9, history: 8 },
    group: 'group1'
  },
  52: {
    id: 52,
    name: '極速飛艇',
    template: 'msft',
    numStyle: { lottery: 9, history: 9 },
    group: 'group1'
  },
  72: {
    id: 72,
    name: '秒速賽車',
    template: 'mspk10',
    numStyle: { lottery: 6, history: 8 },
    group: 'group1'
  },
  55: {
    id: 55,
    name: '幸運飛艇',
    template: 'xyft',
    numStyle: { lottery: 9, history: 9 },
    group: 'group1'
  },
  1: {
    id: 1,
    name: '重慶時時彩',
    template: 'cqssc',
    group: 'group2'
  },
  82: {
    id: 82,
    name: '重慶七星彩',
    template: 'cqqxc',
    group: 'group2'
  },
  73: {
    id: 73,
    name: '極速時時彩',
    template: 'msssc',
    group: 'group2'
  },
  81: {
    id: 81,
    name: '騰訊分分彩',
    template: 'txffc',
    group: 'group2'
  },
  61: {
    id: 61,
    name: '重慶幸運農場',
    template: 'xync',
    group: 'group3'
  },
  21: {
    id: 21,
    name: '廣東11選5',
    template: 'gd11x5',
    group: 'group4'
  },
  60: {
    id: 60,
    name: '廣東快樂十分',
    template: 'gdklsf',
    group: 'group3'
  },
  65: {
    id: 65,
    name: '北京快樂8',
    template: 'bjkl8',
    group: 'group5'
  },
  10: {
    id: 10,
    name: '江蘇快3',
    template: 'jsk3',
    numStyle: { lottery: 10, history: 10 },
    group: 'group6'
  },
  70: {
    id: 70,
    name: '香港六合彩',
    template: 'lhc',
    numStyle: { lottery: 4, history: 4 },
    group: 'group7'
  },
  66: {
    id: 66,
    name: 'PC蛋蛋',
    template: 'pcdd',
    group: 'group8'
  },
  100: {
    id: 100,
    name: '極速分分彩',
    template: 'jsffc',
    group: 'group2'
  },
  101: {
    id: 101,
    name: '1.5分時時彩',
    template: 'rs15',
    group: 'group2'
  },
  102: {
    id: 102,
    name: '三分時時彩',
    template: 'dm3fc',
    group: 'group2'
  },
  103: {
    id: 103,
    name: '澳洲幸運5',
    template: 'kl5fc',
    group: 'group2'
  },
  119: {
    id: 119,
    name: '天津時時彩',
    template: 'tjssc',
    group: 'group2'
  },
  120: {
    id: 120,
    name: '新疆時時彩',
    template: 'xjssc',
    group: 'group2'
  },
  121: {
    id: 121,
    name: '雲南時時彩',
    template: 'ynssc',
    group: 'group2'
  },
  122: {
    id: 122,
    name: '五分時時彩',
    template: 'amssc',
    group: 'group2'
  },
  104: {
    id: 104,
    name: '三分賽車(PK10)',
    template: 'ldpk10',
    numStyle: { lottery: 6, history: 8 },
    group: 'group1'
  },
  108: {
    id: 108,
    name: 'SG飛艇',
    template: 'jsft',
    numStyle: { lottery: 9, history: 8 },
    group: 'group1'
  },
  106: {
    id: 106,
    name: '極速11選5',
    template: 'bx11x5',
    group: 'group4'
  },
  117: {
    id: 117,
    name: '上海11選5',
    template: 'sh11x5',
    group: 'group4'
  },
  118: {
    id: 118,
    name: '安徽11選5',
    template: 'ah11x5',
    group: 'group4'
  },
  105: {
    id: 105,
    name: '極速快3',
    template: 'djk3',
    numStyle: { lottery: 10, history: 10 },
    group: 'group6'
  },
  114: {
    id: 114,
    name: '廣西快3',
    template: 'gxk3',
    numStyle: { lottery: 10, history: 10 },
    group: 'group6'
  },
  115: {
    id: 115,
    name: '湖北快3',
    template: 'ahk3',
    numStyle: { lottery: 10, history: 10 },
    group: 'group6'
  },
  116: {
    id: 116,
    name: '吉林快3',
    template: 'jlk3',
    numStyle: { lottery: 10, history: 10 },
    group: 'group6'
  },
  107: {
    id: 107,
    name: '極速幸運農場',
    template: 'ynxync',
    group: 'group3'
  },
  110: {
    id: 110,
    name: '澳洲幸運20',
    template: 'hnkl8',
    group: 'group5'
  },
  111: {
    id: 111,
    name: '台灣賓果',
    template: 'twbg',
    group: 'group5'
  },
  112: {
    id: 112,
    name: '極速28',
    template: 'tg28',
    group: 'group8'
  },
  113: {
    id: 113,
    name: '極速六合彩',
    template: 'jslhc',
    numStyle: { lottery: 4, history: 4 },
    group: 'group7'
  }
}

// 获取游戏配置
export function getGameConfig(gameId: number): GameConfig | undefined {
  return lotteryConfig[gameId]
}

// 获取游戏玩法分组
export function getGamePanes(gameId: number): GroupPane[] {
  const config = getGameConfig(gameId)
  if (!config) return groupConfig.group1
  return groupConfig[config.group] || groupConfig.group1
}

// 获取所有游戏列表
export function getGameList(): GameConfig[] {
  return Object.values(lotteryConfig)
}
