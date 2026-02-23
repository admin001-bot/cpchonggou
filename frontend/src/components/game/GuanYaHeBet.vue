<template>
  <div class="bet-view">
    <!-- 冠亚和大小单双 -->
    <div class="bet-section">
      <div class="section-title">冠亞和</div>
      <div class="bet-row">
        <div
          class="bet-item"
          :class="{ selected: isSelected(501001) }"
          @click="handleToggle(501001, '冠亞大')"
        >
          <span class="bet-content">冠亞大</span>
          <span class="bet-odds">2.2</span>
        </div>
        <div
          class="bet-item"
          :class="{ selected: isSelected(501002) }"
          @click="handleToggle(501002, '冠亞小')"
        >
          <span class="bet-content">冠亞小</span>
          <span class="bet-odds">1.77</span>
        </div>
      </div>
      <div class="bet-row">
        <div
          class="bet-item"
          :class="{ selected: isSelected(501003) }"
          @click="handleToggle(501003, '冠亞單')"
        >
          <span class="bet-content">冠亞單</span>
          <span class="bet-odds">1.77</span>
        </div>
        <div
          class="bet-item"
          :class="{ selected: isSelected(501004) }"
          @click="handleToggle(501004, '冠亞雙')"
        >
          <span class="bet-content">冠亞雙</span>
          <span class="bet-odds">2.2</span>
        </div>
      </div>
    </div>

    <!-- 冠亚和数字 -->
    <div class="bet-section">
      <div class="section-title">冠亞和數字</div>
      <div class="bet-row" v-for="row in heNumberRows" :key="row[0]">
        <div
          v-for="num in row"
          :key="num"
          class="bet-item number-item"
          :class="{ selected: isSelected(getHePlayId(num)) }"
          @click="handleToggle(getHePlayId(num), `冠亞和${num}`)"
        >
          <span class="bet-number">{{ num }}</span>
          <span class="bet-odds">{{ getHeOdds(num) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  gameId: number
  betData: Record<string, number[]>
  lotteryState?: number  // 1:正常 0:封盘 -1:未开盘
}

const props = withDefaults(defineProps<Props>(), {
  lotteryState: 1
})
const emit = defineEmits<{
  (e: 'toggle-bet', playId: number, paneCode?: string): void
}>()

// 冠亚和数字行
const heNumberRows = computed(() => {
  const rows = []
  for (let i = 3; i <= 19; i += 4) {
    const row = []
    for (let j = i; j < i + 4 && j <= 19; j++) {
      row.push(j)
    }
    rows.push(row)
  }
  return rows
})

// 获取冠亚和玩法ID
function getHePlayId(num: number): number {
  // 根据数字返回对应的玩法ID
  return 502000 + num
}

// 获取冠亚和赔率
function getHeOdds(num: number): string {
  // 中间数字赔率较低，两端赔率较高
  if (num === 3 || num === 4 || num === 18 || num === 19) {
    return '9.85'
  } else if (num === 5 || num === 6 || num === 16 || num === 17) {
    return '4.5'
  } else if (num === 7 || num === 8 || num === 14 || num === 15) {
    return '2.8'
  } else if (num === 9 || num === 10 || num === 12 || num === 13) {
    return '2.2'
  } else {
    return '1.982'
  }
}

// 是否选中
function isSelected(playId: number): boolean {
  const list = props.betData['HE'] || []
  return list.includes(playId)
}

// 切换投注
function handleToggle(playId: number, _name: string) {
  if (props.lotteryState !== 1) return
  emit('toggle-bet', playId, 'HE')
}
</script>

<style scoped>
.bet-view {
  padding: 10px;
  background: #f5f5f5;
}

.bet-section {
  background: #fff;
  margin-bottom: 10px;
  border-radius: 8px;
  overflow: hidden;
}

.section-title {
  background: #fafafa;
  padding: 8px 10px;
  text-align: center;
  font-size: 14px;
  color: #333;
  font-weight: 500;
  border-bottom: 1px solid #eee;
}

.bet-row {
  display: flex;
  border-bottom: 1px solid #f0f0f0;
}

.bet-row:last-child {
  border-bottom: none;
}

.bet-item {
  flex: 1;
  padding: 10px 5px;
  text-align: center;
  border-right: 1px solid #f0f0f0;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #fff;
}

.bet-item:last-child {
  border-right: none;
}

.bet-item:active {
  background: #f5f5f5;
}

.bet-item.selected {
  background: #fff5f7;
}

.bet-item.selected .bet-content,
.bet-item.selected .bet-number {
  color: #fb2351;
}

.bet-item.selected .bet-odds {
  color: #fb2351;
}

.bet-content {
  display: block;
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
}

.bet-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #fb2351;
  color: #fff;
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 4px;
}

.bet-odds {
  display: block;
  font-size: 12px;
  color: #f5a623;
}

.number-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 5px;
}
</style>
