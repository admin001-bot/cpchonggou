<template>
  <div class="touweishu-bet">
    <!-- 头数 -->
    <div class="bet-section">
      <div class="section-title">{{ t('lhc.touShu') }}</div>
      <div class="bet-row">
        <div
          v-for="tou in touList"
          :key="tou.id"
          class="bet-box"
          :class="{ active: isSelected(getTouPlayId(tou.id)) }"
          @click="toggleBet(getTouPlayId(tou.id))"
        >
          <span class="bet-name">{{ tou.name }}尾</span>
          <span class="bet-numbers">{{ tou.numbers }}</span>
          <span class="odds">{{ getOdds(getTouPlayId(tou.id)) }}</span>
        </div>
      </div>
    </div>

    <!-- 尾数 -->
    <div class="bet-section">
      <div class="section-title">{{ t('lhc.weiShu') }}</div>
      <div class="bet-row wei-grid">
        <div
          v-for="wei in weiList"
          :key="wei.id"
          class="bet-box"
          :class="{ active: isSelected(getWeiPlayId(wei.id)) }"
          @click="toggleBet(getWeiPlayId(wei.id))"
        >
          <span class="bet-name">{{ wei.name }}尾</span>
          <span class="bet-numbers">{{ wei.numbers }}</span>
          <span class="odds">{{ getOdds(getWeiPlayId(wei.id)) }}</span>
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
  (e: 'toggle-bet', playId: number): void
}>()

// 头数列表 (0-4) playId: 11395001-11395005
const touList = [
  { id: 0, name: '0', numbers: '01-09' },
  { id: 1, name: '1', numbers: '10-19' },
  { id: 2, name: '2', numbers: '20-29' },
  { id: 3, name: '3', numbers: '30-39' },
  { id: 4, name: '4', numbers: '40-49' }
]

// 尾数列表 (0-9) playId: 11395011-11395020
const weiList = [
  { id: 0, name: '0', numbers: '10,20,30,40' },
  { id: 1, name: '1', numbers: '01,11,21,31,41' },
  { id: 2, name: '2', numbers: '02,12,22,32,42' },
  { id: 3, name: '3', numbers: '03,13,23,33,43' },
  { id: 4, name: '4', numbers: '04,14,24,34,44' },
  { id: 5, name: '5', numbers: '05,15,25,35,45' },
  { id: 6, name: '6', numbers: '06,16,26,36,46' },
  { id: 7, name: '7', numbers: '07,17,27,37,47' },
  { id: 8, name: '8', numbers: '08,18,28,38,48' },
  { id: 9, name: '9', numbers: '09,19,29,39,49' }
]

// 获取头数 playId
const getTouPlayId = (touId: number) => {
  return 11395000 + touId + 1
}

// 获取尾数 playId
const getWeiPlayId = (weiId: number) => {
  return 11395010 + weiId + 1
}

const isSelected = (playId: number) => {
  return props.selectedBets.includes(playId)
}

const toggleBet = (playId: number) => {
  emit('toggle-bet', playId)
}

const getOdds = (playId: number) => {
  const play = props.playsData[playId.toString()]
  return play?.odds?.toFixed(3) || '1.982'
}
</script>

<style scoped>
.touweishu-bet {
  padding: 15px;
  background: #f5f5f5;
}

.bet-section {
  background: #fff;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
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
  flex-wrap: wrap;
}

.bet-row.wei-grid {
  justify-content: space-between;
}

.bet-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 10px;
  background: #f9f9f9;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  flex: 1;
  min-width: 60px;
}

.bet-box:active {
  transform: scale(0.95);
}

.bet-box.active {
  border-color: #fb2351;
  background: #fff5f5;
}

.bet-name {
  font-size: 18px;
  font-weight: 700;
  color: #333;
  margin-bottom: 4px;
}

.bet-numbers {
  font-size: 9px;
  color: #999;
  text-align: center;
  margin-bottom: 6px;
}

.odds {
  font-size: 12px;
  color: #fb2351;
  font-weight: 600;
}
</style>
