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
import { t } from '@/locales'
import { type PlayInfo } from '@/api/game'

const props = defineProps<{
  playsData: Record<string, PlayInfo>
  selectedBets: number[]
}>()

const emit = defineEmits<{
  (e: 'toggle-bet', playId: number): void
}>()

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
