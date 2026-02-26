# 游戏 ID 66（PC 蛋蛋）页面重构实施文档

## 1. 任务概述

**目标**：根据 PHP 原版 UI 和逻辑，完整重构 `/game/66` 页面（PC 蛋蛋）

**优先级**：High

**预计工作量**：1 个会话

---

## 2. 游戏分析

### 2.1 游戏基本信息

| 属性 | 值 |
|------|-----|
| 游戏 ID | 66 |
| 游戏名称 | PC 蛋蛋 |
| 模板名称 | pcdd |
| 开奖号码 | 3 个球（0-9），总和 0-27 |
| 游戏分组 | group8 |
| 期数频率 | 20 分钟/期，全天 179 期 |
| 号码样式 | `numStyle: { lottery: 6, history: 6 }`（推测） |

### 2.2 游戏规则

PC 蛋蛋是一种基于 3 个数字相加总和的彩票游戏：
- 每个球从 0-9 中随机抽取
- 总和范围：0-27
- 根据总和的特性进行投注（大小单双、组合、波色等）

### 2.3 开奖号码结构

```
PC 蛋蛋 = 3 个号码球 + 总和
例：3 5 8 = 16
     │ │ │   │
     │ │ │   └─ 总和
     │ │ └───── 第三球
     │ └─────── 第二球
     └───────── 第一球
```

---

## 3. PHP 原版 UI 分析

### 3.1 玩法分组（group8）

```typescript
group8: [
  { name: '混合', code: 'HH', tpl: 'hh' },
  { name: '特碼', code: 'TM', tpl: 'tm' }
]
```

### 3.2 混合玩法（hh.html）

```
┌─────────────────────────────────────┐
│ 混合                                 │
│ ┌─────────┬─────────┐              │
│ │ 大      │ 小      │ 赔率 1.982   │
│ │ 單      │ 雙      │ 赔率 1.982   │
│ │ 大單    │ 大雙    │ 赔率 1.982   │
│ │ 小單    │ 小雙    │ 赔率 1.982   │
│ │ 極大    │ 極小    │ 豹子         │
│ └─────────┴─────────┴─────────────┘│
├─────────────────────────────────────┤
│ 波色                                 │
│ ┌─────────┬─────────┬─────────────┐│
│ │ 紅波    │ 綠波    │ 藍波        ││
│ │ 1.982   │ 1.982   │ 1.982       ││
│ └─────────┴─────────┴─────────────┘│
└─────────────────────────────────────┘
```

**PlayID 规则**（从 PHP 模板）：
| 玩法 | PlayID |
|------|--------|
| 大 | 6611201 |
| 小 | 6611202 |
| 單 | 6611203 |
| 雙 | 6611204 |
| 大單 | 6611205 |
| 大雙 | 6611206 |
| 小單 | 6611207 |
| 小雙 | 6611208 |
| 極大 | 6611209 |
| 極小 | 6611210 |
| 豹子 | 6611211 |
| 紅波 | 6611301 |
| 綠波 | 6611302 |
| 藍波 | 6611303 |

**PlayID 计算公式**：
```
playId = gameId * 10000 + categoryId * 100 + sequence

gameId = 66
categoryId:
  混合基本 = 112
  波色 = 113

sequence:
  大=01, 小=02, 單=03, 雙=04, 大單=05, 大雙=06, 小單=07, 小雙=08
  極大=09, 極小=10, 豹子=11
  紅波=01, 綠波=02, 藍波=03
```

### 3.3 特碼玩法（tm.html）

```
┌─────────────────────────────────────┐
│ 特碼（0-27 数字投注）               │
│ ┌─────┬─────┬─────┐                │
│ │  0  │  1  │  2  │ 赔率 9.85      │
│ ├─────┼─────┼─────┤                │
│ │  3  │  4  │  5  │                │
│ ...（共 28 个数字）                  │
│ ├─────┼─────┼─────┤                │
│ │ 24  │ 25  │ 26  │                │
│ └─────┴─────┴─────┘                │
│ ┌─────────┬─────────┐              │
│ │    27   │         │              │
│ └─────────┴─────────┘              │
└─────────────────────────────────────┘
```

**PlayID 规则**：
- 特碼 0-27: 6611400 - 6611427

**计算公式**：
```
playId = 66 * 10000 + 114 * 100 + number
playId = 6611400 + number (number: 0-27)
```

---

## 4. 当前 Vue 实现问题分析

