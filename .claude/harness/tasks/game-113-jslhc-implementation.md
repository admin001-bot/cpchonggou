# 游戏 ID 113（極速六合粲）页面重构实施文档

## 1. 任务概述

**目标**：根据 PHP 原版 UI 和逻辑，完整重构 `/game/113` 页面（極速六合粲）

**优先级**：High

**预计工作量**：2-3 个会话

---

## 2. 游戏分析

### 2.1 游戏基本信息

| 属性 | 值 |
|------|-----|
| 游戏 ID | 113 |
| 游戏名称 | 極速六合粲 |
| 模板名称 | jslhc |
| 开奖号码 | 7 个球（6 个正码 + 1 个特码） |
| 游戏分组 | group7 |
| 期数频率 | 5 分钟/期 |

### 2.2 开奖号码结构

```
極速六合粲 = 6 个正码 + 1 个特码
例：03, 15, 22, 31, 42, 48 + 17
     │   │   │   │   │   │    │
     └───┴───┴───┴───┴───┴────┴── 正码 1-6
                              └── 特码
```

### 2.3 玩法分组（group7）

当前 `games.ts` 中定义的 group7 玩法：

```typescript
group7: [
  { name: '特碼', code: 'TM', tpl: 'tm', multiple: true },
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
]
```

---

## 3. PHP 模板分析

### 3.1 PHP 模板文件位置

- `views/lottery/templates/jslhc/tm.html` - 特码玩法
- `views/lottery/templates/jslhc/lm.html` - 两面玩法
- `views/lottery/templates/jslhc/tx.html` - 特肖玩法
- `views/lottery/templates/jslhc/sb.html` - 色波玩法

### 3.2 PlayID 规则分析

#### 3.2.1 特码（TM）

- 特码A 1-49: 1138501 - 1138549
- 特码B 1-49: 1138550 - 1138598

**计算公式**：
```
playId = 113 * 100000 + 85 * 1000 + number (1-49)
```

#### 3.2.2 两面（LM）

| 玩法 | PlayID | 说明 |
|------|--------|------|
| 特大 | 1138601 | 特码 > 24 |
| 特小 | 1138602 | 特码 ≤ 24 |
| 特单 | 1138603 | 特码为奇数 |
| 特双 | 1138604 | 特码为偶数 |
| 特合大 | 1138605 | 十位+个位 ≥ 7 |
| 特合小 | 1138606 | 十位+个位 ≤ 6 |
| 特合单 | 1138607 | 十位+个位为奇数 |
| 特合双 | 1138608 | 十位+个位为偶数 |
| 特尾大 | 1138609 | 尾数 5-9 |
| 特尾小 | 1138610 | 尾数 0-4 |
| 特大单 | 1138611 | 大 + 单 |
| 特大双 | 1138612 | 大 + 双 |
| 特小单 | 1138613 | 小 + 单 |
| 特小双 | 1138614 | 小 + 双 |
| 总和单 | 1138621 | 7个号码总和为奇数 |
| 总和双 | 1138622 | 7个号码总和为偶数 |
| 总和大 | 1138623 | 7个号码总和 ≥ 175 |
| 总和小 | 1138624 | 7个号码总和 ≤ 174 |

**计算公式**：
```
playId = 113 * 10000 + 86 * 100 + sequence
```

#### 3.2.3 色波（SB）

| 玩法 | PlayID |
|------|--------|
| 红波 | 1138701 |
| 蓝波 | 1138702 |
| 绿波 | 1138703 |
| 红单 | 1138704 |
| 红双 | 1138705 |
| 红大 | 1138706 |
| 红小 | 1138707 |
| 蓝单 | 1138708 |
| 蓝双 | 1138709 |
| 蓝大 | 1138710 |
| 蓝小 | 1138711 |
| 绿单 | 1138712 |
| 绿双 | 1138713 |
| 绿大 | 1138714 |
| 绿小 | 1138715 |
| 红大单 | 1138716 |
| 红大双 | 1138717 |
| 红小单 | 1138718 |
| 红小双 | 1138719 |
| 蓝大单 | 1138720 |
| 蓝大双 | 1138721 |
| 蓝小单 | 1138722 |
| 蓝小双 | 1138723 |
| 绿大单 | 1138724 |
| 绿大双 | 1138725 |
| 绿小单 | 1138726 |
| 绿小双 | 1138727 |

#### 3.2.4 特肖（TX）

| 生肖 | PlayID | 号码 |
|------|--------|------|
| 鼠 | 1138801 | 08,20,32,44 |
| 牛 | 1138802 | 07,19,31,43 |
| 虎 | 1138803 | 06,18,30,42 |
| 兔 | 1138804 | 05,17,29,41 |
| 龙 | 1138805 | 04,16,28,40 |
| 蛇 | 1138806 | 03,15,27,39 |
| 马 | 1138807 | 02,14,26,38 |
| 羊 | 1138808 | 01,13,25,37,49 |
| 猴 | 1138809 | 12,24,36,48 |
| 鸡 | 1138810 | 11,23,35,47 |
| 狗 | 1138811 | 10,22,34,46 |
| 猪 | 1138812 | 09,21,33,45 |

