# 游戏 113（极速六合綵）完整实施文档

## 1. 任务概述

**目标**：完善游戏 113（极速六合綵）的所有投注玩法，实现完整的前端功能

**当前状态**：
- 特码 (TM)：已实现
- 两面 (LM)：部分实现（缺少生肖肖面：特天肖、特地肖、特前肖、特后肖、特家肖、特野肖）
- 其他玩法：未实现

**游戏基本信息**：
- 游戏ID：113
- 游戏名称：極速六合綵
- 模板名称：jslhc
- 开奖号码：7 个球（6 个正码 + 1 个特码）
- 游戏分组：group7
- 开奖频率：每天 1 期

---

## 2. 玩法列表及实现状态

### 2.1 玩法总览

| 序号 | 玩法代码 | 玩法名称 | 状态 | 优先级 | 组件文件 |
|------|----------|----------|------|--------|----------|
| 1 | TM | 特码 | ✅ 已实现 | - | TeMaBet.vue |
| 2 | LM | 两面 | ⚠️ 部分 | 高 | LiangMianLhcBet.vue |
| 3 | ZM | 正码 | ⬜ 未实现 | 高 | ZhongMaBet.vue |
| 4 | ZM1-6 | 正码1-6 | ⬜ 未实现 | 高 | ZhongMaPosBet.vue |
| 5 | ZT | 正特 | ⬜ 未实现 | 高 | ZhengTeBet.vue |
| 6 | LMA | 连码 | ⬜ 未实现 | 中 | LianMaBet.vue |
| 7 | SB | 色波 | ⚠️ 部分 | 中 | SeBoBet.vue |
| 8 | TX | 特肖 | ✅ 已实现 | 中 | TeXiaoBet.vue |
| 9 | LX | 连肖 | ⬜ 未实现 | 低 | LianXiaoBet.vue |
| 10 | HX | 合肖 | ⬜ 未实现 | 低 | HeXiaoBet.vue |
| 11 | LW | 连尾 | ⬜ 未实现 | 低 | LianWeiBet.vue |
| 12 | ZX | 正肖 | ⬜ 未实现 | 低 | ZhengXiaoBet.vue |
| 13 | WX | 五行 | ⬜ 未实现 | 低 | WuXingBet.vue |
| 14 | ZXBZ | 自选不中 | ⬜ 未实现 | 低 | ZixuanBuzhong.vue |
| 15 | TWS | 头尾数 | ⬜ 未实现 | 低 | TouWeishuBet.vue |
| 16 | ZOX | 总肖 | ⬜ 未实现 | 低 | ZongxiaoBet.vue |
| 17 | YX | 一肖一尾 | ⬜ 未实现 | 低 | YiXiaoYiWei.vue |

---

## 3. 玩法 ID 编码规则详解

### 3.1 编码格式
```
playId = 游戏ID(113) * 1000000 + 类别ID * 100 + 序号
```

### 3.2 各类别 ID 详细对照表

| 玩法 | 类别ID | playId范围 | 说明 |
|------|--------|------------|------|
| 特码A | 85 | 1138501-1138549 | 1-49号 |
| 特码B | 85 | 1138550-1138598 | 1-49号 |
| 两面 | 86 | 1138601-1138627 | 特码两面 + 总和两面 + 生肖肖面 |
| 色波 | 87 | 1138701-1138727 | 红/蓝/绿波的各种组合 |
| 特肖 | 88 | 1138801-1138812 | 12个生肖 |
| 正码 | 91 | 1139101-1139149 | 1-49号 |
| 七色波 | 96 | 1139601-1139604 | 红/蓝/绿/和局 |

---

## 4. 各玩法详细说明

### 4.1 特码 (TM) - 已实现 ✅

**功能**：投注特码 A 或特码 B（1-49号）

**子玩法**：
- 特码A：1138501-1138549（对应 1-49 号）
- 特码B：1138550-1138598（对应 1-49 号）

**组件**：`TeMaBet.vue`

---

### 4.2 两面 (LM) - 部分实现 ⚠️

**功能**：特码两面 + 总和两面 + 生肖肖面

**已实现选项**：