### 4.1 球号数量错误

**当前问题**：
- 当前 `game/index.vue` 默认显示 10 个球
- PC 蛋蛋应显示 3 个球

**位置**：
```vue
// game/index.vue line 335
const displayNumbers = ref<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) // 错误！
```

**应改为**：
```vue
// 根据游戏类型动态设置
const getBallCount = () => {
  const config = getGameConfig(gameId.value)
  if (config?.group === 'group8') {
    return 3 // PC 蛋蛋 3 个球
  }
  return 10
}
```

### 4.2 开奖结果计算错误

**当前问题**：
- 当前代码计算 PK10 的冠亚和、龙虎结果
- PC 蛋蛋需要计算：总和、大小、单双、组合、波色

### 4.3 玩法组件缺失

需要创建以下组件：

| 组件文件 | 对应玩法 | 状态 |
|---------|---------|------|
| `HunHeBet.vue` | 混合 | 需创建 |
| `TeMaBet.vue` | 特碼 | 需创建 |

---

## 5. 实施步骤

### 步骤 1：修改游戏配置

**文件**：`frontend/src/config/games.ts`

添加 PC 蛋蛋的号码样式配置：

```typescript
66: {
  id: 66,
  name: 'PC 蛋蛋',
  template: 'pcdd',
  numStyle: { lottery: 6, history: 6 }, // 添加号码样式
  group: 'group8'
}
```

### 步骤 2：创建投注组件

#### 2.1 创建 HunHeBet.vue（混合玩法）

**文件**：`frontend/src/components/game/HunHeBet.vue`