#### 3.2.5 七色波

| 玩法 | PlayID |
|------|--------|
| 红波 | 1139601 |
| 蓝波 | 1139602 |
| 绿波 | 1139603 |
| 和局 | 1139604 |

### 3.3 色波颜色定义

**红波**：01,02,07,08,12,13,18,19,23,24,29,30,34,35,40,45,46
**蓝波**：03,04,09,10,14,15,20,25,26,31,36,37,41,42,47,48
**绿波**：05,06,11,16,17,21,22,27,28,32,33,38,39,43,44,49

### 3.4 生肖定义

生肖顺序：鼠 > 牛 > 虎 > 兔 > 龙 > 蛇 > 马 > 羊 > 猴 > 鸡 > 狗 > 猪

| 生肖 | 号码 |
|------|------|
| 羊 | 01,13,25,37,49 |
| 猴 | 12,24,36,48 |
| 鸡 | 11,23,35,47 |
| 狗 | 10,22,34,46 |
| 猪 | 09,21,33,45 |
| 鼠 | 08,20,32,44 |
| 牛 | 07,19,31,43 |
| 虎 | 06,18,30,42 |
| 兔 | 05,17,29,41 |
| 龙 | 04,16,28,40 |
| 蛇 | 03,15,27,39 |
| 马 | 02,14,26,38 |

---

## 4. 当前 Vue 实现问题分析

### 4.1 球号数量错误

**当前问题**：
- `games.ts` 中 113 配置的 `numStyle: { lottery: 4, history: 4 }` 是错误的
- 游戏应有 7 个球（6 个正码 + 1 个特码）
- 当前游戏主页面没有处理 `group7` 的逻辑

**位置**：
```typescript
// games.ts line 372-378
113: {
  id: 113,
  name: '極速六合粲',
  template: 'jslhc',
  numStyle: { lottery: 4, history: 4 },  // 错误！应为 7
  group: 'group7'
}
```

### 4.2 玩法组件缺失

需要创建以下组件：

| 组件文件 | 对应玩法 | 说明 |
|---------|---------|------|
| `TeMaBet.vue` | 特码 | 49个号码 + 两面 |
| `LiangMianLhcBet.vue` | 两面 | 特大/小/单/双等 |
| `SeBoBet.vue` | 色波 | 红/蓝/绿 + 半波 |
| `TeXiaoBet.vue` | 特肖 | 12生肖 |
| `TouWeiShuBet.vue` | 头尾数 | 0-4头 + 0-9尾 |
| `ZhengMaBet.vue` | 正码 | 1-6正码 |
| `ZhengMa1_6Bet.vue` | 正码1-6 | 大小单双 |
| `ZhengTeBet.vue` | 正特 | 正1-6特 |
| `LianMaBet.vue` | 连码 | 三中二/四全中等 |
| `LianXiaoBet.vue` | 连肖 | 二/三/四连肖 |
| `LianWeiBet.vue` | 连尾 | 二/三/四/五连尾 |
| `HeXiaoBet.vue` | 合肖 | 2-11生肖 |
| `ZiXuanBuZhongBet.vue` | 自选不中 | 5-8个号码 |
| `ZongXiaoBet.vue` | 总肖 | 2-6总肖 |
| `YiXiaoYiWeiBet.vue` | 一肖一尾 | 生肖+尾数 |
| `ZhengXiaoBet.vue` | 正肖 | 12生肖 |
| `WuXingBet.vue` | 五行 | 金木水火土 |
| `QiSeBoBet.vue` | 七色波 | 红/蓝/绿/和 |

---

## 5. 实施步骤

### 步骤 1：修改游戏配置

**文件**：`frontend/src/config/games.ts`

```typescript
113: {
  id: 113,
  name: '極速六合粲',
  template: 'jslhc',
  numStyle: { lottery: 7, history: 7 },  // 修改为 7 个球
  group: 'group7'
}
```

### 步骤 2：修改游戏主页面球号数量

**文件**：`frontend/src/views/game/index.vue`

在 `ballCount` 计算属性中添加：

```typescript
case 'group7':  // 極速六合粲
  return 7
```

### 步骤 3：修改开奖结果计算

**文件**：`frontend/src/views/game/index.vue`

添加 `lotteryResults` 计算属性：

