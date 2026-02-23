<template>
  <div class="bet-view">
    <div class="bet-section" v-for="rank in ranks" :key="rank">
      <div class="section-title">{{ getRankName(rank) }}</div>
      <div class="bet-row" v-for="row in getNumberRows()" :key="row[0]">
        <div
          v-for="num in row"
          :key="num"
          class="bet-item"
          :class="{ selected: isSelected(getPlayId(rank, num)) }"
          @click="handleToggle(getPlayId(rank, num), getRankName(rank) + '-' + num)"
        >
          <span class="bet-number" :class="'data-' + num"></span>
          <span class="bet-odds">{{ getOdds(getPlayId(rank, num)).toFixed(3) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { t } from '@/locales'
import type { PlayInfo } from '@/api/game'

interface Props {
  gameId: number
  betData: Record<string, number[]>
  playsData: Record<string, PlayInfo>
  getOdds: (playId: number) => number
  ranks: number[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'toggle-bet', playId: number, paneCode?: string): void
}>()

// 获取名次名称
function getRankName(rank: number): string {
  return t(`rank.${rank}`)
}

// 获取数字行 - 每行2个
function getNumberRows() {
  const rows = []
  for (let i = 1; i <= 10; i += 2) {
    rows.push([i, i + 1])
  }
  return rows
}

// 获取玩法ID
// playId格式: gameId(55) + categoryId(102-111) + sequence(01-10)
// categoryId = 101 + rank (例如: 第1名=102, 第10名=111)
// sequence = 号码 (1-10号对应01-10)
function getPlayId(rank: number, num: number): number {
  const gameId = props.gameId
  const categoryId = 101 + rank // 第1名=102, 第10名=111
  const sequence = num // 号码1-10对应01-10
  return gameId * 100000 + categoryId * 100 + sequence
}

// 是否选中
function isSelected(playId: number): boolean {
  const paneCode = props.ranks[0] <= 5 ? '1-5' : '6-10'
  const list = props.betData[paneCode] || []
  return list.includes(playId)
}

// 切换投注
function handleToggle(playId: number, _name: string) {
  const paneCode = props.ranks[0] <= 5 ? '1-5' : '6-10'
  emit('toggle-bet', playId, paneCode)
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
  display: flex;
  flex-direction: column;
  align-items: center;
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

.bet-item.selected .bet-number {
  box-shadow: 0 0 0 2px #fff;
}

.bet-number {
  display: inline-block;
  width: 30px;
  height: 30px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  margin-bottom: 4px;
}

/* PK10号码图片 */
.bet-number.data-1 { background-image: url('/images/ball/1.png'); }
.bet-number.data-2 { background-image: url('/images/ball/2.png'); }
.bet-number.data-3 { background-image: url('/images/ball/3.png'); }
.bet-number.data-4 { background-image: url('/images/ball/4.png'); }
.bet-number.data-5 { background-image: url('/images/ball/5.png'); }
.bet-number.data-6 { background-image: url('/images/ball/6.png'); }
.bet-number.data-7 { background-image: url('/images/ball/7.png'); }
.bet-number.data-8 { background-image: url('/images/ball/8.png'); }
.bet-number.data-9 { background-image: url('/images/ball/9.png'); }
.bet-number.data-10 { background-image: url('/images/ball/10.png'); }

.bet-odds {
  display: block;
  font-size: 15px;
  font-weight: bold;
  color: #ed3f3f;
}
</style>
