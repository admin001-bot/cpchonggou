# 游戏 ID 122（五分时时彩）页面重构实施文档

## 1. 任务概述

**目标**：根据 PHP 原版 UI 和逻辑，完整重构 `/game/122` 页面（五分时时彩）

**优先级**：High

**预计工作量**：1-2 个会话

---

## 2. 游戏分析

### 2.1 游戏基本信息

| 属性 | 值 |
|------|-----|
| 游戏 ID | 122 |
| 游戏名称 | 五分时时彩 |
| 模板名称 | amssc |
| 开奖号码 | 5 个球（0-9） |
| 游戏分组 | group2（时时彩类型） |
| 期数频率 | 15 分钟/期，全天 288 期 |

### 2.2 开奖号码结构

```
时时彩类型游戏 = 5 个号码球
例：3 5 8 1 9
     │ │ │ │ │
     │ │ │ │ └─ 第五球
     │ │ │ └─── 第四球
     │ │ └───── 第三球
     │ └─────── 第二球
     └───────── 第一球
```

### 2.3 玩法分组（Group2）

当前 `games.ts` 中定义的 group2 玩法：
```typescript
group2: [
  { name: '兩面', code: 'LM', tpl: 'lm' },
  { name: '1-5 球', code: 'ALL', tpl: 'all' },
  { name: '前中後', code: 'QZH', tpl: 'qzh' },
  { name: '龍虎鬥', code: 'LONGHU', tpl: 'longhu' },
  { name: '番灘', code: 'FANTAN', tpl: 'fantan' },
  { name: '百家樂', code: 'BAIJIALE', tpl: 'baijiale' }
]
```

---

## 3. PHP 原版 UI 分析

### 3.1 页面结构（lottery.html）

```
┌─────────────────────────────────────┐
│ 顶部导航栏（游戏名称、余额、菜单）   │
├─────────────────────────────────────┤
│ 上期开奖号码显示区（5 个球）         │
│ 期号 + 倒计时                        │
├─────────────────────────────────────┤
│ 玩法选项卡（两面、1-5 球、龙虎斗...）│
├─────────────────────────────────────┤
│ 投注面板（根据选中玩法动态变化）     │
├─────────────────────────────────────┤
│ 底部操作栏（注数、金额、下注、重置） │
└─────────────────────────────────────┘
```

### 3.2 各玩法详细 UI

#### 3.2.1 两面玩法（lm.html）

```
┌─────────────────────────────────────┐
│ 五球總和                             │
│ ┌─────────┬─────────┐              │
│ │ 總和大  │ 總和小  │ 赔率 1.982   │
│ │ 總和單  │ 總和雙  │ 赔率 1.982   │
│ └─────────┴─────────┘              │
├─────────────────────────────────────┤
│ 第一球                               │
│ ┌─────────┬─────────┐              │
│ │ 大      │ 小      │ 赔率 1.982   │
│ │ 單      │ 雙      │ 赔率 1.982   │
│ └─────────┴─────────┘              │
├─────────────────────────────────────┤
│ 第二球 ~ 第五球（同上）             │
└─────────────────────────────────────┘
```

**PlayID 规则**（从 PHP 数据库）：
- 总和大/小/单/双：122101-122104
- 第一球大/小/单/双：122210-122213
- 第二球大/小/单/双：122310-122313
- 第三球大/小/单/双：122410-122413
- 第四球大/小/单/双：122510-122513
- 第五球大/小/单/双：122610-122613

**PlayID 计算公式**：
```
playId = gameId * 10000 + categoryId * 100 + sequence

gameId = 122
categoryId:
  总和 = 01
  第一球 = 02
  第二球 = 03
  第三球 = 04
  第四球 = 05
  第五球 = 06

sequence:
  大=10, 小=11, 单=12, 双=13
```

#### 3.2.2 1-5 球玩法（all.html）

```
┌─────────────────────────────────────┐
│ 第一球（0-9 数字投注）              │
│ ┌─────┬─────┬─────┬─────┬─────┐   │
│ │  0  │  1  │  2  │  3  │  4  │   │
│ │9.85 │9.85 │9.85 │9.85 │9.85 │   │
│ ├─────┼─────┼─────┼─────┼─────┤   │
│ │  5  │  6  │  7  │  8  │  9  │   │
│ │9.85 │9.85 │9.85 │9.85 │9.85 │   │
│ └─────┴─────┴─────┴─────┴─────┘   │
├─────────────────────────────────────┤
│ 第二球（0-9）同上                   │
│ 第三球（0-9）同上                   │
│ 第四球（0-9）同上                   │
│ 第五球（0-9）同上                   │
└─────────────────────────────────────┘
```