```typescript
// 六合粲类型开奖结果
if (config?.group === 'group7') {
  const nums = lastNumbers.value
  if (!nums || nums.length < 7) return []

  const normalCodes = nums.slice(0, 6)  // 6个正码
  const specialCode = nums[6]           // 1个特码
  const totalSum = nums.reduce((a, b) => a + b, 0)

  const results: (number | string)[] = []

  // 显示7个球
  results.push(...nums)

  // 特码
  results.push(t('lhc.specialCode'))

  // 总和
  results.push(totalSum)
  results.push(totalSum >= 175 ? t('lhc.big') : t('lhc.small'))
  results.push(totalSum % 2 === 1 ? t('lhc.odd') : t('lhc.even'))

  // 色波
  const color = getLhcColor(specialCode)
  if (color) results.push(color)

  // 特码生肖
  const zodiac = getLhcZodiac(specialCode)
  if (zodiac) results.push(zodiac)

  return results
}

// 获取六合粲色波
const getLhcColor = (num: number): string => {
  const redWave = [1,2,7,8,12,13,18,19,23,24,29,30,34,35,40,45,46]
  const blueWave = [3,4,9,10,14,15,20,25,26,31,36,37,41,42,47,48]
  const greenWave = [5,6,11,16,17,21,22,27,28,32,33,38,39,43,44,49]

  if (redWave.includes(num)) return t('lhc.redWave')
  if (blueWave.includes(num)) return t('lhc.blueWave')
  if (greenWave.includes(num)) return t('lhc.greenWave')
  return ''
}

// 获取六合粲生肖
const getLhcZodiac = (num: number): string => {
  const zodiacMap: Record<number, string> = {
    1: '羊', 13: '羊', 25: '羊', 37: '羊', 49: '羊',
    12: '猴', 24: '猴', 36: '猴', 48: '猴',
    11: '雞', 23: '雞', 35: '雞', 47: '雞',
    10: '狗', 22: '狗', 34: '狗', 46: '狗',
    9: '豬', 21: '豬', 33: '豬', 45: '豬',
    8: '鼠', 20: '鼠', 32: '鼠', 44: '鼠',
    7: '牛', 19: '牛', 31: '牛', 43: '牛',
    6: '虎', 18: '虎', 30: '虎', 42: '虎',
    5: '兔', 17: '兔', 29: '兔', 41: '兔',
    4: '龍', 16: '龍', 28: '龍', 40: '龍',
    3: '蛇', 15: '蛇', 27: '蛇', 39: '蛇',
    2: '馬', 14: '馬', 26: '馬', 38: '馬'
  }
  return zodiacMap[num] || ''
}
```

### 步骤 4：添加多语言翻译

**文件**：`frontend/src/locales/index.ts`

```typescript
export const translations = {
  'zh-TW': {
    // ...
    'lhc': {
      'specialCode': '特碼',
      'zhengCode': '正碼',
      'big': '大',
      'small': '小',
      'odd': '單',
      'even': '雙',
      'redWave': '紅波',
      'blueWave': '藍波',
      'greenWave': '綠波',
      // 特码两面
      'teDa': '特大',
      'teXiao': '特小',
      'teDan': '特單',
      'teShuang': '特雙',
      'teHeDa': '特合大',
      'teHeXiao': '特合小',
      'teHeDan': '特合單',
      'teHeShuang': '特合雙',
      'teWeiDa': '特尾大',
      'teWeiXiao': '特尾小',
      'teDaDan': '特大單',
      'teDaShuang': '特大雙',
      'teXiaoDan': '小單',
      'teXiaoShuang': '小雙',
      'totalBig': '總和大',
      'totalSmall': '總和小',
      'totalSingle': '總和單',
      'totalDouble': '總和雙',
      // 生肖
      'teXiao': '特肖',
      'rat': '鼠', 'ox': '牛', 'tiger': '虎', 'rabbit': '兔',
      'dragon': '龍', 'snake': '蛇', 'horse': '馬', 'goat': '羊',
      'monkey': '猴', 'rooster': '雞', 'dog': '狗', 'pig': '豬'
    }
  },
  'zh-CN': {
    'lhc': {
      'specialCode': '特码',
      'zhengCode': '正码',
      'big': '大',
      'small': '小',
      'odd': '单',
      'even': '双',
      'redWave': '红波',
      'blueWave': '蓝波',
      'greenWave': '绿波',
      'teDa': '特大',
      'teXiao': '特小',
      'teDan': '特单',
      'teShuang': '特双',
      'teHeDa': '特合大',
      'teHeXiao': '特合小',
      'teHeDan': '特合单',
      'teHeShuang': '特合双',
      'teWeiDa': '特尾大',
      'teWeiXiao': '特尾小',
      'teDaDan': '大单',
      'teDaShuang': '大双',
      'teXiaoDan': '小单',
      'teXiaoShuang': '小双',
      'totalBig': '总和大',
      'totalSmall': '总和小',
      'totalSingle': '总和单',
      'totalDouble': '总和双',
      'teXiao': '特肖',
      'rat': '鼠', 'ox': '牛', 'tiger': '虎', 'rabbit': '兔',
      'dragon': '龙', 'snake': '蛇', 'horse': '马', 'goat': '羊',
      'monkey': '猴', 'rooster': '鸡', 'dog': '狗', 'pig': '猪'
    }
  },
  'en': {
    'lhc': {
      'specialCode': 'Special',
      'zhengCode': 'Normal',
      'big': 'Big',
      'small': 'Small',
      'odd': 'Odd',
      'even': 'Even',
      'redWave': 'Red',
      'blueWave': 'Blue',
      'greenWave': 'Green',
      'teDa': 'Big',
      'teXiao': 'Small',
      'teDan': 'Odd',
      'teShuang': 'Even',
      'teHeDa': 'Sum Big',
      'teHeXiao': 'Sum Small',
      'teHeDan': 'Sum Odd',
      'teHeShuang': 'Sum Even',
      'teWeiDa': 'Tail Big',
      'teWeiXiao': 'Tail Small',
      'teDaDan': 'Big Odd',
      'teDaShuang': 'Big Even',
      'teXiaoDan': 'Small Odd',
      'teXiaoShuang': 'Small Even',
      'totalBig': 'Total Big',
      'totalSmall': 'Total Small',
      'totalSingle': 'Total Odd',
      'totalDouble': 'Total Even',
      'teXiao': 'Zodiac',
      'rat': 'Rat', 'ox': 'Ox', 'tiger': 'Tiger', 'rabbit': 'Rabbit',
      'dragon': 'Dragon', 'snake': 'Snake', 'horse': 'Horse', 'goat': 'Goat',
      'monkey': 'Monkey', 'rooster': 'Rooster', 'dog': 'Dog', 'pig': 'Pig'
    }
  }
}
```