| playId | 名称 | 说明 |
|--------|------|------|
| 1138601 | 特大 | 特码 > 24 |
| 1138602 | 特小 | 特码 < 25 |
| 1138603 | 特單 | 特码为单数 |
| 1138604 | 特雙 | 特码为双数 |
| 1138605 | 特合大 | 特码个位+十位 > 6 |
| 1138606 | 特合小 | 特码个位+十位 < 7 |
| 1138607 | 特合單 | 特码个位+十位为单数 |
| 1138608 | 特合雙 | 特码个位+十位为双数 |
| 1138609 | 特尾大 | 特码尾数 > 4 |
| 1138610 | 特尾小 | 特码尾数 < 5 |
| 1138611 | 特大單 | 特大 + 特单 |
| 1138612 | 特大雙 | 特大 + 特双 |
| 1138613 | 特小單 | 特小 + 特单 |
| 1138614 | 特小雙 | 特小 + 特双 |
| 1138621 | 總和單 | 7个球总和为单数 |
| 1138622 | 總和雙 | 7个球总和为双数 |
| 1138623 | 總和大 | 7个球总和 > 174 |
| 1138624 | 總和小 | 7个球总和 < 175 |

**待添加选项**（生肖肖面）：

| playId | 名称 | 说明 |
|--------|------|------|
| 1138615 | 特天肖 | 特码属天肖(马兔蛇龙狗牛猴) |
| 1138616 | 特地肖 | 特码属地肖(猪鸡羊虎鼠猴) |
| 1138617 | 特前肖 | 鼠牛虎兔龙蛇 |
| 1138618 | 特後肖 | 马羊猴鸡狗猪 |
| 1138619 | 特家肖 | 牛马羊鸡狗猪 |
| 1138620 | 特野肖 | 鼠虎兔龙蛇猴 |

**PHP模板**：`views/lottery/templates/jslhc/lm.html`

**组件**：`LiangMianLhcBet.vue`

---

### 4.3 正码 (ZM) - 未实现 ⬜

**功能**：投注正码 1-49 号 + 总和两面

**投注项目**：
- 正码：1139101-1139149（对应 1-49 号）
- 总会两面：1138621-1138624（与两面共用）

**PHP模板**：`views/lottery/templates/jslhc/zm.html`

**需要创建**：`ZhongMaBet.vue`

**实现要点**：
1. 显示 1-49 号号码网格（按波色分组显示）
2. 显示总和两面选项
3. 号码选中状态管理

---

### 4.4 正码1-6 (ZM1-6) - 未实现 ⬜

**功能**：分别投注 6 个位置的正码（每个位置 1-49 号）

**PHP模板**：`views/lottery/templates/jslhc/zm1-6.html`

**需要创建**：`ZhongMaPosBet.vue`

**实现要点**：
1. 6 个位置的分页切换（正码1、正码2...正码6）
2. 每个位置 1-49 号选择
3. 每个位置独立的两面选项

---

### 4.5 正特 (ZT) - 未实现 ⬜

**功能**：正码 + 特码的组合投注

**PHP模板**：`views/lottery/templates/jslhc/zt.html`

**需要创建**：`ZhengTeBet.vue`

---

### 4.6 连码 (LMA) - 未实现 ⬜

**功能**：多号码组合投注

**子玩法**：

| 子玩法 | playId | 最小选择 | 最大选择 | 说明 |
|--------|--------|----------|----------|------|
| 三全中 | 11310003 | 3 | 10 | 选3个号全中 |
| 三中二 | 11310001/11310002 | 3 | 7 | 选3个号中2个 |
| 二全中 | 11310004 | 2 | 7 | 选2个号全中 |
| 二中特 | 11310005/11310006 | 2 | 7 | 选2个号中特码 |
| 特串 | 11310007 | 2 | 7 | 1个正码 + 1个特码 |
| 四全中 | 11310008 | 4 | 4 | 选4个号全中 |

**PHP模板**：`views/lottery/templates/jslhc/lma.html`

**需要创建**：`LianMaBet.vue`

**实现要点**：
1. 6 个子玩法切换（通过 data-id 区分）
2. 多选号码（根据子玩法限制数量 min-size/max-size）
3. 动态显示赔率

---

### 4.7 色波 (SB) - 部分实现 ⚠️

**功能**：色波组合投注

**已实现**：七色波（1139601-1139604）

**待实现**：色波组合（1138701-1138727）