**PlayID 规则**：
- 第一球 0-9:122200-122209
- 第二球 0-9:122300-122309
- 第三球 0-9:122400-122409
- 第四球 0-9:122500-122509
- 第五球 0-9:122600-122609

**计算公式**：
```
playId = 122 * 1000 + ballPosition * 100 + number
ballPosition: 第一球=2, 第二球=3, 第三球=4, 第四球=5, 第五球=6
number: 0-9
```

#### 3.2.3 龙虎斗玩法（longhu.html）

```
┌─────────────────────────────────────┐
│ 第一球 VS 第二球                     │
│ ┌─────┬─────┬─────┐                │
│ │ 龍  │ 虎  │ 和  │ 赔率 9.4       │
│ │1.982│1.982│       │                │
│ └─────┴─────┴─────┘                │
├─────────────────────────────────────┤
│ 第一球 VS 第三球                    │
│ ...（共 10 组对阵）                  │
│ 第一球 VS 第四球                    │
│ 第一球 VS 第五球                    │
│ 第二球 VS 第三球                    │
│ 第二球 VS 第四球                    │
│ 第二球 VS 第五球                    │
│ 第三球 VS 第四球                    │
│ 第三球 VS 第五球                    │
│ 第四球 VS 第五球                    │
└─────────────────────────────────────┘
```

**PlayID 规则**：
- 第一球 VS 第二球（龙/虎/和）: 122906-122908
- 第一球 VS 第三球（龙/虎/和）: 122909-122911
- ...依此类推

#### 3.2.4 前中後玩法（qzh.html）

```
┌─────────────────────────────────────┐
│ 前三（第一 + 二 + 三球）             │
│ ┌─────────┬─────────┐              │
│ │ 豹子    │ 順子    │ 赔率 70/14   │
│ │ 對子    │ 半順    │ 赔率 3.2/2.3 │
│ │ 雜六                │ 赔率 2.8     │
│ └─────────┴─────────┘              │
├─────────────────────────────────────┤
│ 中三（第二 + 三 + 四球）同上        │
├─────────────────────────────────────┤
│ 后三（第三 + 四 + 五球）同上        │
└─────────────────────────────────────┘
```

**PlayID 规则**：
- 前三（豹子/顺子/对子/半顺/杂六）: 122701-122705
- 中三：122801-122805
- 后三：122901-122905

---

## 4. 当前 Vue 实现问题分析

### 4.1 球号数量错误

**当前问题**：
- 当前 `game/index.vue` 显示 10 个球（PK10 格式）
- 五分时时彩应显示 5 个球

**位置**：
```vue
// game/index.vue line 335
const displayNumbers = ref<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) // 错误！
```

**应改为**：
```vue
const displayNumbers = ref<number[]>([0, 0, 0, 0, 0]) // 5 个球，初始 0
```

### 4.2 开奖结果计算错误

**当前问题**：
- 当前代码计算 PK10 的冠亚和、龙虎结果
- 五分时时彩需要计算：总和大小单双、龙虎对阵、前三/中三/后三

### 4.3 玩法组件缺失

需要创建以下组件：

| 组件文件 | 对应玩法 | 状态 |
|---------|---------|------|
| `LiangMianBet.vue` | 两面 | 已存在（需修改） |
| `AllBallsBet.vue` | 1-5 球 | 需创建 |
| `LongHuBet.vue` | 龙虎斗 | 需创建 |
| `QzhBet.vue` | 前中後 | 需创建 |
| `FantanBet.vue` | 番滩 | 需创建 |

---

## 5. 实施步骤

### 步骤 1：修改游戏配置

**文件**：`frontend/src/config/games.ts`

```typescript
// 确保 group2 配置正确
group2: [
  { name: '兩面', code: 'LM', tpl: 'lm' },
  { name: '1-5 球', code: 'ALL', tpl: 'all' },
  { name: '前中後', code: 'QZH', tpl: 'qzh' },
  { name: '龍虎鬥', code: 'LONGHU', tpl: 'longhu' },
  { name: '番灘', code: 'FANTAN', tpl: 'fantan' }
]
```

### 步骤 2：创建投注组件

#### 2.1 修改 LiangMianBet.vue

**文件**：`frontend/src/components/game/LiangMianBet.vue`

添加时时彩类型的两面玩法：
- 总和大/小/单/双
- 各球大/小/单/双

#### 2.2 创建 AllBallsBet.vue（1-5 球）

**文件**：`frontend/src/components/game/AllBallsBet.vue`