### 步骤 5：创建投注组件

#### 5.1 TeMaBet.vue（特码玩法）

文件：`frontend/src/components/game/TeMaBet.vue`

```vue
<template>
  <div class="tema-bet">
    <!-- 特码A/B 切换 -->
    <div class="sub-tabs">
      <div
        class="tab"
        :class="{ active: subType === 'A' }"
        @click="subType = 'A'"
      >{{ t('lhc.teMaA') }}</div>
      <div
        class="tab"
        :class="{ active: subType === 'B' }"
        @click="subType = 'B'"
      >{{ t('lhc.teMaB') }}</div>
    </div>

    <!-- 号码网格 -->
    <div class="number-grid">
      <div
        v-for="num in 49"
        :key="num"
        class="bet-box"
        :class="[
          getNumberClass(num),
          { active: isSelected(getPlayId(num)) }
        ]"
        @click="toggleBet(getPlayId(num))"
      >
        <span class="number">{{ num }}</span>
        <span class="odds">{{ getOdds(getPlayId(num)) }}</span>
      </div>
    </div>

    <!-- 两面 -->
    <div class="bet-section">
      <div class="section-title">{{ t('lhc.liangMian') }}</div>
      <div class="bet-row">
        <div class="bet-box" :class="{ active: isSelected(1138601) }" @click="toggleBet(1138601)">
          <span>{{ t('lhc.teDa') }}</span>
          <span class="odds">{{ getOdds(1138601) }}</span>
        </div>
        <div class="bet-box" :class="{ active: isSelected(1138602) }" @click="toggleBet(1138602)">
          <span>{{ t('lhc.teXiao') }}</span>
          <span class="odds">{{ getOdds(1138602) }}</span>
        </div>
      </div>
      <div class="bet-row">
        <div class="bet-box" :class="{ active: isSelected(1138603) }" @click="toggleBet(1138603)">
          <span>{{ t('lhc.teDan') }}</span>
          <span class="odds">{{ getOdds(1138603) }}</span>
        </div>
        <div class="bet-box" :class="{ active: isSelected(1138604) }" @click="toggleBet(1138604)">
          <span>{{ t('lhc.teShuang') }}</span>
          <span class="odds">{{ getOdds(1138604) }}</span>
        </div>
      </div>
      <div class="bet-row">
        <div class="bet-box" :class="{ active: isSelected(1138605) }" @click="toggleBet(1138605)">
          <span>{{ t('lhc.teHeDa') }}</span>
          <span class="odds">{{ getOdds(1138605) }}</span>
        </div>
        <div class="bet-box" :class="{ active: isSelected(1138606) }" @click="toggleBet(1138606)">
          <span>{{ t('lhc.teHeXiao') }}</span>
          <span class="odds">{{ getOdds(1138606) }}</span>
        </div>
      </div>
      <div class="bet-row">
        <div class="bet-box" :class="{ active: isSelected(1138607) }" @click="toggleBet(1138607)">
          <span>{{ t('lhc.teHeDan') }}</span>
          <span class="odds">{{ getOdds(1138607) }}</span>
        </div>
        <div class="bet-box" :class="{ active: isSelected(1138608) }" @click="toggleBet(1138608)">
          <span>{{ t('lhc.teHeShuang') }}</span>
          <span class="odds">{{ getOdds(1138608) }}</span>
        </div>
      </div>
      <div class="bet-row">
        <div class="bet-box" :class="{ active: isSelected(1138609) }" @click="toggleBet(1138609)">
          <span>{{ t('lhc.teWeiDa') }}</span>
          <span class="odds">{{ getOdds(1138609) }}</span>
        </div>
        <div class="bet-box" :class="{ active: isSelected(1138610) }" @click="toggleBet(1138610)">
          <span>{{ t('lhc.teWeiXiao') }}</span>
          <span class="odds">{{ getOdds(1138610) }}</span>
        </div>
      </div>
      <div class="bet-row">
        <div class="bet-box" :class="{ active: isSelected(1138611) }" @click="toggleBet(1138611)">
          <span>{{ t('lhc.teDaDan') }}</span>
          <span class="odds">{{ getOdds(1138611) }}</span>
        </div>
        <div class="bet-box" :class="{ active: isSelected(1138612) }" @click="toggleBet(1138612)">
          <span>{{ t('lhc.teDaShuang') }}</span>
          <span class="odds">{{ getOdds(1138612) }}</span>
        </div>
      </div>
      <div class="bet-row">
        <div class="bet-box" :class="{ active: isSelected(1138613) }" @click="toggleBet(1138613)">
          <span>{{ t('lhc.teXiaoDan') }}</span>
          <span class="odds">{{ getOdds(1138613) }}</span>
        </div>
        <div class="bet-box" :class="{ active: isSelected(1138614) }" @click="toggleBet(1138614)">
          <span>{{ t('lhc.teXiaoShuang') }}</span>
          <span class="odds">{{ getOdds(1138614) }}</span>
        </div>
      </div>
      <div class="bet-row">
        <div class="bet-box" :class="{ active: isSelected(1138621) }" @click="toggleBet(1138621)">
          <span>{{ t('lhc.totalSingle') }}</span>
          <span class="odds">{{ getOdds(1138621) }}</span>
        </div>
        <div class="bet-box" :class="{ active: isSelected(1138622) }" @click="toggleBet(1138622)">
          <span>{{ t('lhc.totalDouble') }}</span>
          <span class="odds">{{ getOdds(1138622) }}</span>
        </div>
      </div>
      <div class="bet-row">
        <div class="bet-box" :class="{ active: isSelected(1138623) }" @click="toggleBet(1138623)">
          <span>{{ t('lhc.totalBig') }}</span>
          <span class="odds">{{ getOdds(1138623) }}</span>
        </div>
        <div class="bet-box" :class="{ active: isSelected(1138624) }" @click="toggleBet(1138624)">
          <span>{{ t('lhc.totalSmall') }}</span>
          <span class="odds">{{ getOdds(1138624) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { t } from '@/locales'
import { type PlayInfo } from '@/api/game'

const props = defineProps<{
  playsData: Record<string, PlayInfo>
  selectedBets: number[]
}>()

const emit = defineEmits<{
  (e: 'bet-toggle', playId: number): void
}>()

const subType = ref<'A' | 'B'>('A')

// playId: A=1138501-1138549, B=1138550-1138598
const getPlayId = (num: number) => {
  const base = subType.value === 'A' ? 1138500 : 1138550
  return base + num
}

// 根据号码获取颜色样式
const getNumberClass = (num: number) => {
  const redWave = [1,2,7,8,12,13,18,19,23,24,29,30,34,35,40,45,46]
  const blueWave = [3,4,9,10,14,15,20,25,26,31,36,37,41,42,47,48]
  const greenWave = [5,6,11,16,17,21,22,27,28,32,33,38,39,43,44,49]

  if (redWave.includes(num)) return 'red'
  if (blueWave.includes(num)) return 'blue'
  if (greenWave.includes(num)) return 'green'
  return ''
}

const isSelected = (playId: number) => {
  return props.selectedBets.includes(playId)
}

const toggleBet = (playId: number) => {
  emit('bet-toggle', playId)
}

const getOdds = (playId: number) => {
  const play = props.playsData[playId.toString()]
  return play?.odds?.toFixed(3) || '1.982'
}
</script>

<style scoped>
.tema-bet {
  padding: 15px;
}

.sub-tabs {
  display: flex;
  margin-bottom: 15px;
  border-radius: 8px;
  overflow: hidden;
}

.sub-tabs .tab {
  flex: 1;
  padding: 10px;
  text-align: center;
  background: #f5f5f5;
  cursor: pointer;
  transition: all 0.2s;
}

.sub-tabs .tab.active {
  background: #fb2351;
  color: #fff;
}

.number-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
  margin-bottom: 20px;
}

.bet-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 5px;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.bet-box:active {
  transform: scale(0.95);
}

.bet-box.active {
  border-color: #fb2351;
  background: #fff5f5;
}

.bet-box.red {
  background: linear-gradient(135deg, #ffe0e0, #ffc0c0);
}

.bet-box.blue {
  background: linear-gradient(135deg, #e0e0ff, #c0c0ff);
}

.bet-box.green {
  background: linear-gradient(135deg, #e0ffe0, #c0ffc0);
}

.number {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.odds {
  font-size: 11px;
  color: #fb2351;
  font-weight: 600;
}

.bet-section {
  margin-bottom: 20px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
  padding-left: 8px;
  border-left: 3px solid #fb2351;
}

.bet-row {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.bet-row .bet-box {
  flex: 1;
}
</style>
```