| playId | 名称 | 波色 |
|--------|------|------|
| 1139601 | 紅波 | - |
| 1139602 | 藍波 | - |
| 1139603 | 綠波 | - |
| 1139604 | 和局 | - |
| 1138704 | 紅單 | 红波单 |
| 1138705 | 紅雙 | 红波双 |
| 1138706 | 紅大 | 红波大 |
| 1138707 | 紅小 | 红波小 |
| 1138708 | 藍單 | 蓝波单 |
| 1138709 | 藍雙 | 蓝波双 |
| 1138710 | 藍大 | 蓝波大 |
| 1138711 | 藍小 | 蓝波小 |
| 1138712 | 綠單 | 绿波单 |
| 1138713 | 綠雙 | 绿波双 |
| 1138714 | 綠大 | 绿波大 |
| 1138715 | 綠小 | 绿波小 |
| 1138716 | 紅大單 | 红波大单 |
| 1138717 | 紅大雙 | 红波大双 |
| 1138718 | 紅小單 | 红波小单 |
| 1138719 | 紅小雙 | 红波小双 |
| 1138720 | 藍大單 | 蓝波大单 |
| 1138721 | 藍大雙 | 蓝波大双 |
| 1138722 | 藍小單 | 蓝波小单 |
| 1138723 | 藍小雙 | 蓝波小双 |
| 1138724 | 綠大單 | 绿波大单 |
| 1138725 | 綠大雙 | 绿波大双 |
| 1138726 | 綠小單 | 绿波小单 |
| 1138727 | 綠小雙 | 绿波小双 |

**PHP模板**：`views/lottery/templates/jslhc/sb.html`

**组件**：`SeBoBet.vue`（需要完善）

---

### 4.8 特肖 (TX) - 已实现 ✅

**功能**：投注特码的生肖

**投注项目**：

| playId | 生肖 | 包含号码 |
|--------|------|----------|
| 1138801 | 鼠 | 08,20,32,44 |
| 1138802 | 牛 | 07,19,31,43 |
| 1138803 | 虎 | 06,18,30,42 |
| 1138804 | 兔 | 05,17,29,41 |
| 1138805 | 龍 | 04,16,28,40 |
| 1138806 | 蛇 | 03,15,27,39 |
| 1138807 | 馬 | 02,14,26,38 |
| 1138808 | 羊 | 01,13,25,37,49 |
| 1138809 | 猴 | 12,24,36,48 |
| 1138810 | 雞 | 11,23,35,47 |
| 1138811 | 狗 | 10,22,34,46 |
| 1138812 | 豬 | 09,21,33,45 |

**PHP模板**：`views/lottery/templates/jslhc/tx.html`

**组件**：`TeXiaoBet.vue`（已实现）

---

### 4.9 连肖 (LX) - 未实现 ⬜

**功能**：2-4 连肖投注

**PHP模板**：`views/lottery/templates/jslhc/lx.html`

**需要创建**：`LianXiaoBet.vue`

---

### 4.10 合肖 (HX) - 未实现 ⬜

**功能**：2-11 合肖投注

**PHP模板**：`views/lottery/templates/jslhc/hx.html`

**需要创建**：`HeXiaoBet.vue`

---

### 4.11 连尾 (LW) - 未实现 ⬜

**功能**：2-4 连尾投注

**PHP模板**：`views/lottery/templates/jslhc/lw.html`

**需要创建**：`LianWeiBet.vue`

---

### 4.12 正肖 (ZX) - 未实现 ⬜

**功能**：正码生肖投注

**PHP模板**：`views/lottery/templates/jslhc/zx.html`

**需要创建**：`ZhengXiaoBet.vue`

---

### 4.13 五行 (WX) - 未实现 ⬜

**功能**：五行投注

**PHP模板**：`views/lottery/templates/jslhc/wx.html`

**需要创建**：`WuXingBet.vue`

---

### 4.14 自选不中 (ZXBZ) - 未实现 ⬜

**功能**：5-12 个号码不中投注

**PHP模板**：`views/lottery/templates/jslhc/zxbz.html`

**需要创建**：`ZixuanBuzhong.vue`

---

### 4.15 头尾数 (TWS) - 未实现 ⬜

**功能**：头数/尾数投注

**PHP模板**：`views/lottery/templates/jslhc/tws.html`

**需要创建**：`TouWeishuBet.vue`

---

### 4.16 总肖 (ZOX) - 未实现 ⬜

**功能**：总肖投注

**PHP模板**：`views/lottery/templates/jslhc/zox.html`

**需要创建**：`ZongxiaoBet.vue`

