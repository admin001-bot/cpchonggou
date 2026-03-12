// 游戏配置 - 从PHP版本config.js迁移
import { t } from '@/locales'

// 号码球样式类型
export type BallStyleType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

// 游戏配置接口
export interface GameConfig {
  id: number
  nameKey: string
  template: string
  numStyle?: {
    lottery: BallStyleType
    history: BallStyleType
  }
  group: string
}

// 玩法分组配置接口
export interface GroupPane {
  nameKey: string
  code: string
  tpl: string
  multiple?: boolean
}

// 获取翻译后的名称
export function getGroupPaneName(pane: GroupPane): string {
  return t(pane.nameKey)
}

export function getGameName(config: GameConfig): string {
  return t(config.nameKey)
}

// 玩法分组配置
export const groupConfig: Record<string, GroupPane[]> = {
  group1: [
    { nameKey: 'play.LM', code: 'LM', tpl: 'lm' },
    { nameKey: 'play.HE', code: 'HE', tpl: 'he' },
    { nameKey: 'play.1-5', code: '1-5', tpl: '1-5' },
    { nameKey: 'play.6-10', code: '6-10', tpl: '6-10' },
    { nameKey: 'play.FANTAN', code: 'FANTAN', tpl: 'fantan' }
  ],
  group2: [
    { nameKey: 'play.LM', code: 'LM', tpl: 'lm' },
    { nameKey: 'play.ALL', code: 'ALL', tpl: 'all' },
    { nameKey: 'play.QZH', code: 'QZH', tpl: 'qzh' },
    { nameKey: 'play.LONGHU', code: 'LONGHU', tpl: 'longhu' },
    { nameKey: 'play.FANTAN', code: 'FANTAN', tpl: 'fantan' },
    { nameKey: 'play.BAIJIALE', code: 'BAIJIALE', tpl: 'baijiale' }
  ],
  group3: [
    { nameKey: 'play.LM', code: 'LM', tpl: 'lm' },
    { nameKey: 'play.Q1', code: 'Q1', tpl: '1' },
    { nameKey: 'play.Q2', code: 'Q2', tpl: '2' },
    { nameKey: 'play.Q3', code: 'Q3', tpl: '3' },
    { nameKey: 'play.Q4', code: 'Q4', tpl: '4' },
    { nameKey: 'play.Q5', code: 'Q5', tpl: '5' },
    { nameKey: 'play.Q6', code: 'Q6', tpl: '6' },
    { nameKey: 'play.Q7', code: 'Q7', tpl: '7' },
    { nameKey: 'play.Q8', code: 'Q8', tpl: '8' },
    { nameKey: 'play.LMA', code: 'LMA', tpl: 'lma', multiple: false }
  ],
  group4: [
    { nameKey: 'play.LM', code: 'LM', tpl: 'lm' },
    { nameKey: 'play.Q1', code: 'HE', tpl: '1' },
    { nameKey: 'play.Q2', code: 'Q1', tpl: '2' },
    { nameKey: 'play.Q3', code: 'Q3', tpl: '3' },
    { nameKey: 'play.Q4', code: 'Q4', tpl: '4' },
    { nameKey: 'play.Q5', code: 'Q5', tpl: '5' },
    { nameKey: 'play.LMA', code: 'LMA', tpl: 'lma', multiple: false }
  ],
  group5: [
    { nameKey: 'play.LM', code: 'LM', tpl: 'lm' },
    { nameKey: 'play.WX', code: 'WX', tpl: 'wx' },
    { nameKey: 'play.ZM', code: 'ZM', tpl: 'zm' }
  ],
  group6: [
    { nameKey: 'play.SJ', code: 'SJ', tpl: 'sj' },
    { nameKey: 'play.WS', code: 'WS', tpl: 'ws' },
    { nameKey: 'play.DS', code: 'DS', tpl: 'ds' },
    { nameKey: 'play.CP', code: 'CP', tpl: 'cp' },
    { nameKey: 'play.DP', code: 'DP', tpl: 'dp' }
  ],
  group7: [
    { nameKey: 'play.TM', code: 'TM', tpl: 'tm', multiple: false },
    { nameKey: 'play.LM', code: 'LM', tpl: 'lm', multiple: false },
    { nameKey: 'play.ZM', code: 'ZM', tpl: 'zm', multiple: false },
    { nameKey: 'play.ZM1-6', code: 'ZM1-6', tpl: 'zm1-6' },
    { nameKey: 'play.ZT', code: 'ZT', tpl: 'zt', multiple: false },
    { nameKey: 'play.LMA', code: 'LMA', tpl: 'lma', multiple: false },
    { nameKey: 'play.SB', code: 'SB', tpl: 'sb', multiple: false },
    { nameKey: 'play.TWS', code: 'TWS', tpl: 'tws', multiple: false },
    { nameKey: 'play.ZOX', code: 'ZOX', tpl: 'zox', multiple: false },
    { nameKey: 'play.YX', code: 'YX', tpl: 'yx', multiple: false },
    { nameKey: 'play.TX', code: 'TX', tpl: 'tx', multiple: false },
    { nameKey: 'play.LX', code: 'LX', tpl: 'lx', multiple: false },
    { nameKey: 'play.HX', code: 'HX', tpl: 'hx', multiple: false },
    { nameKey: 'play.LW', code: 'LW', tpl: 'lw', multiple: false },
    { nameKey: 'play.ZX', code: 'ZX', tpl: 'zx', multiple: false },
    { nameKey: 'play.WX', code: 'WX', tpl: 'wx', multiple: false },
    { nameKey: 'play.ZXBZ', code: 'ZXBZ', tpl: 'zxbz', multiple: false }
  ],
  group8: [
    { nameKey: 'play.HH', code: 'HH', tpl: 'hh' },
    { nameKey: 'play.TM', code: 'TM', tpl: 'tm' }
  ],
  group9: [
    { nameKey: 'play.FB', code: 'FB', tpl: 'fb', multiple: false },
    { nameKey: 'play.PB', code: 'PB', tpl: 'pb', multiple: false }
  ],
  group10: [
    { nameKey: 'play.LM', code: 'LM', tpl: 'lm' },
    { nameKey: 'play.Q1', code: 'Q1', tpl: '1' },
    { nameKey: 'play.Q2', code: 'Q2', tpl: '2' },
    { nameKey: 'play.Q3', code: 'Q3', tpl: '3' },
    { nameKey: 'play.Q4', code: 'Q4', tpl: '4' },
    { nameKey: 'play.Q5', code: 'Q5', tpl: '5' },
    { nameKey: 'play.Q6', code: 'Q6', tpl: '6' },
    { nameKey: 'play.Q7', code: 'Q7', tpl: '7' }
  ]
}