#### 5.2 TeXiaoBet.vue（特肖玩法）

文件：`frontend/src/components/game/TeXiaoBet.vue`

```vue
<template>
  <div class="texiao-bet">
    <div class="section-title">{{ t('lhc.teXiao') }}</div>

    <div class="zodiac-grid">
      <div
        v-for="item in zodiacs"
        :key="item.code"
        class="bet-box"
        :class="{ active: isSelected(item.playId) }"
        @click="toggleBet(item.playId)"
      >
        <span class="zodiac-name">{{ t(item.nameKey) }}</span>
        <span class="odds">{{ getOdds(item.playId) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { t } from '@/locales'
import { type PlayInfo } from '@/api/game'

const props = defineProps<{
  playsData: Record<string, PlayInfo>
  selectedBets: number[]
}>()

const emit = defineEmits<{
  (e: 'bet-toggle', playId: number): void
}>()

const zodiacs = [
  { code: 'rat', playId: 1138801, nameKey: 'lhc.rat' },
  { code: 'ox', playId: 1138802, nameKey: 'lhc.ox' },
  { code: 'tiger', playId: 1138803, nameKey: 'lhc.tiger' },
  { code: 'rabbit', playId: 1138804, nameKey: 'lhc.rabbit' },
  { code: 'dragon', playId: 1138805, nameKey: 'lhc.dragon' },
  { code: 'snake', playId: 1138806, nameKey: 'lhc.snake' },
  { code: 'horse', playId: 1138807, nameKey: 'lhc.horse' },
  { code: 'goat', playId: 1138808, nameKey: 'lhc.goat' },
  { code: 'monkey', playId: 1138809, nameKey: 'lhc.monkey' },
  { code: 'rooster', playId: 1138810, nameKey: 'lhc.rooster' },
  { code: 'dog', playId: 1138811, nameKey: 'lhc.dog' },
  { code: 'pig', playId: 1138812, nameKey: 'lhc.pig' }
]

const isSelected = (playId: number) => {
  return props.selectedBets.includes(playId)
}

const toggleBet = (playId: number) => {
  emit('bet-toggle', playId)
}

const getOdds = (playId: number) => {
  const play = props.playsData[playId.toString()]
  return play?.odds?.toFixed(2) || '2.09'
}
</script>

<style scoped>
.texiao-bet {
  padding: 15px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
  padding-left: 8px;
  border-left: 3px solid #fb2351;
}

.zodiac-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.bet-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 8px;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.bet-box:active {
  transform: scale(0.95);
}

.bet-box.active {
  border-color: #fb2351;
  background: #fff5f5;
}

.zodiac-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.odds {
  font-size: 12px;
  color: #fb2351;
  font-weight: 600;
}
</style>
```

