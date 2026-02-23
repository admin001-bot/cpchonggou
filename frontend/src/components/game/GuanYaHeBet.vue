<template>
  <div class="bet-view">
    <!-- 冠亚和大小单双 -->
    <div class="bet-section">
      <div class="row text-center">
        <div class="col title-no">冠、亞軍 組合</div>
      </div>
      <div class="bet-row">
        <div
          class="bet-item"
          :class="{ selected: isSelected(getPlayId('big')) }"
          @click="handleToggle(getPlayId('big'), '冠亞大')"
        >
          <span class="bet-content">冠亞大</span>
          <span class="bet-odds">{{ getOdds(getPlayId('big')).toFixed(2) }}</span>
        </div>
        <div
          class="bet-item"
          :class="{ selected: isSelected(getPlayId('small')) }"
          @click="handleToggle(getPlayId('small'), '冠亞小')"
        >
          <span class="bet-content">冠亞小</span>
          <span class="bet-odds">{{ getOdds(getPlayId('small')).toFixed(2) }}</span>
        </div>
      </div>
      <div class="bet-row">
        <div
          class="bet-item"
          :class="{ selected: isSelected(getPlayId('odd')) }"
          @click="handleToggle(getPlayId('odd'), '冠亞單')"
        >
          <span class="bet-content">冠亞單</span>
          <span class="bet-odds">{{ getOdds(getPlayId('odd')).toFixed(2) }}</span>
        </div>
        <div
          class="bet-item"
          :class="{ selected: isSelected(getPlayId('even')) }"
          @click="handleToggle(getPlayId('even'), '冠亞雙')"
        >
          <span class="bet-content">冠亞雙</span>
          <span class="bet-odds">{{ getOdds(getPlayId('even')).toFixed(2) }}</span>
        </div>
      </div>
    </div>

    <!-- 冠亚和数字 (每行3个，最后两行各2个) -->
    <div class="bet-section">
      <!-- 第一行: 3, 4, 5 -->
      <div class="bet-row">
        <div class="bet-item number-item" :class="{ selected: isSelected(getNumberPlayId(3)) }" @click="handleToggle(getNumberPlayId(3), '冠亞和3')">
          <span class="bet-number">3</span>
          <span class="bet-odds">{{ getOdds(getNumberPlayId(3)).toFixed(1) }}</span>
        </div>
        <div class="bet-item number-item" :class="{ selected: isSelected(getNumberPlayId(4)) }" @click="handleToggle(getNumberPlayId(4), '冠亞和4')">
          <span class="bet-number">4</span>
          <span class="bet-odds">{{ getOdds(getNumberPlayId(4)).toFixed(1) }}</span>
        </div>
        <div class="bet-item number-item" :class="{ selected: isSelected(getNumberPlayId(5)) }" @click="handleToggle(getNumberPlayId(5), '冠亞和5')">
          <span class="bet-number">5</span>
          <span class="bet-odds">{{ getOdds(getNumberPlayId(5)).toFixed(1) }}</span>
        </div>
      </div>
      <!-- 第二行: 6, 7, 8 -->
      <div class="bet-row">
        <div class="bet-item number-item" :class="{ selected: isSelected(getNumberPlayId(6)) }" @click="handleToggle(getNumberPlayId(6), '冠亞和6')">
          <span class="bet-number">6</span>
          <span class="bet-odds">{{ getOdds(getNumberPlayId(6)).toFixed(1) }}</span>
        </div>
        <div class="bet-item number-item" :class="{ selected: isSelected(getNumberPlayId(7)) }" @click="handleToggle(getNumberPlayId(7), '冠亞和7')">
          <span class="bet-number">7</span>
          <span class="bet-odds">{{ getOdds(getNumberPlayId(7)).toFixed(1) }}</span>
        </div>
        <div class="bet-item number-item" :class="{ selected: isSelected(getNumberPlayId(8)) }" @click="handleToggle(getNumberPlayId(8), '冠亞和8')">
          <span class="bet-number">8</span>
          <span class="bet-odds">{{ getOdds(getNumberPlayId(8)).toFixed(1) }}</span>
        </div>
      </div>
      <!-- 第三行: 9, 10, 11 -->
      <div class="bet-row">
        <div class="bet-item number-item" :class="{ selected: isSelected(getNumberPlayId(9)) }" @click="handleToggle(getNumberPlayId(9), '冠亞和9')">
          <span class="bet-number">9</span>
          <span class="bet-odds">{{ getOdds(getNumberPlayId(9)).toFixed(1) }}</span>
        </div>
        <div class="bet-item number-item" :class="{ selected: isSelected(getNumberPlayId(10)) }" @click="handleToggle(getNumberPlayId(10), '冠亞和10')">
          <span class="bet-number">10</span>
          <span class="bet-odds">{{ getOdds(getNumberPlayId(10)).toFixed(1) }}</span>
        </div>
        <div class="bet-item number-item" :class="{ selected: isSelected(getNumberPlayId(11)) }" @click="handleToggle(getNumberPlayId(11), '冠亞和11')">
          <span class="bet-number">11</span>
          <span class="bet-odds">{{ getOdds(getNumberPlayId(11)).toFixed(1) }}</span>
        </div>
      </div>
      <!-- 第四行: 12, 13, 14 -->
      <div class="bet-row">
        <div class="bet-item number-item" :class="{ selected: isSelected(getNumberPlayId(12)) }" @click="handleToggle(getNumberPlayId(12), '冠亞和12')">
          <span class="bet-number">12</span>
          <span class="bet-odds">{{ getOdds(getNumberPlayId(12)).toFixed(1) }}</span>
        </div>
        <div class="bet-item number-item" :class="{ selected: isSelected(getNumberPlayId(13)) }" @click="handleToggle(getNumberPlayId(13), '冠亞和13')">
          <span class="bet-number">13</span>
          <span class="bet-odds">{{ getOdds(getNumberPlayId(13)).toFixed(1) }}</span>
        </div>
        <div class="bet-item number-item" :class="{ selected: isSelected(getNumberPlayId(14)) }" @click="handleToggle(getNumberPlayId(14), '冠亞和14')">
          <span class="bet-number">14</span>
          <span class="bet-odds">{{ getOdds(getNumberPlayId(14)).toFixed(1) }}</span>
        </div>
      </div>
      <!-- 第五行: 15, 16, 17 -->
      <div class="bet-row">
        <div class="bet-item number-item" :class="{ selected: isSelected(getNumberPlayId(15)) }" @click="handleToggle(getNumberPlayId(15), '冠亞和15')">
          <span class="bet-number">15</span>
          <span class="bet-odds">{{ getOdds(getNumberPlayId(15)).toFixed(1) }}</span>
        </div>
        <div class="bet-item number-item" :class="{ selected: isSelected(getNumberPlayId(16)) }" @click="handleToggle(getNumberPlayId(16), '冠亞和16')">
          <span class="bet-number">16</span>
          <span class="bet-odds">{{ getOdds(getNumberPlayId(16)).toFixed(1) }}</span>
        </div>
        <div class="bet-item number-item" :class="{ selected: isSelected(getNumberPlayId(17)) }" @click="handleToggle(getNumberPlayId(17), '冠亞和17')">
          <span class="bet-number">17</span>
          <span class="bet-odds">{{ getOdds(getNumberPlayId(17)).toFixed(1) }}</span>
        </div>
      </div>
      <!-- 第六行: 18, 19 -->
      <div class="bet-row end">
        <div class="bet-item number-item" :class="{ selected: isSelected(getNumberPlayId(18)) }" @click="handleToggle(getNumberPlayId(18), '冠亞和18')">
          <span class="bet-number">18</span>
          <span class="bet-odds">{{ getOdds(getNumberPlayId(18)).toFixed(1) }}</span>
        </div>
        <div class="bet-item number-item" :class="{ selected: isSelected(getNumberPlayId(19)) }" @click="handleToggle(getNumberPlayId(19), '冠亞和19')">
          <span class="bet-number">19</span>
          <span class="bet-odds">{{ getOdds(getNumberPlayId(19)).toFixed(1) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PlayInfo } from '@/api/game'

interface Props {
  gameId: number
  betData: Record<string, number[]>
  playsData: Record<string, PlayInfo>
  getOdds: (playId: number) => number
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'toggle-bet', playId: number, paneCode?: string): void
}>()