---

### 4.17 一肖一尾 (YX) - 未实现 ⬜

**功能**：生肖 + 尾数投注

**PHP模板**：`views/lottery/templates/jslhc/yx.html`

**需要创建**：`YiXiaoYiWei.vue`

---

## 5. 期号获取分析

### 5.1 后端配置（已实现 ✅）

**文件**：`backend/internal/handler/game_handler.go`

```go
case "70", "113":
    periodSeconds = 86400  // 每天一期（24*60*60）
    ftime = 1800           // 封盘时间30分钟
    periodsPerDay = 1      // 每天1期
```

### 5.2 期号格式

**格式**：`{日期}{期序号}`（例如：20260226001）

**计算逻辑**：
```
secondsOfDay = 当前秒数（从0点开始）
issueNum = secondsOfDay / periodSeconds + 1
期号 = 日期(8位) + 期序号(3位，不足补0)
```

### 5.3 前端显示

游戏 113 的期号显示已在主页面实现：
- 当前期号：`currentPeriod`
- 上期期号：`prePeriod`
- 倒计时：`countdown`

---

## 6. 实施步骤

### 阶段一：完善已有功能（高优先级）

#### 步骤 1.1：完善两面 (LM) 组件

**文件**：`frontend/src/components/game/LiangMianLhcBet.vue`

**需要添加**：生肖肖面选择（1138615-1138620）

```typescript
// 添加生肖肖面选项
const zodiacOptions = [
  { playId: 1138615, name: 'teTianXiao', nameKey: 'lhc.teTianXiao' },
  { playId: 1138616, name: 'teDiXiao', nameKey: 'lhc.teDiXiao' },
  { playId: 1138617, name: 'teQianXiao', nameKey: 'lhc.teQianXiao' },
  { playId: 1138618, name: 'teHouXiao', nameKey: 'lhc.teHouXiao' },
  { playId: 1138619, name: 'teJiaXiao', nameKey: 'lhc.teJiaXiao' },
  { playId: 1138620, name: 'teYeXiao', nameKey: 'lhc.teYeXiao' },
]
```

#### 步骤 1.2：完善色波 (SB) 组件

**文件**：`frontend/src/components/game/SeBoBet.vue`

**需要添加**：色波组合选项（1138701-1138727）

---

### 阶段二：实现核心玩法（高优先级）

#### 步骤 2.1：创建正码 (ZM) 组件

**新建文件**：`frontend/src/components/game/ZhongMaBet.vue`

#### 步骤 2.2：创建正码1-6 (ZM1-6) 组件

**新建文件**：`frontend/src/components/game/ZhongMaPosBet.vue`

#### 步骤 2.3：创建正特 (ZT) 组件

**新建文件**：`frontend/src/components/game/ZhengTeBet.vue`

---

### 阶段三：实现中优先级玩法

#### 步骤 3.1：创建连码 (LMA) 组件

**新建文件**：`frontend/src/components/game/LianMaBet.vue`

---

### 阶段四：实现低优先级玩法

#### 步骤 4.1：创建剩余组件

- 连肖 (LX) - `LianXiaoBet.vue`
- 合肖 (HX) - `HeXiaoBet.vue`
- 连尾 (LW) - `LianWeiBet.vue`
- 正肖 (ZX) - `ZhengXiaoBet.vue`
- 五行 (WX) - `WuXingBet.vue`
- 自选不中 (ZXBZ) - `ZixuanBuzhong.vue`
- 头尾数 (TWS) - `TouWeishuBet.vue`
- 总肖 (ZOX) - `ZongxiaoBet.vue`
- 一肖一尾 (YX) - `YiXiaoYiWei.vue`

---

### 步骤 5：更新主页面组件

**文件**：`frontend/src/views/game/index.vue`

**需要添加**：
1. 导入新的投注组件
2. 在玩法切换中添加新组件的渲染逻辑

```vue
<!-- 正码玩法 -->
<template v-else-if="gameConfig?.group === 'group7' && currentPane?.code === 'ZM'">
  <ZhongMaBet ... />
</template>

<!-- 正码1-6玩法 -->
<template v-else-if="gameConfig?.group === 'group7' && currentPane?.code === 'ZM1-6'">
  <ZhongMaPosBet ... />
</template>

<!-- 正特玩法 -->
<template v-else-if="gameConfig?.group === 'group7' && currentPane?.code === 'ZT'">
  <ZhengTeBet ... />
</template>

<!-- 连码玩法 -->
<template v-else-if="gameConfig?.group === 'group7' && currentPane?.code === 'LMA'">
  <LianMaBet ... />
</template>

<!-- ... 其他玩法 ... -->
```