#### 5.3 SeBoBet.vue（色波玩法）

文件：`frontend/src/components/game/SeBoBet.vue`

```vue
<template>
  <div class="sebo-bet">
    <!-- 七色波 -->
    <div class="bet-section">
      <div class="section-title">{{ t('lhc.qiSeBo') }}</div>
      <div class="bet-row four-col">
        <div class="bet-box red" :class="{ active: isSelected(1139601) }" @click="toggleBet(1139601)">
          <span>{{ t('lhc.redWave') }}</span>
          <span class="odds">{{ getOdds(1139601) }}</span>
        </div>
        <div class="bet-box blue" :class="{ active: isSelected(1139602) }" @click="toggleBet(1139602)">
          <span>{{ t('lhc.blueWave') }}</span>
          <span class="odds">{{ getOdds(1139602) }}</span>
        </div>
        <div class="bet-box green" :class="{ active: isSelected(1139603) }" @click="toggleBet(1139603)">
          <span>{{ t('lhc.greenWave') }}</span>
          <span class="odds">{{ getOdds(1139603) }}</span>
        </div>
        <div class="bet-box" :class="{ active: isSelected(1139604) }" @click="toggleBet(1139604)">
          <span>{{ t('lhc.draw') }}</span>
          <span class="odds">{{ getOdds(1139604) }}</span>
        </div>
      </div>
    </div>

    <!-- 红球半波 -->
    <div class="bet-section">
      <div class="section-title">{{ t('lhc.redBall') }}</div>
      <div class="bet-row">
        <div class="bet-box red" :class="{ active: isSelected(1138704) }" @click="toggleBet(1138704)">
          <span>{{ t('lhc.redOdd') }}</span>
          <span class="odds">{{ getOdds(1138704) }}</span>
        </div>
        <div class="bet-box red" :class="{ active: isSelected(1138705) }" @click="toggleBet(1138705)">
          <span>{{ t('lhc.redEven') }}</span>
          <span class="odds">{{ getOdds(1138705) }}</span>
        </div>
        <div class="bet-box red" :class="{ active: isSelected(1138706) }" @click="toggleBet(1138706)">
          <span>{{ t('lhc.redBig') }}</span>
          <span class="odds">{{ getOdds(1138706) }}</span>
        </div>
        <div class="bet-box red" :class="{ active: isSelected(1138707) }" @click="toggleBet(1138707)">
          <span>{{ t('lhc.redSmall') }}</span>
          <span class="odds">{{ getOdds(1138707) }}</span>
        </div>
      </div>
      <div class="bet-row">
        <div class="bet-box red" :class="{ active: isSelected(1138716) }" @click="toggleBet(1138716)">
          <span>{{ t('lhc.redBigOdd') }}</span>
          <span class="odds">{{ getOdds(1138716) }}</span>
        </div>
        <div class="bet-box red" :class="{ active: isSelected(1138717) }" @click="toggleBet(1138717)">
          <span>{{ t('lhc.redBigEven') }}</span>
          <span class="odds">{{ getOdds(1138717) }}</span>
        </div>
        <div class="bet-box red" :class="{ active: isSelected(1138718) }" @click="toggleBet(1138718)">
          <span>{{ t('lhc.redSmallOdd') }}</span>
          <span class="odds">{{ getOdds(1138718) }}</span>
        </div>
        <div class="bet-box red" :class="{ active: isSelected(1138719) }" @click="toggleBet(1138719)">
          <span>{{ t('lhc.redSmallEven') }}</span>
          <span class="odds">{{ getOdds(1138719) }}</span>
        </div>
      </div>
    </div>

    <!-- 蓝球半波 -->
    <div class="bet-section">
      <div class="section-title">{{ t('lhc.blueBall') }}</div>
      <div class="bet-row">
        <div class="bet-box blue" :class="{ active: isSelected(1138708) }" @click="toggleBet(1138708)">
          <span>{{ t('lhc.blueOdd') }}</span>
          <span class="odds">{{ getOdds(1138708) }}</span>
        </div>
        <div class="bet-box blue" :class="{ active: isSelected(1138709) }" @click="toggleBet(1138709)">
          <span>{{ t('lhc.blueEven') }}</span>
          <span class="odds">{{ getOdds(1138709) }}</span>
        </div>
        <div class="bet-box blue" :class="{ active: isSelected(1138710) }" @click="toggleBet(1138710)">
          <span>{{ t('lhc.blueBig') }}</span>
          <span class="odds">{{ getOdds(1138710) }}</span>
        </div>
        <div class="bet-box blue" :class="{ active: isSelected(1138711) }" @click="toggleBet(1138711)">
          <span>{{ t('lhc.blueSmall') }}</span>
          <span class="odds">{{ getOdds(1138711) }}</span>
        </div>
      </div>
      <div class="bet-row">
        <div class="bet-box blue" :class="{ active: isSelected(1138720) }" @click="toggleBet(1138720)">
          <span>{{ t('lhc.blueBigOdd') }}</span>
          <span class="odds">{{ getOdds(1138720) }}</span>
        </div>
        <div class="bet-box blue" :class="{ active: isSelected(1138721) }" @click="toggleBet(1138721)">
          <span>{{ t('lhc.blueBigEven') }}</span>
          <span class="odds">{{ getOdds(1138721) }}</span>
        </div>
        <div class="bet-box blue" :class="{ active: isSelected(1138722) }" @click="toggleBet(1138722)">
          <span>{{ t('lhc.blueSmallOdd') }}</span>
          <span class="odds">{{ getOdds(1138722) }}</span>
        </div>
        <div class="bet-box blue" :class="{ active: isSelected(1138723) }" @click="toggleBet(1138723)">
          <span>{{ t('lhc.blueSmallEven') }}</span>
          <span class="odds">{{ getOdds(1138723) }}</span>
        </div>
      </div>
    </div>

    <!-- 绿球半波 -->
    <div class="bet-section">
      <div class="section-title">{{ t('lhc.greenBall') }}</div>
      <div class="bet-row">
        <div class="bet-box green" :class="{ active: isSelected(1138712) }" @click="toggleBet(1138712)">
          <span>{{ t('lhc.greenOdd') }}</span>
          <span class="odds">{{ getOdds(1138712) }}</span>
        </div>
        <div class="bet-box green" :class="{ active: isSelected(1138713) }" @click="toggleBet(1138713)">
          <span>{{ t('lhc.greenEven') }}</span>
          <span class="odds">{{ getOdds(1138713) }}</span>
        </div>
        <div class="bet-box green" :class="{ active: isSelected(1138714) }" @click="toggleBet(1138714)">
          <span>{{ t('lhc.greenBig') }}</span>
          <span class="odds">{{ getOdds(1138714) }}</span>
        </div>
        <div class="bet-box green" :class="{ active: isSelected(1138715) }" @click="toggleBet(1138715)">
          <span>{{ t('lhc.greenSmall') }}</span>
          <span class="odds">{{ getOdds(1138715) }}</span>
        </div>
      </div>
      <div class="bet-row">
        <div class="bet-box green" :class="{ active: isSelected(1138724) }" @click="toggleBet(1138724)">
          <span>{{ t('lhc.greenBigOdd') }}</span>
          <span class="odds">{{ getOdds(1138724) }}</span>
        </div>
        <div class="bet-box green" :class="{ active: isSelected(1138725) }" @click="toggleBet(1138725)">
          <span>{{ t('lhc.greenBigEven') }}</span>
          <span class="odds">{{ getOdds(1138725) }}</span>
        </div>
        <div class="bet-box green" :class="{ active: isSelected(1138726) }" @click="toggleBet(1138726)">
          <span>{{ t('lhc.greenSmallOdd') }}</span>
          <span class="odds">{{ getOdds(1138726) }}</span>
        </div>
        <div class="bet-box green" :class="{ active: isSelected(1138727) }" @click="toggleBet(1138727)">
          <span>{{ t('lhc.greenSmallEven') }}</span>
          <span class="odds">{{ getOdds(1138727) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { t } from '@/locales'
import { type PlayInfo } from '@/api/game'

const props = defineProps<{
  playsData: Record<string, PlayInfo>
  selectedBets: number[]
}>()

const emit = defineEmits<{
  (e: 'bet-toggle', playId: number): void
}>()

const isSelected = (playId: number) => {
  return props.selectedBets.includes(playId)
}

const toggleBet = (playId: number) => {
  emit('bet-toggle', playId)
}

const getOdds = (playId: number) => {
  const play = props.playsData[playId.toString()]
  return play?.odds?.toFixed(3) || '1.982'
}
</script>

<style scoped>
.sebo-bet {
  padding: 15px;
}

.bet-section {
  margin-bottom: 20px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
  padding-left: 8px;
  border-left: 3px solid #fb2351;
}

.bet-row {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.bet-row.four-col .bet-box {
  flex: 1;
}

.bet-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 5px;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.bet-box:active {
  transform: scale(0.95);
}

.bet-box.active {
  border-color: #fb2351;
  background: #fff5f5;
}

.bet-box.red {
  background: linear-gradient(135deg, #ffe0e0, #ffc0c0);
}

.bet-box.blue {
  background: linear-gradient(135deg, #e0e0ff, #c0c0ff);
}

.bet-box.green {
  background: linear-gradient(135deg, #e0ffe0, #c0ffc0);
}

.bet-box span:first-child {
  font-size: 13px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.odds {
  font-size: 11px;
  color: #fb2351;
  font-weight: 600;
}
</style>
```