```vue
<template>
  <div class="all-balls-bet">
    <!-- 第一球 -->
    <div class="ball-section">
      <div class="section-title">{{ t('amssc.ball1') }}</div>
      <div class="number-grid">
        <div
          v-for="num in 10"
          :key="num - 1"
          class="bet-box"
          :class="{ active: isSelected(getPlayId(2, num - 1)) }"
          @click="toggleBet(getPlayId(2, num - 1))"
        >
          <span class="number">{{ num - 1 }}</span>
          <span class="odds">{{ getOdds(getPlayId(2, num - 1)) }}</span>
        </div>
      </div>
    </div>
    <!-- 第二球 ~ 第五球 同理 -->
  </div>
</template>

<script setup lang="ts">
// playId = 122 * 1000 + ballPosition * 100 + number
// ballPosition: 2=第一球，3=第二球，4=第三球，5=第四球，6=第五球
const getPlayId = (ballPos: number, number: number) => {
  return 122000 + ballPos * 100 + number
}
</script>
```

#### 2.3 创建 LongHuBet.vue（龙虎斗）

**文件**：`frontend/src/components/game/LongHuBet.vue`

```vue
<template>
  <div class="longhu-bet">
    <div
      v-for="match in matchups"
      :key="match.id"
      class="match-section"
    >
      <div class="section-title">{{ match.title }}</div>
      <div class="bet-row">
        <div
          class="bet-box"
          :class="{ active: isSelected(match.dragonId) }"
          @click="toggleBet(match.dragonId)"
        >
          <span>龍</span>
          <span class="odds">{{ getOdds(match.dragonId) }}</span>
        </div>
        <div
          class="bet-box"
          :class="{ active: isSelected(match.tigerId) }"
          @click="toggleBet(match.tigerId)"
        >
          <span>虎</span>
          <span class="odds">{{ getOdds(match.tigerId) }}</span>
        </div>
        <div
          class="bet-box"
          :class="{ active: isSelected(match.drawId) }"
          @click="toggleBet(match.drawId)"
        >
          <span>和</span>
          <span class="odds">{{ getOdds(match.drawId) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 10 组对阵配置
const matchups = [
  { id: 1, title: '第一球 VS 第二球', dragonId: 122906, tigerId: 122907, drawId: 122908 },
  { id: 2, title: '第一球 VS 第三球', dragonId: 122909, tigerId: 122910, drawId: 122911 },
  // ... 共 10 组
]
</script>
```

#### 2.4 创建 QzhBet.vue（前中後）

**文件**：`frontend/src/components/game/QzhBet.vue`

```vue
<template>
  <div class="qzh-bet">
    <div class="section">
      <div class="section-title">{{ t('amssc.frontThree') }}</div>
      <div class="bet-grid">
        <div class="bet-box" @click="toggleBet(122701)">
          <span>豹子</span><span class="odds">70</span>
        </div>
        <div class="bet-box" @click="toggleBet(122702)">
          <span>順子</span><span class="odds">14</span>
        </div>
        <div class="bet-box" @click="toggleBet(122703)">
          <span>對子</span><span class="odds">3.2</span>
        </div>
        <div class="bet-box" @click="toggleBet(122704)">
          <span>半順</span><span class="odds">2.3</span>
        </div>
        <div class="bet-box" @click="toggleBet(122705)">
          <span>雜六</span><span class="odds">2.8</span>
        </div>
      </div>
    </div>
    <!-- 中三、后三同理 -->
  </div>
</template>
```

### 步骤 3：修改游戏主页面

**文件**：`frontend/src/views/game/index.vue`

#### 3.1 修改球号数量

```typescript
// 根据游戏类型动态设置球号数量
const getBallCount = () => {
  const config = getGameConfig(gameId.value)
  if (config?.group === 'group2') {
    return 5 // 时时彩类型 5 个球
  }
  return 10 // PK10 类型 10 个球
}

const displayNumbers = ref<number[]>(Array(getBallCount()).fill(0))
```

#### 3.2 修改开奖结果计算

```typescript
// 时时彩类型开奖结果
const lotteryResults = computed(() => {
  const nums = lastNumbers.value
  if (!nums || nums.length !== 5) return []

  const results: (number | string)[] = []

  // 总和
  const sum = nums.reduce((a, b) => a + b, 0)
  results.push(sum)
  results.push(sum >= 23 ? '大' : '小')
  results.push(sum % 2 === 1 ? '單' : '雙')

  // 龙虎：1vs5, 2vs4
  results.push(nums[0] > nums[4] ? '龍' : '虎')
  results.push(nums[1] > nums[3] ? '龍' : '虎')

  return results
})
```

#### 3.3 添加新组件导入

