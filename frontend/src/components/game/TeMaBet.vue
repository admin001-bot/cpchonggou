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
import { type PlayInfo } from '@/api/game'

const props = defineProps<{
  playsData: Record<string, PlayInfo>
  selectedBets: number[]
}>()

const emit = defineEmits<{
  (e: 'toggle-bet', playId: number): void
}>()

// playId = 6611400 + number (0-27)
const getPlayId = (number: number) => {
  return 6611400 + number
}

const isSelected = (playId: number) => {
  return props.selectedBets.includes(playId)
}

const toggleBet = (playId: number) => {
  emit('toggle-bet', playId)
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

/* 最后一行特殊处理 - 如果只有 28 个数字，最后一个占两格 */
.number-grid .bet-box:last-child:nth-child(28) {
  grid-column: span 2;
}
</style>
