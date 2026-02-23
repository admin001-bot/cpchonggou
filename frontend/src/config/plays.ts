// 玩法配置 - 从PHP版本提取

// 玩法数据接口
export interface PlayInfo {
  id: number           // 玩法ID，如 5510101
  gameId: number       // 游戏ID
  playCateId: number   // 玩法分类ID
  name: string         // 玩法名称
  alias: string        // 玩法别名
  odds: number         // 赔率
  rebate: number       // 返点
  minMoney: number     // 最小投注金额
  maxMoney: number     // 单注最大金额
  maxTurnMoney: number // 单期最大金额
}

// 玩法数据存储
let playsData: Record<number, PlayInfo> = {}

// 设置玩法数据（从API获取后调用）
export function setPlaysData(data: Record<number, PlayInfo>) {
  playsData = data
}

// 获取玩法信息
export function getPlay(playId: number): PlayInfo | undefined {
  return playsData[playId]
}

// 获取玩法赔率
export function getPlayOdds(playId: number): string {
  const play = playsData[playId]
  if (!play) return '--'
  return play.odds.toFixed(3)
}

// 获取所有玩法数据
export function getAllPlays(): Record<number, PlayInfo> {
  return playsData
}

// PK10系列默认赔率（用于模拟数据）
export const defaultPK10Plays: Record<number, PlayInfo> = {
  // 冠亚和
  5510101: { id: 5510101, gameId: 55, playCateId: 101, name: '冠亞大', alias: 'gyda', odds: 2.2, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5510102: { id: 5510102, gameId: 55, playCateId: 101, name: '冠亞小', alias: 'gyxiao', odds: 1.77, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5510103: { id: 5510103, gameId: 55, playCateId: 101, name: '冠亞單', alias: 'gydan', odds: 1.77, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5510104: { id: 5510104, gameId: 55, playCateId: 101, name: '冠亞雙', alias: 'gyshuang', odds: 2.2, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },

  // 冠亚和数字 3-19
  5510105: { id: 5510105, gameId: 55, playCateId: 101, name: '3', alias: 'gy3', odds: 42.3, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5510106: { id: 5510106, gameId: 55, playCateId: 101, name: '4', alias: 'gy4', odds: 42.3, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5510107: { id: 5510107, gameId: 55, playCateId: 101, name: '5', alias: 'gy5', odds: 21.3, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5510108: { id: 5510108, gameId: 55, playCateId: 101, name: '6', alias: 'gy6', odds: 21.3, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5510109: { id: 5510109, gameId: 55, playCateId: 101, name: '7', alias: 'gy7', odds: 14.3, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5510110: { id: 5510110, gameId: 55, playCateId: 101, name: '8', alias: 'gy8', odds: 14.3, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5510111: { id: 5510111, gameId: 55, playCateId: 101, name: '9', alias: 'gy9', odds: 10.3, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5510112: { id: 5510112, gameId: 55, playCateId: 101, name: '10', alias: 'gy10', odds: 10.3, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5510113: { id: 5510113, gameId: 55, playCateId: 101, name: '11', alias: 'gy11', odds: 8.3, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5510114: { id: 5510114, gameId: 55, playCateId: 101, name: '12', alias: 'gy12', odds: 10.3, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5510115: { id: 5510115, gameId: 55, playCateId: 101, name: '13', alias: 'gy13', odds: 10.3, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5510116: { id: 5510116, gameId: 55, playCateId: 101, name: '14', alias: 'gy14', odds: 14.3, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5510117: { id: 5510117, gameId: 55, playCateId: 101, name: '15', alias: 'gy15', odds: 14.3, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5510118: { id: 5510118, gameId: 55, playCateId: 101, name: '16', alias: 'gy16', odds: 21.3, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5510119: { id: 5510119, gameId: 55, playCateId: 101, name: '17', alias: 'gy17', odds: 21.3, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5510120: { id: 5510120, gameId: 55, playCateId: 101, name: '18', alias: 'gy18', odds: 42.3, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5510121: { id: 5510121, gameId: 55, playCateId: 101, name: '19', alias: 'gy19', odds: 42.3, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },

  // 冠军两面
  5510211: { id: 5510211, gameId: 55, playCateId: 102, name: '冠軍大', alias: 'gjda', odds: 1.982, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5510212: { id: 5510212, gameId: 55, playCateId: 102, name: '冠軍小', alias: 'gjxiao', odds: 1.982, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5510213: { id: 5510213, gameId: 55, playCateId: 102, name: '冠軍單', alias: 'gjdan', odds: 1.982, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5510214: { id: 5510214, gameId: 55, playCateId: 102, name: '冠軍雙', alias: 'gjshuang', odds: 1.982, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5510215: { id: 5510215, gameId: 55, playCateId: 102, name: '冠軍龍', alias: 'gjlong', odds: 1.982, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5510216: { id: 5510216, gameId: 55, playCateId: 102, name: '冠軍虎', alias: 'gjhu', odds: 1.982, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },

  // 亚军两面
  5510311: { id: 5510311, gameId: 55, playCateId: 103, name: '亞軍大', alias: 'yjda', odds: 1.982, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5510312: { id: 5510312, gameId: 55, playCateId: 103, name: '亞軍小', alias: 'yjxiao', odds: 1.982, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5510313: { id: 5510313, gameId: 55, playCateId: 103, name: '亞軍單', alias: 'yjdan', odds: 1.982, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5510314: { id: 5510314, gameId: 55, playCateId: 103, name: '亞軍雙', alias: 'yjshuang', odds: 1.982, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5510315: { id: 5510315, gameId: 55, playCateId: 103, name: '亞軍龍', alias: 'yjlong', odds: 1.982, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5510316: { id: 5510316, gameId: 55, playCateId: 103, name: '亞軍虎', alias: 'yjhu', odds: 1.982, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },

  // 第三名两面
  5510411: { id: 5510411, gameId: 55, playCateId: 104, name: '第三大', alias: 'd3da', odds: 1.982, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5510412: { id: 5510412, gameId: 55, playCateId: 104, name: '第三小', alias: 'd3xiao', odds: 1.982, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5510413: { id: 5510413, gameId: 55, playCateId: 104, name: '第三單', alias: 'd3dan', odds: 1.982, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5510414: { id: 5510414, gameId: 55, playCateId: 104, name: '第三雙', alias: 'd3shuang', odds: 1.982, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5510415: { id: 5510415, gameId: 55, playCateId: 104, name: '第三龍', alias: 'd3long', odds: 1.982, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5510416: { id: 5510416, gameId: 55, playCateId: 104, name: '第三虎', alias: 'd3hu', odds: 1.982, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },

  // 第四名两面
  5510511: { id: 5510511, gameId: 55, playCateId: 105, name: '第四大', alias: 'd4da', odds: 1.982, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5510512: { id: 5510512, gameId: 55, playCateId: 105, name: '第四小', alias: 'd4xiao', odds: 1.982, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5510513: { id: 5510513, gameId: 55, playCateId: 105, name: '第四單', alias: 'd4dan', odds: 1.982, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5510514: { id: 5510514, gameId: 55, playCateId: 105, name: '第四雙', alias: 'd4shuang', odds: 1.982, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5510515: { id: 5510515, gameId: 55, playCateId: 105, name: '第四龍', alias: 'd4long', odds: 1.982, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5510516: { id: 5510516, gameId: 55, playCateId: 105, name: '第四虎', alias: 'd4hu', odds: 1.982, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },

  // 第五名两面
  5510611: { id: 5510611, gameId: 55, playCateId: 106, name: '第五大', alias: 'd5da', odds: 1.982, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5510612: { id: 5510612, gameId: 55, playCateId: 106, name: '第五小', alias: 'd5xiao', odds: 1.982, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5510613: { id: 5510613, gameId: 55, playCateId: 106, name: '第五單', alias: 'd5dan', odds: 1.982, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5510614: { id: 5510614, gameId: 55, playCateId: 106, name: '第五雙', alias: 'd5shuang', odds: 1.982, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5510615: { id: 5510615, gameId: 55, playCateId: 106, name: '第五龍', alias: 'd5long', odds: 1.982, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5510616: { id: 5510616, gameId: 55, playCateId: 106, name: '第五虎', alias: 'd5hu', odds: 1.982, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },

  // 第六名两面
  5510711: { id: 5510711, gameId: 55, playCateId: 107, name: '第六大', alias: 'd6da', odds: 1.982, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5510712: { id: 5510712, gameId: 55, playCateId: 107, name: '第六小', alias: 'd6xiao', odds: 1.982, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5510713: { id: 5510713, gameId: 55, playCateId: 107, name: '第六單', alias: 'd6dan', odds: 1.982, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5510714: { id: 5510714, gameId: 55, playCateId: 107, name: '第六雙', alias: 'd6shuang', odds: 1.982, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },

  // 第七名两面
  5510811: { id: 5510811, gameId: 55, playCateId: 108, name: '第七大', alias: 'd7da', odds: 1.982, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5510812: { id: 5510812, gameId: 55, playCateId: 108, name: '第七小', alias: 'd7xiao', odds: 1.982, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5510813: { id: 5510813, gameId: 55, playCateId: 108, name: '第七單', alias: 'd7dan', odds: 1.982, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5510814: { id: 5510814, gameId: 55, playCateId: 108, name: '第七雙', alias: 'd7shuang', odds: 1.982, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },

  // 第八名两面
  5510911: { id: 5510911, gameId: 55, playCateId: 109, name: '第八大', alias: 'd8da', odds: 1.982, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5510912: { id: 5510912, gameId: 55, playCateId: 109, name: '第八小', alias: 'd8xiao', odds: 1.982, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5510913: { id: 5510913, gameId: 55, playCateId: 109, name: '第八單', alias: 'd8dan', odds: 1.982, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5510914: { id: 5510914, gameId: 55, playCateId: 109, name: '第八雙', alias: 'd8shuang', odds: 1.982, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },

  // 第九名两面
  5511011: { id: 5511011, gameId: 55, playCateId: 110, name: '第九大', alias: 'd9da', odds: 1.982, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5511012: { id: 5511012, gameId: 55, playCateId: 110, name: '第九小', alias: 'd9xiao', odds: 1.982, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5511013: { id: 5511013, gameId: 55, playCateId: 110, name: '第九單', alias: 'd9dan', odds: 1.982, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5511014: { id: 5511014, gameId: 55, playCateId: 110, name: '第九雙', alias: 'd9shuang', odds: 1.982, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },

  // 第十名两面
  5511111: { id: 5511111, gameId: 55, playCateId: 111, name: '第十大', alias: 'd10da', odds: 1.982, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5511112: { id: 5511112, gameId: 55, playCateId: 111, name: '第十小', alias: 'd10xiao', odds: 1.982, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5511113: { id: 5511113, gameId: 55, playCateId: 111, name: '第十單', alias: 'd10dan', odds: 1.982, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5511114: { id: 5511114, gameId: 55, playCateId: 111, name: '第十雙', alias: 'd10shuang', odds: 1.982, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },

  // 第一名数字 (1-10)
  5501101: { id: 5501101, gameId: 55, playCateId: 201, name: '1', alias: 'n1', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5501102: { id: 5501102, gameId: 55, playCateId: 201, name: '2', alias: 'n2', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5501103: { id: 5501103, gameId: 55, playCateId: 201, name: '3', alias: 'n3', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5501104: { id: 5501104, gameId: 55, playCateId: 201, name: '4', alias: 'n4', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5501105: { id: 5501105, gameId: 55, playCateId: 201, name: '5', alias: 'n5', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5501106: { id: 5501106, gameId: 55, playCateId: 201, name: '6', alias: 'n6', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5501107: { id: 5501107, gameId: 55, playCateId: 201, name: '7', alias: 'n7', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5501108: { id: 5501108, gameId: 55, playCateId: 201, name: '8', alias: 'n8', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5501109: { id: 5501109, gameId: 55, playCateId: 201, name: '9', alias: 'n9', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5501110: { id: 5501110, gameId: 55, playCateId: 201, name: '10', alias: 'n10', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },

  // 第二名数字 (1-10)
  5501201: { id: 5501201, gameId: 55, playCateId: 202, name: '1', alias: 'n1', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5501202: { id: 5501202, gameId: 55, playCateId: 202, name: '2', alias: 'n2', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5501203: { id: 5501203, gameId: 55, playCateId: 202, name: '3', alias: 'n3', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5501204: { id: 5501204, gameId: 55, playCateId: 202, name: '4', alias: 'n4', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5501205: { id: 5501205, gameId: 55, playCateId: 202, name: '5', alias: 'n5', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5501206: { id: 5501206, gameId: 55, playCateId: 202, name: '6', alias: 'n6', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5501207: { id: 5501207, gameId: 55, playCateId: 202, name: '7', alias: 'n7', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5501208: { id: 5501208, gameId: 55, playCateId: 202, name: '8', alias: 'n8', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5501209: { id: 5501209, gameId: 55, playCateId: 202, name: '9', alias: 'n9', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5501210: { id: 5501210, gameId: 55, playCateId: 202, name: '10', alias: 'n10', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },

  // 第三名数字 (1-10)
  5501301: { id: 5501301, gameId: 55, playCateId: 203, name: '1', alias: 'n1', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5501302: { id: 5501302, gameId: 55, playCateId: 203, name: '2', alias: 'n2', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5501303: { id: 5501303, gameId: 55, playCateId: 203, name: '3', alias: 'n3', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5501304: { id: 5501304, gameId: 55, playCateId: 203, name: '4', alias: 'n4', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5501305: { id: 5501305, gameId: 55, playCateId: 203, name: '5', alias: 'n5', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5501306: { id: 5501306, gameId: 55, playCateId: 203, name: '6', alias: 'n6', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5501307: { id: 5501307, gameId: 55, playCateId: 203, name: '7', alias: 'n7', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5501308: { id: 5501308, gameId: 55, playCateId: 203, name: '8', alias: 'n8', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5501309: { id: 5501309, gameId: 55, playCateId: 203, name: '9', alias: 'n9', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5501310: { id: 5501310, gameId: 55, playCateId: 203, name: '10', alias: 'n10', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },

  // 第四名数字 (1-10)
  5501401: { id: 5501401, gameId: 55, playCateId: 204, name: '1', alias: 'n1', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5501402: { id: 5501402, gameId: 55, playCateId: 204, name: '2', alias: 'n2', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5501403: { id: 5501403, gameId: 55, playCateId: 204, name: '3', alias: 'n3', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5501404: { id: 5501404, gameId: 55, playCateId: 204, name: '4', alias: 'n4', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5501405: { id: 5501405, gameId: 55, playCateId: 204, name: '5', alias: 'n5', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5501406: { id: 5501406, gameId: 55, playCateId: 204, name: '6', alias: 'n6', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5501407: { id: 5501407, gameId: 55, playCateId: 204, name: '7', alias: 'n7', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5501408: { id: 5501408, gameId: 55, playCateId: 204, name: '8', alias: 'n8', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5501409: { id: 5501409, gameId: 55, playCateId: 204, name: '9', alias: 'n9', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5501410: { id: 5501410, gameId: 55, playCateId: 204, name: '10', alias: 'n10', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },

  // 第五名数字 (1-10)
  5501501: { id: 5501501, gameId: 55, playCateId: 205, name: '1', alias: 'n1', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5501502: { id: 5501502, gameId: 55, playCateId: 205, name: '2', alias: 'n2', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5501503: { id: 5501503, gameId: 55, playCateId: 205, name: '3', alias: 'n3', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5501504: { id: 5501504, gameId: 55, playCateId: 205, name: '4', alias: 'n4', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5501505: { id: 5501505, gameId: 55, playCateId: 205, name: '5', alias: 'n5', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5501506: { id: 5501506, gameId: 55, playCateId: 205, name: '6', alias: 'n6', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5501507: { id: 5501507, gameId: 55, playCateId: 205, name: '7', alias: 'n7', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5501508: { id: 5501508, gameId: 55, playCateId: 205, name: '8', alias: 'n8', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5501509: { id: 5501509, gameId: 55, playCateId: 205, name: '9', alias: 'n9', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5501510: { id: 5501510, gameId: 55, playCateId: 205, name: '10', alias: 'n10', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },

  // 第六名数字 (1-10)
  5501601: { id: 5501601, gameId: 55, playCateId: 206, name: '1', alias: 'n1', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5501602: { id: 5501602, gameId: 55, playCateId: 206, name: '2', alias: 'n2', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5501603: { id: 5501603, gameId: 55, playCateId: 206, name: '3', alias: 'n3', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5501604: { id: 5501604, gameId: 55, playCateId: 206, name: '4', alias: 'n4', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5501605: { id: 5501605, gameId: 55, playCateId: 206, name: '5', alias: 'n5', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5501606: { id: 5501606, gameId: 55, playCateId: 206, name: '6', alias: 'n6', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5501607: { id: 5501607, gameId: 55, playCateId: 206, name: '7', alias: 'n7', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5501608: { id: 5501608, gameId: 55, playCateId: 206, name: '8', alias: 'n8', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5501609: { id: 5501609, gameId: 55, playCateId: 206, name: '9', alias: 'n9', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5501610: { id: 5501610, gameId: 55, playCateId: 206, name: '10', alias: 'n10', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },

  // 第七名数字 (1-10)
  5501701: { id: 5501701, gameId: 55, playCateId: 207, name: '1', alias: 'n1', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5501702: { id: 5501702, gameId: 55, playCateId: 207, name: '2', alias: 'n2', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5501703: { id: 5501703, gameId: 55, playCateId: 207, name: '3', alias: 'n3', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5501704: { id: 5501704, gameId: 55, playCateId: 207, name: '4', alias: 'n4', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5501705: { id: 5501705, gameId: 55, playCateId: 207, name: '5', alias: 'n5', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5501706: { id: 5501706, gameId: 55, playCateId: 207, name: '6', alias: 'n6', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5501707: { id: 5501707, gameId: 55, playCateId: 207, name: '7', alias: 'n7', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5501708: { id: 5501708, gameId: 55, playCateId: 207, name: '8', alias: 'n8', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5501709: { id: 5501709, gameId: 55, playCateId: 207, name: '9', alias: 'n9', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5501710: { id: 5501710, gameId: 55, playCateId: 207, name: '10', alias: 'n10', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },

  // 第八名数字 (1-10)
  5501801: { id: 5501801, gameId: 55, playCateId: 208, name: '1', alias: 'n1', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5501802: { id: 5501802, gameId: 55, playCateId: 208, name: '2', alias: 'n2', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5501803: { id: 5501803, gameId: 55, playCateId: 208, name: '3', alias: 'n3', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5501804: { id: 5501804, gameId: 55, playCateId: 208, name: '4', alias: 'n4', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5501805: { id: 5501805, gameId: 55, playCateId: 208, name: '5', alias: 'n5', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5501806: { id: 5501806, gameId: 55, playCateId: 208, name: '6', alias: 'n6', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5501807: { id: 5501807, gameId: 55, playCateId: 208, name: '7', alias: 'n7', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5501808: { id: 5501808, gameId: 55, playCateId: 208, name: '8', alias: 'n8', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5501809: { id: 5501809, gameId: 55, playCateId: 208, name: '9', alias: 'n9', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5501810: { id: 5501810, gameId: 55, playCateId: 208, name: '10', alias: 'n10', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },

  // 第九名数字 (1-10)
  5501901: { id: 5501901, gameId: 55, playCateId: 209, name: '1', alias: 'n1', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5501902: { id: 5501902, gameId: 55, playCateId: 209, name: '2', alias: 'n2', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5501903: { id: 5501903, gameId: 55, playCateId: 209, name: '3', alias: 'n3', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5501904: { id: 5501904, gameId: 55, playCateId: 209, name: '4', alias: 'n4', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5501905: { id: 5501905, gameId: 55, playCateId: 209, name: '5', alias: 'n5', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5501906: { id: 5501906, gameId: 55, playCateId: 209, name: '6', alias: 'n6', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5501907: { id: 5501907, gameId: 55, playCateId: 209, name: '7', alias: 'n7', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5501908: { id: 5501908, gameId: 55, playCateId: 209, name: '8', alias: 'n8', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5501909: { id: 5501909, gameId: 55, playCateId: 209, name: '9', alias: 'n9', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5501910: { id: 5501910, gameId: 55, playCateId: 209, name: '10', alias: 'n10', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },

  // 第十名数字 (1-10)
  5502001: { id: 5502001, gameId: 55, playCateId: 210, name: '1', alias: 'n1', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5502002: { id: 5502002, gameId: 55, playCateId: 210, name: '2', alias: 'n2', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5502003: { id: 5502003, gameId: 55, playCateId: 210, name: '3', alias: 'n3', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5502004: { id: 5502004, gameId: 55, playCateId: 210, name: '4', alias: 'n4', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5502005: { id: 5502005, gameId: 55, playCateId: 210, name: '5', alias: 'n5', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5502006: { id: 5502006, gameId: 55, playCateId: 210, name: '6', alias: 'n6', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5502007: { id: 5502007, gameId: 55, playCateId: 210, name: '7', alias: 'n7', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5502008: { id: 5502008, gameId: 55, playCateId: 210, name: '8', alias: 'n8', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5502009: { id: 5502009, gameId: 55, playCateId: 210, name: '9', alias: 'n9', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 },
  5502010: { id: 5502010, gameId: 55, playCateId: 210, name: '10', alias: 'n10', odds: 9.85, rebate: 0, minMoney: 10, maxMoney: 50000, maxTurnMoney: 200000 }
}

// 不再初始化默认数据，由API加载
// setPlaysData(defaultPK10Plays)