### 步骤 6：修改游戏主页面添加组件导入

**文件**：`frontend/src/views/game/index.vue`

添加导入：

```typescript
import TeMaBet from '@/components/game/TeMaBet.vue'
import TeXiaoBet from '@/components/game/TeXiaoBet.vue'
import SeBoBet from '@/components/game/SeBoBet.vue'
```

在模板中添加玩法选择逻辑：

```vue
<!-- group7 六合粲玩法 -->
<template v-else-if="config?.group === 'group7'">
  <!-- 特码 -->
  <template v-if="currentPane?.code === 'TM'">
    <TeMaBet
      :plays-data="playsData"
      :selected-bets="betData[currentPane.code] || []"
      @bet-toggle="toggleBet"
    />
  </template>
  <!-- 特肖 -->
  <template v-else-if="currentPane?.code === 'TX'">
    <TeXiaoBet
      :plays-data="playsData"
      :selected-bets="betData[currentPane.code] || []"
      @bet-toggle="toggleBet"
    />
  </template>
  <!-- 色波 -->
  <template v-else-if="currentPane?.code === 'SB'">
    <SeBoBet
      :plays-data="playsData"
      :selected-bets="betData[currentPane.code] || []"
      @bet-toggle="toggleBet"
    />
  </template>
</template>
```