---

## 7. 测试验证清单

### 7.1 两面玩法测试

| 测试项 | playId | 预期结果 |
|--------|--------|----------|
| 特天肖 | 1138615 | 可选择 |
| 特地肖 | 1138616 | 可选择 |
| 特前肖 | 1138617 | 可选择 |
| 特後肖 | 1138618 | 可选择 |
| 特家肖 | 1138619 | 可选择 |
| 特野肖 | 1138620 | 可选择 |

### 7.2 正码玩法测试

| 测试项 | 预期结果 |
|--------|----------|
| 号码选择 | 1-49 号可选择 |
| 总会两面 | 开奖后正确结算 |
| 多选限制 | 按规则限制选择数量 |

### 7.3 色波玩法测试

| 测试项 | playId | 预期结果 |
|--------|--------|----------|
| 色波组合 | 1138701-1138727 | 全部可选择 |
| 七色波 | 1139601-1139604 | 已实现 |

### 7.4 连码玩法测试

| 测试项 | 预期结果 |
|--------|----------|
| 子玩法切换 | 6 个子玩法可切换 |
| 数量限制 | 根据子玩法限制选择数量 |
| 赔率显示 | 动态显示 |

---

## 8. PHP 模板参考文件

| 玩法 | 文件路径 |
|------|----------|
| 特码 | views/lottery/templates/jslhc/tm.html |
| 两面 | views/lottery/templates/jslhc/lm.html |
| 正码 | views/lottery/templates/jslhc/zm.html |
| 正码1-6 | views/lottery/templates/jslhc/zm1-6.html |
| 正特 | views/lottery/templates/jslhc/zt.html |
| 连码 | views/lottery/templates/jslhc/lma.html |
| 色波 | views/lottery/templates/jslhc/sb.html |
| 特肖 | views/lottery/templates/jslhc/tx.html |
| 连肖 | views/lottery/templates/jslhc/lx.html |
| 合肖 | views/lottery/templates/jslhc/hx.html |
| 连尾 | views/lottery/templates/jslhc/lw.html |
| 正肖 | views/lottery/templates/jslhc/zx.html |
| 五行 | views/lottery/templates/jslhc/wx.html |
| 自选不中 | views/lottery/templates/jslhc/zxbz.html |
| 头尾数 | views/lottery/templates/jslhc/tws.html |
| 总肖 | views/lottery/templates/jslhc/zox.html |
| 一肖一尾 | views/lottery/templates/jslhc/yx.html |

---

## 9. 公共数据定义

### 9.1 色波颜色定义

```typescript
const redWave = [1, 2, 7, 8, 12, 13, 18, 19, 23, 24, 29, 30, 34, 35, 40, 45, 46]
const blueWave = [3, 4, 9, 10, 14, 15, 20, 25, 26, 31, 36, 37, 41, 42, 47, 48]
const greenWave = [5, 6, 11, 16, 17, 21, 22, 27, 28, 32, 33, 38, 39, 43, 44, 49]
```

### 9.2 生肖定义

```typescript
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
```

### 9.3 生肖肖分类

```typescript
// 天肖：马兔蛇龙狗牛猴
const tianXiao = ['馬', '兔', '蛇', '龍', '狗', '牛', '猴']

// 地肖：猪鸡羊虎鼠猴
const diXiao = ['豬', '雞', '羊', '虎', '鼠', '猴']

// 前肖：鼠牛虎兔龙蛇
const qianXiao = ['鼠', '牛', '虎', '兔', '龍', '蛇']

// 后肖：马羊猴鸡狗猪
const houXiao = ['馬', '羊', '猴', '雞', '狗', '豬']

// 家肖：牛马羊鸡狗猪
const jiaXiao = ['牛', '馬', '羊', '雞', '狗', '豬']

// 野肖：鼠虎兔龙蛇猴
const yeXiao = ['鼠', '虎', '兔', '龍', '蛇', '猴']
```

---

**文档版本**：1.0
**创建日期**：2026-02-26
**最后更新**：2026-02-26
**适用人员**：前端开发工程师