```vue
<template>
  <div class="hunhe-bet">
    <!-- 基本混合 -->
    <div class="bet-section">
      <div class="section-title">{{ t('pcdd.basic') }}</div>

      <div class="bet-row">
        <div
          class="bet-box"
          :class="{ active: isSelected(6611201) }"
          @click="toggleBet(6611201)"
        >
          <span>{{ t('pcdd.big') }}</span>
          <span class="odds">{{ getOdds(6611201) }}</span>
        </div>
        <div
          class="bet-box"
          :class="{ active: isSelected(6611202) }"
          @click="toggleBet(6611202)"
        >
          <span>{{ t('pcdd.small') }}</span>
          <span class="odds">{{ getOdds(6611202) }}</span>
        </div>
      </div>

      <div class="bet-row">
        <div
          class="bet-box"
          :class="{ active: isSelected(6611203) }"
          @click="toggleBet(6611203)"
        >
          <span>{{ t('pcdd.odd') }}</span>
          <span class="odds">{{ getOdds(6611203) }}</span>
        </div>
        <div
          class="bet-box"
          :class="{ active: isSelected(6611204) }"
          @click="toggleBet(6611204)"
        >
          <span>{{ t('pcdd.even') }}</span>
          <span class="odds">{{ getOdds(6611204) }}</span>
        </div>
      </div>

      <div class="bet-row">
        <div
          class="bet-box"
          :class="{ active: isSelected(6611205) }"
          @click="toggleBet(6611205)"
        >
          <span>{{ t('pcdd.bigOdd') }}</span>
          <span class="odds">{{ getOdds(6611205) }}</span>
        </div>
        <div
          class="bet-box"
          :class="{ active: isSelected(6611206) }"
          @click="toggleBet(6611206)"
        >
          <span>{{ t('pcdd.bigEven') }}</span>
          <span class="odds">{{ getOdds(6611206) }}</span>
        </div>
      </div>

      <div class="bet-row">
        <div
          class="bet-box"
          :class="{ active: isSelected(6611207) }"
          @click="toggleBet(6611207)"
        >
          <span>{{ t('pcdd.smallOdd') }}</span>
          <span class="odds">{{ getOdds(6611207) }}</span>
        </div>
        <div
          class="bet-box"
          :class="{ active: isSelected(6611208) }"
          @click="toggleBet(6611208)"
        >
          <span>{{ t('pcdd.smallEven') }}</span>
          <span class="odds">{{ getOdds(6611208) }}</span>
        </div>
      </div>

      <div class="bet-row three-col">
        <div
          class="bet-box"
          :class="{ active: isSelected(6611209) }"
          @click="toggleBet(6611209)"
        >
          <span>{{ t('pcdd.extraBig') }}</span>
          <span class="odds">{{ getOdds(6611209) }}</span>
        </div>
        <div
          class="bet-box"
          :class="{ active: isSelected(6611210) }"
          @click="toggleBet(6611210)"
        >
          <span>{{ t('pcdd.extraSmall') }}</span>
          <span class="odds">{{ getOdds(6611210) }}</span>
        </div>
        <div
          class="bet-box"
          :class="{ active: isSelected(6611211) }"
          @click="toggleBet(6611211)"
        >
          <span>{{ t('pcdd.leopard') }}</span>
          <span class="odds">{{ getOdds(6611211) }}</span>
        </div>
      </div>
    </div>

    <!-- 波色 -->
    <div class="bet-section">
      <div class="section-title">{{ t('pcdd.waveColor') }}</div>

      <div class="bet-row three-col">
        <div
          class="bet-box red-wave"
          :class="{ active: isSelected(6611301) }"
          @click="toggleBet(6611301)"
        >
          <span>{{ t('pcdd.redWave') }}</span>
          <span class="odds">{{ getOdds(6611301) }}</span>
        </div>
        <div
          class="bet-box green-wave"
          :class="{ active: isSelected(6611302) }"
          @click="toggleBet(6611302)"
        >
          <span>{{ t('pcdd.greenWave') }}</span>
          <span class="odds">{{ getOdds(6611302) }}</span>
        </div>
        <div
          class="bet-box blue-wave"
          :class="{ active: isSelected(6611303) }"
          @click="toggleBet(6611303)"
        >
          <span>{{ t('pcdd.blueWave') }}</span>
          <span class="odds">{{ getOdds(6611303) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { t } from '@/locales'
import { gameApi, type PlayInfo } from '@/api/game'

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
.hunhe-bet {
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

.bet-row.three-col {
  justify-content: space-between;
}

.bet-box {
  flex: 1;
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

.bet-box.red-wave {
  background: linear-gradient(135deg, #ffe0e0, #ffc0c0);
}

.bet-box.green-wave {
  background: linear-gradient(135deg, #e0ffe0, #c0ffc0);
}

.bet-box.blue-wave {
  background: linear-gradient(135deg, #e0e0ff, #c0c0ff);
}

.bet-box span:first-child {
  font-size: 14px;
  font-weight: 500;
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

#### 2.2 创建 TeMaBet.vue（特碼玩法）

**文件**：`frontend/src/components/game/TeMaBet.vue`

```vue
<template>
  <div class="tema-bet">
    <div class="section-title">{{ t('pcdd.teMa') }}</div>

    <div class="number-grid">
      <div
        v-for="num in 28"
        :key="num - 1"
        class="bet-box"
        :class="{ active: isSelected(getPlayId(num - 1)) }"
        @click="toggleBet(getPlayId(num - 1))"
      >
        <span class="number">{{ num - 1 }}</span>
        <span class="odds">{{ getOdds(getPlayId(num - 1)) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { t } from '@/locales'
import { gameApi, type PlayInfo } from '@/api/game'

const props = defineProps<{
  playsData: Record<string, PlayInfo>
  selectedBets: number[]
}>()

const emit = defineEmits<{
  (e: 'bet-toggle', playId: number): void
}>()

// playId = 6611400 + number (0-27)
const getPlayId = (number: number) => {
  return 6611400 + number
}

const isSelected = (playId: number) => {
  return props.selectedBets.includes(playId)
}

const toggleBet = (playId: number) => {
  emit('bet-toggle', playId)
}

const getOdds = (playId: number) => {
  const play = props.playsData[playId.toString()]
  return play?.odds?.toFixed(2) || '9.85'
}
</script>

<style scoped>
.tema-bet {
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

.number-grid {
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

.number {
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

/* 最后一行特殊处理 */
.number-grid .bet-box:last-child:nth-last-child(2) {
  grid-column: span 2;
}
</style>
```

### 步骤 3：修改游戏主页面

**文件**：`frontend/src/views/game/index.vue`

#### 3.1 修改球号数量

找到 `displayNumbers` 的定义位置（约 line 335），修改为：

```typescript
// 获取球号数量
const getBallCount = () => {
  const config = getGameConfig(gameId.value)
  switch (config?.group) {
    case 'group8':  // PC 蛋蛋、极速 28
      return 3
    case 'group6':  // 快 3
      return 3
    case 'group2':  // 时时彩
      return 5
    case 'group1':  // PK10 类型
      return 10
    case 'group3':  // 11 选 5
      return 8
    case 'group4':  // 11 选 5
      return 7
    default:
      return 10
  }
}

const displayNumbers = ref<number[]>(Array(getBallCount()).fill(0))
```

#### 3.2 修改开奖结果计算

找到 `lotteryResults` 计算位置，添加 PC 蛋蛋的结果计算：

```typescript
// 开奖结果计算
const lotteryResults = computed(() => {
  const nums = lastNumbers.value
  if (!nums || nums.length === 0) return []

  const config = getGameConfig(gameId.value)

  // PC 蛋蛋类型
  if (config?.group === 'group8') {
    const sum = nums.reduce((a, b) => a + b, 0)
    const results: (number | string)[] = [sum]

    // 大小单双
    if (sum >= 14) results.push(t('pcdd.big'))
    else if (sum <= 13) results.push(t('pcdd.small'))

    results.push(sum % 2 === 1 ? t('pcdd.odd') : t('pcdd.even'))

    // 极大极小
    if (sum >= 22) results.push(t('pcdd.extraBig'))
    if (sum <= 5) results.push(t('pcdd.extraSmall'))

    // 豹子（三球相同）
    if (nums[0] === nums[1] && nums[1] === nums[2]) {
      results.push(t('pcdd.leopard'))
    }

    // 波色
    const waveColor = getWaveColor(sum)
    if (waveColor) {
      results.push(waveColor)
    }

    return results
  }

  // ... 其他游戏类型的结果计算
})

// 获取波色
const getWaveColor = (sum: number): string => {
  // 波色定义（根据实际规则调整）
  const redWave = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27]
  const greenWave = [2, 6, 8, 10, 14, 16, 18, 20, 22, 24]
  const blueWave = [0, 4, 12, 26]

  if (redWave.includes(sum)) return t('pcdd.redWave')
  if (greenWave.includes(sum)) return t('pcdd.greenWave')
  if (blueWave.includes(sum)) return t('pcdd.blueWave')
  return ''
}
```

#### 3.3 添加新组件导入

在 imports 部分添加：

```typescript
import HunHeBet from '@/components/game/HunHeBet.vue'
import TeMaBet from '@/components/game/TeMaBet.vue'
```

#### 3.4 修改玩法选择逻辑

在模板的投注面板部分：

```vue
<!-- 混合玩法 -->
<template v-if="currentPane?.code === 'HH'">
  <HunHeBet
    :plays-data="playsData"
    :selected-bets="betData[currentPane.code] || []"
    @bet-toggle="toggleBet"
  />
</template>

<!-- 特碼玩法 -->
<template v-else-if="currentPane?.code === 'TM'">
  <TeMaBet
    :plays-data="playsData"
    :selected-bets="betData[currentPane.code] || []"
    @bet-toggle="toggleBet"
  />
</template>
```

### 步骤 4：添加多语言翻译

**文件**：`frontend/src/locales/index.ts`

```typescript
export const translations = {
  'zh-TW': {
    // ...
    'pcdd': {
      'basic': '基本',
      'big': '大',
      'small': '小',
      'odd': '單',
      'even': '雙',
      'bigOdd': '大單',
      'bigEven': '大雙',
      'smallOdd': '小單',
      'smallEven': '小雙',
      'extraBig': '極大',
      'extraSmall': '極小',
      'leopard': '豹子',
      'waveColor': '波色',
      'redWave': '紅波',
      'greenWave': '綠波',
      'blueWave': '藍波',
      'teMa': '特碼'
    }
  },
  'zh-CN': {
    // ...
    'pcdd': {
      'basic': '基本',
      'big': '大',
      'small': '小',
      'odd': '单',
      'even': '双',
      'bigOdd': '大单',
      'bigEven': '大双',
      'smallOdd': '小单',
      'smallEven': '小双',
      'extraBig': '极大',
      'extraSmall': '极小',
      'leopard': '豹子',
      'waveColor': '波色',
      'redWave': '红波',
      'greenWave': '绿波',
      'blueWave': '蓝波',
      'teMa': '特码'
    }
  },
  'en': {
    // ...
    'pcdd': {
      'basic': 'Basic',
      'big': 'Big',
      'small': 'Small',
      'odd': 'Odd',
      'even': 'Even',
      'bigOdd': 'Big Odd',
      'bigEven': 'Big Even',
      'smallOdd': 'Small Odd',
      'smallEven': 'Small Even',
      'extraBig': 'Extra Big',
      'extraSmall': 'Extra Small',
      'leopard': 'Leopard',
      'waveColor': 'Wave',
      'redWave': 'Red',
      'greenWave': 'Green',
      'blueWave': 'Blue',
      'teMa': 'Special'
    }
  }
}
```

### 步骤 5：完善 PlayID 计算逻辑

**文件**：`frontend/src/api/game.ts`

添加 PC 蛋蛋专用 playId 计算函数：

```typescript
/**
 * 计算 PC 蛋蛋玩法 ID
 * @param gameId 游戏 ID (66)
 * @param category 分类 (112=混合，113=波色，114=特码)
 * @param sequence 序号
 */
export function calcPCDDPlayId(gameId: number, category: number, sequence: number): number {
  return gameId * 10000 + category * 100 + sequence
}

// 特碼快捷计算
export function calcPCDDTeMaId(number: number): number {
  return 6611400 + number
}
```

---

## 6. 测试验证

### 6.1 功能测试清单

| 测试项 | 预期结果 | 状态 |
|-------|---------|------|
| 页面显示 3 个球 | 不是 10 个球 | ☐ |
| 混合玩法投注 | 能正常选择和显示赔率 | ☐ |
| 特碼玩法 | 0-27 数字投注正常 | ☐ |
| 下注功能 | 能成功提交到后端 | ☐ |
| 开奖结果显示 | 3 个球 + 总和正确 | ☐ |
| 波色计算正确 | 红/绿/蓝波正确 | ☐ |
| 豹子判断正确 | 三球相同时显示 | ☐ |

### 6.2 PlayID 验证

从后端获取玩法数据后，验证以下 PlayID 是否正确：

| 玩法 | 期望 PlayID | 实际 PlayID |
|-----|-----------|-----------|
| 大 | 6611201 | ☐ |
| 小 | 6611202 | ☐ |
| 單 | 6611203 | ☐ |
| 雙 | 6611204 | ☐ |
| 大單 | 6611205 | ☐ |
| 大雙 | 6611206 | ☐ |
| 小單 | 6611207 | ☐ |
| 小雙 | 6611208 | ☐ |
| 極大 | 6611209 | ☐ |
| 極小 | 6611210 | ☐ |
| 豹子 | 6611211 | ☐ |
| 紅波 | 6611301 | ☐ |
| 綠波 | 6611302 | ☐ |
| 藍波 | 6611303 | ☐ |
| 特碼 0 | 6611400 | ☐ |
| 特碼 27 | 6611427 | ☐ |

---

## 7. 交付要求

1. **代码要求**：
   - 所有新增组件必须使用 TypeScript
   - CSS 必须使用 scoped
   - 遵循现有代码规范

2. **文档要求**：
   - 更新 `frontend/src/config/games.ts` 注释
   - 在组件中添加必要的 JSDoc 注释

3. **Git 提交规范**：
   ```
   feat: 完成 PC 蛋蛋（游戏 66）页面重构

   - 修改球号显示为 3 个
   - 创建混合、特碼投注组件
   - 添加 PC 蛋蛋开奖结果计算逻辑
   - 添加波色、豹子判断
   - 添加多语言支持

   Co-Authored-By: Claude <noreply@anthropic.com>
   ```

---

## 8. 参考资料

- PHP 模板：`views/lottery/templates/pcdd/`
  - `hh.html` - 混合玩法
  - `tm.html` - 特碼玩法
- PHP 游戏控制器：`wjaction/default/Game.class.php`
- 数据库玩法配置：查询 `ssc_played` 表中 `playId LIKE '6611%'` 的记录
- 游戏配置：`frontend/src/config/games.ts`

---

## 9. 游戏规则说明

### 9.1 大小定义
- **大**：总和 14-27
- **小**：总和 0-13

### 9.2 单双定义
- **单**：总和为奇数
- **双**：总和为偶数

### 9.3 极大极小
- **极大**：总和 22-27
- **极小**：总和 0-5

### 9.4 豹子
- 三个球号码相同（如：3,3,3）

### 9.5 波色（参考）
波色根据总和值划分，具体规则可能因平台而异：
- **红波**：1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27
- **绿波**：2, 6, 8, 10, 14, 16, 18, 20, 22, 24
- **蓝波**：0, 4, 12, 26

---

**文档创建日期**：2026-02-26
**最后更新**：2026-02-26
