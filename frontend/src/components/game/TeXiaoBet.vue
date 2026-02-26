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
        <span class="numbers">{{ item.numbers }}</span>
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
  (e: 'toggle-bet', playId: number): void
}>()

const zodiacs = [
  { code: 'goat', playId: 1138808, nameKey: 'lhc.goat', numbers: '01,13,25,37,49' },
  { code: 'monkey', playId: 1138809, nameKey: 'lhc.monkey', numbers: '12,24,36,48' },
  { code: 'rooster', playId: 1138810, nameKey: 'lhc.rooster', numbers: '11,23,35,47' },
  { code: 'dog', playId: 1138811, nameKey: 'lhc.dog', numbers: '10,22,34,46' },
  { code: 'pig', playId: 1138812, nameKey: 'lhc.pig', numbers: '09,21,33,45' },
  { code: 'rat', playId: 1138801, nameKey: 'lhc.rat', numbers: '08,20,32,44' },
  { code: 'ox', playId: 1138802, nameKey: 'lhc.ox', numbers: '07,19,31,43' },
  { code: 'tiger', playId: 1138803, nameKey: 'lhc.tiger', numbers: '06,18,30,42' },
  { code: 'rabbit', playId: 1138804, nameKey: 'lhc.rabbit', numbers: '05,17,29,41' },
  { code: 'dragon', playId: 1138805, nameKey: 'lhc.dragon', numbers: '04,16,28,40' },
  { code: 'snake', playId: 1138806, nameKey: 'lhc.snake', numbers: '03,15,27,39' },
  { code: 'horse', playId: 1138807, nameKey: 'lhc.horse', numbers: '02,14,26,38' }
]

const isSelected = (playId: number) => {
  return props.selectedBets.includes(playId)
}

const toggleBet = (playId: number) => {
  emit('toggle-bet', playId)
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
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.numbers {
  font-size: 10px;
  color: #999;
  margin-bottom: 4px;
}

.odds {
  font-size: 12px;
  color: #fb2351;
  font-weight: 600;
}
</style>