```typescript
import AllBallsBet from '@/components/game/AllBallsBet.vue'
import LongHuBet from '@/components/game/LongHuBet.vue'
import QzhBet from '@/components/game/QzhBet.vue'
```

#### 3.4 修改玩法选择逻辑

```vue
<!-- 两面玩法 -->
<template v-if="currentPane?.code === 'LM'">
  <LiangMianBet ... />
</template>

<!-- 1-5 球玩法 -->
<template v-else-if="currentPane?.code === 'ALL'">
  <AllBallsBet ... />
</template>

<!-- 龙虎斗 -->
<template v-else-if="currentPane?.code === 'LONGHU'">
  <LongHuBet ... />
</template>

<!-- 前中後 -->
<template v-else-if="currentPane?.code === 'QZH'">
  <QzhBet ... />
</template>
```

### 步骤 4：完善 PlayID 计算逻辑

**文件**：`frontend/src/api/game.ts`

添加统一的 playId 计算函数：

```typescript
/**
 * 计算时时彩类型玩法 ID
 * @param gameId 游戏 ID (122)
 * @param category 分类 (1=总和，2=第一球，3=第二球...)
 * @param sequence 序号 (01=大，02=小，03=单，04=双，00-09=数字)
 */
export function calcSSCPplayId(gameId: number, category: number, sequence: number): number {
  return gameId * 10000 + category * 100 + sequence
}
```

### 步骤 5：添加多语言翻译

**文件**：`frontend/src/locales/index.ts`

```typescript
export const translations = {
  'zh-TW': {
    // ...
    'amssc': {
      'ball1': '第一球',
      'ball2': '第二球',
      'ball3': '第三球',
      'ball4': '第四球',
      'ball5': '第五球',
      'totalBig': '總和大',
      'totalSmall': '總和小',
      'totalSingle': '總和單',
      'totalDouble': '總和雙',
      'frontThree': '前三',
      'middleThree': '中三',
      'backThree': '后三',
      'leopard': '豹子',
      'straight': '順子',
      'pair': '對子',
      'halfStraight': '半順',
      'mixed': '雜六'
    }
  },
  // zh-CN 和 en 同理
}
```

---

## 6. 测试验证

### 6.1 功能测试清单

| 测试项 | 预期结果 | 状态 |
|-------|---------|------|
| 页面显示 5 个球 | 不是 10 个球 | ☐ |
| 两面玩法投注 | 能正常选择和显示赔率 | ☐ |
| 1-5 球玩法 | 0-9 数字投注正常 | ☐ |
| 龙虎斗 | 10 组对阵显示正确 | ☐ |
| 前中後 | 豹子/顺子等赔率正确 | ☐ |
| 下注功能 | 能成功提交到后端 | ☐ |
| 开奖结果显示 | 5 个球位置正确 | ☐ |

### 6.2 PlayID 验证

从后端获取玩法数据后，验证以下 PlayID 是否正确：

| 玩法 | 期望 PlayID | 实际 PlayID |
|-----|-----------|-----------|
| 总和大 | 122101 | ☐ |
| 总和小 | 122102 | ☐ |
| 第一球 0 | 122200 | ☐ |
| 第一球大 | 122210 | ☐ |
| 龙虎（1VS2） | 122906 | ☐ |
| 前三豹子 | 122701 | ☐ |

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
   feat: 完成五分时时彩（游戏 122）页面重构

   - 修改球号显示为 5 个
   - 创建两面、1-5 球、龙虎斗、前中後投注组件
   - 添加时时彩类型 PlayID 计算逻辑
   - 添加多语言支持

   Co-Authored-By: Claude <noreply@anthropic.com>
   ```

---

## 8. 参考资料

- PHP 模板：`views/lottery/templates/amssc/`
- PHP 游戏控制器：`wjaction/default/Game.class.php`
- 数据库玩法配置：查询 `ssc_played` 表中 `gameId=122` 的记录
- 游戏配置：`frontend/src/config/games.ts`

---

## 9. 常见问题

**Q1: 为什么 PlayID 计算方式不同？**
A: 不同游戏类型的 PlayID 编码规则不同。PK10 是 `gameId*100000+categoryId*100+sequence`，时时彩是 `gameId*10000+categoryId*100+sequence`。

**Q2: 如何获取准确的赔率数据？**
A: 通过后端 `GET /api/game/plays?gameId=122&panId=2` 接口获取，数据来自数据库 `ssc_played` 表。

**Q3: 龙虎斗的和局赔率是多少？**
A: 从 PHP 数据库看，和局赔率约为 9.4。

---

**文档创建日期**：2026-02-26
**最后更新**：2026-02-26