// 游戏配置
export const lotteryConfig: Record<number, GameConfig> = {
  80: { id: 80, nameKey: 'game.80', template: 'qxc', group: 'group10' },
  58: { id: 58, nameKey: 'game.58', template: 'pk10nn', numStyle: { lottery: 6, history: 8 }, group: 'group9' },
  59: { id: 59, nameKey: 'game.59', template: 'nn', numStyle: { lottery: 6, history: 8 }, group: 'group9' },
  50: { id: 50, nameKey: 'game.50', template: 'pk10', numStyle: { lottery: 6, history: 8 }, group: 'group1' },
  51: { id: 51, nameKey: 'game.51', template: 'lcpk10', numStyle: { lottery: 9, history: 8 }, group: 'group1' },
  52: { id: 52, nameKey: 'game.52', template: 'msft', numStyle: { lottery: 9, history: 9 }, group: 'group1' },
  72: { id: 72, nameKey: 'game.72', template: 'mspk10', numStyle: { lottery: 6, history: 8 }, group: 'group1' },
  55: { id: 55, nameKey: 'game.55', template: 'xyft', numStyle: { lottery: 9, history: 9 }, group: 'group1' },
  1: { id: 1, nameKey: 'game.1', template: 'cqssc', group: 'group2' },
  82: { id: 82, nameKey: 'game.82', template: 'cqqxc', group: 'group2' },
  73: { id: 73, nameKey: 'game.73', template: 'msssc', group: 'group2' },
  81: { id: 81, nameKey: 'game.81', template: 'txffc', group: 'group2' },
  61: { id: 61, nameKey: 'game.61', template: 'xync', group: 'group3' },
  21: { id: 21, nameKey: 'game.21', template: 'gd11x5', group: 'group4' },
  60: { id: 60, nameKey: 'game.60', template: 'gdklsf', group: 'group3' },
  65: { id: 65, nameKey: 'game.65', template: 'bjkl8', group: 'group5' },
  10: { id: 10, nameKey: 'game.10', template: 'jsk3', numStyle: { lottery: 10, history: 10 }, group: 'group6' },
  70: { id: 70, nameKey: 'game.70', template: 'lhc', numStyle: { lottery: 4, history: 4 }, group: 'group7' },
  66: { id: 66, nameKey: 'game.66', template: 'pcdd', numStyle: { lottery: 6, history: 6 }, group: 'group8' },
  100: { id: 100, nameKey: 'game.100', template: 'jsffc', group: 'group2' },
  101: { id: 101, nameKey: 'game.101', template: 'rs15', group: 'group2' },
  102: { id: 102, nameKey: 'game.102', template: 'dm3fc', group: 'group2' },
  103: { id: 103, nameKey: 'game.103', template: 'kl5fc', group: 'group2' },
  119: { id: 119, nameKey: 'game.119', template: 'tjssc', group: 'group2' },
  120: { id: 120, nameKey: 'game.120', template: 'xjssc', group: 'group2' },
  121: { id: 121, nameKey: 'game.121', template: 'ynssc', group: 'group2' },
  122: { id: 122, nameKey: 'game.122', template: 'amssc', group: 'group2' },
  104: { id: 104, nameKey: 'game.104', template: 'ldpk10', numStyle: { lottery: 6, history: 8 }, group: 'group1' },
  108: { id: 108, nameKey: 'game.108', template: 'jsft', numStyle: { lottery: 9, history: 8 }, group: 'group1' },
  106: { id: 106, nameKey: 'game.106', template: 'bx11x5', group: 'group4' },
  117: { id: 117, nameKey: 'game.117', template: 'sh11x5', group: 'group4' },
  118: { id: 118, nameKey: 'game.118', template: 'ah11x5', group: 'group4' },
  105: { id: 105, nameKey: 'game.105', template: 'djk3', numStyle: { lottery: 10, history: 10 }, group: 'group6' },
  114: { id: 114, nameKey: 'game.114', template: 'gxk3', numStyle: { lottery: 10, history: 10 }, group: 'group6' },
  115: { id: 115, nameKey: 'game.115', template: 'ahk3', numStyle: { lottery: 10, history: 10 }, group: 'group6' },
  116: { id: 116, nameKey: 'game.116', template: 'jlk3', numStyle: { lottery: 10, history: 10 }, group: 'group6' },
  107: { id: 107, nameKey: 'game.107', template: 'ynxync', group: 'group3' },
  110: { id: 110, nameKey: 'game.110', template: 'hnkl8', group: 'group5' },
  111: { id: 111, nameKey: 'game.111', template: 'twbg', group: 'group5' },
  112: { id: 112, nameKey: 'game.112', template: 'tg28', group: 'group8' },
  113: { id: 113, nameKey: 'game.113', template: 'jslhc', numStyle: { lottery: 7, history: 7 }, group: 'group7' }
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