// 获取冠亚和大小单双玩法ID
// playId格式: gameId(55) + categoryId(101) + sequence(01-04)
// 大=01, 小=02, 单=03, 双=04
function getPlayId(type: 'big' | 'small' | 'odd' | 'even'): number {
  const gameId = props.gameId
  const categoryId = 101 // 冠亚和
  let sequence: number
  switch (type) {
    case 'big': sequence = 1; break
    case 'small': sequence = 2; break
    case 'odd': sequence = 3; break
    case 'even': sequence = 4; break
    default: sequence = 1
  }
  return gameId * 100000 + categoryId * 100 + sequence
}

// 获取冠亚和数字玩法ID
// 数字3-19对应 sequence 05-21
// 例如: 数字3 = 5510105, 数字19 = 5510121
function getNumberPlayId(num: number): number {
  const gameId = props.gameId
  const categoryId = 101 // 冠亚和
  const sequence = num + 2 // 数字3->05, 数字19->21
  return gameId * 100000 + categoryId * 100 + sequence
}

// 是否选中
function isSelected(playId: number): boolean {
  const list = props.betData['HE'] || []
  return list.includes(playId)
}

// 切换投注
function handleToggle(playId: number, _name: string) {
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

.row {
  display: flex;
}

.text-center {
  text-align: center;
}

.col {
  flex: 1;
}

.title-no {
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

.bet-row.end {
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
  background: #b3b3b3;
}

.bet-item.selected .bet-content,
.bet-item.selected .bet-number {
  color: #fff;
}

.bet-item.selected .bet-odds {
  color: #ed3f3f;
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
  font-size: 15px;
  font-weight: bold;
  color: #ed3f3f;
}

.number-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 5px;
}
</style>