---

## 6. 实施记录

### 2026-02-26 创建文档

**计划工作量**：2-3 个会话

**第一阶段目标**（会话 1）：
1. 修改 `games.ts` 配置（球号数量改为 7）
2. 修改 `game/index.vue` 球号数量计算逻辑
3. 添加 `lotteryResults` 计算属性（7个球 + 总和 + 色波 + 生肖）
4. 添加多语言翻译
5. 创建 TeMaBet.vue（特码 + 两面）
6. 创建 TeXiaoBet.vue（特肖）
7. 创建 SeBoBet.vue（色波 + 七色波）

**第二阶段目标**（会话 2-3）：
- 创建其他玩法组件

---

## 7. 测试验证

### 7.1 功能测试清单

| 测试项 | 预期结果 | 状态 |
|-------|---------|------|
| 页面显示 7 个球 | 6个正码 + 1个特码 | ☐ |
| 特码玩法 | 49个号码显示 + 颜色区分 | ☐ |
| 两面玩法 | 特大/小/单/双正常 | ☐ |
| 色波显示 | 红/蓝/绿波正确 | ☐ |
| 特肖显示 | 12生肖正确 | ☐ |
| 开奖结果 | 7个球 + 总和 + 色波 + 生肖 | ☐ |
| 下注功能 | 能成功提交到后端 | ☐ |

---

## 8. 参考资料

- PHP 模板：`views/lottery/templates/jslhc/`
- PHP 规则说明：`views/lottery/templates/role/role_113.html`
- 游戏配置：`frontend/src/config/games.ts`
- 游戏主页面：`frontend/src/views/game/index.vue`

---

**文档创建日期**：2026-02-26
